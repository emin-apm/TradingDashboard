import rateLimit from "express-rate-limit";
import { Request, Response } from "express";

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    status: 429,
    error: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req: Request, res: Response, _next, options) => {
    res.status(options.statusCode).json(options.message);
  },
});

export default rateLimiter;
