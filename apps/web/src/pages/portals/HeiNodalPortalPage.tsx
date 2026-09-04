import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PortalLayout, NavItem } from "../../components/layout/PortalLayout";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { StatusPill } from "../../components/common/StatusPill";
import { SdgBadge } from "../../components/common/SdgBadge";
import { ExplainableAIModal } from "../../components/ai/ExplainableAIModal";
import { getEcosystemByUserId } from "../../data/universityEcosystems";
import {
  GraduationCap,
  Building,
  CheckCircle2,
  XCircle,
  Users,
  BrainCircuit,
  FileText,
  Clock,
  ArrowRight,
  ShieldCheck,
  Award
} from "lucide-react";
import confetti from "canvas-confetti";

export const HeiNodalPortalPage: React.FC = () => {
  const { problems, updateProblemStatus, currentUser, universities, teams, proposals } = useApp();
  const { currentRole } = useAuth();
  const [activeTab, setActiveTab] = useState("routed");
  const [selectedProbForXAI, setSelectedProbForXAI] = useState<any>(null);

  // Dynamic institution resolution
  const eco = getEcosystemByUserId(currentUser?.id, currentUser?.organizationName);

  // STRICT FILTERING by university:
  // "Routed Challenges" are those awaiting acceptance for this university
  const routedProblems = problems.filter((p) => {
    const isPending = p.status === "routed" || p.status === "pending_nodal_review";
    if (!isPending) return false;
    const isAssignedToUs = p.assignedUniversityId === eco.id;
    const isTopSuggested = p.aiExplanation?.suggestedUniversities?.[0]?.universityId === eco.id;
    const isDistrictMatch = p.district === eco.district;
    return isAssignedToUs || isTopSuggested || isDistrictMatch;
  });

  // "Accepted Challenges" are strictly those assigned to this institution
  const acceptedProblems = problems.filter(
    (p) =>
      p.assignedUniversityId === eco.id &&
      p.status !== "pending_nodal_review" &&
      p.status !== "routed" &&
      p.status !== "submitted"
  );

  // Filter proposals belonging to this university
  const univProposals = proposals.filter(
    (pr) =>
      pr.universityName?.toLowerCase().includes(eco.shortName.toLowerCase()) ||
      pr.universityName?.toLowerCase().includes(eco.name.toLowerCase()) ||
      pr.facultyMentorName === eco.faculty.fullName
  );

  const navItems: NavItem[] = [
    { id: "overview", label: "HEI Capacity & Portfolio", icon: Building },
    { id: "routed", label: "Routed Challenges", icon: BrainCircuit, badge: routedProblems.length },
    { id: "accepted", label: "Accepted Challenges", icon: CheckCircle2, badge: acceptedProblems.length },
    { id: "faculty_roster", label: "Faculty Mentors Roster", icon: Users },
    { id: "proposals", label: "Proposals & Cohorts", icon: FileText, badge: univProposals.length }
  ];

  const handleAccept = (probId: string) => {
    updateProblemStatus(probId, "accepted_by_hei", eco.id, eco.faculty.id);
    confetti({ particleCount: 70, spread: 60 });
    setActiveTab("accepted");
  };

  const handleDecline = (probId: string) => {
    const fallbackUniv = eco.id === "univ-bit-mesra" ? "univ-iit-dhanbad" : "univ-bit-mesra";
    updateProblemStatus(probId, "routed", fallbackUniv);
    alert(`Challenge declined by ${eco.shortName}. AI Routing Engine re-assigned ticket to next ranked HEI.`);
  };

  return (
    <PortalLayout
      portalTitle="University Nodal Desk (HEI Portal)"
      portalSubtitle={`विश्वविद्यालय एवं उच्च शिक्षण संस्थान नवाचार पटल — ${eco.name} (${eco.shortName})`}
      navItems={navItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {/* 1. Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl">{eco.domainIcon}</span>
                <h3 className="font-heading font-bold text-base text-slate-900">
                  {eco.name}
                </h3>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Nodal Officer: <strong>{eco.nodal.fullName}</strong> ({eco.nodal.title}) • District: <strong>{eco.district}</strong>
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Designated State Nodal Centre for <strong>{eco.domainName}</strong>.
              </p>
            </div>
            <div className="bg-slate-50 px-3 py-2 border border-slate-200 rounded text-center shrink-0">
              <span className="text-[10px] text-slate-500 block uppercase font-mono">Institutional TRL Level</span>
              <span className="font-bold text-emerald-800 text-sm font-mono">TRL 6 - TRL 8 Ready</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Pending AI Routing</span>
              <span className="font-heading font-extrabold text-xl text-blue-700 font-mono mt-0.5 block">
                {routedProblems.length}
              </span>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Accepted & Active Projects</span>
              <span className="font-heading font-extrabold text-xl text-emerald-700 font-mono mt-0.5 block">
                {acceptedProblems.length}
              </span>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Active Proposals</span>
              <span className="font-heading font-extrabold text-xl text-purple-700 font-mono mt-0.5 block">
                {univProposals.length}
              </span>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200">
              <span className="text-[11px] text-slate-500 block">Designated Faculty Lead</span>
              <span className="font-heading font-bold text-xs text-slate-800 mt-1 block truncate">
                {eco.faculty.fullName}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Routed Challenges Tab */}
      {activeTab === "routed" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-slate-900">
                Challenges Routed to {eco.shortName} by State AI Engine ({routedProblems.length})
              </h3>
              <p className="text-xs text-slate-500">
                Matched based on institutional domain expertise ({eco.domainName}) and field requirements
              </p>
            </div>
          </div>

          {routedProblems.length === 0 ? (
            <div className="bg-white p-8 rounded-lg border border-slate-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-sm text-slate-800">All Routed Challenges Have Been Processed!</h4>
              <p className="text-xs text-slate-500">
                You have accepted or triaged all routed challenges. View them in the "Accepted Challenges" tab.
              </p>
              <button
                onClick={() => setActiveTab("accepted")}
                className="mt-2 px-4 py-1.5 bg-[#0f2942] text-white text-xs font-semibold rounded"
              >
                View Accepted Challenges ({acceptedProblems.length}) &rarr;
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {routedProblems.map((p) => (
                <div key={p.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{p.ticketNumber}</span>
                      <StatusPill status={p.status} />
                      <span className="text-slate-500">District: {p.district}</span>
                    </div>
                    <button
                      onClick={() => setSelectedProbForXAI(p)}
                      className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center space-x-1"
                    >
                      <BrainCircuit className="w-3.5 h-3.5" />
                      <span>Explainable AI Match Breakdown &rarr;</span>
                    </button>
                  </div>

                  <div>
                    <h4 className="font-heading font-bold text-sm text-slate-900">{p.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{p.description}</p>
                  </div>

                  <div className="bg-blue-50/60 p-3 rounded border border-blue-100 text-xs space-y-1">
                    <span className="font-bold text-blue-950 block text-[11px]">AI Matching Rationale:</span>
                    <p className="text-blue-900 text-[11px]">
                      Optimal match for {eco.name} laboratory facilities • Domain: {p.category} • Priority Score: {p.priorityScore}/100.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-500">Proposed Mentor:</span>
                      <span className="font-semibold text-slate-800">{eco.faculty.fullName} ({eco.faculty.dept})</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDecline(p.id)}
                        className="px-3 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded font-semibold"
                      >
                        Decline & Re-Route
                      </button>
                      <button
                        onClick={() => handleAccept(p.id)}
                        className="px-4 py-1.5 bg-[#0f2942] hover:bg-[#163b5f] text-white rounded font-semibold flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Accept & Assign to {eco.faculty.fullName.split(" ")[0]} {eco.faculty.fullName.split(" ").slice(-1)[0]} &rarr;</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. Accepted Challenges Tab */}
      {activeTab === "accepted" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-slate-900">
                Accepted Challenges in Active {eco.shortName} Pipeline ({acceptedProblems.length})
              </h3>
              <p className="text-xs text-slate-500">
                Challenges officially accepted by {eco.name} with faculty mentors assigned
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {acceptedProblems.map((p) => (
              <div key={p.id} className="bg-white p-5 rounded-lg border border-emerald-300 shadow-xs space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{p.ticketNumber}</span>
                    <StatusPill status={p.status} />
                    <span className="text-slate-500">District: {p.district}</span>
                  </div>

                  <span className="bg-emerald-50 text-emerald-800 font-bold px-2.5 py-1 rounded text-[11px] border border-emerald-300 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    <span>ACCEPTED BY {eco.shortName.toUpperCase()}</span>
                  </span>
                </div>

                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-900">{p.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{p.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded border border-slate-200">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Assigned Faculty Mentor:</span>
                    <strong className="text-slate-900">{p.assignedFacultyName || eco.faculty.fullName}</strong>
                    <span className="text-slate-500 block text-[10px]">{eco.faculty.dept}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Academic Cohort Status:</span>
                    <strong className="text-emerald-800 uppercase font-mono">{p.status.replace(/_/g, " ")}</strong>
                    <span className="text-slate-500 block text-[10px]">Priority Score: {p.priorityScore}/100</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500 text-[11px]">
                    Student teams and research proposals active under this challenge
                  </span>

                  <Link
                    to="/portal/faculty"
                    className="px-3 py-1.5 bg-[#0f2942] hover:bg-[#163b5f] text-white rounded font-semibold flex items-center space-x-1"
                  >
                    <span>Inspect in Faculty Workspace &rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Faculty Roster Tab */}
      {activeTab === "faculty_roster" && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 font-heading font-bold text-xs uppercase tracking-wider text-slate-800">
            Registered Faculty Mentors & Research Specializations — {eco.shortName}
          </div>

          <table className="gov-table">
            <thead>
              <tr>
                <th>Faculty Name</th>
                <th>Department</th>
                <th>Specialization Domains</th>
                <th>Designation</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold text-slate-900">{eco.faculty.fullName}</td>
                <td>{eco.faculty.dept}</td>
                <td>{eco.faculty.specialization}</td>
                <td>{eco.faculty.title}</td>
                <td><span className="bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">Active Lead</span></td>
              </tr>
              <tr>
                <td className="font-bold text-slate-900">Dr. K. N. Chatterjee</td>
                <td>Dept of Electronics & Sensor Instrumentation</td>
                <td>LoRaWAN Mesh Telemetry, IoT Edge Hardware</td>
                <td>Associate Professor</td>
                <td><span className="bg-blue-50 text-blue-800 font-bold px-1.5 py-0.5 rounded border border-blue-200 text-[10px]">Co-Mentor</span></td>
              </tr>
              <tr>
                <td className="font-bold text-slate-900">Dr. S. K. Mahato</td>
                <td>Centre for Applied Science & Prototyping</td>
                <td>Field Pilot Commissioning, NABL Standards</td>
                <td>Professor</td>
                <td><span className="bg-slate-100 text-slate-700 font-bold px-1.5 py-0.5 rounded text-[10px]">Lab Director</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* 5. Proposals Tab */}
      {activeTab === "proposals" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Institutional Solution Proposals — {eco.shortName} ({univProposals.length})
            </h3>
          </div>

          <div className="space-y-3">
            {univProposals.map((pr) => (
              <div key={pr.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-2 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-heading font-bold text-slate-900 text-sm">{pr.title}</h4>
                    <p className="text-slate-500 text-[11px]">Faculty Mentor: {pr.facultyMentorName} • Duration: {pr.durationMonths} Months</p>
                  </div>
                  <span className="font-mono font-bold text-emerald-800 text-sm">
                    ₹{(pr.estimatedBudget).toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-slate-600 line-clamp-2">{pr.summary}</p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[11px]">
                  <span className="text-slate-500">Status: <strong className="uppercase text-slate-800">{pr.status}</strong></span>
                  <span className="text-blue-700 font-semibold">{pr.needsIndustrySupport ? "Open for CSR Grant" : "Academic Research"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Explainable AI Modal */}
      <ExplainableAIModal
        problem={selectedProbForXAI}
        onClose={() => setSelectedProbForXAI(null)}
      />
    </PortalLayout>
  );
};
