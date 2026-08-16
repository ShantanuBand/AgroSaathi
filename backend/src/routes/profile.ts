import { Router, type IRouter } from "express";
import { FARMER_PROFILE } from "../data/mockProfile.js";
import { userRepository } from "../repositories/userRepository.js";
import { verifyAccessToken } from "../utils/jwt.js";

const router: IRouter = Router();

const defaultProfile = { ...FARMER_PROFILE };

async function getAuthenticatedUser(req: any) {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.access_token || req.cookies?.auth_token;
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : cookieToken;

  if (!token) return null;
  try {
    const payload = verifyAccessToken(token);
    return await userRepository.findById(payload.userId);
  } catch (e) {
    return null;
  }
}

/** GET /profile */
router.get("/profile", async (req, res): Promise<void> => {
  const user = await getAuthenticatedUser(req);
  if (user) {
    res.json({
      id: user.id,
      name: user.name,
      phone: user.phone,
      email: user.email || "",
      village: user.city || "Chandur Railway",
      district: user.district || "Amravati",
      state: user.state || "Maharashtra",
      landHolding: user.landHolding || 4.5,
      landUnit: "Acres",
      primaryCrops: user.primaryCrops || ["Soybean", "Tur", "Cotton"],
      irrigationType: "Drip / Sprinkler",
      soilType: "Medium Black Soil",
      kccHolder: true,
      pmFasalBimaEnrolled: true,
      joinedAt: user.createdAt || "2024-03-15T00:00:00Z"
    });
    return;
  }

  res.json(defaultProfile);
});

/** PATCH /profile */
router.patch("/profile", async (req, res): Promise<void> => {
  const user = await getAuthenticatedUser(req);
  const updates = req.body as any;

  if (user) {
    const updated = await userRepository.update(user.id, {
      name: updates.name || user.name,
      email: updates.email !== undefined ? updates.email : user.email,
      district: updates.district || user.district,
      city: updates.village || updates.city || user.city,
      landHolding: updates.landHolding !== undefined ? Number(updates.landHolding) : user.landHolding,
      primaryCrops: updates.primaryCrops || user.primaryCrops,
    });

    if (updated) {
      res.json({
        id: updated.id,
        name: updated.name,
        phone: updated.phone,
        email: updated.email || "",
        village: updated.city || "Chandur Railway",
        district: updated.district || "Amravati",
        state: updated.state || "Maharashtra",
        landHolding: updated.landHolding || 4.5,
        landUnit: "Acres",
        primaryCrops: updated.primaryCrops || ["Soybean", "Tur", "Cotton"],
        irrigationType: updates.irrigationType || "Drip / Sprinkler",
        soilType: updates.soilType || "Medium Black Soil",
        kccHolder: true,
        pmFasalBimaEnrolled: true,
        joinedAt: updated.createdAt || "2024-03-15T00:00:00Z"
      });
      return;
    }
  }

  Object.assign(defaultProfile, updates);
  res.json(defaultProfile);
});

export default router;
