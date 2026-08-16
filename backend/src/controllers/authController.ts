import { Request, Response, NextFunction } from "express";
import { authService } from "../services/authService.js";
import { sendSuccess } from "../utils/response.js";
import { AuthenticatedRequest } from "../middlewares/authMiddleware.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { userRepository } from "../repositories/userRepository.js";

export async function registerHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, phone, email, password, district, city, landHolding, primaryCrops } = req.body;

    if (!name || !phone || !password || !district || !city) {
      res.status(400).json({ success: false, message: "Name, phone number, password, district, and city are required fields." });
      return;
    }

    const { user, accessToken, refreshToken } = await authService.register({
      name,
      phone,
      email,
      password,
      district,
      city,
      landHolding,
      primaryCrops
    });

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    sendSuccess(res, { user, token: accessToken, refreshToken }, "Registration successful! Welcome to AgroSaathi.", 201);
  } catch (error) {
    next(error);
  }
}

export async function loginHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      res.status(400).json({ success: false, message: "Phone number and password are required." });
      return;
    }

    const { user, accessToken, refreshToken } = await authService.login(phone, password);

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    sendSuccess(res, { user, token: accessToken, refreshToken }, `Welcome back, ${user.name}!`);
  } catch (error) {
    next(error);
  }
}

export async function logoutHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    sendSuccess(res, null, "Logged out successfully.");
  } catch (error) {
    next(error);
  }
}

export async function meHandler(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.access_token;
    const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.substring(7) : cookieToken;

    if (token) {
      try {
        const payload = verifyAccessToken(token);
        const user = await userRepository.findById(payload.userId);
        if (user) {
          const { passwordHash, ...userWithoutPassword } = user;
          res.json({ authenticated: true, user: userWithoutPassword });
          return;
        }
      } catch (e) {
        // Expired or invalid token
      }
    }

    res.json({ authenticated: false, user: null });
  } catch (error) {
    next(error);
  }
}

export async function forgotPasswordHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { phone } = req.body;
    if (!phone) {
      res.status(400).json({ success: false, message: "Phone number is required." });
      return;
    }
    const result = await authService.requestPasswordReset(phone);
    sendSuccess(res, result, result.message);
  } catch (error) {
    next(error);
  }
}

export async function resetPasswordHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) {
      res.status(400).json({ success: false, message: "resetToken and newPassword are required." });
      return;
    }
    const result = await authService.resetPassword(resetToken, newPassword);
    sendSuccess(res, result, result.message);
  } catch (error) {
    next(error);
  }
}
