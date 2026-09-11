
import express from "express";
import http from "http";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import problemsRoutes from "./routes/problems.routes.js";
import universitiesRoutes from "./routes/universities.routes.js";
import teamsRoutes from "./routes/teams.routes.js";
import proposalsRoutes from "./routes/proposals.routes.js";
import agreementsRoutes from "./routes/agreements.routes.js";
import milestonesRoutes from "./routes/milestones.routes.js";
import deliverablesRoutes from "./routes/deliverables.routes.js";
import kanbanRoutes from "./routes/kanban.routes.js";
import notificationsRoutes from "./routes/notifications.routes.js";
import blockchainRoutes from "./routes/blockchain.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import aiRoutes from "./routes/ai.routes.js";

import { initPostgres, getPostgresStatus, getActiveDbName } from "./db/postgres.js";
import { db } from "./db/store.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load a local backend .env file without overriding real deployment variables.
// This keeps provider secrets out of the frontend bundle.
const localEnvPath = path.join(__dirname, ".env");
if (fs.existsSync(localEnvPath)) {
  for (const rawLine of fs.readFileSync(localEnvPath, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (!match || process.env[match[1]] !== undefined) continue;
    const value = match[2].trim().replace(/^(['"])(.*)\1$/, "$2");
    process.env[match[1]] = value;
  }
}


const webDistPath = path.join(__dirname, "../../apps/web/dist");


const app = express();
const PORT = process.env.PORT || 4000;

// Initialize Postgres & Schema
initPostgres(db.get()).catch((err) => {
  console.warn("[PostgreSQL] Initialization note:", err.message);
});

// Enable CORS for all origins
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// JSON Body Parser with 50mb limit for base64 media uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[JSICP API] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "JSICP Core Backend API",
    version: "1.0.0",
    storageEngine: getPostgresStatus() ? `PostgreSQL (${getActiveDbName()})` : "Persistent JSON DB Engine",
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemsRoutes);
app.use("/api/universities", universitiesRoutes);
app.use("/api/teams", teamsRoutes);
app.use("/api/proposals", proposalsRoutes);
app.use("/api/agreements", agreementsRoutes);
app.use("/api/milestones", milestonesRoutes);
app.use("/api/deliverables", deliverablesRoutes);
app.use("/api/kanban", kanbanRoutes);
app.use("/api/notifications", notificationsRoutes);
app.use("/api/blockchain", blockchainRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/ai", aiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("[JSICP Error]", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

// Serve frontend build if present
if (fs.existsSync(webDistPath)) {
  app.use(express.static(webDistPath));
  app.get("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api")) {
      return next();
    }
    res.sendFile(path.join(webDistPath, "index.html"));
  });
}

// 404 Handler for API
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route ${req.originalUrl} not found`
  });
});


const server = http.createServer(app);
server.listen(PORT, "0.0.0.0", () => {
  console.log(`=================================================`);
  console.log(`🚀 JSICP Backend Server running on http://0.0.0.0:${PORT}`);
  console.log(`📡 REST API Endpoints active under /api`);
  console.log(`=================================================`);
});

export default app;
