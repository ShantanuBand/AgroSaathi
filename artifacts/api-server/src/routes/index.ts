import { Router, type IRouter } from "express";
import healthRouter from "./health";
import marketRouter from "./market";
import weatherRouter from "./weather";
import notificationsRouter from "./notifications";
import aiRouter from "./ai";
import schemesRouter from "./schemes";
import marketplaceRouter from "./marketplace";
import profileRouter from "./profile";
import dashboardRouter from "./dashboard";

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

export default router;
