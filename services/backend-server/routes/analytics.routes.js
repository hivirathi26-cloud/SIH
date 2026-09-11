import express from "express";
import { pgDb } from "../db/postgresStore.js";

const router = express.Router();

router.get("/summary", async (req, res) => {
  const summary = await pgDb.getAnalyticsSummary();
  res.json({
    success: true,
    data: summary
  });
});

router.get("/districts", async (req, res) => {
  const districts = await pgDb.getDistricts();
  res.json({
    success: true,
    count: districts.length,
    data: districts
  });
});

router.get("/leaderboard", async (req, res) => {
  const leaderboard = await pgDb.getLeaderboard();
  res.json({
    success: true,
    count: leaderboard.length,
    data: leaderboard
  });
});

export default router;

