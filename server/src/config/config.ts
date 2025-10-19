import dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || "secret";
export const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || "1h";
export const PORT = process.env.PORT || 4000;
export const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/trading-dashboard";
