import express from "express";
import { pgDb } from "../db/postgresStore.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const list = await pgDb.getUniversities();
  res.json({ success: true, count: list.length, data: list });
});

router.get("/:id", async (req, res) => {
  const list = await pgDb.getUniversities();
  const univ = list.find((u) => u.id === req.params.id);
  if (!univ) return res.status(404).json({ success: false, message: "University not found" });
  res.json({ success: true, data: univ });
});

export default router;

