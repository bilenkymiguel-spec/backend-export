import { Router } from "express";
import {
  governanceData,
  type GovernanceSummary,
} from "../types/system.js";

const router = Router();

router.get("/", (_req, res) => {
  const data: GovernanceSummary = governanceData;

  res.json({
    success: true,
    data,
  });
});

export default router;