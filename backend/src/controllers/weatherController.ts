import { Request, Response, NextFunction } from "express";
import { weatherService } from "../services/weatherService.js";

export async function getCurrentWeatherHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await weatherService.getCurrentWeather(req.query as any);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function getWeatherForecastHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const forecast = await weatherService.getWeatherForecast(req.query as any);
    res.json(forecast);
  } catch (error) {
    next(error);
  }
}

export async function getWeatherAlertsHandler(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const alerts = weatherService.getWeatherAlerts();
    res.json(alerts);
  } catch (error) {
    next(error);
  }
}
