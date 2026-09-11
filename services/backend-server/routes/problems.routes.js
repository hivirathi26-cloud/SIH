import express from "express";
import { pgDb } from "../db/postgresStore.js";

const router = express.Router();

// GET all problems with optional filters directly from PostgreSQL
router.get("/", async (req, res) => {
  try {
    const list = await pgDb.getProblems(req.query);
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single problem by ID
router.get("/:id", async (req, res) => {
  try {
    const problem = await pgDb.getProblemById(req.params.id);
    if (!problem) return res.status(404).json({ success: false, message: "Problem not found" });
    res.json({ success: true, data: problem });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST submit new problem
router.post("/", async (req, res) => {
  try {
    const created = await pgDb.createProblem(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH update status
router.patch("/:id/status", async (req, res) => {
  try {
    const updated = await pgDb.updateProblemStatus(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "Problem not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST upvote problem
router.post("/:id/upvote", async (req, res) => {
  try {
    const updated = await pgDb.upvoteProblem(req.params.id);
    if (!updated) return res.status(404).json({ success: false, message: "Problem not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST rate problem
router.post("/:id/rate", async (req, res) => {
  try {
    const updated = await pgDb.rateProblem(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: "Problem not found" });
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
