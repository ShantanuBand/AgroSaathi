import { Router, type IRouter } from "express";
import { CURRENT_WEATHER, WEATHER_FORECAST, WEATHER_ALERTS } from "../data/mockWeather.js";

const router: IRouter = Router();

/** GET /weather/current */
router.get("/weather/current", async (_req, res): Promise<void> => {
  res.json({ ...CURRENT_WEATHER, updatedAt: new Date().toISOString() });
});

/** GET /weather/forecast */
router.get("/weather/forecast", async (_req, res): Promise<void> => {
  res.json(WEATHER_FORECAST);
});

/** GET /weather/alerts */
router.get("/weather/alerts", async (_req, res): Promise<void> => {
  res.json(WEATHER_ALERTS);
});

export default router;
