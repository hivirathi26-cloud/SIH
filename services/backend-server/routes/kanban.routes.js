import express from "express";
import { pgDb } from "../db/postgresStore.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { teamId } = req.query;
  const tasks = await pgDb.getKanbanTasks(teamId);
  res.json({ success: true, count: tasks.length, data: tasks });
});

router.post("/", async (req, res) => {
  const newTask = await pgDb.addKanbanTask(req.body);
  res.status(201).json({ success: true, data: newTask });
});

router.patch("/:id", async (req, res) => {
  const updated = await pgDb.updateKanbanTask(req.params.id, req.body);
  if (!updated) return res.status(404).json({ success: false, message: "Task not found" });
  res.json({ success: true, data: updated });
});

export default router;

