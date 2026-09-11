import express from "express";
import { pgDb } from "../db/postgresStore.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const list = await pgDb.getTeams(req.query);
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const created = await pgDb.createTeam(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
