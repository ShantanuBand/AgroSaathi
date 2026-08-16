import { Router, type IRouter } from "express";
import { MAHARASHTRA_DISTRICTS, MAHARASHTRA_CITIES } from "../data/mockDistricts.js";

const router: IRouter = Router();

/** GET /locations/districts - List all 36 districts of Maharashtra */
router.get("/locations/districts", async (req, res): Promise<void> => {
  const { search } = req.query as { search?: string };
  let results = [...MAHARASHTRA_DISTRICTS];

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(d => d.name.toLowerCase().includes(q) || d.division.toLowerCase().includes(q));
  }

  const payload = results.map(district => {
    const cityCount = MAHARASHTRA_CITIES.filter(c => c.districtId === district.id).length;
    return {
      ...district,
      cityCount,
    };
  });

  res.json(payload);
});

/** GET /locations/districts/:districtId/cities - List all cities/talukas in a district */
router.get("/locations/districts/:districtId/cities", async (req, res): Promise<void> => {
  const { districtId } = req.params;
  const rawId = Array.isArray(districtId) ? districtId[0] : districtId;
  const districtKey = rawId.startsWith("d_") ? rawId.toLowerCase() : `d_${rawId.toLowerCase()}`;
  const term = rawId.replace(/^d_/, '').toLowerCase();
  const cities = MAHARASHTRA_CITIES.filter(c => {
    const dId = c.districtId.toLowerCase();
    const dName = c.districtName.toLowerCase();
    return dId === districtKey || dName.includes(term) || term.includes(dName.split(' ')[0]);
  });
  
  res.json(cities);
});

export default router;
