import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import routes from "./routes/index.js";
import { globalErrorHandler } from "./middlewares/errorHandler.js";
import { apiRateLimiter } from "./middlewares/rateLimiter.js";
import { env } from "./config/env.js";

export const app = express();

app.use(helmet({
  contentSecurityPolicy: false, // Disabled for flexible dev asset loading
}));

app.use(cors({
  origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN,
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", apiRateLimiter, routes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: "API Route Not Found" });
});

app.use(globalErrorHandler);
