import { Router } from "express";
import authController from "../controller/authController";
import tradeController from "../controller/tradeController";

const router = Router();

router.use("/user", authController);
router.use("/order", tradeController);

export default router;
