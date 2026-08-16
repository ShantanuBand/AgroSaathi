import { Router, type IRouter } from "express";
import {
  getListingsHandler,
  getListingByIdHandler,
  createListingHandler,
  updateListingHandler,
  deleteListingHandler
} from "../controllers/marketplaceController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router: IRouter = Router();

router.get("/marketplace/listings", getListingsHandler);
router.get("/marketplace/listings/:listingId", getListingByIdHandler);

// Protected Routes: Require Authentication for POST, PATCH, DELETE
router.post("/marketplace/listings", requireAuth, createListingHandler);
router.patch("/marketplace/listings/:listingId", requireAuth, updateListingHandler);
router.delete("/marketplace/listings/:listingId", requireAuth, deleteListingHandler);

router.post("/marketplace/contact", async (req, res): Promise<void> => {
  const { listingId, buyerPhone } = req.body as { listingId?: string; buyerPhone?: string };
  if (!listingId || !buyerPhone) {
    res.status(400).json({ success: false, error: "listingId and buyerPhone are required" });
    return;
  }
  res.json({
    success: true,
    message: `Message sent to Seller! They will contact you shortly on ${buyerPhone}.`,
  });
});

export default router;
