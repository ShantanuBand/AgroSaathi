import NodeCache from "node-cache";
import { CURRENT_WEATHER } from "../data/mockWeather.js";
import { MAHARASHTRA_DISTRICTS, MAHARASHTRA_CITIES } from "../data/mockDistricts.js";
import { getLiveWeatherForecast, getLiveWeatherAlerts } from "../data/mockTime.js";
import { logger } from "../config/logger.js";

const weatherCache = new NodeCache({ stdTTL: 1800 }); // 30 minute cache

function resolveLocation(query: { location?: string; district?: string; city?: string }) {
  const raw = (query.city && query.city !== 'All' ? query.city : (query.district && query.district !== 'All' ? query.district : query.location)) || "Amravati";
  
  let clean = raw
    .replace(/[\u0900-\u097F]/g, '')
    .replace(/\(.*\)/g, '')
    .replace(/apmc/gi, '')
    .replace(/mandi/gi, '')
    .replace(/[^\w\s]/gi, '')
    .trim();

  if (!clean) clean = raw.split(' ')[0] || "Amravati";

  const matchedCity = MAHARASHTRA_CITIES.find(c => 
    c.name.toLowerCase().includes(clean.toLowerCase()) || 
    clean.toLowerCase().includes(c.name.toLowerCase()) ||
    c.id.toLowerCase().includes(clean.toLowerCase())
  );

  if (matchedCity) {
    return {
      lat: matchedCity.lat,
      lon: matchedCity.lon,
      displayName: `${matchedCity.name}, ${matchedCity.districtName}, Maharashtra`,
      cityName: matchedCity.name,
      districtName: matchedCity.districtName,
    };
  }

  const matchedDistrict = MAHARASHTRA_DISTRICTS.find(d => 
    d.name.toLowerCase().includes(clean.toLowerCase()) || 
    clean.toLowerCase().includes(d.name.toLowerCase()) ||
    d.id.toLowerCase().includes(clean.toLowerCase())
  );

  if (matchedDistrict) {
    return {
      lat: matchedDistrict.lat,
      lon: matchedDistrict.lon,
      displayName: `${matchedDistrict.name}, Maharashtra`,
      cityName: matchedDistrict.name,
      districtName: matchedDistrict.name,
    };
  }

  const defaultDist = MAHARASHTRA_DISTRICTS.find(d => d.id === 'd_amravati') || MAHARASHTRA_DISTRICTS[0];
  return {
    lat: defaultDist.lat,
    lon: defaultDist.lon,
    displayName: `${clean}, ${defaultDist.name}, Maharashtra`,
    cityName: clean,
    districtName: defaultDist.name,
  };
}

export class WeatherService {
  async getCurrentWeather(query: any) {
    const { lat, lon, displayName } = resolveLocation(query);
    const cacheKey = `weather_current_${lat}_${lon}`;
    const cached = weatherCache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m`;
      const apiRes = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (apiRes.ok) {
        const data = (await apiRes.json()) as any;
        const current = data.current_weather;
        const humidity = data.hourly?.relativehumidity_2m?.[0] ?? 78;

        const liveData = {
          location: displayName,
          temperature: Math.round(current.temperature),
          feelsLike: Math.round(current.temperature + 2),
          humidity,
          windSpeed: Math.round(current.windspeed),
          windDirection: current.winddirection > 180 ? "SW" : "NE",
          condition: current.weathercode <= 3 ? "Partly Cloudy" : current.weathercode <= 65 ? "Light Rain" : "Heavy Rain",
          conditionCode: current.weathercode <= 3 ? "partly_cloudy" : "rain",
          visibility: 9.5,
          uvIndex: 6,
          soilMoisture: 68,
          rainfall: current.weathercode > 50 ? 18.4 : 2.5,
          updatedAt: new Date().toISOString(),
        };

        weatherCache.set(cacheKey, liveData);
        return liveData;
      }
    } catch (e) {
      clearTimeout(timeoutId);
      logger.warn("Open-Meteo live API offline or timed out, returning fallback weather");
    }

    return {
      ...CURRENT_WEATHER,
      location: displayName,
      updatedAt: new Date().toISOString()
    };
  }

  async getWeatherForecast(query: any = {}) {
    const { lat, lon } = resolveLocation(query);
    const cacheKey = `weather_forecast_${lat}_${lon}`;
    const cached = weatherCache.get(cacheKey);

    if (cached) return cached;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum,windspeed_10m_max&timezone=auto`;
      const apiRes = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (apiRes.ok) {
        const data = (await apiRes.json()) as any;
        const daily = data.daily;
        
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const conditionsMap: Record<number, string> = {
          0: "Sunny Intervals", 1: "Partly Cloudy", 2: "Partly Cloudy", 3: "Overcast",
          45: "Foggy", 48: "Foggy",
          51: "Light Drizzle", 53: "Drizzle", 55: "Heavy Drizzle",
          61: "Light Rain", 63: "Moderate Rain", 65: "Heavy Rain",
          80: "Light Showers", 81: "Moderate Showers", 82: "Violent Showers",
          95: "Thunderstorms", 96: "Thunderstorms", 99: "Thunderstorms"
        };
        const codesMap: Record<number, string> = {
          0: "sunny_intervals", 1: "partly_cloudy", 2: "partly_cloudy", 3: "overcast",
          61: "light_rain", 63: "moderate_rain", 65: "heavy_rain", 95: "thunderstorm"
        };

        const forecast = daily.time.map((dateStr: string, idx: number) => {
          const dt = new Date(dateStr);
          const wc = daily.weathercode[idx];
          const rainfall = daily.precipitation_sum[idx];
          
          let advisory = "Favorable for kharif crop growth.";
          if (rainfall > 30) advisory = "Heavy rainfall expected. Ensure proper drainage in fields to prevent waterlogging.";
          else if (rainfall > 10) advisory = "Avoid pesticide spraying due to rain.";
          else if (wc >= 95) advisory = "Thunderstorm warning active. Secure farm equipment.";
          
          return {
            date: dateStr,
            dayOfWeek: dayNames[dt.getDay()],
            high: Math.round(daily.temperature_2m_max[idx]),
            low: Math.round(daily.temperature_2m_min[idx]),
            condition: conditionsMap[wc] || "Partly Cloudy",
            conditionCode: codesMap[wc] || "partly_cloudy",
            humidity: 75,
            rainfall,
            windSpeed: Math.round(daily.windspeed_10m_max[idx] || 15),
            farmingAdvice: advisory
          };
        });

        weatherCache.set(cacheKey, forecast);
        return forecast;
      }
    } catch (e) {
      clearTimeout(timeoutId);
      logger.warn("Open-Meteo live API offline or timed out for forecast, returning fallback");
    }

    return getLiveWeatherForecast();
  }

  getWeatherAlerts() {
    return getLiveWeatherAlerts();
  }
}

export const weatherService = new WeatherService();
