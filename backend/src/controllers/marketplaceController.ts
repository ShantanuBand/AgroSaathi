import { Response, NextFunction } from "express";
import { marketplaceService } from "../services/marketplaceService.js";
import { sendSuccess } from "../utils/response.js";
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js";

export async function getListingsHandler(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, type, state, search } = req.query as Record<string, string>;
    const listings = await marketplaceService.getListings({ category, type, state, search });
    res.json(listings);
  } catch (error) {
    next(error);
  }
}

export async function getListingByIdHandler(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Array.isArray(req.params.listingId) ? req.params.listingId[0] : req.params.listingId;
    const listing = await marketplaceService.getListingById(id);
    res.json(listing);
  } catch (error) {
    next(error);
  }
}

export async function createListingHandler(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const listing = await marketplaceService.createListing(req.user, req.body);
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
}

export async function updateListingHandler(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Array.isArray(req.params.listingId) ? req.params.listingId[0] : req.params.listingId;
    const updated = await marketplaceService.updateListing(req.user, id, req.body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function deleteListingHandler(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = Array.isArray(req.params.listingId) ? req.params.listingId[0] : req.params.listingId;
    const result = await marketplaceService.deleteListing(req.user, id);
    res.json(result);
  } catch (error) {
    next(error);
  }
}
