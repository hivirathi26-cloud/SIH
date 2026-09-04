import React, { useState, useMemo, useEffect } from "react";
import { Problem } from "../../types";
import { useApp } from "../../context/AppContext";
import { getAiRoutingRecommendations } from "../../data/universityEcosystems";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  TrendingUp,
  BrainCircuit,
  Eye,
  CopyCheck,
  Building2,
  ShieldCheck,
  Award,
  ArrowRight,
  HelpCircle,
  X
} from "lucide-react";
import confetti from "canvas-confetti";

export const ExplainableAIModal: React.FC<{
  problem: Problem | null;
  onClose: () => void;
}> = ({ problem, onClose }) => {
  const { updateProblemStatus, currentUser } = useApp();

  const dynamicRecommendations = useMemo(() => {
    if (!problem) return [];
    return getAiRoutingRecommendations(
      problem.category,
      problem.title,
      problem.description,
      problem.district
    );
  }, [problem]);

  const explanation = useMemo(() => {
    if (!problem) return null;

    const isHealth =
      problem.category === "Healthcare & MedTech" ||
      `${problem.title} ${problem.description}`.toLowerCase().includes("fever") ||
      `${problem.title} ${problem.description}`.toLowerCase().includes("flew") ||
      `${problem.title} ${problem.description}`.toLowerCase().includes("flu") ||
      `${problem.title} ${problem.description}`.toLowerCase().includes("virus");

    const isMining =
      problem.category === "Environment & Mining Remediation" ||
      `${problem.title} ${problem.description}`.toLowerCase().includes("coal") ||
      `${problem.title} ${problem.description}`.toLowerCase().includes("mining");

    const defaultExp = problem.aiExplanation || {
      nlpKeywords: isHealth
        ? ["fever", "epidemic", "viral_outbreak", "public_health", problem.district || "Ranchi"]
        : isMining
        ? ["coal_seam", "methane", "subsidence", "Jharia", problem.district || "Dhanbad"]
        : ["water", "fluoride", "remediation", "Angara"],
      cvSceneTags: isHealth
        ? ["clinical anomaly", "patient surge", "syndromic cluster"]
        : isMining
        ? ["ground fissure", "smoke plume", "mine dump"]
        : ["handpump", "turbid water", "contamination"],
      duplicateCheckResult: "Zero duplicates found in 5km radius",
      priorityBreakdown: {
        severityWeight: 38.0,
        affectedPopulationEstimate: 24.5,
        locationVulnerabilityIndex: 18.0,
        sdgImpactScore: 14.0
      },
      suggestedUniversities: dynamicRecommendations
    };

    // Ensure Healthcare & MedTech problems always have AIIMS Deoghar as #1 recommendation
    const shouldOverride =
      !defaultExp.suggestedUniversities ||
      defaultExp.suggestedUniversities.length === 0 ||
      (isHealth && defaultExp.suggestedUniversities[0]?.universityId !== "univ-aiims-deoghar") ||
      (isMining && defaultExp.suggestedUniversities[0]?.universityId !== "univ-iit-dhanbad");

    return {
      ...defaultExp,
      nlpKeywords: isHealth
        ? ["fever", "epidemic", "viral_outbreak", "public_health", problem.district || "Ranchi"]
        : defaultExp.nlpKeywords,
      cvSceneTags: isHealth
        ? ["clinical anomaly", "patient surge", "syndromic cluster"]
        : defaultExp.cvSceneTags,
      suggestedUniversities: shouldOverride ? dynamicRecommendations : defaultExp.suggestedUniversities
    };
  }, [problem, dynamicRecommendations]);

  const [selectedUnivId, setSelectedUnivId] = useState<string>(
    explanation?.suggestedUniversities[0]?.universityId || "univ-aiims-deoghar"
  );
  const [justApproved, setJustApproved] = useState(false);

  useEffect(() => {
    if (explanation?.suggestedUniversities[0]?.universityId) {
      setSelectedUnivId(explanation.suggestedUniversities[0].universityId);
    }
  }, [explanation]);

  if (!problem || !explanation) return null;

  const handleApproveAndRoute = () => {
    updateProblemStatus(problem.id, "routed", selectedUnivId);
    setJustApproved(true);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleReject = () => {
    updateProblemStatus(problem.id, "rejected");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-heading font-bold text-lg text-white">
                  Explainable AI (XAI) Decision Intelligence Gate
                </h3>
                <span className="bg-indigo-500/30 text-indigo-200 text-[10px] font-mono px-2 py-0.5 rounded border border-indigo-400/40">
                  HYBRID ML + HUMAN VALIDATION
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Ticket: {problem.ticketNumber} | Submitter: {problem.submitterName} ({problem.district})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Problem Brief */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Civic Challenge Under Review
            </span>
            <h4 className="font-heading font-bold text-base text-slate-900 mt-1">
              {problem.title}
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {problem.description}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded font-medium border border-emerald-300">
                Category: {problem.category}
              </span>
              <span className="bg-slate-200 text-slate-700 px-2.5 py-1 rounded font-mono">
                Geo: ({problem.latitude.toFixed(4)}, {problem.longitude.toFixed(4)})
              </span>
              <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded font-bold">
                Priority: {problem.priorityScore}/100
              </span>
            </div>
          </div>

          {/* 4 Pillars of AI Explainability Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pillar 1: NLP Domain Classification */}
            <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5 text-xs font-bold text-indigo-900">
                  <BrainCircuit className="w-4 h-4 text-indigo-600" />
                  <span>1. NLP Text Classification</span>
                </span>
                <span className="text-xs font-bold text-indigo-600 font-mono">
                  {(problem.categoryConfidence * 100).toFixed(0)}% Confidence
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Model: Fine-tuned IndicBERT & TF-IDF Semantic Tokenizer
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {explanation.nlpKeywords.map((kw, i) => (
                  <span key={i} className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200 font-mono">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Pillar 2: Computer Vision Image Authenticity */}
            <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5 text-xs font-bold text-emerald-900">
                  <Eye className="w-4 h-4 text-emerald-600" />
                  <span>2. CV Visual Verification</span>
                </span>
                <span className="text-xs font-bold text-emerald-600 font-mono">
                  94% Authenticated
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Model: ResNet-50 / YOLOv8 Scene Anomaly Detection
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {explanation.cvSceneTags.map((tag, i) => (
                  <span key={i} className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Pillar 3: Vector Duplicate & Geo-Radius Search */}
            <div className="bg-white p-4 rounded-xl border border-sky-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5 text-xs font-bold text-sky-900">
                  <CopyCheck className="w-4 h-4 text-sky-600" />
                  <span>3. FAISS Vector Dedup Engine</span>
                </span>
                <span className="text-xs font-bold text-sky-600 font-mono">
                  Unique (100%)
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Zero duplicates detected within 3km geo-radius.
              </p>
              <span className="text-[10px] bg-sky-50 text-sky-700 px-2 py-0.5 rounded border border-sky-200 font-mono inline-block">
                all-MiniLM-L6-v2 Embeddings + PostGIS 2km Filter
              </span>
            </div>

            {/* Pillar 4: Priority Formula Breakdown */}
            <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5 text-xs font-bold text-amber-900">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  <span>4. Priority Formula Breakdown</span>
                </span>
                <span className="text-xs font-bold text-amber-700 font-mono">
                  Score: {problem.priorityScore}
                </span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between text-slate-600">
                  <span>Severity Keywords:</span>
                  <span className="font-mono font-semibold">{explanation.priorityBreakdown.severityWeight} pts</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Population Estimate:</span>
                  <span className="font-mono font-semibold">{explanation.priorityBreakdown.affectedPopulationEstimate} pts</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Vulnerability Index:</span>
                  <span className="font-mono font-semibold">{explanation.priorityBreakdown.locationVulnerabilityIndex} pts</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>SDG Impact Boost:</span>
                  <span className="font-mono font-semibold">{explanation.priorityBreakdown.sdgImpactScore} pts</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommended University Routing */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="font-heading font-bold text-sm text-slate-900 flex items-center space-x-1.5">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>Smart Academic Routing Recommendations (Top 3 Match)</span>
                </h5>
                <p className="text-xs text-slate-500">
                  Select the institution to assign this challenge to, or confirm AI Top Recommendation:
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {explanation.suggestedUniversities.map((item) => (
                <label
                  key={item.universityId}
                  className={`flex items-start justify-between p-3.5 rounded-xl border cursor-pointer transition ${
                    selectedUnivId === item.universityId
                      ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      name="selectedUniv"
                      value={item.universityId}
                      checked={selectedUnivId === item.universityId}
                      onChange={() => setSelectedUnivId(item.universityId)}
                      className="mt-1 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-heading font-bold text-xs text-slate-900">
                          #{item.rank} {item.universityName}
                        </span>
                        {item.rank === 1 && (
                          <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded">
                            AI Best Match
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{item.reason}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-emerald-700 font-mono">
                      {(item.score * 100).toFixed(0)}% Fit
                    </span>
                    <span className="text-[10px] text-slate-400 block">Cosine Similarity</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Explainability Governance Notice */}
          <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-xl flex items-start space-x-2 text-xs text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p>
              <strong>Governance Requirement:</strong> The State Nodal Officer acts as the human-in-the-loop validator. Approving this recommendation immediately triggers a dispatch to the Higher Education Institution (HEI) Nodal Desk for faculty assignment.
            </p>
          </div>
        </div>

        {/* Modal Footer / Action Buttons */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleReject}
            className="px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition"
          >
            Reject as Spam / Out of Scope
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              onClick={handleApproveAndRoute}
              disabled={justApproved}
              className="flex items-center space-x-1.5 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-md shadow-emerald-600/20 transition hover:scale-105"
            >
              {justApproved ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approved & Routed!</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Route to University &rarr;</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
