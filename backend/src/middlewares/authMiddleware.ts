import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, JwtPayload } from "../utils/jwt.js";
import { UnauthorizedError, ForbiddenError } from "../errors/AppError.js";
import { userRepository } from "../repositories/userRepository.js";

export interface AuthenticatedRequest extends Request {
  user?: any;
  jwtPayload?: JwtPayload;
}

export async function requireAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.access_token;
    
    let token: string | undefined;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else if (cookieToken) {
      token = cookieToken;
    }

    if (!token) {
      throw new UnauthorizedError("Authentication token is missing. Please log in.");
    }

    const payload = verifyAccessToken(token);
    const user = await userRepository.findById(payload.userId);

    if (!user) {
      throw new UnauthorizedError("User associated with token no longer exists.");
    }

    req.user = user;
    req.jwtPayload = payload;
    next();
  } catch (error) {
    next(error);
  }
}

export function requireRole(...roles: Array<"farmer" | "trader" | "admin">) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError());
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError(`Access denied. Role '${req.user.role}' is not authorized.`));
    }

    next();
  };
}
