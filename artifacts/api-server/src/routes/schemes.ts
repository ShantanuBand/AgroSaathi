import { Router, type IRouter } from "express";
import { GOVERNMENT_SCHEMES } from "../data/mockSchemes.js";

const router: IRouter = Router();

/** GET /schemes/featured — must come before /schemes/:schemeId */
router.get("/schemes/featured", async (_req, res): Promise<void> => {
  res.json(GOVERNMENT_SCHEMES.filter(s => s.isFeatured && s.isActive));
});

/** GET /schemes */
router.get("/schemes", async (req, res): Promise<void> => {
  let results = GOVERNMENT_SCHEMES.filter(s => s.isActive);
  const { category, search, state } = req.query as Record<string, string>;
  if (category) results = results.filter(s => s.category.toLowerCase() === category.toLowerCase());
  if (state) results = results.filter(s => s.states.includes("All India") || s.states.some(st => st.toLowerCase() === state.toLowerCase()));
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(s => s.title.toLowerCase().includes(q) || s.shortDescription.toLowerCase().includes(q));
  }
  res.json(results);
});

/** GET /schemes/:schemeId */
router.get("/schemes/:schemeId", async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.schemeId) ? req.params.schemeId[0] : req.params.schemeId;
  const scheme = GOVERNMENT_SCHEMES.find(s => s.id === id);
  if (!scheme) {
    res.status(404).json({ error: "Scheme not found" });
    return;
  }
  res.json(scheme);
});

export default router;
