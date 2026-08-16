import { Router, type IRouter } from "express";
import { getCurrentWeatherHandler, getWeatherForecastHandler, getWeatherAlertsHandler } from "../controllers/weatherController.js";

const router: IRouter = Router();

router.get("/weather/current", getCurrentWeatherHandler);
router.get("/weather/forecast", getWeatherForecastHandler);
router.get("/weather/alerts", getWeatherAlertsHandler);

router.post("/weather/location", async (req, res): Promise<void> => {
  const { district, city } = req.body as { district?: string; city?: string };
  const locName = city ? `${city}, ${district || 'Maharashtra'}` : `${district || 'Amravati'}, Maharashtra`;
  res.json({
    success: true,
    location: locName,
    message: `Weather location updated to ${locName}`
  });
});

router.get("/weather/satellite-info", async (_req, res): Promise<void> => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (apiKey) {
    res.json({
      hasApiKey: true,
      tileUrlTemplate: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`,
      provider: "OpenWeatherMap Satellite & Radar Layer"
    });
  } else {
    res.json({
      hasApiKey: false,
      tileUrlTemplate: null,
      provider: "Open-Meteo & OpenStreetMap (Free, No API Key Required)"
    });
  }
});

export default router;
