import { Router } from "express";
import * as authService from "../services/authService";
import { toLowerCase } from "../middleware/emailToLower";
import { cookieOptions } from "../utils/cookieOptions";

const router = Router();

router.post("/register", toLowerCase, async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.cookie("authcookie", result.refreshToken, cookieOptions);
    console.log("User registered:", result.userData.email);
    res.status(201).json({
      userData: result.userData,
      accessToken: result.accessToken,
    });
  } catch (error: any) {
    console.error("Register error:", error.message);
    res.status(400).json({ message: error.message });
  }
});

router.post("/login", toLowerCase, async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.cookie("authcookie", result.refreshToken, cookieOptions);
    res.status(200).json({
      userData: result.userData,
      accessToken: result.accessToken,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/refresh-token", async (req, res) => {
  try {
    const token = req.cookies.authcookie;
    if (!token) throw new Error("No refresh token provided");

    const result = await authService.refreshToken(token);
    res.cookie("authcookie", result.refreshToken, cookieOptions);
    res.status(200).json(result.userData);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

router.get("/test", (_req, res) => res.send("Auth controller works!"));

export default router;
