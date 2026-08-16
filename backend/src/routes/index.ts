import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import marketRouter from "./market.js";
import weatherRouter from "./weather.js";
import notificationsRouter from "./notifications.js";
import aiRouter from "./ai.js";
import schemesRouter from "./schemes.js";
import marketplaceRouter from "./marketplace.js";
import profileRouter from "./profile.js";
import dashboardRouter from "./dashboard.js";
import newsRouter from "./news.js";
import locationsRouter from "./locations.js";
import authRouter from "./auth.js";
import servicesRouter from "./services.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(marketRouter);
router.use(weatherRouter);
router.use(notificationsRouter);
router.use(aiRouter);
router.use(schemesRouter);
router.use(marketplaceRouter);
router.use(profileRouter);
router.use(dashboardRouter);
router.use(newsRouter);
router.use(locationsRouter);
router.use(authRouter);
router.use(servicesRouter);

export default router;
