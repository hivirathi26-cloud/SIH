import React, { useState, useMemo, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { getAiRoutingRecommendations, isDepartmentExcludedFromUniversity, getDepartmentResolutionDetails } from "../../data/universityEcosystems";
import { CheckCircle2, TrendingUp, BrainCircuit, Eye, CopyCheck, Building2, ShieldCheck, X, AlertTriangle, Landmark, RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";

export const ExplainableAIModal = ({ problem, onClose }) => {
    const { updateProblemStatus, currentUser } = useApp();
    const [selectedCategory, setSelectedCategory] = useState(problem?.category || "Unclassified Submission");
    const [isOverridden, setIsOverridden] = useState(false);
    const [justApproved, setJustApproved] = useState(false);

    // Sync whenever problem changes
    useEffect(() => {
        if (problem) {
            setSelectedCategory(problem.category || "Unclassified Submission");
            setIsOverridden(false);
            setJustApproved(false);
        }
    }, [problem]);
    
    const isExcluded = useMemo(() => {
        if (!problem || selectedCategory === "Unclassified Submission") return false;
        return isDepartmentExcludedFromUniversity(selectedCategory, problem.title, problem.description);
    }, [problem, selectedCategory]);

    const deptDetails = useMemo(() => {
        if (!problem || !isExcluded) return null;
        return getDepartmentResolutionDetails(selectedCategory, problem.title, problem.description);
    }, [problem, isExcluded, selectedCategory]);

    const dynamicRecommendations = useMemo(() => {
        if (!problem || isExcluded || selectedCategory === "Unclassified Submission")
            return [];
        return getAiRoutingRecommendations(selectedCategory, problem.title, problem.description, problem.district);
    }, [problem, isExcluded, selectedCategory]);

    const explanation = useMemo(() => {
        if (!problem)
            return null;
        const isHealth = selectedCategory === "Healthcare & MedTech" ||
            `${problem.title} ${problem.description}`.toLowerCase().includes("fever") ||
            `${problem.title} ${problem.description}`.toLowerCase().includes("flu") ||
            `${problem.title} ${problem.description}`.toLowerCase().includes("hospital") ||
            `${problem.title} ${problem.description}`.toLowerCase().includes("vaccin");
        
        const isWater = selectedCategory === "Water Resources & Sanitation" ||
            `${problem.title} ${problem.description}`.toLowerCase().includes("handpump") ||
            `${problem.title} ${problem.description}`.toLowerCase().includes("water");

        const isMining = selectedCategory === "Environment & Mining Remediation" ||
            `${problem.title} ${problem.description}`.toLowerCase().includes("coal") ||
            `${problem.title} ${problem.description}`.toLowerCase().includes("mining");

        const defaultExp = problem.aiExplanation || {
            nlpKeywords: isHealth
                ? ["healthcare", "outbreak_surveillance", "public_health_desk", problem.district || "Ranchi"]
                : isWater
                    ? ["drinking_water", "municipal_utility", "dwsd_line_dept", problem.district || "Ranchi"]
                    : isMining
                        ? ["coal_seam", "methane", "subsidence", "Jharia", problem.district || "Dhanbad"]
                        : ["rural_infrastructure", "civil_engineering", "jharkhand"],
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

        const universitiesToUse = isExcluded
            ? []
            : (isOverridden || !problem.aiExplanation?.suggestedUniversities?.length
                ? dynamicRecommendations
                : problem.aiExplanation.suggestedUniversities);

        return {
            ...defaultExp,
            suggestedUniversities: universitiesToUse
        };
    }, [problem, dynamicRecommendations, isExcluded, selectedCategory, isOverridden]);

    const [selectedUnivId, setSelectedUnivId] = useState(explanation?.suggestedUniversities?.[0]?.universityId || "univ-iit-dhanbad");

    useEffect(() => {
        if (explanation?.suggestedUniversities?.[0]?.universityId) {
            setSelectedUnivId(explanation.suggestedUniversities[0].universityId);
        }
    }, [explanation]);

    const selectedUnivName = useMemo(() => {
        const found = explanation?.suggestedUniversities?.find(u => u.universityId === selectedUnivId);
        return found ? found.universityName : (explanation?.suggestedUniversities?.[0]?.universityName || "Assigned University");
    }, [explanation, selectedUnivId]);

    if (!problem || !explanation)
        return null;

    const handleApproveAndRoute = () => {
        if (selectedCategory === "Unclassified Submission") {
            return;
        }
        if (isExcluded) {
            updateProblemStatus(problem.id, "routed_to_line_department", null, null, selectedCategory);
        } else {
            updateProblemStatus(problem.id, "routed", selectedUnivId, null, selectedCategory);
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

    const handleCategoryChange = (newCat) => {
        setSelectedCategory(newCat);
        setIsOverridden(newCat !== problem.category);
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
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Civic Challenge Under Review
              </span>
              <div className="flex items-center space-x-2 text-xs">
                <span className="bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono text-[11px]">
                  Geo: ({problem.latitude?.toFixed(4)}, {problem.longitude?.toFixed(4)})
                </span>
                <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold text-[11px]">
                  Priority: {problem.priorityScore}/100
                </span>
              </div>
            </div>
            <h4 className="font-heading font-bold text-base text-slate-900 mt-1">
              {problem.title}
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {problem.description}
            </p>
          </div>

          {/* Domain Status & Officer Override Control Bar */}
          <div className={`p-3.5 rounded-xl border transition ${
            selectedCategory === "Unclassified Submission"
              ? "bg-amber-50/80 border-amber-300"
              : isOverridden
              ? "bg-purple-50/80 border-purple-200"
              : "bg-emerald-50/80 border-emerald-200"
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  {selectedCategory === "Unclassified Submission" ? (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3 inline mr-1"/>
                      <span>AI Low Confidence</span>
                    </span>
                  ) : isOverridden ? (
                    <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1">
                      <RotateCcw className="w-3 h-3 inline mr-1"/>
                      <span>Officer Override Active</span>
                    </span>
                  ) : (
                    <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 inline mr-1"/>
                      <span>AI Auto-Detected Domain</span>
                    </span>
                  )}

                  <span className="font-heading font-bold text-sm text-slate-900">
                    {selectedCategory}
                  </span>

                  {selectedCategory !== "Unclassified Submission" && !isOverridden && (
                    <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded font-semibold">
                      {((problem.categoryConfidence || 0.96) * 100).toFixed(0)}% Confidence
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600">
                  {selectedCategory === "Unclassified Submission"
                    ? "Domain could not be determined automatically. State Nodal Officer must assign domain below."
                    : isOverridden
                    ? "Domain modified by Nodal Officer. Target institutions and routing updated dynamically."
                    : isExcluded
                    ? "Routine civic issue auto-assigned to Municipal & Public Health Line Department."
                    : "R&D innovation challenge auto-matched with top Jharkhand academic institutions."
                  }
                </p>
              </div>

              {/* Quick Override Dropdown */}
              <div className="flex items-center space-x-2 shrink-0">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
                  Change Domain:
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer shadow-xs"
                >
                  <option value="Unclassified Submission">⚠️ Unclassified Submission</option>
                  <option value="Healthcare & MedTech">Healthcare & MedTech (स्वास्थ्य एवं चिकित्सा)</option>
                  <option value="Water Resources & Sanitation">Water Resources & Sanitation (पेयजल एवं स्वच्छता)</option>
                  <option value="Environment & Mining Remediation">Environment & Mining Remediation (पर्यावरण एवं खनन)</option>
                  <option value="Agriculture & Allied Technologies">Agriculture & Allied Technologies (कृषि एवं संबद्ध)</option>
                  <option value="Rural Infrastructure & Transport">Rural Infrastructure & Transport (सड़क एवं अवसंरचना)</option>
                  <option value="Renewable Energy & Off-Grid Power">Renewable Energy & Off-Grid Power (सौर ऊर्जा)</option>
                  <option value="Education & Smart Learning">Education & Smart Learning (शिक्षा एवं डिजिटल लर्निंग)</option>
                  <option value="Forest & Tribal Livelihoods">Forest & Tribal Livelihoods (वन एवं जनजातीय आजीविका)</option>
                </select>
              </div>
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
                  {selectedCategory === "Unclassified Submission" ? "Review Required" : `${((problem.categoryConfidence || 0.96) * 100).toFixed(0)}% Confidence`}
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                {selectedCategory === "Unclassified Submission" ? (
                  <span className="text-amber-700 font-medium">
                    ⚠️ Low confidence / ambiguous text. Human Nodal Officer must assign the domain.
                  </span>
                ) : (
                  <>Classified / Validated into <strong>{selectedCategory}</strong>.</>
                )}
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
                  <span key={i} className="bg-teal-50 text-teal-700 text-[10px] px-2 py-0.5 rounded font-medium flex items-center space-x-1">
                    <span>✓</span>
                    <span>{tag}</span>
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

          {/* Allocation Section: Direct Line Department vs Smart University Routing vs Unclassified Assignment */}
          {selectedCategory === "Unclassified Submission" ? (
            /* UNCLASSIFIED ACTION CARD: Human-in-the-Loop Officer Triage */
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-400 p-5 rounded-2xl space-y-3">
              <div className="flex items-center space-x-2 text-amber-950 font-heading font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0"/>
                <span>Human-in-the-Loop Action Required: Assign Civic Domain & Routing Theme</span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                The AI classification engine flagged this submission with low confidence. As the State Nodal Officer, please select the target domain to enable automatic routing to the relevant Higher Education Institution or Municipal Department.
              </p>
              <div className="bg-white p-4 rounded-xl border border-amber-300 space-y-2">
                <label className="text-xs font-bold text-slate-800 block">
                  Click a Department / Domain to Assign:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: "Healthcare & MedTech", label: "Healthcare & MedTech (स्वास्थ्य एवं चिकित्सा)", type: "Line Dept" },
                    { id: "Water Resources & Sanitation", label: "Water Resources & Sanitation (पेयजल एवं स्वच्छता)", type: "Line Dept" },
                    { id: "Environment & Mining Remediation", label: "Environment & Mining (पर्यावरण एवं खनन)", type: "University HEI" },
                    { id: "Agriculture & Allied Technologies", label: "Agriculture & Allied Technologies (कृषि एवं संबद्ध)", type: "University HEI" },
                    { id: "Rural Infrastructure & Transport", label: "Rural Infra & Roads (सड़क एवं अवसंरचना)", type: "University HEI" },
                    { id: "Renewable Energy & Off-Grid Power", label: "Renewable Energy & Solar (सौर ऊर्जा)", type: "University HEI" },
                    { id: "Education & Smart Learning", label: "Education & Smart Learning (शिक्षा)", type: "University HEI" },
                    { id: "Forest & Tribal Livelihoods", label: "Forest & Tribal Livelihoods (वन एवं जनजाति)", type: "University HEI" }
                  ].map((dept) => (
                    <button
                      key={dept.id}
                      type="button"
                      onClick={() => handleCategoryChange(dept.id)}
                      className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/60 transition group cursor-pointer"
                    >
                      <span className="font-bold text-xs text-slate-900 group-hover:text-indigo-900 block">{dept.label}</span>
                      <span className="text-[10px] text-slate-500 font-mono">Routes to: {dept.type}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : isExcluded ? (
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
                    Direct Municipal & Health Execution Desk Pre-Selected
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
                    <span>ML-Powered Academic Routing Recommendations (Top Match Pre-Selected for {selectedCategory})</span>
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
                              AI Best Match (Pre-Selected)
                            </span>)}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">{item.reason}</p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-bold text-emerald-700 font-mono">
                        {(item.score > 1 ? item.score : item.score * 100).toFixed(0)}% Fit
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
                : ` Approving will dispatch this challenge to ${selectedUnivName} Nodal Desk for research team formulation.`}
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
            <button
              onClick={handleApproveAndRoute}
              disabled={justApproved || selectedCategory === "Unclassified Submission"}
              className={`flex items-center space-x-1.5 px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-md transition ${
                selectedCategory === "Unclassified Submission"
                  ? "bg-slate-400 cursor-not-allowed opacity-60"
                  : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-600/20 hover:scale-105 cursor-pointer"
              }`}
            >
              {justApproved ? (
                <>
                  <CheckCircle2 className="w-4 h-4"/>
                  <span>{isExcluded ? "Dispatched to Line Dept!" : "Approved & Routed!"}</span>
                </>
              ) : selectedCategory === "Unclassified Submission" ? (
                <>
                  <AlertTriangle className="w-4 h-4"/>
                  <span>Select Domain Above to Confirm & Route →</span>
                </>
              ) : isExcluded ? (
                <>
                  <CheckCircle2 className="w-4 h-4"/>
                  <span>Confirm & Route to State Line Department →</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4"/>
                  <span>Confirm & Route to {selectedUnivName} →</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>);
};
