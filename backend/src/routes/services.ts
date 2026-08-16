import { Router, type IRouter } from "express";
import { 
  KRISHI_SEVA_KENDRAS, 
  GOV_OFFICES, 
  EMERGENCY_SERVICES, 
  userFavoritesStore 
} from "../data/mockServices.js";
import { getLiveAPMCLocations } from "../data/mockTime.js";

const router: IRouter = Router();

/** GET /services/apmcs - Returns list of APMC Mandi locations with strict district filtering */
router.get("/services/apmcs", async (req, res): Promise<void> => {
  const { district, taluka, commodity, search, openOnly } = req.query as Record<string, string>;

  let results = getLiveAPMCLocations();

  if (district && district !== "All") {
    const dKey = district.toLowerCase().split(' ')[0].replace('(', '').replace(')', '').trim();
    results = results.filter(a => {
      const aDist = a.district.toLowerCase();
      return aDist.includes(dKey) || dKey.includes(aDist.split(' ')[0]);
    });
  }

  if (taluka) {
    const t = taluka.toLowerCase();
    results = results.filter(a => a.taluka.toLowerCase().includes(t));
  }

  if (commodity) {
    const c = commodity.toLowerCase();
    results = results.filter(a => a.primaryCommodities.some(item => item.toLowerCase().includes(c)));
  }

  if (openOnly === "true") {
    results = results.filter(a => a.status === "Open");
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(a => 
      a.name.toLowerCase().includes(q) ||
      a.nameHindi.includes(q) ||
      a.district.toLowerCase().includes(q) ||
      a.taluka.toLowerCase().includes(q) ||
      a.address.toLowerCase().includes(q)
    );
  }

  res.json(results);
});

/** GET /services/krishi-seva-kendras */
router.get("/services/krishi-seva-kendras", async (req, res): Promise<void> => {
  const { district, taluka, city, search } = req.query as Record<string, string>;
  let results = [...KRISHI_SEVA_KENDRAS];

  if (district && district !== "All") {
    const dKey = district.toLowerCase().split(' ')[0].replace('(', '').replace(')', '').trim();
    results = results.filter(k => k.district.toLowerCase().includes(dKey));
  }

  const cityParam = taluka || city;
  if (cityParam && cityParam !== "All") {
    const cKey = cityParam.toLowerCase().trim();
    results = results.filter(k => 
      k.taluka.toLowerCase().includes(cKey) || 
      k.address.toLowerCase().includes(cKey) ||
      cKey.includes(k.taluka.toLowerCase())
    );
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(k => 
      k.name.toLowerCase().includes(q) || 
      k.dealerName.toLowerCase().includes(q) ||
      k.address.toLowerCase().includes(q) ||
      k.taluka.toLowerCase().includes(q) ||
      k.district.toLowerCase().includes(q)
    );
  }

  res.json(results);
});

/** GET /services/gov-offices */
router.get("/services/gov-offices", async (req, res): Promise<void> => {
  const { category, district, taluka, city, search } = req.query as Record<string, string>;
  let results = [...GOV_OFFICES];

  if (category && category !== "All") {
    results = results.filter(g => g.category.toLowerCase() === category.toLowerCase());
  }

  if (district && district !== "All") {
    const dKey = district.toLowerCase().split(' ')[0].replace('(', '').replace(')', '').trim();
    results = results.filter(g => g.district.toLowerCase().includes(dKey));
  }

  const cityParam = taluka || city;
  if (cityParam && cityParam !== "All") {
    const cKey = cityParam.toLowerCase().trim();
    results = results.filter(g => 
      g.taluka.toLowerCase().includes(cKey) || 
      g.address.toLowerCase().includes(cKey) ||
      cKey.includes(g.taluka.toLowerCase())
    );
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(g => 
      g.name.toLowerCase().includes(q) || 
      g.address.toLowerCase().includes(q) ||
      g.servicesProvided.some(s => s.toLowerCase().includes(q))
    );
  }

  res.json(results);
});

/** GET /services/emergency */
router.get("/services/emergency", async (req, res): Promise<void> => {
  const { category, district, taluka, city, search } = req.query as Record<string, string>;
  let results = [...EMERGENCY_SERVICES];

  if (category && category !== "All") {
    results = results.filter(e => e.category.toLowerCase() === category.toLowerCase());
  }

  if (district && district !== "All") {
    const dKey = district.toLowerCase().split(' ')[0].replace('(', '').replace(')', '').trim();
    results = results.filter(e => e.district.toLowerCase().includes(dKey));
  }

  const cityParam = taluka || city;
  if (cityParam && cityParam !== "All") {
    const cKey = cityParam.toLowerCase().trim();
    results = results.filter(e => 
      e.taluka.toLowerCase().includes(cKey) || 
      e.address.toLowerCase().includes(cKey) ||
      cKey.includes(e.taluka.toLowerCase())
    );
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(e => e.name.toLowerCase().includes(q) || e.address.toLowerCase().includes(q));
  }

  res.json(results);
});

import { favoriteRepository } from "../repositories/favoriteRepository.js";
import { verifyAccessToken } from "../utils/jwt.js";

/** GET /services/favorites/apmc - List user favourite APMC Mandi IDs */
router.get("/services/favorites/apmc", async (req, res): Promise<void> => {
  const token = req.headers.authorization?.replace("Bearer ", "") || req.cookies?.access_token;
  let userId = "guest_user";
  if (token) {
    try {
      const payload = verifyAccessToken(token);
      userId = payload.userId;
    } catch (e) {}
  }
  const favorites = await favoriteRepository.getFavorites(userId);
  res.json(favorites);
});

/** POST /services/favorites/apmc - Toggle user favourite APMC Mandi ID */
router.post("/services/favorites/apmc", async (req, res): Promise<void> => {
  const { apmcId } = req.body as { apmcId?: string };
  if (!apmcId) {
    res.status(400).json({ error: "apmcId is required" });
    return;
  }

  const token = req.headers.authorization?.replace("Bearer ", "") || req.cookies?.access_token;
  let userId = "guest_user";
  if (token) {
    try {
      const payload = verifyAccessToken(token);
      userId = payload.userId;
    } catch (e) {}
  }

  const result = await favoriteRepository.toggleFavorite(userId, apmcId);
  res.json({ success: true, isFavorite: result.isFavorite, favorites: result.favorites });
});

export default router;

