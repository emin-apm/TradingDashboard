import dotenv from "dotenv";

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./config/connectDB";
import router from "./routes/router";
import { errorHandler } from "./middleware/errorHandler";
import rateLimiter from "./middleware/limiter";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://trading-web331.web.app"],
    credentials: true,
  })
);

app.use(rateLimiter);

app.use("/", router);
app.get("/", (_req, res) => res.send("Trading Cashboard Backend running1!"));
app.use(errorHandler);

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT;

if (!MONGO_URI) {
  throw new Error("MONGO_URI environment variable not defined!");
}
connectDB(MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
