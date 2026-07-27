import { Router, type IRouter } from "express";
import { FARMER_PROFILE } from "../data/mockProfile.js";

const router: IRouter = Router();

// In-memory mutable profile
const profile = { ...FARMER_PROFILE };

/** GET /profile */
router.get("/profile", async (_req, res): Promise<void> => {
  res.json(profile);
});

/** PATCH /profile */
router.patch("/profile", async (req, res): Promise<void> => {
  const updates = req.body as Partial<typeof profile>;
  Object.assign(profile, updates);
  res.json(profile);
});

export default router;
