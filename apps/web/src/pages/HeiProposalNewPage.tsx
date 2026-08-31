import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { FileText, Sparkles, Building, Send, DollarSign, Clock, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";

export const HeiProposalNewPage: React.FC = () => {
  const { problems, createProposal, currentUser, teams } = useApp();
  const navigate = useNavigate();

  const [selectedProblemId, setSelectedProblemId] = useState(problems[0]?.id || "prob-001");
  const [title, setTitle] = useState("JalShuddhi: Solar-Powered Nano-Adsorptive Fluoride Filter with IoT Contamination Telemetry");
  const [summary, setSummary] = useState("Development of a decentralized modular filtration pillar utilizing activated alumina and biochar nanoparticles to reduce fluoride below 0.8 ppm and arsenic below 5 ppb, coupled with solar-powered continuous spectrophotometric telemetry reporting live water quality to Ranchi district portal.");
  const [technicalApproach, setTechnicalApproach] = useState("Dual-stage adsorption cartridge + ESP32 IoT water conductivity & optical sensor + 50W mono-perc solar panel + GSM telemetry burst to JSICP gateway.");
  const [expectedOutcome, setExpectedOutcome] = useState("Safe potable water for 2,400+ residents in Hesal and Childag villages, zero recurring electricity cost, automated SMS alerts to Jal Sahiyyas upon cartridge exhaustion.");
  const [estimatedBudget, setEstimatedBudget] = useState(385000);
  const [durationMonths, setDurationMonths] = useState(6);
  const [needsIndustrySupport, setNeedsIndustrySupport] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedProb = problems.find((p) => p.id === selectedProblemId) || problems[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      createProposal({
        teamId: teams[0]?.id || "team-001",
        problemId: selectedProb.id,
        problemTitle: selectedProb.title,
        problemCategory: selectedProb.category,
        district: selectedProb.district,
        universityName: selectedProb.assignedUniversityName || "Birla Institute of Technology, Mesra",
        facultyMentorName: currentUser.fullName,
        title,
        summary,
        technicalApproach,
        expectedOutcome,
        estimatedBudget: Number(estimatedBudget),
        durationMonths: Number(durationMonths),
        needsIndustrySupport,
        supportTypeNeeded: needsIndustrySupport ? ["funding", "prototyping", "tech_transfer"] : [],
        status: "submitted"
      });

      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
      setIsSubmitting(false);
      navigate("/industry/marketplace");
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      <div className="bg-gradient-to-r from-emerald-800 to-indigo-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg space-y-2">
        <span className="bg-emerald-500/30 text-emerald-200 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-400/30 uppercase">
          HEI Solution Proposal Workflow
        </span>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl">
          Draft & Submit Academic Solution Proposal
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
          Submit formal research plan, engineering architecture, milestone roadmap, and budget. If industry support is flagged, your proposal appears on the Open Innovation Marketplace for CSR funding.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        {/* Problem Target Select */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Select Targeted Societal Challenge:
          </label>
          <select
            value={selectedProblemId}
            onChange={(e) => setSelectedProblemId(e.target.value)}
            className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl bg-slate-50 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            {problems.map((p) => (
              <option key={p.id} value={p.id}>
                [{p.ticketNumber}] {p.title} ({p.district})
              </option>
            ))}
          </select>
        </div>

        {/* Proposal Title */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Proposed Technical Solution Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. JalShuddhi: Solar-Powered Nano-Adsorptive Fluoride Filter"
            className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Executive Summary */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Executive Summary & Problem-Solution Fit <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Technical Approach & Architecture */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Detailed Technical Approach, Hardware/Software Architecture & Lab Facilities:
          </label>
          <textarea
            required
            rows={3}
            value={technicalApproach}
            onChange={(e) => setTechnicalApproach(e.target.value)}
            className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Expected Outcomes */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Expected Community Impact & Measurable Outcomes:
          </label>
          <textarea
            required
            rows={2}
            value={expectedOutcome}
            onChange={(e) => setExpectedOutcome(e.target.value)}
            className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Budget & Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Estimated R&D / Prototype Budget (INR ₹):
            </label>
            <input
              type="number"
              required
              value={estimatedBudget}
              onChange={(e) => setEstimatedBudget(Number(e.target.value))}
              className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl font-mono font-bold text-emerald-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Estimated Project Duration (Months):
            </label>
            <input
              type="number"
              required
              value={durationMonths}
              onChange={(e) => setDurationMonths(Number(e.target.value))}
              className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl font-mono"
            />
          </div>
        </div>

        {/* Needs Industry Support Toggle */}
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between">
          <div>
            <span className="font-heading font-bold text-xs sm:text-sm text-amber-950 block">
              Enable Open Innovation & Industry / CSR Matching?
            </span>
            <p className="text-[11px] text-amber-800">
              When enabled, your proposal is automatically featured on the Industry Marketplace for co-funding & MoUs.
            </p>
          </div>
          <input
            type="checkbox"
            checked={needsIndustrySupport}
            onChange={(e) => setNeedsIndustrySupport(e.target.checked)}
            className="w-6 h-6 text-emerald-600 focus:ring-emerald-500 rounded cursor-pointer"
          />
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/20 transition hover:scale-105"
          >
            <Send className="w-4 h-4" />
            <span>Submit Proposal for Govt Review &rarr;</span>
          </button>
        </div>
      </form>
    </div>
  );
};
