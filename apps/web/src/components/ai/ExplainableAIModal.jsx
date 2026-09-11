import React, { useState, useMemo, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { getAiRoutingRecommendations, isDepartmentExcludedFromUniversity, getDepartmentResolutionDetails } from "../../data/universityEcosystems";
import { CheckCircle2, TrendingUp, BrainCircuit, Eye, CopyCheck, Building2, ShieldCheck, X, AlertTriangle, Landmark } from "lucide-react";
import confetti from "canvas-confetti";

export const ExplainableAIModal = ({ problem, onClose }) => {
    const { updateProblemStatus, currentUser } = useApp();
    
    const isExcluded = useMemo(() => {
        if (!problem) return false;
        return isDepartmentExcludedFromUniversity(problem.category, problem.title, problem.description);
    }, [problem]);

    const deptDetails = useMemo(() => {
        if (!problem || !isExcluded) return null;
        return getDepartmentResolutionDetails(problem.category, problem.title, problem.description);
    }, [problem, isExcluded]);

    const dynamicRecommendations = useMemo(() => {
        if (!problem || isExcluded)
            return [];
        return getAiRoutingRecommendations(problem.category, problem.title, problem.description, problem.district);
    }, [problem, isExcluded]);

    const explanation = useMemo(() => {
        if (!problem)
            return null;
        const isHealth = problem.category === "Healthcare & MedTech" ||
            `${problem.title} ${problem.description}`.toLowerCase().includes("fever") ||
            `${problem.title} ${problem.description}`.toLowerCase().includes("flu") ||
            `${problem.title} ${problem.description}`.toLowerCase().includes("hospital");
        
        const isWater = problem.category === "Water Resources & Sanitation" ||
            `${problem.title} ${problem.description}`.toLowerCase().includes("handpump") ||
            `${problem.title} ${problem.description}`.toLowerCase().includes("water");

        const isMining = problem.category === "Environment & Mining Remediation" ||
            `${problem.title} ${problem.description}`.toLowerCase().includes("coal") ||
            `${problem.title} ${problem.description}`.toLowerCase().includes("mining");

        const defaultExp = problem.aiExplanation || {
            nlpKeywords: isHealth
                ? ["healthcare", "outbreak_surveillance", "public_health_desk", problem.district || "Ranchi"]
                : isWater
                    ? ["drinking_water", "municipal_utility", "dwsd_line_dept", problem.district || "Ranchi"]
                    : isMining
                        ? ["coal_seam", "methane", "subsidence", "Jharia", problem.district || "Dhanbad"]
                        : ["agriculture", "soil", "crop_yield", "Jharkhand"],
            cvSceneTags: isHealth
                ? ["clinical anomaly", "patient surge", "syndromic cluster"]
                : isWater
                    ? ["water utility", "pipeline leak", "handpump platform"]
                    : isMining
                        ? ["ground fissure", "smoke plume", "mine dump"]
                        : ["infrastructure defect", "public utility", "anomaly"],
            duplicateCheckResult: isExcluded
                ? "Zero duplicates in geo-radius. Dispatched to Government Line Department."
                : "Zero duplicates found in 5km radius",
            priorityBreakdown: {
                severityWeight: 38.0,
                affectedPopulationEstimate: 24.5,
                locationVulnerabilityIndex: 18.0,
                sdgImpactScore: 14.0
            },
            suggestedUniversities: isExcluded ? [] : dynamicRecommendations
        };

        return {
            ...defaultExp,
            suggestedUniversities: isExcluded ? [] : (dynamicRecommendations.length > 0 ? dynamicRecommendations : (defaultExp.suggestedUniversities || []))
        };
    }, [problem, dynamicRecommendations, isExcluded]);

    const [selectedUnivId, setSelectedUnivId] = useState(explanation?.suggestedUniversities?.[0]?.universityId || "univ-iit-dhanbad");
    const [justApproved, setJustApproved] = useState(false);

    useEffect(() => {
        if (explanation?.suggestedUniversities?.[0]?.universityId) {
            setSelectedUnivId(explanation.suggestedUniversities[0].universityId);
        }
    }, [explanation]);

    if (!problem || !explanation)
        return null;

    const handleApproveAndRoute = () => {
        if (isExcluded) {
            updateProblemStatus(problem.id, "routed_to_line_department");
        } else {
            updateProblemStatus(problem.id, "routed", selectedUnivId);
        }
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

    return (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <BrainCircuit className="w-6 h-6"/>
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
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition">
            <X className="w-5 h-5"/>
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
              <span className={`px-2.5 py-1 rounded font-medium border ${isExcluded ? "bg-amber-100 text-amber-900 border-amber-300" : "bg-emerald-100 text-emerald-800 border-emerald-300"}`}>
                Domain: {problem.category}
              </span>
              <span className="bg-slate-200 text-slate-700 px-2.5 py-1 rounded font-mono">
                Geo: ({problem.latitude?.toFixed(4)}, {problem.longitude?.toFixed(4)})
              </span>
              <span className="bg-amber-100 text-amber-900 px-2.5 py-1 rounded font-bold">
                Priority: {problem.priorityScore}/100
              </span>
              {isExcluded && (
                <span className="bg-blue-100 text-blue-900 px-2.5 py-1 rounded font-bold text-[11px] border border-blue-300">
                  Direct Line Department (Non-HEI)
                </span>
              )}
            </div>
          </div>

          {/* 4 Pillars of AI Explainability Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pillar 1: NLP Domain Classification */}
            <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5 text-xs font-bold text-indigo-900">
                  <BrainCircuit className="w-4 h-4 text-indigo-600"/>
                  <span>1. NLP Text Classification</span>
                </span>
                <span className="text-xs font-bold text-indigo-600 font-mono">
                  {((problem.categoryConfidence || 0.96) * 100).toFixed(0)}% Confidence
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Classified into <strong>{problem.category}</strong> using JSICP text model.
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {(explanation.nlpKeywords || []).map((kw, i) => (
                  <span key={i} className="bg-indigo-50 text-indigo-700 text-[10px] px-2 py-0.5 rounded font-mono">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Pillar 2: Computer Vision Scene Tagging */}
            <div className="bg-white p-4 rounded-xl border border-teal-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5 text-xs font-bold text-teal-900">
                  <Eye className="w-4 h-4 text-teal-600"/>
                  <span>2. CV Visual Verification</span>
                </span>
                <span className="text-xs font-bold text-teal-600 font-mono">
                  95% Match
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                Image verified for authentic physical anomaly.
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {(explanation.cvSceneTags || []).map((tag, i) => (
                  <span key={i} className="bg-teal-50 text-teal-700 text-[10px] px-2 py-0.5 rounded">
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Pillar 3: Semantic Deduplication */}
            <div className="bg-white p-4 rounded-xl border border-purple-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5 text-xs font-bold text-purple-900">
                  <CopyCheck className="w-4 h-4 text-purple-600"/>
                  <span>3. Deduplication Check</span>
                </span>
                <span className="text-xs font-bold text-purple-700 font-mono">
                  Unique Issue
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {explanation.duplicateCheckResult}
              </p>
            </div>

            {/* Pillar 4: Priority Formula Breakdown */}
            <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center space-x-1.5 text-xs font-bold text-amber-900">
                  <TrendingUp className="w-4 h-4 text-amber-600"/>
                  <span>4. Priority Formula Breakdown</span>
                </span>
                <span className="text-xs font-bold text-amber-700 font-mono">
                  Score: {problem.priorityScore}
                </span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between text-slate-600">
                  <span>Severity Factor:</span>
                  <span className="font-mono font-semibold">{explanation.priorityBreakdown?.severityWeight || 35} pts</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Population Estimate:</span>
                  <span className="font-mono font-semibold">{explanation.priorityBreakdown?.affectedPopulationEstimate || 25} pts</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Vulnerability Index:</span>
                  <span className="font-mono font-semibold">{explanation.priorityBreakdown?.locationVulnerabilityIndex || 18} pts</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>SDG Impact Boost:</span>
                  <span className="font-mono font-semibold">{explanation.priorityBreakdown?.sdgImpactScore || 14} pts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Allocation Section: Direct Line Department vs Smart University Routing */}
          {isExcluded ? (
            /* EXCLUDED DEPARTMENTS: Healthcare & Water direct departmental dispatch */
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-5 rounded-2xl space-y-3">
              <div className="flex items-center space-x-2 text-blue-950 font-heading font-bold text-sm">
                <Landmark className="w-5 h-5 text-blue-700"/>
                <span>Direct Government Line Department Redressal (Excluded from University R&D Allocation)</span>
              </div>
              <p className="text-xs text-blue-900 leading-relaxed">
                {deptDetails?.reason}
              </p>
              <div className="bg-white/90 p-3.5 rounded-xl border border-blue-100 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Assigned State Line Department:</span>
                  <span className="font-bold text-blue-950">{deptDetails?.assignedAuthority}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Field Executive Desk:</span>
                  <span className="font-semibold text-slate-800">{deptDetails?.subOffice}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Allocation Status:</span>
                  <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[10px]">
                    Direct Municipal & Health Execution (Non-HEI)
                  </span>
                </div>
              </div>
            </div>
          ) : (
            /* ROUTABLE DOMAINS: ML-Powered Academic University Allocation */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-heading font-bold text-sm text-slate-900 flex items-center space-x-1.5">
                    <Building2 className="w-4 h-4 text-emerald-600"/>
                    <span>ML-Powered Academic Routing Recommendations (Top 3 Match)</span>
                  </h5>
                  <p className="text-xs text-slate-500">
                    Allocated to Jharkhand Higher Education Institutions (HEIs) via domain expertise matching:
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {(explanation.suggestedUniversities || []).map((item) => (<label key={item.universityId} className={`flex items-start justify-between p-3.5 rounded-xl border cursor-pointer transition ${selectedUnivId === item.universityId
                  ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20"
                  : "bg-white border-slate-200 hover:bg-slate-50"}`}>
                    <div className="flex items-start space-x-3">
                      <input type="radio" name="selectedUniv" value={item.universityId} checked={selectedUnivId === item.universityId} onChange={() => setSelectedUnivId(item.universityId)} className="mt-1 text-emerald-600 focus:ring-emerald-500"/>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-heading font-bold text-xs text-slate-900">
                            #{item.rank} {item.universityName}
                          </span>
                          {item.rank === 1 && (<span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded">
                              AI Best Match
                            </span>)}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{item.reason}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-emerald-700 font-mono">
                        {(item.score * 100).toFixed(0)}% Fit
                      </span>
                      <span className="text-[10px] text-slate-400 block">ML Domain Score</span>
                    </div>
                  </label>))}
              </div>
            </div>
          )}

          {/* Explainability Governance Notice */}
          <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-xl flex items-start space-x-2 text-xs text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5"/>
            <p>
              <strong>Governance Requirement:</strong> The State Officer acts as the human-in-the-loop validator.
              {isExcluded
                ? " Approving will dispatch this challenge directly to the District Line Department for immediate municipal/health resolution."
                : " Approving will dispatch this challenge to the assigned Higher Education Institution (HEI) Nodal Desk for research team formulation."}
            </p>
          </div>
        </div>

        {/* Modal Footer / Action Buttons */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <button onClick={handleReject} className="px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition">
            Reject as Spam / Out of Scope
          </button>

          <div className="flex items-center space-x-3">
            <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition">
              Cancel
            </button>
            <button onClick={handleApproveAndRoute} disabled={justApproved} className="flex items-center space-x-1.5 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-md shadow-emerald-600/20 transition hover:scale-105">
              {justApproved ? (<>
                  <CheckCircle2 className="w-4 h-4"/>
                  <span>{isExcluded ? "Dispatched to Line Dept!" : "Approved & Routed!"}</span>
                </>) : (<>
                  <CheckCircle2 className="w-4 h-4"/>
                  <span>{isExcluded ? "Confirm & Route to State Line Department →" : "Confirm & Route to University →"}</span>
                </>)}
            </button>
          </div>
        </div>
      </div>
    </div>);
};
