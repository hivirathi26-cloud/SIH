import express from "express";
import { pgDb } from "../db/postgresStore.js";
import { query, getPostgresStatus } from "../db/postgres.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const list = await pgDb.getMilestones(req.query.proposalId);
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Faculty Mentor Approval
router.post("/:id/faculty-approve", async (req, res) => {
  try {
    const updated = await pgDb.facultyApproveMilestone(req.params.id, req.body.approverName);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Govt District Officer Approval
router.post("/:id/govt-approve", async (req, res) => {
  try {
    const updated = await pgDb.govtApproveMilestone(req.params.id, req.body.approverName);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Document Vault Upload
router.post("/:id/documents", async (req, res) => {
  const { title, docType, storageUrl, fileSize, uploadedBy, uploadedByName } = req.body;
  const newDoc = {
    id: `doc-${Date.now()}`,
    milestoneId: req.params.id,
    title: title || "Milestone Research Deliverable",
    docType: docType || "report",
    storageUrl: storageUrl || "/vault/report.pdf",
    fileSize: fileSize || "2.4 MB",
    uploadedBy: uploadedBy || "student",
    uploadedByName: uploadedByName || "Student Innovator",
    uploadedAt: new Date().toISOString()
  };

  if (getPostgresStatus()) {
    try {
      const resDb = await query(
        `UPDATE milestones SET documents = documents || $1::jsonb WHERE id = $2 RETURNING *;`,
        [JSON.stringify([newDoc]), req.params.id]
      );
      if (resDb.rows.length > 0) {
        return res.status(201).json({ success: true, data: newDoc, milestone: resDb.rows[0] });
      }
    } catch (err) {
      console.warn("PostgreSQL document upload error:", err.message);
    }
  }

  res.status(201).json({ success: true, data: newDoc });
});

export default router;
