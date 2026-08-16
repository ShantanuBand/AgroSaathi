import { z } from "zod";

const envSchema = z.object({
  PORT: z.string().default("3000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().default("agri_clarity_super_secret_jwt_key_2026_prod"),
  JWT_REFRESH_SECRET: z.string().default("agri_clarity_super_secret_refresh_jwt_key_2026_prod"),
  AGMARKNET_API_KEY: z.string().optional(),
  OPENWEATHER_API_KEY: z.string().optional(),
  CORS_ORIGIN: z.string().default("*"),
});

export const env = envSchema.parse(process.env);
