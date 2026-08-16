import bcrypt from "bcrypt";
import crypto from "crypto";
import { userRepository } from "../repositories/userRepository.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";
import { BadRequestError, UnauthorizedError, ConflictError } from "../errors/AppError.js";
import { type UserAccount } from "../data/mockUsers.js";

const SALT_ROUNDS = 12;
const resetTokensMap = new Map<string, { userId: string; expiresAt: number }>();

export class AuthService {
  async register(data: {
    name: string;
    phone: string;
    email?: string;
    password: string;
    district: string;
    city: string;
    landHolding?: number;
    primaryCrops?: string[];
  }) {
    const existing = await userRepository.findByPhone(data.phone);
    if (existing) {
      throw new ConflictError("An account with this phone number already exists. Please login.");
    }

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    const newUser: UserAccount = {
      id: `usr_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || undefined,
      passwordHash,
      district: data.district.trim(),
      city: data.city.trim(),
      state: "Maharashtra",
      landHolding: Number(data.landHolding) || 4.5,
      primaryCrops: Array.isArray(data.primaryCrops) && data.primaryCrops.length > 0 
        ? data.primaryCrops 
        : ["Soybean", "Tur", "Wheat"],
      role: "farmer",
      isVerified: true,
      createdAt: new Date().toISOString(),
    };

    await userRepository.create(newUser);

    const accessToken = signAccessToken({
      userId: newUser.id,
      phone: newUser.phone,
      role: newUser.role,
    });

    const refreshToken = signRefreshToken({
      userId: newUser.id,
      phone: newUser.phone,
      role: newUser.role,
    });

    const { passwordHash: _, ...userWithoutPassword } = newUser;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  async login(phone: string, password: string) {
    const user = await userRepository.findByPhone(phone);
    if (!user) {
      throw new UnauthorizedError("Invalid phone number or password.");
    }

    // Support both bcrypt hashes and legacy plaintext for initial mock data
    let isMatch = false;
    if (user.passwordHash.startsWith("$2b$") || user.passwordHash.startsWith("$2a$")) {
      isMatch = await bcrypt.compare(password, user.passwordHash);
    } else {
      isMatch = user.passwordHash === password;
    }

    if (!isMatch) {
      throw new UnauthorizedError("Invalid phone number or password.");
    }

    const accessToken = signAccessToken({
      userId: user.id,
      phone: user.phone,
      role: user.role,
    });

    const refreshToken = signRefreshToken({
      userId: user.id,
      phone: user.phone,
      role: user.role,
    });

    const { passwordHash: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  async requestPasswordReset(phone: string) {
    const user = await userRepository.findByPhone(phone);
    if (!user) {
      // Don't leak user existence
      return { success: true, message: "If account exists, reset instructions have been generated." };
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    resetTokensMap.set(resetToken, {
      userId: user.id,
      expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
    });

    return {
      success: true,
      message: "Reset token generated successfully.",
      resetToken, // Returned for API usage
    };
  }

  async resetPassword(resetToken: string, newPassword: string) {
    const record = resetTokensMap.get(resetToken);
    if (!record || record.expiresAt < Date.now()) {
      throw new BadRequestError("Invalid or expired reset token.");
    }

    const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await userRepository.update(record.userId, { passwordHash: newPasswordHash });
    resetTokensMap.delete(resetToken);

    return { success: true, message: "Password updated successfully." };
  }
}

export const authService = new AuthService();
