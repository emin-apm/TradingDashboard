import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload as DefaultJwtPayload } from "jsonwebtoken";

interface JwtPayload extends DefaultJwtPayload {
  _id: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const verifyAccessToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const tokenParts = authHeader.split(" ");
  const token = tokenParts[1];
  if (!token) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET is missing in environment variables");
    return res.status(500).json({ message: "Internal server error" });
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;

    if (!decoded._id || !decoded.email) {
      return res.status(403).json({ message: "Invalid token payload" });
    }

    req.user = decoded;

    next();
  } catch {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
