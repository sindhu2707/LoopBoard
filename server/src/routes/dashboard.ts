import { Router } from "express";
import { getDashboardStats } from "../data/store";
import { asyncHandler } from "../middleware/asyncHandler";

const router = Router();

router.get(
  "/stats",
  asyncHandler(async (req, res) => {
    res.json(await getDashboardStats());
  })
);

export default router;