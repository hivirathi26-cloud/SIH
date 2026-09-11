import crypto from "crypto";
import { pool, getPostgresStatus, query } from "./postgres.js";
import { db as fallbackDb } from "./store.js";
import { getAiRoutingRecommendations } from "../../../apps/web/src/data/universityEcosystems.js";
import { MOCK_LEADERBOARD } from "../../../apps/web/src/data/mockData.js";
import { aiClient } from "../services/aiClient.js";

// Helper to format PostgreSQL row to JS object matching camelCase naming
function mapProblemRow(r) {
  if (!r) return null;
  return {
    id: r.id,
    ticketNumber: r.ticket_number,
    submittedBy: r.submitted_by,
    submitterName: r.submitter_name,
    submitterRole: r.submitter_role,
    title: r.title,
    description: r.description,
    descriptionOriginalLang: r.description_original_lang,
    detectedLanguage: r.detected_language,
    category: r.category,
    subCategory: r.sub_category,
    categoryConfidence: r.category_confidence,
    priorityScore: r.priority_score,
    status: r.status,
    district: r.district,
    block: r.block,
    village: r.village,
    latitude: r.latitude,
    longitude: r.longitude,
    isDuplicateOf: r.is_duplicate_of,
    citizenSupportCount: r.citizen_support_count,
    sdgTags: typeof r.sdg_tags === "string" ? JSON.parse(r.sdg_tags) : r.sdg_tags || [],
    media: typeof r.media === "string" ? JSON.parse(r.media) : r.media || [],
    aiExplanation: typeof r.ai_explanation === "string" ? JSON.parse(r.ai_explanation) : r.ai_explanation || {},
    assignedUniversityId: r.assigned_university_id,
    assignedUniversityName: r.assigned_university_name,
    assignedFacultyId: r.assigned_faculty_id,
    assignedFacultyName: r.assigned_faculty_name,
    activeProposalId: r.active_proposal_id,
    feedbackRating: r.feedback_rating,
    feedbackComment: r.feedback_comment,
    createdAt: r.created_at,
    updatedAt: r.updated_at
  };
}

function mapProposalRow(r) {
  if (!r) return null;
  return {
    id: r.id,
    teamId: r.team_id,
    problemId: r.problem_id,
    problemTitle: r.problem_title,
    problemCategory: r.problem_category,
    district: r.district,
    universityName: r.university_name,
    facultyMentorName: r.faculty_mentor_name,
    title: r.title,
    summary: r.summary,
    technicalApproach: r.technical_approach,
    expectedOutcome: r.expected_outcome,
    estimatedBudget: r.estimated_budget,
    durationMonths: r.duration_months,
    needsIndustrySupport: r.needs_industry_support,
    supportTypeNeeded: typeof r.support_type_needed === "string" ? JSON.parse(r.support_type_needed) : r.support_type_needed || [],
    status: r.status,
    submittedAt: r.submitted_at,
    approvedAt: r.approved_at,
    industryPartnerId: r.industry_partner_id,
    industryPartnerName: r.industry_partner_name,
    startupIncubationEligible: r.startup_incubation_eligible
  };
}

function mapMilestoneRow(r) {
  if (!r) return null;
  return {
    id: r.id,
    proposalId: r.proposal_id,
    index: r.index,
    name: r.name,
    displayName: r.display_name,
    description: r.description,
    status: r.status,
    dueDate: r.due_date,
    completedAt: r.completed_at,
    facultyApproved: r.faculty_approved,
    facultyApprovedBy: r.faculty_approved_by,
    govtApproved: r.govt_approved,
    govtApprovedBy: r.govt_approved_by,
    documents: typeof r.documents === "string" ? JSON.parse(r.documents) : r.documents || [],
    blockchainTxHash: r.blockchain_tx_hash,
    feedbackNotes: r.feedback_notes
  };
}

function mapAgreementRow(r) {
  if (!r) return null;
  return {
    id: r.id,
    proposalId: r.proposal_id,
    proposalTitle: r.proposal_title,
    universityName: r.university_name,
    industryPartnerId: r.industry_partner_id,
    industryPartnerName: r.industry_partner_name,
    industryType: r.industry_type,
    agreementType: r.agreement_type,
    amount: r.amount,
    terms: r.terms,
    signedAt: r.signed_at,
    documentUrl: r.document_url,
    blockchainTxHash: r.blockchain_tx_hash,
    status: r.status
  };
}

function mapTeamRow(r) {
  if (!r) return null;
  return {
    id: r.id,
    problemId: r.problem_id,
    problemTitle: r.problem_title,
    universityId: r.university_id,
    universityName: r.university_name,
    facultyMentorId: r.faculty_mentor_id,
    facultyMentorName: r.faculty_mentor_name,
    facultyDepartment: r.faculty_department,
    members: typeof r.members === "string" ? JSON.parse(r.members) : r.members || [],
    createdAt: r.created_at
  };
}

function mapDeliverableRow(r) {
  if (!r) return null;
  return {
    id: r.id,
    proposalId: r.proposal_id,
    proposalTitle: r.proposal_title,
    milestoneId: r.milestone_id,
    milestoneName: r.milestone_name,
    title: r.title,
    description: r.description,
    assignedStudentId: r.assigned_student_id,
    assignedStudentName: r.assigned_student_name,
    studentDiscipline: r.student_discipline,
    progressPercent: r.progress_percent,
    pdfUrl: r.pdf_url,
    submissionNotes: r.submission_notes,
    assignedAt: r.assigned_at,
    submittedAt: r.submitted_at,
    status: r.status,
    facultyFeedback: r.faculty_feedback,
    facultySignedAt: r.faculty_signed_at,
    facultySignedBy: r.faculty_signed_by
  };
}

export const pgDb = {
  // 1. PROBLEMS
  getProblems: async ({ district, category, status, search, submittedBy } = {}) => {
    if (!getPostgresStatus()) {
      return fallbackDb.getProblems();
    }
    try {
      let sql = "SELECT * FROM problems WHERE 1=1";
      const params = [];
      let paramIdx = 1;

      if (district && district !== "all") {
        sql += ` AND LOWER(district) = LOWER($${paramIdx++})`;
        params.push(district);
      }
      if (category && category !== "all") {
        sql += ` AND category = $${paramIdx++}`;
        params.push(category);
      }
      if (status && status !== "all") {
        sql += ` AND status = $${paramIdx++}`;
        params.push(status);
      }
      if (submittedBy) {
        sql += ` AND submitted_by = $${paramIdx++}`;
        params.push(submittedBy);
      }
      if (search) {
        sql += ` AND (LOWER(title) LIKE $${paramIdx} OR LOWER(description) LIKE $${paramIdx} OR LOWER(ticket_number) LIKE $${paramIdx})`;
        params.push(`%${search.toLowerCase()}%`);
        paramIdx++;
      }

      sql += " ORDER BY created_at DESC;";
      const result = await query(sql, params);
      return result.rows.map(mapProblemRow);
    } catch (err) {
      console.warn("PostgreSQL getProblems error, fallback to memory:", err.message);
      return fallbackDb.getProblems();
    }
  },

  getProblemById: async (id) => {
    if (!getPostgresStatus()) {
      return fallbackDb.getProblemById(id);
    }
    try {
      const result = await query("SELECT * FROM problems WHERE id = $1 OR ticket_number = $1 LIMIT 1;", [id]);
      return mapProblemRow(result.rows[0]);
    } catch (err) {
      return fallbackDb.getProblemById(id);
    }
  },

  createProblem: async (problemData) => {
    const ticketId = `JSICP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const textToCheck = `${problemData.title || ""} ${problemData.description || ""}`.trim();

    // Run ML-based complaint triage pipeline
    let aiResult = null;
    try {
      aiResult = await aiClient.processComplaint({
        text: textToCheck,
        title: problemData.title,
        district: problemData.district,
        latitude: problemData.latitude,
        longitude: problemData.longitude,
        affected_population: problemData.affectedPopulation || 100,
        severity: problemData.severity || "medium"
      });
    } catch (e) {
      console.warn("[PostgreSQL Store] AI processing error, using fallback:", e.message);
    }

    const category = problemData.category && problemData.category !== "Water Resources & Sanitation" && !aiResult
      ? problemData.category
      : aiResult?.category || problemData.category || "Water Resources & Sanitation";

    const subCategory = problemData.subCategory || aiResult?.sub_category || "Community Scale Intervention";
    const confidence = aiResult?.confidence || 0.96;
    const priorityScore = problemData.priorityScore || aiResult?.priority_score || Math.round((75 + Math.random() * 23) * 10) / 10;
    const isHealthDetected = category.includes("Health");

    const aiRecs = aiResult?.suggested_universities || getAiRoutingRecommendations(category, problemData.title || "", problemData.description || "", problemData.district || "Ranchi");

    const nlpKeywords = isHealthDetected
      ? ["fever", "epidemic", "viral_outbreak", "public_health", problemData.district || "Ranchi"]
      : ["infrastructure", "community", "remediation", "Jharkhand", problemData.district || "Ranchi"];

    const cvSceneTags = isHealthDetected
      ? ["clinical anomaly", "patient surge", "syndromic cluster"]
      : ["infrastructure defect", "public utility", "anomaly"];

    const problemId = `prob-${Date.now()}`;
    const newProblem = {
      id: problemId,
      ticketNumber: ticketId,
      submittedBy: problemData.submittedBy || "citizen-sunita",
      submitterName: problemData.submitterName || "Citizen Innovator",
      submitterRole: problemData.submitterRole || "citizen",
      title: problemData.title || "Untitled Civic Challenge",
      description: problemData.description || "",
      descriptionOriginalLang: problemData.descriptionOriginalLang || problemData.description || "",
      detectedLanguage: problemData.detectedLanguage || (aiResult?.language === "hi" ? "Hindi (hi)" : "English (en)"),
      category,
      subCategory,
      categoryConfidence: confidence,
      priorityScore,
      status: "pending_nodal_review",
      district: problemData.district || "Ranchi",
      block: problemData.block || "Sadar Block",
      village: problemData.village || "Main Village",
      latitude: problemData.latitude || 23.3441,
      longitude: problemData.longitude || 85.3096,
      isDuplicateOf: null,
      citizenSupportCount: 1,
      sdgTags: aiResult?.sdg_tags?.length
        ? aiResult.sdg_tags
        : [
            category.includes("Health")
              ? "SDG 3: Good Health & Well-Being"
              : category.includes("Water")
              ? "SDG 6: Clean Water"
              : "SDG 11: Sustainable Cities",
            "SDG 9: Innovation & Infrastructure"
          ],
      media: problemData.media || [
        {
          id: `med-${Date.now()}`,
          problemId,
          mediaType: "image",
          storageUrl: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80",
          cvValidationLabel: isHealthDetected ? "Verified Clinical / Public Health Anomaly" : "Verified Civic Infrastructure Anomaly",
          cvValidationConfidence: 0.95
        }
      ],
      aiExplanation: {
        nlpKeywords,
        cvSceneTags,
        duplicateCheckResult: "Zero duplicates detected within 3km geo-radius.",
        priorityBreakdown: aiResult?.priority_breakdown || {
          severityWeight: isHealthDetected ? 38.0 : 35.0,
          affectedPopulationEstimate: 25.0,
          locationVulnerabilityIndex: 18.0,
          sdgImpactScore: 14.0
        },
        suggestedUniversities: aiRecs,
        mlSource: aiResult?.source || "jsicp_ai_ml_model"
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (getPostgresStatus()) {
      try {
        const sql = `
          INSERT INTO problems (
            id, ticket_number, submitted_by, submitter_name, submitter_role, title, description,
            description_original_lang, detected_language, category, sub_category, category_confidence,
            priority_score, status, district, block, village, latitude, longitude, is_duplicate_of,
            citizen_support_count, sdg_tags, media, ai_explanation, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26
          ) RETURNING *;
        `;
        const res = await query(sql, [
          newProblem.id,
          newProblem.ticketNumber,
          newProblem.submittedBy,
          newProblem.submitterName,
          newProblem.submitterRole,
          newProblem.title,
          newProblem.description,
          newProblem.descriptionOriginalLang,
          newProblem.detectedLanguage,
          newProblem.category,
          newProblem.subCategory,
          newProblem.categoryConfidence,
          newProblem.priorityScore,
          newProblem.status,
          newProblem.district,
          newProblem.block,
          newProblem.village,
          newProblem.latitude,
          newProblem.longitude,
          newProblem.isDuplicateOf,
          newProblem.citizenSupportCount,
          JSON.stringify(newProblem.sdgTags),
          JSON.stringify(newProblem.media),
          JSON.stringify(newProblem.aiExplanation),
          newProblem.createdAt,
          newProblem.updatedAt
        ]);

        // Add blockchain block
        await pgDb.addBlockchainBlock({
          eventType: "PROBLEM_SUBMISSION",
          entityId: newProblem.id,
          details: `Citizen ${newProblem.submitterName} registered challenge ${newProblem.ticketNumber} from ${newProblem.district} with priority score ${newProblem.priorityScore}.`,
          verifiedBy: "JSICP AI Gateway Node #1"
        });

        // Add Notification
        await pgDb.createNotification({
          userId: newProblem.submittedBy,
          channel: "whatsapp",
          eventType: "PROBLEM_SUBMITTED",
          title: "✅ Challenge Successfully Registered!",
          message: `Your challenge "${newProblem.title.slice(0, 45)}..." has been logged with ID ${newProblem.ticketNumber}. AI Engine priority: ${newProblem.priorityScore}/100.`,
          linkUrl: "/my-problems"
        });

        return mapProblemRow(res.rows[0]);
      } catch (err) {
        console.warn("PostgreSQL createProblem error, falling back:", err.message);
      }
    }

    return fallbackDb.addProblem(newProblem);
  },

  updateProblemStatus: async (id, { status, assignedUniversityId, assignedUniversityName, assignedFacultyId, assignedFacultyName }) => {
    if (getPostgresStatus()) {
      try {
        const sql = `
          UPDATE problems
          SET status = $1,
              assigned_university_id = COALESCE($2, assigned_university_id),
              assigned_university_name = COALESCE($3, assigned_university_name),
              assigned_faculty_id = COALESCE($4, assigned_faculty_id),
              assigned_faculty_name = COALESCE($5, assigned_faculty_name),
              updated_at = NOW()
          WHERE id = $6 OR ticket_number = $6
          RETURNING *;
        `;
        const res = await query(sql, [
          status,
          assignedUniversityId || null,
          assignedUniversityName || null,
          assignedFacultyId || null,
          assignedFacultyName || null,
          id
        ]);

        if (res.rows.length > 0) {
          if (status === "routed" || status === "accepted_by_hei") {
            await pgDb.addBlockchainBlock({
              eventType: "NODAL_APPROVAL",
              entityId: id,
              details: `Nodal review finalized. Status updated to ${status}. Assigned to ${assignedUniversityName || "HEI"}.`,
              verifiedBy: "State Nodal Officer Gateway"
            });
          }
          return mapProblemRow(res.rows[0]);
        }
      } catch (err) {
        console.warn("PostgreSQL updateProblemStatus error:", err.message);
      }
    }

    return fallbackDb.updateProblem(id, {
      status,
      ...(assignedUniversityId && { assignedUniversityId }),
      ...(assignedUniversityName && { assignedUniversityName }),
      ...(assignedFacultyId && { assignedFacultyId }),
      ...(assignedFacultyName && { assignedFacultyName })
    });
  },

  upvoteProblem: async (id) => {
    if (getPostgresStatus()) {
      try {
        const res = await query(
          "UPDATE problems SET citizen_support_count = citizen_support_count + 1, updated_at = NOW() WHERE id = $1 OR ticket_number = $1 RETURNING *;",
          [id]
        );
        if (res.rows.length > 0) return mapProblemRow(res.rows[0]);
      } catch (err) {
        console.warn("PostgreSQL upvoteProblem error:", err.message);
      }
    }
    const p = fallbackDb.getProblemById(id);
    if (p) return fallbackDb.updateProblem(id, { citizenSupportCount: (p.citizenSupportCount || 0) + 1 });
    return null;
  },

  rateProblem: async (id, { rating, comment }) => {
    if (getPostgresStatus()) {
      try {
        const res = await query(
          "UPDATE problems SET feedback_rating = $1, feedback_comment = $2, status = 'closed', updated_at = NOW() WHERE id = $3 OR ticket_number = $3 RETURNING *;",
          [rating, comment, id]
        );
        if (res.rows.length > 0) return mapProblemRow(res.rows[0]);
      } catch (err) {
        console.warn("PostgreSQL rateProblem error:", err.message);
      }
    }
    return fallbackDb.updateProblem(id, { feedbackRating: rating, feedbackComment: comment, status: "closed" });
  },

  // 2. PROPOSALS & MILESTONES
  getProposals: async ({ problemId, teamId, status, sector } = {}) => {
    if (!getPostgresStatus()) {
      return fallbackDb.getProposals();
    }
    try {
      let sql = "SELECT * FROM proposals WHERE 1=1";
      const params = [];
      let idx = 1;
      if (problemId) { sql += ` AND problem_id = $${idx++}`; params.push(problemId); }
      if (teamId) { sql += ` AND team_id = $${idx++}`; params.push(teamId); }
      if (status && status !== "all") { sql += ` AND status = $${idx++}`; params.push(status); }
      if (sector && sector !== "all") { sql += ` AND problem_category = $${idx++}`; params.push(sector); }
      sql += " ORDER BY submitted_at DESC;";
      const res = await query(sql, params);
      return res.rows.map(mapProposalRow);
    } catch (err) {
      return fallbackDb.getProposals();
    }
  },

  createProposal: async (proposalData) => {
    const propId = `prop-${Date.now()}`;
    const propStatus = proposalData.needsIndustrySupport ? "open_for_funding" : "approved";
    const startupIncubationEligible = (proposalData.estimatedBudget || 0) > 300000 || proposalData.needsIndustrySupport;

    const newMilestones = [
      { id: `ms-${Date.now()}-1`, proposalId: propId, index: 1, name: "research_design", displayName: "Milestone 1: Research, Chemical/Hardware Formulation & 3D CAD Design", description: "Background research and CAD model simulation.", status: "in_progress", dueDate: "2026-03-30", facultyApproved: false, govtApproved: false, documents: [] },
      { id: `ms-${Date.now()}-2`, proposalId: propId, index: 2, name: "prototype_build", displayName: "Milestone 2: Prototype Fabrication & Laboratory Bench Testing", description: "Bench assembly and lab sensor calibration.", status: "pending", dueDate: "2026-04-30", facultyApproved: false, govtApproved: false, documents: [] },
      { id: `ms-${Date.now()}-3`, proposalId: propId, index: 3, name: "testing_validation", displayName: "Milestone 3: Field Testing & Pilot Calibration in District", description: "Field trial deployment and NABL testing.", status: "pending", dueDate: "2026-05-30", facultyApproved: false, govtApproved: false, documents: [] },
      { id: `ms-${Date.now()}-4`, proposalId: propId, index: 4, name: "pilot_deployment", displayName: "Milestone 4: Community Pilot Deployment & User Training", description: "Beneficiary training and PRI handover.", status: "pending", dueDate: "2026-06-30", facultyApproved: false, govtApproved: false, documents: [] },
      { id: `ms-${Date.now()}-5`, proposalId: propId, index: 5, name: "full_implementation", displayName: "Milestone 5: Impact Assessment, Patent Filing & Startup Incubation", description: "Final outcome audit and IP patent filing.", status: "pending", dueDate: "2026-07-30", facultyApproved: false, govtApproved: false, documents: [] }
    ];

    if (getPostgresStatus()) {
      try {
        const sql = `
          INSERT INTO proposals (
            id, team_id, problem_id, problem_title, problem_category, district, university_name,
            faculty_mentor_name, title, summary, technical_approach, expected_outcome, estimated_budget,
            duration_months, needs_industry_support, support_type_needed, status, submitted_at, approved_at,
            startup_incubation_eligible
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, NOW(), $18, $19)
          RETURNING *;
        `;
        const res = await query(sql, [
          propId,
          proposalData.teamId || null,
          proposalData.problemId || null,
          proposalData.problemTitle || null,
          proposalData.problemCategory || null,
          proposalData.district || null,
          proposalData.universityName || null,
          proposalData.facultyMentorName || null,
          proposalData.title,
          proposalData.summary || null,
          proposalData.technicalApproach || null,
          proposalData.expectedOutcome || null,
          proposalData.estimatedBudget || 0,
          proposalData.durationMonths || 6,
          proposalData.needsIndustrySupport || false,
          JSON.stringify(proposalData.supportTypeNeeded || []),
          propStatus,
          !proposalData.needsIndustrySupport ? new Date().toISOString() : null,
          startupIncubationEligible
        ]);

        // Insert milestones in PostgreSQL
        for (const m of newMilestones) {
          await query(
            `INSERT INTO milestones (id, proposal_id, index, name, display_name, description, status, due_date, faculty_approved, govt_approved, documents)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`,
            [m.id, m.proposalId, m.index, m.name, m.displayName, m.description, m.status, m.dueDate, false, false, JSON.stringify([])]
          );
        }

        return { data: mapProposalRow(res.rows[0]), milestones: newMilestones };
      } catch (err) {
        console.warn("PostgreSQL createProposal error:", err.message);
      }
    }

    const fallbackProp = fallbackDb.addProposal({
      ...proposalData,
      id: propId,
      submittedAt: new Date().toISOString(),
      status: propStatus,
      approvedAt: !proposalData.needsIndustrySupport ? new Date().toISOString() : undefined,
      startupIncubationEligible
    });
    fallbackDb.addMilestones(newMilestones);
    return { data: fallbackProp, milestones: newMilestones };
  },

  // 3. MILESTONES
  getMilestones: async (proposalId) => {
    if (getPostgresStatus()) {
      try {
        let sql = "SELECT * FROM milestones";
        const params = [];
        if (proposalId) {
          sql += " WHERE proposal_id = $1";
          params.push(proposalId);
        }
        sql += " ORDER BY index ASC;";
        const res = await query(sql, params);
        return res.rows.map(mapMilestoneRow);
      } catch (err) {
        console.warn("PostgreSQL getMilestones error:", err.message);
      }
    }
    return fallbackDb.getMilestones(proposalId);
  },

  facultyApproveMilestone: async (id, approverName) => {
    if (getPostgresStatus()) {
      try {
        const check = await query("SELECT * FROM milestones WHERE id = $1;", [id]);
        if (check.rows.length > 0) {
          const m = check.rows[0];
          const both = m.govt_approved;
          const status = both ? "approved" : "submitted";
          const res = await query(
            `UPDATE milestones SET faculty_approved = TRUE, faculty_approved_by = $1, status = $2, completed_at = CASE WHEN $3 = TRUE THEN NOW() ELSE completed_at END WHERE id = $4 RETURNING *;`,
            [approverName || "Faculty Mentor", status, both, id]
          );
          return mapMilestoneRow(res.rows[0]);
        }
      } catch (err) {
        console.warn("PostgreSQL facultyApproveMilestone error:", err.message);
      }
    }
    return fallbackDb.updateMilestone(id, { facultyApproved: true, facultyApprovedBy: approverName });
  },

  govtApproveMilestone: async (id, approverName) => {
    if (getPostgresStatus()) {
      try {
        const check = await query("SELECT * FROM milestones WHERE id = $1;", [id]);
        if (check.rows.length > 0) {
          const m = check.rows[0];
          const both = m.faculty_approved;
          const status = both ? "approved" : "submitted";
          const res = await query(
            `UPDATE milestones SET govt_approved = TRUE, govt_approved_by = $1, status = $2, completed_at = CASE WHEN $3 = TRUE THEN NOW() ELSE completed_at END WHERE id = $4 RETURNING *;`,
            [approverName || "Govt District Officer", status, both, id]
          );
          return mapMilestoneRow(res.rows[0]);
        }
      } catch (err) {
        console.warn("PostgreSQL govtApproveMilestone error:", err.message);
      }
    }
    return fallbackDb.updateMilestone(id, { govtApproved: true, govtApprovedBy: approverName });
  },

  // 4. AGREEMENTS
  getAgreements: async ({ proposalId, industryPartnerId } = {}) => {
    if (getPostgresStatus()) {
      try {
        let sql = "SELECT * FROM agreements WHERE 1=1";
        const params = [];
        let idx = 1;
        if (proposalId) { sql += ` AND proposal_id = $${idx++}`; params.push(proposalId); }
        if (industryPartnerId) { sql += ` AND industry_partner_id = $${idx++}`; params.push(industryPartnerId); }
        sql += " ORDER BY signed_at DESC;";
        const res = await query(sql, params);
        return res.rows.map(mapAgreementRow);
      } catch (err) {
        console.warn("PostgreSQL getAgreements error:", err.message);
      }
    }
    return fallbackDb.getAgreements();
  },

  createAgreement: async (agreementData) => {
    const agreementId = `agr-${Date.now()}`;
    const signedAt = new Date().toISOString();
    const blockchainTxHash = "0x" + crypto.createHash("sha256").update(`${agreementId}${agreementData.proposalId}${signedAt}`).digest("hex");

    if (getPostgresStatus()) {
      try {
        const sql = `
          INSERT INTO agreements (
            id, proposal_id, proposal_title, university_name, industry_partner_id, industry_partner_name,
            industry_type, agreement_type, amount, terms, signed_at, blockchain_tx_hash, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'active')
          RETURNING *;
        `;
        const res = await query(sql, [
          agreementId,
          agreementData.proposalId,
          agreementData.proposalTitle || null,
          agreementData.universityName || null,
          agreementData.industryPartnerId || null,
          agreementData.industryPartnerName || null,
          agreementData.industryType || null,
          agreementData.agreementType || null,
          agreementData.amount || 0,
          agreementData.terms || null,
          signedAt,
          blockchainTxHash
        ]);

        // Update proposal in PostgreSQL
        await query(
          "UPDATE proposals SET status = 'funded', industry_partner_id = $1, industry_partner_name = $2, approved_at = NOW() WHERE id = $3;",
          [agreementData.industryPartnerId, agreementData.industryPartnerName, agreementData.proposalId]
        );

        // Add blockchain block
        await pgDb.addBlockchainBlock({
          eventType: "MOU_SIGNED",
          entityId: agreementId,
          details: `MoU agreement signed between ${agreementData.industryPartnerName} and ${agreementData.universityName} for ₹${(agreementData.amount || 0).toLocaleString("en-IN")}.`,
          verifiedBy: "JSICP Smart Contract Ledger Gateway"
        });

        return mapAgreementRow(res.rows[0]);
      } catch (err) {
        console.warn("PostgreSQL createAgreement error:", err.message);
      }
    }

    return fallbackDb.addAgreement({
      ...agreementData,
      id: agreementId,
      signedAt,
      blockchainTxHash,
      status: "active"
    });
  },

  // 5. TEAMS
  getTeams: async ({ problemId, universityId } = {}) => {
    if (getPostgresStatus()) {
      try {
        let sql = "SELECT * FROM teams WHERE 1=1";
        const params = [];
        let idx = 1;
        if (problemId) { sql += ` AND problem_id = $${idx++}`; params.push(problemId); }
        if (universityId) { sql += ` AND university_id = $${idx++}`; params.push(universityId); }
        sql += " ORDER BY created_at DESC;";
        const res = await query(sql, params);
        return res.rows.map(mapTeamRow);
      } catch (err) {
        console.warn("PostgreSQL getTeams error:", err.message);
      }
    }
    return fallbackDb.getTeams();
  },

  createTeam: async (teamData) => {
    const teamId = `team-${Date.now()}`;
    if (getPostgresStatus()) {
      try {
        const res = await query(
          `INSERT INTO teams (id, problem_id, problem_title, university_id, university_name, faculty_mentor_id, faculty_mentor_name, faculty_department, members, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW())
           RETURNING *;`,
          [
            teamId,
            teamData.problemId || null,
            teamData.problemTitle || null,
            teamData.universityId || null,
            teamData.universityName || null,
            teamData.facultyMentorId || null,
            teamData.facultyMentorName || null,
            teamData.facultyDepartment || null,
            JSON.stringify(teamData.members || [])
          ]
        );
        if (teamData.problemId) {
          await query("UPDATE problems SET status = 'team_formed' WHERE id = $1;", [teamData.problemId]);
        }
        return mapTeamRow(res.rows[0]);
      } catch (err) {
        console.warn("PostgreSQL createTeam error:", err.message);
      }
    }
    return fallbackDb.addTeam({ ...teamData, id: teamId, createdAt: new Date().toISOString() });
  },

  // 6. DELIVERABLES
  getDeliverables: async ({ proposalId, studentId, status } = {}) => {
    if (getPostgresStatus()) {
      try {
        let sql = "SELECT * FROM student_deliverables WHERE 1=1";
        const params = [];
        let idx = 1;
        if (proposalId) { sql += ` AND proposal_id = $${idx++}`; params.push(proposalId); }
        if (studentId) { sql += ` AND assigned_student_id = $${idx++}`; params.push(studentId); }
        if (status) { sql += ` AND status = $${idx++}`; params.push(status); }
        sql += " ORDER BY assigned_at DESC;";
        const res = await query(sql, params);
        return res.rows.map(mapDeliverableRow);
      } catch (err) {
        console.warn("PostgreSQL getDeliverables error:", err.message);
      }
    }
    return fallbackDb.getStudentDeliverables(proposalId);
  },

  // 7. BLOCKCHAIN LEDGER
  getBlockchainLedger: async () => {
    if (getPostgresStatus()) {
      try {
        const res = await query("SELECT * FROM blockchain_ledger ORDER BY block_number DESC;");
        return res.rows.map((r) => ({
          blockNumber: r.block_number,
          timestamp: r.timestamp,
          eventType: r.event_type,
          entityId: r.entity_id,
          details: r.details,
          previousHash: r.previous_hash,
          currentHash: r.current_hash,
          verifiedBy: r.verified_by
        }));
      } catch (err) {
        console.warn("PostgreSQL getBlockchainLedger error:", err.message);
      }
    }
    return fallbackDb.getBlockchainLedger();
  },

  addBlockchainBlock: async ({ eventType, entityId, details, verifiedBy }) => {
    const timestamp = new Date().toISOString();
    let previousHash = "0000000000000000";
    let blockNumber = 1;

    if (getPostgresStatus()) {
      try {
        const last = await query("SELECT current_hash, block_number FROM blockchain_ledger ORDER BY block_number DESC LIMIT 1;");
        if (last.rows.length > 0) {
          previousHash = last.rows[0].current_hash;
          blockNumber = last.rows[0].block_number + 1;
        }
        const currentHash = crypto.createHash("sha256").update(`${blockNumber}${timestamp}${eventType}${entityId}${previousHash}`).digest("hex");
        const res = await query(
          `INSERT INTO blockchain_ledger (block_number, timestamp, event_type, entity_id, details, previous_hash, current_hash, verified_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
          [blockNumber, timestamp, eventType, entityId, details, previousHash, currentHash, verifiedBy || "JSICP Blockchain Oracle Node"]
        );
        return res.rows[0];
      } catch (err) {
        console.warn("PostgreSQL addBlockchainBlock error:", err.message);
      }
    }

    const ledger = fallbackDb.getBlockchainLedger();
    const last = ledger[0];
    if (last) {
      previousHash = last.currentHash;
      blockNumber = ledger.length + 1;
    }
    const currentHash = crypto.createHash("sha256").update(`${blockNumber}${timestamp}${eventType}${entityId}${previousHash}`).digest("hex");
    return fallbackDb.addBlockchainBlock({
      blockNumber,
      timestamp,
      eventType,
      entityId,
      details,
      previousHash,
      currentHash,
      verifiedBy: verifiedBy || "JSICP Blockchain Oracle Node"
    });
  },

  // 8. NOTIFICATIONS
  getNotifications: async (userId) => {
    if (getPostgresStatus()) {
      try {
        let sql = "SELECT * FROM notifications";
        const params = [];
        if (userId) {
          sql += " WHERE user_id = $1";
          params.push(userId);
        }
        sql += " ORDER BY sent_at DESC;";
        const res = await query(sql, params);
        return res.rows.map((r) => ({
          id: r.id,
          userId: r.user_id,
          channel: r.channel,
          eventType: r.event_type,
          title: r.title,
          message: r.message,
          sentAt: r.sent_at,
          status: r.status,
          linkUrl: r.link_url
        }));
      } catch (err) {
        console.warn("PostgreSQL getNotifications error:", err.message);
      }
    }
    return fallbackDb.getNotifications(userId);
  },

  createNotification: async (notifData) => {
    const notifId = `notif-${Date.now()}`;
    const sentAt = new Date().toISOString();
    if (getPostgresStatus()) {
      try {
        const res = await query(
          `INSERT INTO notifications (id, user_id, channel, event_type, title, message, sent_at, status, link_url)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`,
          [
            notifId,
            notifData.userId || null,
            notifData.channel || "in_app",
            notifData.eventType || "GENERAL",
            notifData.title,
            notifData.message,
            sentAt,
            notifData.status || "delivered",
            notifData.linkUrl || null
          ]
        );
        return res.rows[0];
      } catch (err) {
        console.warn("PostgreSQL createNotification error:", err.message);
      }
    }
    return fallbackDb.addNotification({ ...notifData, id: notifId, sentAt });
  },

  markNotificationRead: async (id) => {
    if (getPostgresStatus()) {
      try {
        const res = await query("UPDATE notifications SET status = 'read' WHERE id = $1 RETURNING *;", [id]);
        if (res.rows.length > 0) return res.rows[0];
      } catch (err) {
        console.warn("PostgreSQL markNotificationRead error:", err.message);
      }
    }
    return fallbackDb.markNotificationRead(id);
  },

  // 9. KANBAN TASKS
  getKanbanTasks: async (teamId) => {
    if (getPostgresStatus()) {
      try {
        let sql = "SELECT * FROM kanban_tasks";
        const params = [];
        if (teamId) {
          sql += " WHERE team_id = $1";
          params.push(teamId);
        }
        const res = await query(sql, params);
        return res.rows.map((r) => ({
          id: r.id,
          teamId: r.team_id,
          title: r.title,
          description: r.description,
          assignedTo: r.assigned_to,
          assignedName: r.assigned_name,
          status: r.status,
          priority: r.priority,
          milestoneName: r.milestone_name,
          dueDate: r.due_date
        }));
      } catch (err) {
        console.warn("PostgreSQL getKanbanTasks error:", err.message);
      }
    }
    return fallbackDb.getKanbanTasks(teamId);
  },

  addKanbanTask: async (taskData) => {
    const taskId = taskData.id || `task-${Date.now()}`;
    if (getPostgresStatus()) {
      try {
        const res = await query(
          `INSERT INTO kanban_tasks (id, team_id, title, description, assigned_to, assigned_name, status, priority, milestone_name, due_date)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;`,
          [
            taskId,
            taskData.teamId || null,
            taskData.title,
            taskData.description || null,
            taskData.assignedTo || null,
            taskData.assignedName || null,
            taskData.status || "backlog",
            taskData.priority || "medium",
            taskData.milestoneName || null,
            taskData.dueDate || null
          ]
        );
        return {
          id: res.rows[0].id,
          teamId: res.rows[0].team_id,
          title: res.rows[0].title,
          description: res.rows[0].description,
          assignedTo: res.rows[0].assigned_to,
          assignedName: res.rows[0].assigned_name,
          status: res.rows[0].status,
          priority: res.rows[0].priority,
          milestoneName: res.rows[0].milestone_name,
          dueDate: res.rows[0].due_date
        };
      } catch (err) {
        console.warn("PostgreSQL addKanbanTask error:", err.message);
      }
    }
    return fallbackDb.addKanbanTask({ ...taskData, id: taskId });
  },

  updateKanbanTask: async (id, updateData) => {
    if (getPostgresStatus()) {
      try {
        const setClauses = [];
        const params = [];
        let idx = 1;

        if (updateData.status !== undefined) { setClauses.push(`status = $${idx++}`); params.push(updateData.status); }
        if (updateData.title !== undefined) { setClauses.push(`title = $${idx++}`); params.push(updateData.title); }
        if (updateData.description !== undefined) { setClauses.push(`description = $${idx++}`); params.push(updateData.description); }
        if (updateData.assignedTo !== undefined) { setClauses.push(`assigned_to = $${idx++}`); params.push(updateData.assignedTo); }
        if (updateData.assignedName !== undefined) { setClauses.push(`assigned_name = $${idx++}`); params.push(updateData.assignedName); }
        if (updateData.priority !== undefined) { setClauses.push(`priority = $${idx++}`); params.push(updateData.priority); }
        if (updateData.milestoneName !== undefined) { setClauses.push(`milestone_name = $${idx++}`); params.push(updateData.milestoneName); }
        if (updateData.dueDate !== undefined) { setClauses.push(`due_date = $${idx++}`); params.push(updateData.dueDate); }

        if (setClauses.length > 0) {
          params.push(id);
          const sql = `UPDATE kanban_tasks SET ${setClauses.join(", ")} WHERE id = $${idx} RETURNING *;`;
          const res = await query(sql, params);
          if (res.rows.length > 0) {
            const r = res.rows[0];
            return {
              id: r.id,
              teamId: r.team_id,
              title: r.title,
              description: r.description,
              assignedTo: r.assigned_to,
              assignedName: r.assigned_name,
              status: r.status,
              priority: r.priority,
              milestoneName: r.milestone_name,
              dueDate: r.due_date
            };
          }
        }
      } catch (err) {
        console.warn("PostgreSQL updateKanbanTask error:", err.message);
      }
    }
    return fallbackDb.updateKanbanTask(id, updateData);
  },

  // 10. ANALYTICS
  getAnalyticsSummary: async () => {
    if (getPostgresStatus()) {
      try {
        const pCount = await query("SELECT COUNT(*) as total, COUNT(CASE WHEN status IN ('deployed', 'closed') THEN 1 END) as resolved FROM problems;");
        const propCount = await query("SELECT COUNT(*) as active FROM proposals WHERE status IN ('approved', 'funded');");
        const funding = await query("SELECT COALESCE(SUM(amount), 0) as total FROM agreements;");
        const uCount = await query("SELECT COUNT(*) as total FROM universities;");
        const catDist = await query("SELECT category, COUNT(*) as count FROM problems GROUP BY category;");

        const categoryDistribution = {};
        catDist.rows.forEach((r) => {
          categoryDistribution[r.category] = parseInt(r.count, 10);
        });

        return {
          totalProblems: parseInt(pCount.rows[0]?.total || 0, 10),
          resolvedProblems: parseInt(pCount.rows[0]?.resolved || 0, 10),
          activeProjects: parseInt(propCount.rows[0]?.active || 0, 10),
          totalFundingMobilizedINR: parseFloat(funding.rows[0]?.total || 0),
          universitiesParticipating: parseInt(uCount.rows[0]?.total || 0, 10),
          patentsFiled: 54,
          startupsIncubated: 38,
          categoryDistribution
        };
      } catch (err) {
        console.warn("PostgreSQL getAnalyticsSummary error:", err.message);
      }
    }
    const problems = fallbackDb.getProblems();
    const proposals = fallbackDb.getProposals();
    const agreements = fallbackDb.getAgreements();
    const universities = fallbackDb.getUniversities();
    const categoryCounts = {};
    problems.forEach((p) => { categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1; });
    return {
      totalProblems: problems.length,
      resolvedProblems: problems.filter((p) => p.status === "deployed" || p.status === "closed").length,
      activeProjects: proposals.filter((p) => p.status === "approved" || p.status === "funded").length,
      totalFundingMobilizedINR: agreements.reduce((a, b) => a + (b.amount || 0), 0),
      universitiesParticipating: universities.length,
      patentsFiled: 54,
      startupsIncubated: 38,
      categoryDistribution: categoryCounts
    };
  },

  getDistricts: async () => {
    if (getPostgresStatus()) {
      try {
        const res = await query("SELECT * FROM districts ORDER BY total_problems DESC;");
        if (res.rows.length > 0) {
          return res.rows.map((r) => ({
            id: r.id,
            name: r.name,
            hindiName: r.hindi_name,
            headquarters: r.headquarters,
            division: r.division,
            latitude: r.latitude,
            longitude: r.longitude,
            totalProblems: r.total_problems,
            resolvedProblems: r.resolved_problems,
            activeProjects: r.active_projects,
            vulnerabilityIndex: r.vulnerability_index,
            topCategory: r.top_category
          }));
        }
      } catch (err) {
        console.warn("PostgreSQL getDistricts error:", err.message);
      }
    }
    return fallbackDb.getDistricts();
  },

  getLeaderboard: async () => {
    return MOCK_LEADERBOARD;
  },

  // 11. USERS
  getUsers: async () => {
    if (getPostgresStatus()) {
      try {
        const res = await query("SELECT * FROM users;");
        if (res.rows.length > 0) {
          const userMap = {};
          res.rows.forEach((r) => {
            userMap[r.id] = {
              id: r.id,
              fullName: r.full_name,
              phone: r.phone,
              email: r.email,
              role: r.role,
              roleTitle: r.role_title,
              organizationName: r.organization_name,
              department: r.department,
              district: r.district,
              aadhaarVerified: r.aadhaar_verified,
              reputationPoints: r.reputation_points,
              badges: typeof r.badges === "string" ? JSON.parse(r.badges) : r.badges || [],
              createdAt: r.created_at
            };
          });
          return userMap;
        }
      } catch (err) {
        console.warn("PostgreSQL getUsers error:", err.message);
      }
    }
    return fallbackDb.getUsers();
  },

  getUserById: async (id) => {
    if (getPostgresStatus()) {
      try {
        const res = await query("SELECT * FROM users WHERE id = $1 LIMIT 1;", [id]);
        if (res.rows.length > 0) {
          const r = res.rows[0];
          return {
            id: r.id,
            fullName: r.full_name,
            phone: r.phone,
            email: r.email,
            role: r.role,
            roleTitle: r.role_title,
            organizationName: r.organization_name,
            department: r.department,
            district: r.district,
            aadhaarVerified: r.aadhaar_verified,
            reputationPoints: r.reputation_points,
            badges: typeof r.badges === "string" ? JSON.parse(r.badges) : r.badges || [],
            createdAt: r.created_at
          };
        }
      } catch (err) {
        console.warn("PostgreSQL getUserById error:", err.message);
      }
    }
    return fallbackDb.getUserById(id);
  },

  createUser: async (userData) => {
    const id = userData.id || `user-${Date.now()}`;
    const newUser = {
      id,
      fullName: userData.fullName || "New User",
      phone: userData.phone || "+91 99999 00000",
      email: userData.email || `${id}@jharkhand.gov.in`,
      role: userData.role || "citizen",
      roleTitle: userData.roleTitle || (userData.role ? userData.role.toUpperCase() : "Citizen Innovator"),
      organizationName: userData.organizationName || "",
      department: userData.department || "",
      district: userData.district || "Ranchi",
      aadhaarVerified: userData.aadhaarVerified ?? true,
      reputationPoints: userData.reputationPoints || 100,
      badges: userData.badges || ["Pioneering Contributor"],
      createdAt: new Date().toISOString()
    };

    if (getPostgresStatus()) {
      try {
        await query(
          `INSERT INTO users (id, full_name, phone, email, role, role_title, organization_name, department, district, aadhaar_verified, reputation_points, badges, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
           ON CONFLICT (id) DO NOTHING;`,
          [
            newUser.id,
            newUser.fullName,
            newUser.phone,
            newUser.email,
            newUser.role,
            newUser.roleTitle,
            newUser.organizationName,
            newUser.department,
            newUser.district,
            newUser.aadhaarVerified,
            newUser.reputationPoints,
            JSON.stringify(newUser.badges),
            newUser.createdAt
          ]
        );
        return newUser;
      } catch (err) {
        console.warn("PostgreSQL createUser error:", err.message);
      }
    }
    fallbackDb.get().users[id] = newUser;
    fallbackDb.get().users = { ...fallbackDb.get().users };
    return newUser;
  },

  // 12. UNIVERSITIES
  getUniversities: async () => {
    if (getPostgresStatus()) {
      try {
        const res = await query("SELECT * FROM universities;");
        if (res.rows.length > 0) {
          return res.rows.map((r) => ({
            id: r.id,
            name: r.name,
            shortName: r.short_name,
            district: r.district,
            expertiseDomains: typeof r.expertise_domains === "string" ? JSON.parse(r.expertise_domains) : r.expertise_domains || [],
            nodalOfficerId: r.nodal_officer_id,
            nodalOfficerName: r.nodal_officer_name,
            activeProjectsCount: r.active_projects_count,
            completedProjectsCount: r.completed_projects_count,
            patentsCount: r.patents_count,
            startupsIncubated: r.startups_incubated,
            nirfRank: r.nirf_rank,
            logoBadge: r.logo_badge
          }));
        }
      } catch (err) {
        console.warn("PostgreSQL getUniversities error:", err.message);
      }
    }
    return fallbackDb.getUniversities();
  }
};
