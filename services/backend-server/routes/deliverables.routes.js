import express from "express";
import { pgDb } from "../db/postgresStore.js";
import { query, getPostgresStatus } from "../db/postgres.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const list = await pgDb.getDeliverables(req.query);
    res.json({ success: true, count: list.length, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/", async (req, res) => {
  const newTask = {
    ...req.body,
    id: `dt-${Date.now()}`,
    status: req.body.status || "assigned",
    assignedAt: new Date().toISOString()
  };

  if (getPostgresStatus()) {
    try {
      const resDb = await query(
        `INSERT INTO student_deliverables (id, proposal_id, proposal_title, milestone_id, milestone_name, title, description, assigned_student_id, assigned_student_name, student_discipline, progress_percent, status, assigned_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW()) RETURNING *;`,
        [
          newTask.id,
          newTask.proposalId || null,
          newTask.proposalTitle || null,
          newTask.milestoneId || null,
          newTask.milestoneName || null,
          newTask.title,
          newTask.description || null,
          newTask.assignedStudentId || null,
          newTask.assignedStudentName || null,
          newTask.studentDiscipline || null,
          newTask.progressPercent || 0,
          newTask.status
        ]
      );
      return res.status(201).json({ success: true, data: resDb.rows[0] });
    } catch (err) {
      console.warn("PostgreSQL create deliverable error:", err.message);
    }
  }

  res.status(201).json({ success: true, data: newTask });
});

router.post("/:id/submit", async (req, res) => {
  const { progressPercent, notes, pdfUrl } = req.body;
  if (getPostgresStatus()) {
    try {
      const resDb = await query(
        `UPDATE student_deliverables SET progress_percent = $1, submission_notes = $2, pdf_url = $3, status = 'in_review_by_faculty', submitted_at = NOW() WHERE id = $4 RETURNING *;`,
        [progressPercent || 100, notes || null, pdfUrl || null, req.params.id]
      );
      if (resDb.rows.length > 0) {
        return res.json({ success: true, data: resDb.rows[0] });
      }
    } catch (err) {
      console.warn("PostgreSQL submit deliverable error:", err.message);
    }
  }
  res.json({ success: true, data: { id: req.params.id, status: "in_review_by_faculty" } });
});

router.post("/:id/review", async (req, res) => {
  const { decision, feedback, approverName } = req.body;
  const isApproved = decision === "accept";
  if (getPostgresStatus()) {
    try {
      const resDb = await query(
        `UPDATE student_deliverables SET status = $1, faculty_feedback = $2, faculty_signed_at = NOW(), faculty_signed_by = $3 WHERE id = $4 RETURNING *;`,
        [isApproved ? "approved_by_faculty" : "revision_requested", feedback || null, approverName || "Faculty Mentor", req.params.id]
      );
      if (resDb.rows.length > 0) {
        return res.json({ success: true, data: resDb.rows[0] });
      }
    } catch (err) {
      console.warn("PostgreSQL review deliverable error:", err.message);
    }
  }
  res.json({ success: true, data: { id: req.params.id, status: isApproved ? "approved_by_faculty" : "revision_requested" } });
});

export default router;
