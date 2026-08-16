import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Load .env file into process.env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../.env");

if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf-8");
  for (const line of envConfig.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...valueParts] = trimmed.split("=");
      const val = valueParts.join("=").trim();
      if (key && val && !process.env[key.trim()]) {
        process.env[key.trim()] = val;
      }
    }
  }
}

import { app } from "./app.js";

const port = Number(process.env.PORT || 3000);

app.listen(port, "0.0.0.0", () => {
  console.log(`Backend API Server running on http://0.0.0.0:${port}`);
  if (process.env.AGMARKNET_API_KEY) {
    console.log("AGMARKNET Live Government API Key Loaded! Key:", process.env.AGMARKNET_API_KEY.slice(0, 10) + "...");
  }
});
