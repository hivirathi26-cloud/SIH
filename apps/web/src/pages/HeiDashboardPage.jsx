import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { StatusPill } from "../components/common/StatusPill";
import { SdgBadge } from "../components/common/SdgBadge";
import { ExplainableAIModal } from "../components/ai/ExplainableAIModal";
import { TeamBuilderModal } from "../components/hei/TeamBuilderModal";
import { Users, BrainCircuit, FilePlus } from "lucide-react";
import confetti from "canvas-confetti";
export const HeiDashboardPage = () => {
    const { problems, updateProblemStatus, currentUser, universities, teams, proposals } = useApp();
    const [selectedProbForXAI, setSelectedProbForXAI] = useState(null);
    const [selectedProbForTeam, setSelectedProbForTeam] = useState(null);
    // Filter problems routed to or relevant to HEIs (excluding direct line-dept healthcare/water issues)
    const routedProblems = problems.filter((p) => {
        if (p.isUniversityRoutable === false || p.category === "Healthcare & MedTech" || p.category === "Water Resources & Sanitation")
            return false;
        return p.status === "routed" || p.status === "pending_nodal_review" || p.assignedUniversityId === "univ-bit-mesra";
    });
    const acceptedProblems = problems.filter((p) => (p.status === "accepted_by_hei" || p.status === "team_formed" || p.status === "in_progress") && p.isUniversityRoutable !== false);
    const handleAcceptProblem = (problemId) => {
        updateProblemStatus(problemId, "accepted_by_hei", "univ-bit-mesra", "faculty-ananya");
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    };
    const handleDeclineProblem = (problemId) => {
        // Auto re-routes to next best university
        updateProblemStatus(problemId, "routed", "univ-iit-dhanbad");
        alert("Problem declined. AI Engine automatically re-routed challenge to next ranked HEI: IIT (ISM) Dhanbad.");
    };
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-500/30 text-blue-200 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-400/30">
              MODULE C: UNIVERSITY WORKSPACE
            </span>
            <span className="text-xs text-blue-300">BIT Mesra Nodal Desk</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl">
            Higher Education Institution (HEI) Portal
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 max-w-2xl leading-relaxed">
            Review AI-routed societal challenges, accept institutional ownership, assign faculty research mentors, and form multidisciplinary student teams.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to="/hei/teams" className="flex items-center space-x-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm">
            <Users className="w-4 h-4"/>
            <span>Manage Student Teams & Kanban</span>
          </Link>
          <Link to="/hei/proposals/new" className="flex items-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm">
            <FilePlus className="w-4 h-4"/>
            <span>Draft New Solution Proposal</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium block">Routed for Acceptance</span>
          <span className="font-heading font-extrabold text-2xl text-blue-600 font-mono mt-1 block">
            {routedProblems.length}
          </span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium block">Active Solving Teams</span>
          <span className="font-heading font-extrabold text-2xl text-purple-600 font-mono mt-1 block">
            {teams.length + 8}
          </span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium block">Proposals Submitted</span>
          <span className="font-heading font-extrabold text-2xl text-emerald-600 font-mono mt-1 block">
            {proposals.length}
          </span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium block">Patents / Prototypes</span>
          <span className="font-heading font-extrabold text-2xl text-amber-600 font-mono mt-1 block">
            12 Filed
          </span>
        </div>
      </div>

      {/* Section 1: AI Routed Problems Awaiting Acceptance */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-lg text-slate-900 flex items-center space-x-2">
            <span>Challenges Routed to Your University</span>
            <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
              {routedProblems.length} Pending
            </span>
          </h2>
          <span className="text-xs text-slate-500">Matched by Cosine Similarity & Domain Match</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {routedProblems.map((prob) => (<div key={prob.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-500">{prob.ticketNumber}</span>
                  <StatusPill status={prob.status}/>
                </div>

                <h3 className="font-heading font-bold text-base text-slate-900 leading-snug">
                  {prob.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {prob.description}
                </p>

                <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-200 text-xs space-y-1">
                  <div className="flex justify-between font-semibold text-blue-950">
                    <span>AI Domain Match Fit:</span>
                    <span className="font-mono text-blue-700">96% High Compatibility</span>
                  </div>
                  <p className="text-[11px] text-blue-800">
                    Reason: Matches BIT Mesra Water & Environmental Engg research labs + Same District ({prob.district}).
                  </p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {prob.sdgTags.map((tag, i) => (<SdgBadge key={i} tag={tag}/>))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <button onClick={() => setSelectedProbForXAI(prob)} className="flex items-center space-x-1 text-xs font-bold text-indigo-700 hover:text-indigo-900">
                  <BrainCircuit className="w-3.5 h-3.5"/>
                  <span>View XAI Match Reasoning</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button onClick={() => handleDeclineProblem(prob.id)} className="px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-xl transition">
                    Decline & Re-Route
                  </button>

                  <button onClick={() => handleAcceptProblem(prob.id)} className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition hover:scale-105">
                    Accept Challenge ✓
                  </button>
                </div>
              </div>
            </div>))}
        </div>
      </div>

      {/* Section 2: Accepted Problems & Team Formation */}
      <div className="space-y-4 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-lg text-slate-900">
            Accepted Challenges & Active Research Pipeline
          </h2>
          <span className="text-xs text-slate-500">Ready for Multidisciplinary Team Assembly</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {acceptedProblems.map((prob) => (<div key={prob.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-500">{prob.ticketNumber}</span>
                  <StatusPill status={prob.status}/>
                </div>

                <h3 className="font-heading font-bold text-base text-slate-900 leading-snug">
                  {prob.title}
                </h3>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between text-slate-700">
                    <span>Assigned Faculty Mentor:</span>
                    <span className="font-bold text-slate-900">{prob.assignedFacultyName || "Prof. Ananya Sen"}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>District / Location:</span>
                    <span className="font-medium text-slate-800">{prob.district}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button onClick={() => setSelectedProbForTeam(prob)} className="flex items-center space-x-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition shadow-sm">
                  <Users className="w-4 h-4"/>
                  <span>Form Student Team</span>
                </button>

                <Link to="/hei/proposals/new" className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1">
                  <span>Draft Proposal &rarr;</span>
                </Link>
              </div>
            </div>))}
        </div>
      </div>

      {/* Modals */}
      <ExplainableAIModal problem={selectedProbForXAI} onClose={() => setSelectedProbForXAI(null)}/>

      <TeamBuilderModal problem={selectedProbForTeam} onClose={() => setSelectedProbForTeam(null)}/>
    </div>);
};
