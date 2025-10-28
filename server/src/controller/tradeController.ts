import { Router } from "express";
import * as tradeService from "../services/tradeService";
import { verifyAccessToken } from "../middleware/verifyAccessToken";

const router = Router();

router.post("/buy", verifyAccessToken, async (req, res) => {
  try {
    const result = await tradeService.buy(req.body);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/sell", verifyAccessToken, async (req, res) => {
  try {
    const result = await tradeService.sell(req.body);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
