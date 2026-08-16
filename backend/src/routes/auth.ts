import { Router, type IRouter } from "express";
import { 
  registerHandler, 
  loginHandler, 
  logoutHandler, 
  meHandler,
  forgotPasswordHandler,
  resetPasswordHandler
} from "../controllers/authController.js";
import { authRateLimiter } from "../middlewares/rateLimiter.js";

const router: IRouter = Router();

router.post("/auth/register", authRateLimiter, registerHandler);
router.post("/auth/login", authRateLimiter, loginHandler);
router.post("/auth/logout", logoutHandler);
router.get("/auth/me", meHandler);
router.post("/auth/forgot-password", authRateLimiter, forgotPasswordHandler);
router.post("/auth/reset-password", authRateLimiter, resetPasswordHandler);

export default router;
