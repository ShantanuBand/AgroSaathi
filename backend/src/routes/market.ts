import { Router, type IRouter } from "express";
import { getCropPricesHandler, getPriceSummaryHandler, getPriceHistoryHandler } from "../controllers/marketController.js";

const router: IRouter = Router();

router.get("/crops/prices", getCropPricesHandler);
router.get("/crops/prices/summary", getPriceSummaryHandler);
router.get("/crops/:cropId/price-history", getPriceHistoryHandler);

router.post("/crops/alerts", async (req, res): Promise<void> => {
  const { cropName, targetPrice, mandi } = req.body as { cropName?: string; targetPrice?: number; mandi?: string };
  if (!cropName || !targetPrice) {
    res.status(400).json({ success: false, error: "cropName and targetPrice are required" });
    return;
  }
  res.json({
    success: true,
    message: `AGMARKNET price alert set for ${cropName} at ₹${targetPrice}/quintal in ${mandi || 'APMC'}!`,
    alertId: `pa_${Date.now()}`
  });
});

export default router;
