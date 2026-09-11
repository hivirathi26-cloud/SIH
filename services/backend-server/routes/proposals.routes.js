import express from "express";
import { pgDb } from "../db/postgresStore.js";
import { query, getPostgresStatus } from "../db/postgres.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const list = await pgDb.getProposals(req.query);
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { data, milestones } = await pgDb.createProposal(req.body);
    res.status(201).json({ success: true, data, milestones });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch("/:id/status", async (req, res) => {
  const { status, industryPartnerId, industryPartnerName } = req.body;
  if (getPostgresStatus()) {
    try {
      const result = await query(
        `UPDATE proposals SET status = $1, industry_partner_id = $2, industry_partner_name = $3, approved_at = CASE WHEN $1 = 'approved' THEN NOW() ELSE approved_at END WHERE id = $4 RETURNING *;`,
        [status, industryPartnerId || null, industryPartnerName || null, req.params.id]
      );
      if (result.rows.length > 0) {
        return res.json({ success: true, data: result.rows[0] });
      }
    } catch (err) {
      console.warn("PostgreSQL updateProposal error:", err.message);
    }
  }
  res.json({ success: true, data: { id: req.params.id, status } });
});

export default router;
