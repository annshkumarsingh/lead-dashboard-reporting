import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 8000),
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/lead_dashboard",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
};
