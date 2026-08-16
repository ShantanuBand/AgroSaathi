import { Router, type IRouter } from "express";
import { getLiveNotifications, getLiveMarketplaceListings, getLiveSchemes } from "../data/mockTime.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { userRepository } from "../repositories/userRepository.js";
import { newsService } from "../services/newsService.js";
import { weatherService } from "../services/weatherService.js";
import { marketService } from "../services/marketService.js";

const router: IRouter = Router();

/** GET /dashboard/summary */
router.get("/dashboard/summary", async (req, res): Promise<void> => {
  const token = req.headers.authorization?.replace("Bearer ", "") || req.cookies?.access_token;
  let farmerName = "Ramesh Patil";
  let location = "Amravati, Maharashtra";
  let district = "Amravati";
  let city = "Amravati";

  if (token) {
    try {
      const payload = verifyAccessToken(token);
      const user = await userRepository.findById(payload.userId);
      if (user) {
        farmerName = user.name;
        location = `${user.city}, ${user.district}`;
        district = user.district;
        city = user.city;
      }
    } catch (e) {
      // Guest fallback
    }
  }

  // Fetch real-time data in parallel
  const [news, weather, marketData] = await Promise.all([
    newsService.getNews({ district }),
    weatherService.getCurrentWeather({ district, city }),
    marketService.getCropPrices({ district })
  ]);

  const topCrops = [...marketData]
    .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
    .slice(0, 5);

  const notifications = getLiveNotifications();
  const listings = getLiveMarketplaceListings();
  const schemes = getLiveSchemes();

  const unreadNotifications = notifications.filter(n => !n.isRead).length;
  const activeListings = listings.filter(l => l.isActive).length;
  const activeSchemes = schemes.filter(s => s.isActive).length;
  const recentNotifications = notifications.slice(0, 4);

  const avgChange = marketData.length > 0 ? marketData.reduce((sum: number, c: any) => sum + c.changePercent, 0) / marketData.length : 0;
  const marketTrend: "up" | "down" | "stable" =
    avgChange > 0.5 ? "up" : avgChange < -0.5 ? "down" : "stable";

  // Provide latest 3 news items for the dashboard ticker
  const latestNews = news.slice(0, 3);

  res.json({
    farmerName,
    location,
    todayWeather: weather,
    activeListings,
    unreadNotifications,
    activeSchemes,
    topCrops,
    recentNotifications,
    latestNews,
    marketTrend,
  });
});

export default router;
