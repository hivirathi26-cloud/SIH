import express from "express";
import { pgDb } from "../db/postgresStore.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const ledger = await pgDb.getBlockchainLedger();
  res.json({
    success: true,
    count: ledger.length,
    data: ledger
  });
});

router.post("/block", async (req, res) => {
  const { eventType, entityId, details, verifiedBy } = req.body;
  const newBlock = await pgDb.addBlockchainBlock({ eventType, entityId, details, verifiedBy });
  res.status(201).json({ success: true, data: newBlock });
});

export default router;

