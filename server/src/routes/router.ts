import { Router } from "express";
import authController from "../controller/authController";

const router = Router();

router.use("/user", authController);

export default router;
