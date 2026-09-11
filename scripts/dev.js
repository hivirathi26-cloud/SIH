import { spawn, execSync } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, "..");
const aiDir = path.join(root, "../JSICP_AI/JSICP_AI_REAL_DATA_FUSION_FINAL");

console.log("=================================================");
console.log("🚀 Launching JSICP Full-Stack Platform (SIH 2026)");
console.log("🤖 Connected to JSICP_AI Machine Learning Engine");
console.log("=================================================");

// Function to kill any existing process on a port
function freePort(port) {
  try {
    if (process.platform === "win32") {
      execSync(`for /f "tokens=5" %a in ('netstat -aon ^| findstr :${port}') do taskkill /f /pid %a 2>nul`, { stdio: "ignore" });
    } else {
      execSync(`fuser -k -9 ${port}/tcp 2>/dev/null || true`, { stdio: "ignore" });
    }
  } catch (e) {}
}

// Ensure ports 8000, 4000 and 3000 are completely free before booting
freePort(8000);
freePort(4000);
freePort(3000);

// 0. Start Python ML Microservice on Port 8000
let aiService = null;
const venvPython = path.join(aiDir, "venv/bin/python");
const venvUvicorn = path.join(aiDir, "venv/bin/uvicorn");

if (fs.existsSync(aiDir)) {
  const pythonCmd = fs.existsSync(venvUvicorn) ? venvUvicorn : (fs.existsSync(venvPython) ? venvPython : "python3");
  const aiArgs = fs.existsSync(venvUvicorn)
    ? ["main:app", "--host", "0.0.0.0", "--port", "8000"]
    : ["-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"];

  console.log(`[AI Engine] Starting ML service from ${aiDir} on http://0.0.0.0:8000 ...`);
  aiService = spawn(pythonCmd, aiArgs, {
    cwd: aiDir,
    stdio: "inherit",
    env: { ...process.env, PYTHONPATH: aiDir, PORT: "8000" },
    detached: process.platform !== "win32"
  });

  aiService.on("error", (err) => {
    console.warn("[AI Engine] Could not start Python ML service automatically:", err.message);
  });
}

// 1. Start Backend on Port 4000
const backend = spawn("node", [
  "--no-network-family-autoselection",
  "services/backend-server/server.js"
], {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, PORT: "4000", AI_SERVICE_URL: "http://127.0.0.1:8000" },
  detached: process.platform !== "win32"
});

// 2. Start Web Frontend on Port 3000
const frontend = spawn("npm", ["run", "dev", "--workspace=apps/web"], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
  detached: process.platform !== "win32"
});

// Handle termination and kill process groups cleanly
let isCleaningUp = false;
function cleanExit() {
  if (isCleaningUp) return;
  isCleaningUp = true;
  console.log("\n🛑 Stopping JSICP services...");

  try {
    if (process.platform !== "win32") {
      if (aiService?.pid) process.kill(-aiService.pid, "SIGTERM");
      if (backend?.pid) process.kill(-backend.pid, "SIGTERM");
      if (frontend?.pid) process.kill(-frontend.pid, "SIGTERM");
    } else {
      if (aiService?.pid) aiService.kill("SIGTERM");
      if (backend?.pid) backend.kill("SIGTERM");
      if (frontend?.pid) frontend.kill("SIGTERM");
    }
  } catch (e) {}

  freePort(8000);
  freePort(4000);
  freePort(3000);
  process.exit(0);
}

process.on("SIGINT", cleanExit);
process.on("SIGTERM", cleanExit);
process.on("exit", cleanExit);
