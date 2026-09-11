import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env file if present
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const [key, ...rest] = trimmed.split("=");
      const val = rest.join("=").trim();
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = val;
      }
    }
  });
}

const isCloudUrl = process.env.DATABASE_URL && (process.env.DATABASE_URL.includes("neon.tech") || process.env.DATABASE_URL.includes("sslmode") || process.env.DATABASE_URL.includes("amazonaws.com"));

const defaultHost = fs.existsSync("/var/run/postgresql") ? "/var/run/postgresql" : "localhost";
const defaultUser = process.env.USER || "hitesh";

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: isCloudUrl ? { rejectUnauthorized: false } : undefined,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000
    }
  : {
      host: process.env.PGHOST || defaultHost,
      port: parseInt(process.env.PGPORT || "5432", 10),
      user: process.env.PGUSER || defaultUser,
      ...(process.env.PGPASSWORD ? { password: process.env.PGPASSWORD } : {}),
      database: process.env.PGDATABASE || "jsicp_db",
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 3000
    };

export let pool = new Pool(poolConfig);

let isPostgresReady = false;
let currentActiveDb = "jsicp_db";

export function getPostgresStatus() {
  return isPostgresReady;
}

export function getActiveDbName() {
  return currentActiveDb;
}

export async function query(text, params) {
  if (!isPostgresReady) {
    throw new Error("PostgreSQL connection not active");
  }
  return pool.query(text, params);
}

export async function initPostgres(seedData) {
  let client;
  try {
    client = await pool.connect();
    currentActiveDb = process.env.DATABASE_URL ? "Neon Cloud PostgreSQL (neondb)" : "Local PostgreSQL (jsicp_db)";
    console.log("🐘 [PostgreSQL] Connected successfully to database:", currentActiveDb);
  } catch (err) {
    const errMsg = err.errors ? err.errors[0]?.message : (err.message || "Connection timed out");
    console.warn(`🐘 [PostgreSQL] Primary endpoint connection failed: ${errMsg}`);

    if (process.env.DATABASE_URL) {
      console.log("🔄 [PostgreSQL] Falling back to local PostgreSQL database (jsicp_db)...");
      try {
        const localConfig = {
          host: fs.existsSync("/var/run/postgresql") ? "/var/run/postgresql" : "localhost",
          port: 5432,
          user: process.env.USER || "hitesh",
          database: "jsicp_db",
          max: 20,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 3000
        };
        const localPool = new Pool(localConfig);
        client = await localPool.connect();
        pool = localPool;
        currentActiveDb = "Local PostgreSQL (jsicp_db)";
        console.log("🐘 [PostgreSQL] Connected successfully to local database: jsicp_db");
      } catch (localErr) {
        console.info(`🐘 [PostgreSQL] Local database also not active (${localErr.message}). Using persistent JSON storage engine.`);
        isPostgresReady = false;
        return false;
      }
    } else {
      isPostgresReady = false;
      return false;
    }
  }

  try {
    // Execute Schema DDL
    const schemaPath = path.join(__dirname, "schema.sql");
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, "utf8");
      await client.query(schemaSql);
      console.log("🐘 [PostgreSQL] Schema DDL tables & indexes verified.");
    }

    // Seed data if present
    if (seedData) {
      console.log("🐘 [PostgreSQL] Verifying / Seeding initial dataset...");

      // 1. Seed Users
      for (const user of Object.values(seedData.users || {})) {
        await client.query(
          `INSERT INTO users (id, full_name, phone, email, role, role_title, organization_name, department, district, aadhaar_verified, reputation_points, badges, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
           ON CONFLICT (id) DO NOTHING;`,
          [
            user.id,
            user.fullName,
            user.phone,
            user.email,
            user.role,
            user.roleTitle,
            user.organizationName || null,
            user.department || null,
            user.district,
            user.aadhaarVerified ?? true,
            user.reputationPoints || 0,
            JSON.stringify(user.badges || []),
            user.createdAt || new Date().toISOString()
          ]
        );
      }

        // 2. Seed Universities
        for (const u of seedData.universities || []) {
          await client.query(
            `INSERT INTO universities (id, name, short_name, district, expertise_domains, nodal_officer_id, nodal_officer_name, active_projects_count, completed_projects_count, patents_count, startups_incubated, nirf_rank, logo_badge)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
             ON CONFLICT (id) DO NOTHING;`,
            [
              u.id,
              u.name,
              u.shortName,
              u.district,
              JSON.stringify(u.expertiseDomains || []),
              u.nodalOfficerId,
              u.nodalOfficerName,
              u.activeProjectsCount || 0,
              u.completedProjectsCount || 0,
              u.patentsCount || 0,
              u.startupsIncubated || 0,
              u.nirfRank || null,
              u.logoBadge || null
            ]
          );
        }

        // 3. Seed Districts
        for (const d of seedData.districts || []) {
          await client.query(
            `INSERT INTO districts (id, name, hindi_name, headquarters, division, latitude, longitude, total_problems, resolved_problems, active_projects, vulnerability_index, top_category)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
             ON CONFLICT (id) DO NOTHING;`,
            [
              d.id,
              d.name,
              d.hindiName,
              d.headquarters,
              d.division,
              d.latitude,
              d.longitude,
              d.totalProblems || 0,
              d.resolvedProblems || 0,
              d.activeProjects || 0,
              d.vulnerabilityIndex || 0.5,
              d.topCategory || "General"
            ]
          );
        }

        // 4. Seed Problems
        for (const p of seedData.problems || []) {
          await client.query(
            `INSERT INTO problems (id, ticket_number, submitted_by, submitter_name, submitter_role, title, description, description_original_lang, detected_language, category, sub_category, category_confidence, priority_score, status, district, block, village, latitude, longitude, is_duplicate_of, citizen_support_count, sdg_tags, media, ai_explanation, assigned_university_id, assigned_university_name, assigned_faculty_id, assigned_faculty_name, active_proposal_id, feedback_rating, feedback_comment, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33)
             ON CONFLICT (id) DO NOTHING;`,
            [
              p.id,
              p.ticketNumber,
              p.submittedBy,
              p.submitterName,
              p.submitterRole,
              p.title,
              p.description,
              p.descriptionOriginalLang || null,
              p.detectedLanguage || null,
              p.category,
              p.subCategory || null,
              p.categoryConfidence || 0.95,
              p.priorityScore || 80,
              p.status || "submitted",
              p.district,
              p.block || null,
              p.village || null,
              p.latitude || null,
              p.longitude || null,
              p.isDuplicateOf || null,
              p.citizenSupportCount || 1,
              JSON.stringify(p.sdgTags || []),
              JSON.stringify(p.media || []),
              JSON.stringify(p.aiExplanation || {}),
              p.assignedUniversityId || null,
              p.assignedUniversityName || null,
              p.assignedFacultyId || null,
              p.assignedFacultyName || null,
              p.activeProposalId || null,
              p.feedbackRating || null,
              p.feedbackComment || null,
              p.createdAt || new Date().toISOString(),
              p.updatedAt || new Date().toISOString()
            ]
          );
        }

        // 5. Seed Proposals
        for (const pr of seedData.proposals || []) {
          await client.query(
            `INSERT INTO proposals (id, team_id, problem_id, problem_title, problem_category, district, university_name, faculty_mentor_name, title, summary, technical_approach, expected_outcome, estimated_budget, duration_months, needs_industry_support, support_type_needed, status, submitted_at, approved_at, industry_partner_id, industry_partner_name, startup_incubation_eligible)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
             ON CONFLICT (id) DO NOTHING;`,
            [
              pr.id,
              pr.teamId || null,
              pr.problemId || null,
              pr.problemTitle || null,
              pr.problemCategory || null,
              pr.district || null,
              pr.universityName || null,
              pr.facultyMentorName || null,
              pr.title,
              pr.summary || null,
              pr.technicalApproach || null,
              pr.expectedOutcome || null,
              pr.estimatedBudget || 0,
              pr.durationMonths || 6,
              pr.needsIndustrySupport || false,
              JSON.stringify(pr.supportTypeNeeded || []),
              pr.status || "submitted",
              pr.submittedAt || new Date().toISOString(),
              pr.approvedAt || null,
              pr.industryPartnerId || null,
              pr.industryPartnerName || null,
              pr.startupIncubationEligible || false
            ]
          );
        }

        // 6. Seed Milestones
        for (const m of seedData.milestones || []) {
          await client.query(
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
          );
        }

        // 7. Seed Agreements
        for (const a of seedData.agreements || []) {
          await client.query(
            `INSERT INTO agreements (id, proposal_id, proposal_title, university_name, industry_partner_id, industry_partner_name, industry_type, agreement_type, amount, terms, signed_at, document_url, blockchain_tx_hash, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
             ON CONFLICT (id) DO NOTHING;`,
            [
              a.id,
              a.proposalId,
              a.proposalTitle || null,
              a.universityName || null,
              a.industryPartnerId || null,
              a.industryPartnerName || null,
              a.industryType || null,
              a.agreementType || null,
              a.amount || 0,
              a.terms || null,
              a.signedAt || new Date().toISOString(),
              a.documentUrl || null,
              a.blockchainTxHash || null,
              a.status || "active"
            ]
          );
        }

        // 8. Seed Kanban Tasks
        for (const k of seedData.kanbanTasks || []) {
          await client.query(
            `INSERT INTO kanban_tasks (id, team_id, title, description, assigned_to, assigned_name, status, priority, milestone_name, due_date)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             ON CONFLICT (id) DO NOTHING;`,
            [
              k.id,
              k.teamId || null,
              k.title,
              k.description || null,
              k.assignedTo || null,
              k.assignedName || null,
              k.status || "backlog",
              k.priority || "medium",
              k.milestoneName || null,
              k.dueDate || null
            ]
          );
        }

        // 9. Seed Blockchain Ledger
        for (const bl of seedData.blockchainLedger || []) {
          await client.query(
            `INSERT INTO blockchain_ledger (block_number, timestamp, event_type, entity_id, details, previous_hash, current_hash, verified_by)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             ON CONFLICT (block_number) DO NOTHING;`,
            [
              bl.blockNumber,
              bl.timestamp || new Date().toISOString(),
              bl.eventType,
              bl.entityId,
              bl.details,
              bl.previousHash,
              bl.currentHash,
              bl.verifiedBy
            ]
          );
        }

        // 10. Seed Notifications
        for (const n of seedData.notifications || []) {
          await client.query(
            `INSERT INTO notifications (id, user_id, channel, event_type, title, message, sent_at, status, link_url)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             ON CONFLICT (id) DO NOTHING;`,
            [
              n.id,
              n.userId || null,
              n.channel || "in_app",
              n.eventType || "GENERAL",
              n.title,
              n.message,
              n.sentAt || new Date().toISOString(),
              n.status || "delivered",
              n.linkUrl || null
            ]
          );
        }

        console.log("🐘 [PostgreSQL] Initial database seeding completed successfully.");
    }

    client.release();
    isPostgresReady = true;
    return true;
  } catch (err) {
    console.info(`🐘 [PostgreSQL] Database not active at ${process.env.PGHOST || "localhost"}:${process.env.PGPORT || "5432"} (${err.message}). Using persistent JSON storage engine.`);
    isPostgresReady = false;
    return false;
  }
}
