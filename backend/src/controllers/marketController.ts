import { Request, Response, NextFunction } from "express";
import { marketService } from "../services/marketService.js";

export async function getCropPricesHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const prices = await marketService.getCropPrices(req.query as any);
    res.json(prices);
  } catch (error) {
    next(error);
  }
}

export async function getPriceSummaryHandler(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const summary = marketService.getPriceSummary();
    res.json(summary);
  } catch (error) {
    next(error);
  }
}

export async function getPriceHistoryHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { cropId } = req.params;
    const history = marketService.getPriceHistory(Array.isArray(cropId) ? cropId[0] : cropId);
    res.json(history);
  } catch (error) {
    next(error);
  }
}
