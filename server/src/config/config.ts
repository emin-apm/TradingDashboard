import dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET;
export const TOKEN_EXPIRY = process.env.JWT_EXPIRES_IN;
export const PORT = process.env.PORT;

export const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI)
  throw new Error("MONGO_URI environment variable is not defined!");
