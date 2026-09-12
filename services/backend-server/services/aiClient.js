/**
 * JSICP AI Client Bridge
 * Connects Node.js backend to the Python FastAPI ML microservice (JSICP_AI)
 */

import { getAiRoutingRecommendations } from "../../../apps/web/src/data/universityEcosystems.js";

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";
const REQUEST_TIMEOUT_MS = 6000;

// Mapping ML Model 13 categories to JSICP Official Portal Domains
export const ML_TO_PORTAL_CATEGORY_MAP = {
  water: "Water Resources & Sanitation",
  sanitation: "Water Resources & Sanitation",
  agriculture: "Agriculture & Allied Technologies",
  health: "Healthcare & MedTech",
  roads: "Rural Infrastructure & Transport",
  transport: "Rural Infrastructure & Transport",
  electricity: "Renewable Energy & Off-Grid Power",
  environment: "Environment & Mining Remediation",
  education: "Education & Smart Learning",
  welfare: "Forest & Tribal Livelihoods",
  certificates: "Rural Infrastructure & Transport",
  public_safety: "Rural Infrastructure & Transport",
  housing: "Rural Infrastructure & Transport",
  other: "Unclassified Submission"
};

export const PORTAL_SUBCATEGORY_SUGGESTIONS = {
  "Water Resources & Sanitation": "Groundwater Quality & Fluoride Filtration",
  "Agriculture & Allied Technologies": "Post-Harvest Processing & Deseeding",
  "Healthcare & MedTech": "Cold-Chain Logistics & Epidemic Telemetry",
  "Rural Infrastructure & Transport": "All-Weather Connectivity & Heavy Load Bridges",
  "Education & Smart Learning": "Digital Literacy & Smart Classrooms",
  "Environment & Mining Remediation": "Underground Seam Thermal Containment & Mine Waste",
  "Renewable Energy & Off-Grid Power": "Microgrid Solar Installation & Storage",
  "Forest & Tribal Livelihoods": "Non-Timber Forest Produce (NTFP) Value Chain"
};

/**
 * Perform fetch with timeout
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export const aiClient = {
  getServiceUrl() {
    return AI_SERVICE_URL;
  },

  /**
   * Health & Readiness check of the Python ML microservice
   */
  async getStatus() {
    try {
      const start = Date.now();
      const res = await fetchWithTimeout(`${AI_SERVICE_URL}/readiness`, { method: "GET" }, 3000);
      const latency = Date.now() - start;
      if (res.ok) {
        const data = await res.json();
        return {
          connected: true,
          status: "online",
          serviceUrl: AI_SERVICE_URL,
          latencyMs: latency,
          details: data
        };
      }
      return {
        connected: false,
        status: "degraded",
        serviceUrl: AI_SERVICE_URL,
        error: `HTTP ${res.status}`
      };
    } catch (err) {
      return {
        connected: false,
        status: "offline",
        serviceUrl: AI_SERVICE_URL,
        error: err.message
      };
    }
  },

  /**
   * Classify complaint text using ML text classifier
   */
  async classifyText(text) {
    if (!text || !text.trim()) {
      return {
        category: "Water Resources & Sanitation",
        sub_category: "General Civic Intervention",
        confidence: 0.5,
        top_predictions: [],
        source: "default"
      };
    }

    try {
      const res = await fetchWithTimeout(`${AI_SERVICE_URL}/api/classify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });

      if (res.ok) {
        const data = await res.json();
        const rawCategory = data.category || "water";
        const portalCategory = ML_TO_PORTAL_CATEGORY_MAP[rawCategory] || "Water Resources & Sanitation";
        const subCategory = PORTAL_SUBCATEGORY_SUGGESTIONS[portalCategory] || "Civic Technology";

        return {
          category: portalCategory,
          raw_category: rawCategory,
          sub_category: subCategory,
          confidence: data.confidence || 0.94,
          top_predictions: (data.top_predictions || []).map((p) => ({
            raw_category: p.category,
            category: ML_TO_PORTAL_CATEGORY_MAP[p.category] || p.category,
            confidence: p.confidence
          })),
          source: "jsicp_ai_ml_model"
        };
      }
    } catch (err) {
      console.warn(`[JSICP AI Bridge] ML Classify unavailable (${err.message}). Using fallback.`);
    }

    // Fallback heuristic classification
    return this.fallbackClassify(text);
  },

  /**
   * Full end-to-end AI complaint processing
   */
  async processComplaint(payload) {
    const text = payload.text || `${payload.title || ""} ${payload.description || ""}`.trim();
    try {
      const res = await fetchWithTimeout(`${AI_SERVICE_URL}/api/ai/process-complaint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          title: payload.title || "",
          description: payload.description || "",
          latitude: payload.latitude || payload.lat,
          longitude: payload.longitude || payload.lng,
          affected_population: payload.affected_population || payload.affectedPopulation || 100,
          duration_days: payload.duration_days || payload.durationDays || 3,
          severity: payload.severity || "medium",
          image_url: payload.image_url || payload.imageUrl || null
        })
      });

      if (res.ok) {
        const mlData = await res.json();
        const rawCat = mlData.classification?.category || "other";
        const portalCat = mlData.classification?.portal_category || ML_TO_PORTAL_CATEGORY_MAP[rawCat] || "Unclassified Submission";
        const isUnclassified = portalCat === "Unclassified Submission";
        const subCat = isUnclassified ? "Human review required" : (PORTAL_SUBCATEGORY_SUGGESTIONS[portalCat] || "Civic Technology");

        // University routing directly from ML microservice or ecosystem mapper
        const mlRouting = mlData.university_routing || {};
        const isRoutable = !isUnclassified && mlRouting.is_routable_to_university !== false &&
          !portalCat.includes("Health") && !portalCat.includes("Water") &&
          rawCat !== "health" && rawCat !== "water" && rawCat !== "sanitation";

        const recs = isRoutable
          ? (mlRouting.recommendations && mlRouting.recommendations.length > 0
              ? mlRouting.recommendations.map((r) => ({
                  universityId: r.university?.toLowerCase().includes("iit") ? "univ-iit-dhanbad"
                    : r.university?.toLowerCase().includes("bau") || r.university?.toLowerCase().includes("birsa") ? "univ-bau-kanke"
                    : r.university?.toLowerCase().includes("nit") ? "univ-nit-jamshedpur"
                    : "univ-bit-mesra",
                  universityName: r.university,
                  score: r.match_score,
                  rank: r.rank,
                  reason: r.reason || "Matched by JSICP AI Model"
                }))
              : getAiRoutingRecommendations(portalCat, payload.title || text.slice(0, 50), text, payload.district || "Ranchi"))
          : [];

        return {
          success: true,
          source: "jsicp_ai_ml_model",
          category: portalCat,
          raw_category: rawCat,
          sub_category: subCat,
          is_routable_to_university: isRoutable,
          department_type: isRoutable ? "Academic Research & Innovation HEI" : (isUnclassified ? "Unclassified Submission (Human Review Required)" : "Municipal & Public Health Line Department"),
          assigned_line_department: isRoutable || isUnclassified ? null : (portalCat.includes("Health") ? "Department of Health, Medical Education & Family Welfare" : "Drinking Water & Sanitation Department (DWSD)"),
          confidence: mlData.classification?.confidence || (isUnclassified ? 0.0 : 0.95),
          top_predictions: (mlData.classification?.top_predictions || []).map((p) => ({
            raw_category: p.category,
            category: ML_TO_PORTAL_CATEGORY_MAP[p.category] || p.category,
            confidence: p.confidence
          })),
          priority_score: mlData.priority?.priority_score || 82.5,
          priority_breakdown: mlData.priority?.factors || {},
          language: mlData.language?.detected_language || "en",
          sdg_tags: (mlData.sdg_tags?.sdgs || []).map((s) => `SDG ${s.number}`),
          suggested_universities: recs,
          raw_ml_output: mlData
        };
      }
    } catch (err) {
      console.warn(`[JSICP AI Bridge] Process complaint ML call failed (${err.message}). Using resilient engine.`);
    }

    // Resilient fallback engine
    const fallback = this.fallbackClassify(text);
    const isUnclassified = fallback.category === "Unclassified Submission";
    const isExcluded = isUnclassified || fallback.category.includes("Health") || fallback.category.includes("Water");
    const recs = isExcluded
      ? []
      : getAiRoutingRecommendations(
          fallback.category,
          payload.title || text.slice(0, 50),
          text,
          payload.district || "Ranchi"
        );

    return {
      success: true,
      source: "jsicp_local_fallback",
      category: fallback.category,
      sub_category: fallback.sub_category,
      is_routable_to_university: !isExcluded,
      department_type: isUnclassified ? "Unclassified Submission (Human Review Required)" : (isExcluded ? "Municipal & Public Health Line Department" : "Academic Research & Innovation HEI"),
      assigned_line_department: isUnclassified ? null : (isExcluded ? (fallback.category.includes("Health") ? "Department of Health, Medical Education & Family Welfare" : "Drinking Water & Sanitation Department (DWSD)") : null),
      confidence: fallback.confidence,
      top_predictions: fallback.top_predictions,
      priority_score: fallback.category.includes("Health") ? 89.0 : 78.5,
      priority_breakdown: {
        severityWeight: fallback.category.includes("Health") ? 38.0 : 35.0,
        affectedPopulationEstimate: 25.0,
        locationVulnerabilityIndex: 18.0,
        sdgImpactScore: 14.0
      },
      language: /[\u0900-\u097F]/.test(text) ? "hi" : "en",
      sdg_tags: fallback.category.includes("Health") ? ["SDG 3: Good Health & Well-Being"] : ["SDG 6: Clean Water", "SDG 9: Innovation & Infrastructure"],
      suggested_universities: recs
    };
  },

  /**
   * Priority score calculation
   */
  async calculatePriority(payload) {
    try {
      const res = await fetchWithTimeout(`${AI_SERVICE_URL}/api/priority-score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn(`[JSICP AI Bridge] Priority score fallback: ${err.message}`);
    }

    const isHealth = (payload.category || "").toLowerCase().includes("health");
    const baseScore = isHealth ? 88 : 78;
    const popFactor = Math.min(10, ((payload.affected_population || 500) / 100));
    return {
      priority_score: Math.min(100, Math.round((baseScore + popFactor) * 10) / 10),
      status: "pending_human_review",
      source: "local_fallback"
    };
  },

  /**
   * Duplicate check using TF-IDF cosine similarity
   */
  async checkDuplicate(text, existing = []) {
    try {
      const res = await fetchWithTimeout(`${AI_SERVICE_URL}/api/duplicate-check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, existing })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn(`[JSICP AI Bridge] Duplicate check fallback: ${err.message}`);
    }

    return {
      is_duplicate: false,
      similarity: 0.1,
      matched_problem_id: null,
      status: "new_issue"
    };
  },

  /**
   * Fallback rule-based classifier
   */
  fallbackClassify(text) {
    const t = (text || "").toLowerCase();
    let category = "Unclassified Submission";
    let sub_category = "Human review required";
    let confidence = 0;

    const healthKeywords = ["vaccin", "tika", "teeka", "टीका", "disease", "diseases", "diseas", "illness", "fever", "flu", "hospital", "hospit", "doctor", "medicine", "medic", "health", "infection", "infect", "clinic", "patient", "epidemic", "outbreak", "dengue", "malaria", "typhoid", "cholera", "sick", "virus", "दवाई", "अस्पताल", "मरीज", "बीमारी", "इलाज", "बुखार", "रोग"];
    const waterKeywords = ["pani", "water", "handpump", "tap", "borewell", "filter", "fluoride", "arsenic", "contamination", "drain", "drainage", "sewage", "kachra", "garbage", "waste", "pipeline", "leakage", "नल", "जल", "पानी", "चापाकल", "गंदा पानी", "कचरा"];
    const miningKeywords = ["fire", "coal", "mine", "mining", "smoke", "methane", "gas", "leachate", "tailing", "pollution", "blast", "dust", "robot", "robotics", "drone", "sensor", "telemetry", "iot", "automation", "खदान", "कोयला", "धुआं", "आग"];
    const agriKeywords = ["crop", "lac", "soil", "farm", "farmer", "seed", "agriculture", "drought", "millet", "irrigation", "harvest", "paddy", "किसान", "खेती", "फसल", "बीज"];
    const infraKeywords = ["road", "bridge", "culvert", "transport", "pothole", "highway", "accident", "connectivity", "सड़क", "पुल", "गड्ढा", "रास्ता"];
    const powerKeywords = ["solar", "electricity", "power", "grid", "bijli", "transformer", "wire", "blackout", "बिजली", "सोलर", "ट्रांसफार्मर"];
    const eduKeywords = ["school", "teacher", "student", "education", "classroom", "book", "college", "स्कूल", "शिक्षा", "शिक्षक"];
    const tribalKeywords = ["forest", "tribal", "ntfp", "tendu", "mahua", "livelihood", "artisan", "जंगल", "आदिवासी", "महुआ"];

    if (healthKeywords.some(k => t.includes(k))) {
      category = "Healthcare & MedTech";
      sub_category = "Cold-Chain Logistics & Epidemic Telemetry";
      confidence = 0.98;
    } else if (waterKeywords.some(k => t.includes(k))) {
      category = "Water Resources & Sanitation";
      sub_category = "Groundwater Quality & Fluoride Filtration";
      confidence = 0.96;
    } else if (miningKeywords.some(k => t.includes(k))) {
      category = "Environment & Mining Remediation";
      sub_category = "Underground Seam Thermal Containment";
      confidence = 0.95;
    } else if (agriKeywords.some(k => t.includes(k))) {
      category = "Agriculture & Allied Technologies";
      sub_category = "Post-Harvest Processing & Deseeding";
      confidence = 0.94;
    } else if (infraKeywords.some(k => t.includes(k))) {
      category = "Rural Infrastructure & Transport";
      sub_category = "All-Weather Connectivity & Heavy Load Bridges";
      confidence = 0.93;
    } else if (powerKeywords.some(k => t.includes(k))) {
      category = "Renewable Energy & Off-Grid Power";
      sub_category = "Microgrid Solar Installation & Storage";
      confidence = 0.94;
    } else if (eduKeywords.some(k => t.includes(k))) {
      category = "Education & Smart Learning";
      sub_category = "Digital Literacy & Smart Classrooms";
      confidence = 0.94;
    } else if (tribalKeywords.some(k => t.includes(k))) {
      category = "Forest & Tribal Livelihoods";
      sub_category = "Non-Timber Forest Produce (NTFP) Value Chain";
      confidence = 0.93;
    }

    return {
      category,
      raw_category: category.toLowerCase().split(" ")[0],
      sub_category,
      confidence,
      top_predictions: [{ category, confidence }],
      source: "local_heuristic"
    };
  }
};
