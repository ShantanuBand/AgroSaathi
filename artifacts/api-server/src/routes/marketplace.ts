import { Router, type IRouter } from "express";
import { MARKETPLACE_LISTINGS } from "../data/mockMarketplace.js";

const router: IRouter = Router();

// In-memory mutable store
const listings = MARKETPLACE_LISTINGS.map(l => ({ ...l }));
let idCounter = listings.length + 1;

/** GET /marketplace/listings */
router.get("/marketplace/listings", async (req, res): Promise<void> => {
  let results = listings.filter(l => l.isActive);
  const { category, type, state, search } = req.query as Record<string, string>;
  if (category) results = results.filter(l => l.category.toLowerCase() === category.toLowerCase());
  if (type) results = results.filter(l => l.type === type);
  if (state) results = results.filter(l => l.state.toLowerCase() === state.toLowerCase());
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(l => l.cropName.toLowerCase().includes(q) || l.description.toLowerCase().includes(q));
  }
  res.json(results);
});

/** POST /marketplace/listings */
router.post("/marketplace/listings", async (req, res): Promise<void> => {
  const body = req.body as {
    type: "sell" | "buy"; cropName: string; category: string; quantity: number; unit: string;
    pricePerUnit: number; location: string; state: string; description: string;
    quality: "A" | "B" | "C"; isOrganic: boolean; isNegotiable: boolean;
  };

  const newListing = {
    id: `ml${++idCounter}`,
    ...body,
    totalPrice: body.quantity * body.pricePerUnit,
    sellerName: "Ramesh Patil",
    sellerPhone: "9876543210",
    imageUrl: null,
    postedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    viewCount: 0,
  };

  listings.unshift(newListing);
  res.status(201).json(newListing);
});

/** GET /marketplace/listings/:listingId */
router.get("/marketplace/listings/:listingId", async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.listingId) ? req.params.listingId[0] : req.params.listingId;
  const listing = listings.find(l => l.id === id);
  if (!listing) {
    res.status(404).json({ error: "Listing not found" });
    return;
  }
  listing.viewCount += 1;
  res.json(listing);
});

/** PATCH /marketplace/listings/:listingId */
router.patch("/marketplace/listings/:listingId", async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.listingId) ? req.params.listingId[0] : req.params.listingId;
  const idx = listings.findIndex(l => l.id === id);
  if (idx === -1) {
    res.status(404).json({ error: "Listing not found" });
    return;
  }
  const updates = req.body as Partial<typeof listings[0]>;
  listings[idx] = { ...listings[idx], ...updates };
  if (updates.pricePerUnit !== undefined || updates.quantity !== undefined) {
    listings[idx].totalPrice = listings[idx].quantity * listings[idx].pricePerUnit;
  }
  res.json(listings[idx]);
});

/** DELETE /marketplace/listings/:listingId */
router.delete("/marketplace/listings/:listingId", async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.listingId) ? req.params.listingId[0] : req.params.listingId;
  const idx = listings.findIndex(l => l.id === id);
  if (idx === -1) {
    res.status(404).json({ error: "Listing not found" });
    return;
  }
  listings[idx].isActive = false;
  res.json({ success: true, message: "Listing removed" });
});

export default router;
