import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  MOCK_USERS,
  MOCK_PROBLEMS,
  MOCK_UNIVERSITIES,
  MOCK_TEAMS,
  MOCK_PROPOSALS,
  MOCK_AGREEMENTS,
  MOCK_MILESTONES,
  MOCK_KANBAN_TASKS,
  MOCK_NOTIFICATIONS,
  MOCK_BLOCKCHAIN_LEDGER,
  JHARKHAND_DISTRICTS
} from "../../../apps/web/src/data/mockData.js";
import { initPostgres, query, getPostgresStatus } from "./postgres.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "../data");
const DB_FILE = path.join(DATA_DIR, "db.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial state
let store = {
  users: { ...MOCK_USERS },
  problems: [...MOCK_PROBLEMS],
  universities: [...MOCK_UNIVERSITIES],
  teams: [...MOCK_TEAMS],
  proposals: [...MOCK_PROPOSALS],
  agreements: [...MOCK_AGREEMENTS],
  milestones: [...MOCK_MILESTONES],
  kanbanTasks: [...MOCK_KANBAN_TASKS],
  notifications: [...MOCK_NOTIFICATIONS],
  blockchainLedger: [...MOCK_BLOCKCHAIN_LEDGER],
  districts: [...JHARKHAND_DISTRICTS],
  studentDeliverables: [
    {
      id: "dt-001",
      proposalId: "prop-001",
      proposalTitle: "JalShuddhi: Solar-Powered Nano-Adsorptive Fluoride Filter",
      milestoneId: "ms-002",
      milestoneName: "Milestone 2: Prototype Fabrication & Lab Bench Testing",
      title: "ESP32 Embedded Firmware & LoRaWAN Node Assembly",
      description: "Program ESP32 to read optical turbidity & conductivity sensors and transmit every 15 mins.",
      assignedStudentId: "student-rahul",
      assignedStudentName: "Rahul Kumar (Team Lead)",
      studentDiscipline: "Electronics & IoT Engineering",
      progressPercent: 85,
      status: "in_progress",
      submissionNotes: "Bench prototype breadboard completed, working on waterproof housing."
    },
    {
      id: "dt-002",
      proposalId: "prop-001",
      proposalTitle: "JalShuddhi: Solar-Powered Nano-Adsorptive Fluoride Filter",
      milestoneId: "ms-002",
      milestoneName: "Milestone 2: Prototype Fabrication & Lab Bench Testing",
      title: "MQTT Cloud Broker & Real-Time Dashboard Integration",
      description: "Build state dashboard ingestion stream with automatic alert triggers when fluoride > 1.0 ppm.",
      assignedStudentId: "student-priya",
      assignedStudentName: "Priya Sharma (Student)",
      studentDiscipline: "Computer Science & Engineering",
      progressPercent: 100,
      status: "in_review_by_faculty",
      pdfUrl: "/vault/mqtt_cloud_telemetry_report.pdf",
      submissionNotes: "AWS IoT core hooked up to JSICP database. 100% packets received in 48-hr stress test.",
      submittedAt: "2026-03-02T14:30:00Z"
    },
    {
      id: "dt-003",
      proposalId: "prop-001",
      proposalTitle: "JalShuddhi: Solar-Powered Nano-Adsorptive Fluoride Filter",
      milestoneId: "ms-003",
      milestoneName: "Milestone 3: Field Testing & Pilot Calibration in District",
      title: "14-Day NABL Laboratory Water Fluoride Stress Test",
      description: "Continuous flow testing of activated alumina nano-adsorbent cartridge matrix using Angara borewell samples.",
      assignedStudentId: "student-sneha",
      assignedStudentName: "Sneha Soren (Student)",
      studentDiscipline: "Chemical & Environmental Engineering",
      progressPercent: 100,
      status: "in_review_by_faculty",
      pdfUrl: "/vault/nabl_certified_water_fluoride_titration_sheet.pdf",
      submissionNotes: "Fluoride level dropped from 6.8 ppm down to 0.42 ppm (well within BIS 10500 standard of 1.0 ppm). NABL certified report attached.",
      submittedAt: "2026-03-03T11:00:00Z"
    },
    {
      id: "dt-004",
      proposalId: "prop-001",
      proposalTitle: "JalShuddhi: Solar-Powered Nano-Adsorptive Fluoride Filter",
      milestoneId: "ms-001",
      milestoneName: "Milestone 1: Research, Chemical Formulation & 3D CAD Design",
      title: "Dual-Cartridge Modular Chamber 3D CAD Blueprint",
      description: "CAD mechanical design of quick-swap cartridge housing compatible with standard Mark-II handpumps.",
      assignedStudentId: "student-amit",
      assignedStudentName: "Amit Verma (Student)",
      studentDiscipline: "Mechanical Engineering",
      progressPercent: 100,
      status: "approved_by_faculty",
      pdfUrl: "/vault/mark2_handpump_cartridge_cad_blueprint.pdf",
      submissionNotes: "3D CAD model stress-analyzed for 15 bar pressure. Passed mechanical safety guidelines.",
      facultyFeedback: "Excellent dimensional tolerance and ergonomic latch design. Approved for lab CNC milling.",
      facultySignedAt: "2026-02-20T16:00:00Z",
      facultySignedBy: "Prof. Ananya Sen"
    }
  ]
};

// Load existing data from DB_FILE if present
if (fs.existsSync(DB_FILE)) {
  try {
    const saved = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    store = { ...store, ...saved };
  } catch (err) {
    console.error("Error reading db.json, starting with fresh seed data:", err.message);
  }
}

// Initialize PostgreSQL in background
initPostgres(store);

// Persist store helper
export function saveStore() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to save store to file:", err.message);
  }
}

export const db = {
  get: () => store,
  getProblems: () => store.problems,
  getProblemById: (id) => store.problems.find((p) => p.id === id || p.ticketNumber === id),
  addProblem: (problem) => {
    store.problems.unshift(problem);
    saveStore();

    if (getPostgresStatus()) {
      query(
        `INSERT INTO problems (id, ticket_number, submitted_by, submitter_name, submitter_role, title, description, description_original_lang, detected_language, category, sub_category, category_confidence, priority_score, status, district, block, village, latitude, longitude, is_duplicate_of, citizen_support_count, sdg_tags, media, ai_explanation, assigned_university_id, assigned_university_name, assigned_faculty_id, assigned_faculty_name, active_proposal_id, feedback_rating, feedback_comment, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33)
         ON CONFLICT (id) DO UPDATE SET status = EXCLUDED.status, updated_at = EXCLUDED.updated_at;`,
        [
          problem.id,
          problem.ticketNumber,
          problem.submittedBy,
          problem.submitterName,
          problem.submitterRole,
          problem.title,
          problem.description,
          problem.descriptionOriginalLang || null,
          problem.detectedLanguage || null,
          problem.category,
          problem.subCategory || null,
          problem.categoryConfidence || 0.95,
          problem.priorityScore || 80,
          problem.status || "submitted",
          problem.district,
          problem.block || null,
          problem.village || null,
          problem.latitude || null,
          problem.longitude || null,
          problem.isDuplicateOf || null,
          problem.citizenSupportCount || 1,
          JSON.stringify(problem.sdgTags || []),
          JSON.stringify(problem.media || []),
          JSON.stringify(problem.aiExplanation || {}),
          problem.assignedUniversityId || null,
          problem.assignedUniversityName || null,
          problem.assignedFacultyId || null,
          problem.assignedFacultyName || null,
          problem.activeProposalId || null,
          problem.feedbackRating || null,
          problem.feedbackComment || null,
          problem.createdAt || new Date().toISOString(),
          problem.updatedAt || new Date().toISOString()
        ]
      ).catch((err) => console.warn("PostgreSQL addProblem sync warning:", err.message));
    }

    return problem;
  },
  updateProblem: (id, updates) => {
    const idx = store.problems.findIndex((p) => p.id === id || p.ticketNumber === id);
    if (idx !== -1) {
      store.problems[idx] = { ...store.problems[idx], ...updates, updatedAt: new Date().toISOString() };
      saveStore();

      if (getPostgresStatus()) {
        const p = store.problems[idx];
        query(
          `UPDATE problems SET status = $1, assigned_university_id = $2, assigned_university_name = $3, assigned_faculty_id = $4, assigned_faculty_name = $5, citizen_support_count = $6, feedback_rating = $7, feedback_comment = $8, updated_at = $9 WHERE id = $10 OR ticket_number = $10;`,
          [
            p.status,
            p.assignedUniversityId || null,
            p.assignedUniversityName || null,
            p.assignedFacultyId || null,
            p.assignedFacultyName || null,
            p.citizenSupportCount || 1,
            p.feedbackRating || null,
            p.feedbackComment || null,
            p.updatedAt,
            id
          ]
        ).catch((err) => console.warn("PostgreSQL updateProblem sync warning:", err.message));
      }

      return store.problems[idx];
    }
    return null;
  },
  getUsers: () => store.users,
  getUserById: (id) => store.users[id],
  getUniversities: () => store.universities,
  getTeams: () => store.teams,
  addTeam: (team) => {
    store.teams.unshift(team);
    saveStore();

    if (getPostgresStatus()) {
      query(
        `INSERT INTO teams (id, problem_id, problem_title, university_id, university_name, faculty_mentor_id, faculty_mentor_name, faculty_department, members, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (id) DO NOTHING;`,
        [
          team.id,
          team.problemId || null,
          team.problemTitle || null,
          team.universityId || null,
          team.universityName || null,
          team.facultyMentorId || null,
          team.facultyMentorName || null,
          team.facultyDepartment || null,
          JSON.stringify(team.members || []),
          team.createdAt || new Date().toISOString()
        ]
      ).catch((err) => console.warn("PostgreSQL addTeam sync warning:", err.message));
    }

    return team;
  },
  addTeamMember: (teamId, member) => {
    const team = store.teams.find((t) => t.id === teamId);
    if (team) {
      team.members.push(member);
      saveStore();

      if (getPostgresStatus()) {
        query(`UPDATE teams SET members = $1 WHERE id = $2;`, [JSON.stringify(team.members), teamId]).catch(
          (err) => console.warn("PostgreSQL addTeamMember sync warning:", err.message)
        );
      }

      return member;
    }
    return null;
  },
  getProposals: () => store.proposals,
  addProposal: (proposal) => {
    store.proposals.unshift(proposal);
    saveStore();

    if (getPostgresStatus()) {
      query(
        `INSERT INTO proposals (id, team_id, problem_id, problem_title, problem_category, district, university_name, faculty_mentor_name, title, summary, technical_approach, expected_outcome, estimated_budget, duration_months, needs_industry_support, support_type_needed, status, submitted_at, approved_at, industry_partner_id, industry_partner_name, startup_incubation_eligible)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
         ON CONFLICT (id) DO NOTHING;`,
        [
          proposal.id,
          proposal.teamId || null,
          proposal.problemId || null,
          proposal.problemTitle || null,
          proposal.problemCategory || null,
          proposal.district || null,
          proposal.universityName || null,
          proposal.facultyMentorName || null,
          proposal.title,
          proposal.summary || null,
          proposal.technicalApproach || null,
          proposal.expectedOutcome || null,
          proposal.estimatedBudget || 0,
          proposal.durationMonths || 6,
          proposal.needsIndustrySupport || false,
          JSON.stringify(proposal.supportTypeNeeded || []),
          proposal.status || "submitted",
          proposal.submittedAt || new Date().toISOString(),
          proposal.approvedAt || null,
          proposal.industryPartnerId || null,
          proposal.industryPartnerName || null,
          proposal.startupIncubationEligible || false
        ]
      ).catch((err) => console.warn("PostgreSQL addProposal sync warning:", err.message));
    }

    return proposal;
  },
  updateProposal: (id, updates) => {
    const idx = store.proposals.findIndex((p) => p.id === id);
    if (idx !== -1) {
      store.proposals[idx] = { ...store.proposals[idx], ...updates };
      saveStore();

      if (getPostgresStatus()) {
        const prop = store.proposals[idx];
        query(
          `UPDATE proposals SET status = $1, approved_at = $2, industry_partner_id = $3, industry_partner_name = $4 WHERE id = $5;`,
          [prop.status, prop.approvedAt || null, prop.industryPartnerId || null, prop.industryPartnerName || null, id]
        ).catch((err) => console.warn("PostgreSQL updateProposal sync warning:", err.message));
      }

      return store.proposals[idx];
    }
    return null;
  },
  getAgreements: () => store.agreements,
  addAgreement: (agreement) => {
    store.agreements.unshift(agreement);
    saveStore();

    if (getPostgresStatus()) {
      query(
        `INSERT INTO agreements (id, proposal_id, proposal_title, university_name, industry_partner_id, industry_partner_name, industry_type, agreement_type, amount, terms, signed_at, document_url, blockchain_tx_hash, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
         ON CONFLICT (id) DO NOTHING;`,
        [
          agreement.id,
          agreement.proposalId,
          agreement.proposalTitle || null,
          agreement.universityName || null,
          agreement.industryPartnerId || null,
          agreement.industryPartnerName || null,
          agreement.industryType || null,
          agreement.agreementType || null,
          agreement.amount || 0,
          agreement.terms || null,
          agreement.signedAt || new Date().toISOString(),
          agreement.documentUrl || null,
          agreement.blockchainTxHash || null,
          agreement.status || "active"
        ]
      ).catch((err) => console.warn("PostgreSQL addAgreement sync warning:", err.message));
    }

    return agreement;
  },
  getMilestones: (proposalId) => {
    if (proposalId) {
      return store.milestones.filter((m) => m.proposalId === proposalId);
    }
    return store.milestones;
  },
  addMilestones: (milestoneList) => {
    store.milestones.unshift(...milestoneList);
    saveStore();

    if (getPostgresStatus()) {
      for (const m of milestoneList) {
        query(
          `INSERT INTO milestones (id, proposal_id, index, name, display_name, description, status, due_date, completed_at, faculty_approved, faculty_approved_by, govt_approved, govt_approved_by, documents, blockchain_tx_hash, feedback_notes)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
           ON CONFLICT (id) DO NOTHING;`,
          [
            m.id,
            m.proposalId,
            m.index,
            m.name,
            m.displayName,
            m.description || null,
            m.status || "pending",
            m.dueDate || null,
            m.completedAt || null,
            m.facultyApproved || false,
            m.facultyApprovedBy || null,
            m.govtApproved || false,
            m.govtApprovedBy || null,
            JSON.stringify(m.documents || []),
            m.blockchainTxHash || null,
            m.feedbackNotes || null
          ]
        ).catch((err) => console.warn("PostgreSQL addMilestones sync warning:", err.message));
      }
    }

    return milestoneList;
  },
  updateMilestone: (id, updates) => {
    const idx = store.milestones.findIndex((m) => m.id === id);
    if (idx !== -1) {
      store.milestones[idx] = { ...store.milestones[idx], ...updates };
      saveStore();

      if (getPostgresStatus()) {
        const m = store.milestones[idx];
        query(
          `UPDATE milestones SET status = $1, completed_at = $2, faculty_approved = $3, faculty_approved_by = $4, govt_approved = $5, govt_approved_by = $6, documents = $7 WHERE id = $8;`,
          [
            m.status,
            m.completedAt || null,
            m.facultyApproved || false,
            m.facultyApprovedBy || null,
            m.govtApproved || false,
            m.govtApprovedBy || null,
            JSON.stringify(m.documents || []),
            id
          ]
        ).catch((err) => console.warn("PostgreSQL updateMilestone sync warning:", err.message));
      }

      return store.milestones[idx];
    }
    return null;
  },
  getStudentDeliverables: (proposalId) => {
    if (proposalId) {
      return store.studentDeliverables.filter((d) => d.proposalId === proposalId);
    }
    return store.studentDeliverables;
  },
  addStudentDeliverable: (task) => {
    store.studentDeliverables.unshift(task);
    saveStore();

    if (getPostgresStatus()) {
      query(
        `INSERT INTO student_deliverables (id, proposal_id, proposal_title, milestone_id, milestone_name, title, description, assigned_student_id, assigned_student_name, student_discipline, progress_percent, status, pdf_url, submission_notes, assigned_at, submitted_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
         ON CONFLICT (id) DO NOTHING;`,
        [
          task.id,
          task.proposalId,
          task.proposalTitle || null,
          task.milestoneId || null,
          task.milestoneName || null,
          task.title,
          task.description || null,
          task.assignedStudentId || null,
          task.assignedStudentName || null,
          task.studentDiscipline || null,
          task.progressPercent || 0,
          task.status || "assigned",
          task.pdfUrl || null,
          task.submissionNotes || null,
          task.assignedAt || new Date().toISOString(),
          task.submittedAt || null
        ]
      ).catch((err) => console.warn("PostgreSQL addStudentDeliverable sync warning:", err.message));
    }

    return task;
  },
  updateStudentDeliverable: (id, updates) => {
    const idx = store.studentDeliverables.findIndex((d) => d.id === id);
    if (idx !== -1) {
      store.studentDeliverables[idx] = { ...store.studentDeliverables[idx], ...updates };
      saveStore();

      if (getPostgresStatus()) {
        const d = store.studentDeliverables[idx];
        query(
          `UPDATE student_deliverables SET status = $1, progress_percent = $2, submission_notes = $3, pdf_url = $4, submitted_at = $5, faculty_feedback = $6, faculty_signed_at = $7, faculty_signed_by = $8 WHERE id = $9;`,
          [
            d.status,
            d.progressPercent || 0,
            d.submissionNotes || null,
            d.pdfUrl || null,
            d.submittedAt || null,
            d.facultyFeedback || null,
            d.facultySignedAt || null,
            d.facultySignedBy || null,
            id
          ]
        ).catch((err) => console.warn("PostgreSQL updateStudentDeliverable sync warning:", err.message));
      }

      return store.studentDeliverables[idx];
    }
    return null;
  },
  getKanbanTasks: (teamId) => {
    if (teamId && teamId !== "all") {
      return store.kanbanTasks.filter((k) => k.teamId === teamId);
    }
    return store.kanbanTasks;
  },
  addKanbanTask: (task) => {
    store.kanbanTasks.unshift(task);
    saveStore();

    if (getPostgresStatus()) {
      query(
        `INSERT INTO kanban_tasks (id, team_id, title, description, assigned_to, assigned_name, status, priority, milestone_name, due_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (id) DO NOTHING;`,
        [
          task.id,
          task.teamId || "all",
          task.title,
          task.description || null,
          task.assignedTo || null,
          task.assignedName || null,
          task.status || "backlog",
          task.priority || "medium",
          task.milestoneName || null,
          task.dueDate || null
        ]
      ).catch((err) => console.warn("PostgreSQL addKanbanTask sync warning:", err.message));
    }

    return task;
  },
  updateKanbanTask: (id, updates) => {
    const idx = store.kanbanTasks.findIndex((k) => k.id === id);
    if (idx !== -1) {
      store.kanbanTasks[idx] = { ...store.kanbanTasks[idx], ...updates };
      saveStore();

      if (getPostgresStatus()) {
        const k = store.kanbanTasks[idx];
        query(`UPDATE kanban_tasks SET status = $1, priority = $2 WHERE id = $3;`, [k.status, k.priority, id]).catch(
          (err) => console.warn("PostgreSQL updateKanbanTask sync warning:", err.message)
        );
      }

      return store.kanbanTasks[idx];
    }
    return null;
  },
  getNotifications: (userId) => {
    if (userId) {
      return store.notifications.filter((n) => n.userId === userId);
    }
    return store.notifications;
  },
  addNotification: (notif) => {
    store.notifications.unshift(notif);
    saveStore();

    if (getPostgresStatus()) {
      query(
        `INSERT INTO notifications (id, user_id, channel, event_type, title, message, sent_at, status, link_url)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO NOTHING;`,
        [
          notif.id,
          notif.userId || null,
          notif.channel || "in_app",
          notif.eventType || "GENERAL",
          notif.title,
          notif.message,
          notif.sentAt || new Date().toISOString(),
          notif.status || "delivered",
          notif.linkUrl || null
        ]
      ).catch((err) => console.warn("PostgreSQL addNotification sync warning:", err.message));
    }

    return notif;
  },
  markNotificationRead: (id) => {
    const notif = store.notifications.find((n) => n.id === id);
    if (notif) {
      notif.status = "read";
      saveStore();

      if (getPostgresStatus()) {
        query(`UPDATE notifications SET status = 'read' WHERE id = $1;`, [id]).catch((err) =>
          console.warn("PostgreSQL markNotificationRead sync warning:", err.message)
        );
      }

      return notif;
    }
    return null;
  },
  getBlockchainLedger: () => store.blockchainLedger,
  addBlockchainBlock: (block) => {
    store.blockchainLedger.unshift(block);
    saveStore();

    if (getPostgresStatus()) {
      query(
        `INSERT INTO blockchain_ledger (block_number, timestamp, event_type, entity_id, details, previous_hash, current_hash, verified_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (block_number) DO NOTHING;`,
        [
          block.blockNumber,
          block.timestamp || new Date().toISOString(),
          block.eventType,
          block.entityId,
          block.details,
          block.previousHash,
          block.currentHash,
          block.verifiedBy
        ]
      ).catch((err) => console.warn("PostgreSQL addBlockchainBlock sync warning:", err.message));
    }

    return block;
  },
  getDistricts: () => store.districts
};
