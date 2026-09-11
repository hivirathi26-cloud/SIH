import express from "express";
import { pgDb } from "../db/postgresStore.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { userId } = req.query;
  const notifs = await pgDb.getNotifications(userId);
  res.json({ success: true, count: notifs.length, data: notifs });
});

router.post("/", async (req, res) => {
  const newNotif = await pgDb.createNotification(req.body);
  res.status(201).json({ success: true, data: newNotif });
});

router.patch("/:id/read", async (req, res) => {
  const notif = await pgDb.markNotificationRead(req.params.id);
  if (!notif) return res.status(404).json({ success: false, message: "Notification not found" });
  res.json({ success: true, data: notif });
});

export default router;

