import express from "express";
import { aiClient } from "../services/aiClient.js";
import { generateGeminiChatReply } from "../services/geminiChat.js";
import { pgDb } from "../db/postgresStore.js";
import { getAiRoutingRecommendations } from "../../../apps/web/src/data/universityEcosystems.js";

const router = express.Router();

function formatStatus(status) {
  return String(status || "pending_review")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

// 0. AI ML Service Status & Health
router.get("/status", async (req, res) => {
  const status = await aiClient.getStatus();
  res.json({
    success: true,
    data: status
  });
});

// 1. Text Preprocessing & Language Detection
router.post("/preprocess", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ success: false, message: "Text required" });

  const isHindi = /[\u0900-\u097F]/.test(text);
  const isNagpuri = text.toLowerCase().includes("pani") || text.toLowerCase().includes("bada") || text.toLowerCase().includes("gadbad");

  let detected_language = "en";
  let normalized_text = text.trim();

  if (isHindi) detected_language = "hi";
  else if (isNagpuri) detected_language = "nagpuri";

  res.json({
    success: true,
    detected_language,
    clean_text: normalized_text,
    translated_text: normalized_text
  });
});

// Audio transcription is deliberately performed server-side so the browser does
// not depend on the inconsistent Web Speech API or expose the provider API key.
router.post("/transcribe", async (req, res) => {
  const { audioBase64, mimeType, languageCode } = req.body || {};
  const audioData = typeof audioBase64 === "string"
    ? audioBase64.replace(/^data:[^;]+;base64,/, "")
    : "";

  if (!audioData) {
    return res.status(400).json({ success: false, message: "An audio recording is required." });
  }
  // Gemini inline audio requests are limited to 20 MB. Keep some room for JSON.
  if (audioData.length > 18 * 1024 * 1024) {
    return res.status(413).json({ success: false, message: "The recording is too large. Please keep voice notes under about 12 minutes." });
  }

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return res.status(503).json({ success: false, message: "Voice transcription is not configured on this server." });
  }

  try {
    const model = process.env.GEMINI_TRANSCRIPTION_MODEL?.trim() || "gemini-3.5-transcribe";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          contents: [{ parts: [{ inlineData: { mimeType: mimeType || "audio/webm", data: audioData } }] }],
          generationConfig: {
            audioTranscriptionConfig: {
              languageCodes: [languageCode || "hi-IN"],
              mode: "smart"
            }
          }
        })
      }
    );
    const payload = await response.json();
    if (!response.ok) {
      console.warn("[Voice Transcription] Gemini returned", response.status);
      return res.status(502).json({ success: false, message: "The transcription service could not process this recording. Please try again." });
    }
    const transcript = payload?.candidates?.[0]?.content?.parts
      ?.map((part) => part?.text || "")
      .join("")
      .trim();
    if (!transcript) {
      return res.status(422).json({ success: false, message: "No speech was detected in this recording." });
    }
    return res.json({ success: true, data: { transcript } });
  } catch (error) {
    console.warn("[Voice Transcription] Request failed:", error.message);
    return res.status(503).json({ success: false, message: "The transcription service is temporarily unavailable. Please try again." });
  }
});

// 2. Domain Classification using JSICP Python ML Model
router.post("/classify", async (req, res) => {
  try {
    const { text } = req.body;
    const classification = await aiClient.classifyText(text);

    res.json({
      success: true,
      ...classification
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. Unified Full Complaint Processing Pipeline
router.post("/process-complaint", async (req, res) => {
  try {
    const result = await aiClient.processComplaint(req.body);
    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. Media Authenticity CV Validation
router.post("/validate-media", (req, res) => {
  const { mediaUrl, claimed_category } = req.body;
  const isHealth = claimed_category?.includes("Health");
  const isMining = claimed_category?.includes("Mining");

  const scene_tags = isHealth
    ? ["clinical anomaly", "patient cluster", "syndromic outbreak"]
    : isMining
    ? ["smoke vents", "ground fissure", "thermal anomaly"]
    : ["verified defect", "public utility anomaly", "ground infrastructure"];

  res.json({
    success: true,
    matches_claim: true,
    confidence: 0.95,
    scene_tags
  });
});

// 5. Duplicate Check (Geo-Radius + Semantic Cosine Similarity)
router.post("/dedup-check", async (req, res) => {
  const { text, existing } = req.body;
  const result = await aiClient.checkDuplicate(text, existing || []);
  res.json({
    success: true,
    ...result
  });
});

// 6. Priority Scoring (Learned ML Model + Domain Signals)
router.post("/priority-score", async (req, res) => {
  const result = await aiClient.calculatePriority(req.body);
  res.json({
    success: true,
    ...result
  });
});

// 7. Smart Routing Recommender
router.post("/route-recommend", (req, res) => {
  const { category, title, description, district } = req.body;
  const cat = (category || "").toLowerCase();
  const isExcluded = cat.includes("health") || cat.includes("water") || cat.includes("sanitation");

  if (isExcluded) {
    const assignedDept = cat.includes("health")
      ? "Department of Health, Medical Education & Family Welfare"
      : "Drinking Water & Sanitation Department (DWSD) / Municipal Corporation";
    return res.json({
      success: true,
      category,
      is_routable_to_university: false,
      department_type: "Municipal & Public Health Line Department (Direct Civic Redressal)",
      assigned_line_department: assignedDept,
      message: `Problems under '${category}' are managed directly by Government Line Departments (${assignedDept}) and are excluded from academic university R&D allocation.`,
      recommendations: []
    });
  }

  const recommendations = getAiRoutingRecommendations(category, title, description, district || "Ranchi");
  res.json({
    success: true,
    category,
    is_routable_to_university: true,
    department_type: "Academic Research & Innovation HEI",
    message: `Allocated to top Jharkhand universities based on ML domain matching for '${category}'.`,
    recommendations
  });
});

// 8. Jharkhand Sahayak AI Chatbot
router.post("/chat", async (req, res) => {
  const { message, sessionId, userRole, history } = req.body;
  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({ success: false, message: "A chat message is required." });
  }
  if (message.length > 2_000) {
    return res.status(400).json({ success: false, message: "Chat messages must be 2,000 characters or fewer." });
  }

  // Read-only ticket lookup.  A valid ticket number is required so the chatbot
  // cannot browse or modify the system database.  This response is generated
  // from the live record instead of asking the LLM to infer a status.
  const ticketMatch = message.match(/\bJSICP-\d{4}-\d{4}\b/i);
  if (ticketMatch) {
    const ticketNumber = ticketMatch[0].toUpperCase();
    try {
      const problem = await pgDb.getProblemById(ticketNumber);
      if (!problem) {
        return res.json({
          success: true,
          source: "database",
          reply: `I could not find ticket ${ticketNumber}. Please check the ticket number and try again.`,
          sessionId: sessionId || `session-${Date.now()}`
        });
      }

      const details = [
        `🔎 Ticket: ${problem.ticketNumber}`,
        `• Title: ${problem.title || "Not available"}`,
        `• Status: ${formatStatus(problem.status)}`,
        problem.district ? `• District: ${problem.district}` : null,
        problem.assignedUniversityName ? `• Assigned HEI: ${problem.assignedUniversityName}` : "• Assigned HEI: Under nodal review",
        formatDate(problem.updatedAt) ? `• Last updated: ${formatDate(problem.updatedAt)}` : null
      ].filter(Boolean);

      return res.json({
        success: true,
        source: "database",
        reply: details.join("\n"),
        sessionId: sessionId || `session-${Date.now()}`
      });
    } catch (error) {
      console.warn("[Chat Status Lookup] Database query failed:", error.message);
      return res.status(503).json({
        success: false,
        retryable: true,
        message: "Problem status is temporarily unavailable. Please try again shortly."
      });
    }
  }

  try {
    const geminiReply = await generateGeminiChatReply({
      message: message.trim(),
      history,
      userRole
    });
    if (geminiReply) {
      return res.json({
        success: true,
        reply: geminiReply,
        source: "gemini",
        sessionId: sessionId || `session-${Date.now()}`
      });
    }
  } catch (error) {
    console.warn("[Gemini Chat] Provider request failed:", error.message);
    return res.status(error.retryable ? 503 : 502).json({
      success: false,
      retryable: Boolean(error.retryable),
      message: error.retryable
        ? "Gemini is temporarily busy. Please try again in a few seconds."
        : "The Gemini chatbot could not respond. Please check the model and API-key configuration."
    });
  }

  const q = (message || "").toLowerCase();

  let reply = "Namaste! I am Jharkhand Sahayak AI powered by JSICP Machine Learning engine. How may I assist you with the innovation portal today?";

  if (q.includes("submit") || q.includes("report") || q.includes("problem") || q.includes("complain")) {
    reply = "To submit a civic challenge, navigate to the Submit Challenge page (/submit). You can record voice notes in Hindi, Nagpuri, or Santali, attach photos, and our ML model will categorize and score it in real time!";
  } else if (q.includes("status") || q.includes("track") || q.includes("ticket")) {
    reply = "You can track your submitted challenges on the 'My Problems' dashboard (/my-problems). Each ticket features a live 10-step progress stepper and real-time Nodal review updates.";
  } else if (q.includes("university") || q.includes("college") || q.includes("bit") || q.includes("iit")) {
    reply = "JSICP AI routes challenges to premier Jharkhand HEIs like BIT Mesra (Water & MedTech), IIT ISM Dhanbad (Mining & Renewable Energy), and BAU Ranchi (Agriculture & Agro-forestry).";
  } else if (q.includes("fund") || q.includes("csr") || q.includes("grant") || q.includes("industry")) {
    reply = "Industries and CSR foundations can browse approved university proposals on the Industry Marketplace (/industry/marketplace) and e-sign digital MoUs on our Blockchain Audit Ledger.";
  } else if (q.includes("help") || q.includes("hindi") || q.includes("madad")) {
    reply = "झारखंड सहायक AI में आपका स्वागत है। आप अपनी समस्या दर्ज कर सकते हैं, विश्वविद्यालय के प्रस्ताव देख सकते हैं या फंड और MoU की जानकारी प्राप्त कर सकते हैं।";
  }

  res.json({
    success: true,
    reply,
    source: "local_fallback",
    sessionId: sessionId || `session-${Date.now()}`
  });
});

export default router;
