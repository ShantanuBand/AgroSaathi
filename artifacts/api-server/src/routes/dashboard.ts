import { Router, type IRouter } from "express";
import { CROP_PRICES } from "../data/mockCrops.js";
import { CURRENT_WEATHER } from "../data/mockWeather.js";
import { NOTIFICATIONS } from "../data/mockNotifications.js";
import { MARKETPLACE_LISTINGS } from "../data/mockMarketplace.js";
import { GOVERNMENT_SCHEMES } from "../data/mockSchemes.js";

const router: IRouter = Router();

/** GET /dashboard/summary */
router.get("/dashboard/summary", async (_req, res): Promise<void> => {
  const topCrops = [...CROP_PRICES]
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
    .slice(0, 5);

  const unreadNotifications = NOTIFICATIONS.filter(n => !n.isRead).length;
  const activeListings = MARKETPLACE_LISTINGS.filter(l => l.isActive).length;
  const activeSchemes = GOVERNMENT_SCHEMES.filter(s => s.isActive).length;
  const recentNotifications = NOTIFICATIONS.slice(0, 4);

  const avgChange = CROP_PRICES.reduce((sum, c) => sum + c.changePercent, 0) / CROP_PRICES.length;
  const marketTrend: "up" | "down" | "stable" =
    avgChange > 0.5 ? "up" : avgChange < -0.5 ? "down" : "stable";

  res.json({
    farmerName: "Ramesh Patil",
    location: "Pune, Maharashtra",
    todayWeather: { ...CURRENT_WEATHER, updatedAt: new Date().toISOString() },
    activeListings,
    unreadNotifications,
    activeSchemes,
    topCrops,
    recentNotifications,
    marketTrend,
  });
});

export default router;
