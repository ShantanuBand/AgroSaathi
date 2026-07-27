// Mock weather data — realistic Indian agricultural weather (July 2026, Monsoon season)

export const CURRENT_WEATHER = {
  location: "Pune, Maharashtra",
  temperature: 26.4,
  feelsLike: 29.1,
  humidity: 82,
  windSpeed: 18.5,
  windDirection: "SW",
  condition: "Partly Cloudy",
  conditionCode: "partly_cloudy",
  visibility: 8.2,
  uvIndex: 5,
  soilMoisture: 68.3,
  rainfall: 14.2,
  updatedAt: new Date().toISOString(),
};

export const WEATHER_FORECAST = [
  { date: "2026-07-27", dayOfWeek: "Monday",    high: 28, low: 22, condition: "Partly Cloudy",    conditionCode: "partly_cloudy",    humidity: 82, rainfall: 12.0, windSpeed: 18, farmingAdvice: "Good day for transplanting paddy seedlings. Soil moisture is adequate." },
  { date: "2026-07-28", dayOfWeek: "Tuesday",   high: 27, low: 21, condition: "Light Rain",       conditionCode: "light_rain",       humidity: 88, rainfall: 28.5, windSpeed: 22, farmingAdvice: "Avoid pesticide spraying due to rain. Hold off on harvesting operations." },
  { date: "2026-07-29", dayOfWeek: "Wednesday", high: 25, low: 20, condition: "Moderate Rain",    conditionCode: "moderate_rain",    humidity: 92, rainfall: 45.0, windSpeed: 25, farmingAdvice: "Heavy rainfall expected. Ensure proper drainage in fields to prevent waterlogging." },
  { date: "2026-07-30", dayOfWeek: "Thursday",  high: 26, low: 21, condition: "Overcast",         conditionCode: "overcast",         humidity: 85, rainfall: 8.0,  windSpeed: 16, farmingAdvice: "Suitable for inter-cultivation and weeding after rains subside." },
  { date: "2026-07-31", dayOfWeek: "Friday",    high: 29, low: 23, condition: "Partly Cloudy",    conditionCode: "partly_cloudy",    humidity: 78, rainfall: 5.0,  windSpeed: 14, farmingAdvice: "Good conditions for applying foliar fertilizers and crop protection measures." },
  { date: "2026-08-01", dayOfWeek: "Saturday",  high: 31, low: 24, condition: "Sunny Intervals",  conditionCode: "sunny_intervals",  humidity: 72, rainfall: 2.0,  windSpeed: 12, farmingAdvice: "Favorable for kharif crop growth. Monitor for pest activity in dry spells." },
  { date: "2026-08-02", dayOfWeek: "Sunday",    high: 27, low: 22, condition: "Thunderstorms",    conditionCode: "thunderstorm",     humidity: 90, rainfall: 62.0, windSpeed: 35, farmingAdvice: "Thunderstorm warning active. Secure farm equipment and stay indoors during storms." },
];

export const WEATHER_ALERTS = [
  {
    id: "wa1",
    type: "Heavy Rainfall Warning",
    severity: "warning" as const,
    title: "Heavy to Very Heavy Rainfall Warning",
    description: "IMD has issued a heavy to very heavy rainfall warning for Pune, Satara, Kolhapur, and Sangli districts. Farmers are advised to maintain proper field drainage and avoid operating heavy machinery.",
    validFrom: "2026-07-29T00:00:00Z",
    validUntil: "2026-07-30T23:59:00Z",
    affectedAreas: ["Pune", "Satara", "Kolhapur", "Sangli", "Solapur"],
  },
  {
    id: "wa2",
    type: "Thunderstorm Alert",
    severity: "severe" as const,
    title: "Thunderstorm & Lightning Alert — Sunday",
    description: "Severe thunderstorm activity expected on August 2. Gusty winds up to 60 km/h possible. All outdoor agricultural activities should be suspended.",
    validFrom: "2026-08-02T08:00:00Z",
    validUntil: "2026-08-02T20:00:00Z",
    affectedAreas: ["Pune", "Nashik", "Ahmednagar"],
  },
  {
    id: "wa3",
    type: "Advisory",
    severity: "info" as const,
    title: "Kharif Crop Advisory — July Week 4",
    description: "IMD advises farmers: Current soil moisture levels are adequate for direct-seeded rice. Avoid over-irrigation. Apply nitrogenous fertilizers after rain clears for better absorption.",
    validFrom: "2026-07-27T00:00:00Z",
    validUntil: "2026-08-03T23:59:00Z",
    affectedAreas: ["Maharashtra", "Karnataka", "Madhya Pradesh"],
  },
];
