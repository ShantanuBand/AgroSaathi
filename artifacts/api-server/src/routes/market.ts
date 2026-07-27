import { Router, type IRouter } from "express";
import { CROP_PRICES, PRICE_HISTORY } from "../data/mockCrops.js";

const router: IRouter = Router();

/** GET /crops/prices */
router.get("/crops/prices", async (req, res): Promise<void> => {
  let results = [...CROP_PRICES];

  const { category, state, search } = req.query as Record<string, string>;
  if (category) results = results.filter(c => c.category.toLowerCase() === category.toLowerCase());
  if (state) results = results.filter(c => c.state.toLowerCase() === state.toLowerCase());
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(c => c.cropName.toLowerCase().includes(q) || c.cropNameHindi.includes(q));
  }

  res.json(results);
});

/** GET /crops/prices/summary */
router.get("/crops/prices/summary", async (_req, res): Promise<void> => {
  const sorted = [...CROP_PRICES].sort((a, b) => b.changePercent - a.changePercent);
  const topGainers = sorted.slice(0, 3);
  const topLosers = sorted.slice(-3).reverse();
  const averageChange = CROP_PRICES.reduce((sum, c) => sum + c.changePercent, 0) / CROP_PRICES.length;

  res.json({
    totalCrops: CROP_PRICES.length,
    topGainers,
    topLosers,
    averageChange: Math.round(averageChange * 100) / 100,
    lastUpdated: new Date().toISOString(),
  });
});

/** GET /crops/:cropId/price-history */
router.get("/crops/:cropId/price-history", async (req, res): Promise<void> => {
  const { cropId } = req.params;
  const raw = Array.isArray(cropId) ? cropId[0] : cropId;
  const history = PRICE_HISTORY[raw];

  if (!history) {
    // Return empty array for unknown crops rather than 404
    res.json([]);
    return;
  }

  res.json(history);
});

export default router;
