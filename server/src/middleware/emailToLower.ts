import { Request, Response, NextFunction } from "express";

export const toLowerCase = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (req.body.email) {
    req.body.email = req.body.email.toLowerCase();
  }
  next();
};
