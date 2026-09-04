import React, { useState } from "react";
import { PortalLayout, NavItem } from "../../components/layout/PortalLayout";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { StatusPill } from "../../components/common/StatusPill";
import { SdgBadge } from "../../components/common/SdgBadge";
import { TeamBuilderModal } from "../../components/hei/TeamBuilderModal";
import {
  GraduationCap,
  Users,
  FileText,
  CheckCircle2,
  Send,
  Plus,
  Trash2,
  ShieldCheck,
  Building,
  Clock,
  ExternalLink
} from "lucide-react";
import confetti from "canvas-confetti";

export const FacultyPortalPage: React.FC = () => {
  const { problems, teams, proposals, milestones, createProposal, approveMilestoneFaculty, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState("challenges");
  const [selectedProbForTeam, setSelectedProbForTeam] = useState<any>(null);

  // Proposal drafting state
  const [propTitle, setPropTitle] = useState("JalShuddhi: Solar-Powered Nano-Adsorptive Fluoride Filter with IoT Contamination Telemetry");
  const [propSummary, setPropSummary] = useState("Decentralized modular filtration pillar using activated alumina and biochar nanoparticles to reduce fluoride below 0.8 ppm and arsenic below 5 ppb, with solar telemetry.");
  const [propApproach, setPropApproach] = useState("Dual-stage adsorption cartridge + ESP32 IoT water conductivity & optical sensor + 50W mono-perc solar panel.");
  const [propOutcome, setPropOutcome] = useState("Safe potable water for 2,400+ residents in Hesal and Childag villages, zero electricity bill, automated SMS alerts upon exhaustion.");
  const [propBudget, setPropBudget] = useState(385000);
  const [propDuration, setPropDuration] = useState(6);
  const [needsIndustrySupport, setNeedsIndustrySupport] = useState(true);
  const [proposalSubmitted, setProposalSubmitted] = useState(false);

  const assignedProblems = problems.filter((p) => p.assignedUniversityId === "univ-bit-mesra");

  const navItems: NavItem[] = [
    { id: "challenges", label: "Assigned Challenges", icon: FileText, badge: assignedProblems.length },
    { id: "team_builder", label: "Multidisciplinary Teams", icon: Users, badge: teams.length },
    { id: "proposal", label: "Draft Research Proposal", icon: FileText },
    { id: "milestone_gate", label: "Milestone Faculty Sign-off", icon: ShieldCheck }
  ];

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProposal({
      teamId: teams[0]?.id || "team-001",
      problemId: assignedProblems[0]?.id || "prob-001",
      problemTitle: assignedProblems[0]?.title || "Fluoride Contamination",
      problemCategory: "Water Resources & Sanitation",
      district: "Ranchi",
      universityName: "Birla Institute of Technology, Mesra",
      facultyMentorName: currentUser?.fullName || "Prof. Ananya Sen",
      title: propTitle,
      summary: propSummary,
      technicalApproach: propApproach,
      expectedOutcome: propOutcome,
      estimatedBudget: Number(propBudget),
      durationMonths: Number(propDuration),
      needsIndustrySupport,
      supportTypeNeeded: needsIndustrySupport ? ["funding", "prototyping", "tech_transfer"] : [],
      status: "submitted"
    });
    setProposalSubmitted(true);
    confetti({ particleCount: 70, spread: 60 });
  };

  return (
    <PortalLayout
      portalTitle="Faculty Mentor Workspace"
      portalSubtitle="प्राध्यापक परामर्शदाता एवं शोध पटल — BIT Mesra, Ranchi"
      navItems={navItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {/* 1. Assigned Challenges */}
      {activeTab === "challenges" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-slate-900">
                Challenges Allocated by University Nodal Desk ({assignedProblems.length})
              </h3>
              <p className="text-xs text-slate-500">
                Assemble a student cohort and formulate an actionable research & engineering plan
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {assignedProblems.map((p) => (
              <div key={p.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{p.ticketNumber}</span>
                    <StatusPill status={p.status} />
                    <span className="text-slate-500">District: {p.district}</span>
                  </div>
                  <span className="font-semibold text-emerald-800 text-[11px]">Assigned Mentor: You</span>
                </div>

                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-900">{p.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{p.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-500">Priority Score:</span>
                    <span className="font-mono font-bold text-amber-700">{p.priorityScore}/100</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedProbForTeam(p)}
                      className="px-3.5 py-1.5 bg-[#0f2942] hover:bg-[#163b5f] text-white rounded font-semibold flex items-center space-x-1.5"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Form Student Cohort</span>
                    </button>
                    <button
                      onClick={() => setActiveTab("proposal")}
                      className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-semibold"
                    >
                      Draft Proposal &rarr;
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Team Builder */}
      {activeTab === "team_builder" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-slate-900">
                Active Multidisciplinary Student Teams ({teams.length})
              </h3>
              <p className="text-xs text-slate-500">
                NEP 2020 cross-disciplinary collaboration: Electronics, CS, Chemical, Civil & Rural Mgmt
              </p>
            </div>
            <button
              onClick={() => setSelectedProbForTeam(assignedProblems[0])}
              className="px-3 py-1.5 bg-[#0f2942] text-white text-xs font-semibold rounded hover:bg-[#163b5f]"
            >
              + Assemble New Team
            </button>
          </div>

          <div className="space-y-4">
            {teams.map((t) => (
              <div key={t.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                  <div>
                    <h4 className="font-heading font-bold text-sm text-slate-900">Team JalRakshak</h4>
                    <p className="text-slate-500 text-[11px]">Solving: {t.problemTitle}</p>
                  </div>
                  <span className="bg-purple-50 text-purple-800 font-bold px-2 py-0.5 rounded border border-purple-200">
                    {t.members.length} Multidisciplinary Innovators
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {t.members.map((m) => (
                    <div key={m.id} className="bg-slate-50 p-3 rounded border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">{m.studentName}</span>
                        <span className="text-[11px] text-slate-500 block">{m.discipline} ({m.yearOfStudy})</span>
                      </div>
                      <span className="bg-white text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-300">
                        {m.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Draft Proposal */}
      {activeTab === "proposal" && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-[#0f2942] text-white px-5 py-3 border-b border-[#163b5f]">
            <h3 className="font-heading font-bold text-sm">
              अनुसंधान एवं तकनीकी समाधान प्रस्ताव प्रपत्र (Research & Solution Proposal Form)
            </h3>
            <p className="text-[11px] text-slate-300">
              Submit to Higher Education Directorate and Open Innovation Marketplace for funding.
            </p>
          </div>

          <form onSubmit={handleProposalSubmit} className="p-6 space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Proposed Solution Title / समाधान का शीर्षक <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={propTitle}
                onChange={(e) => setPropTitle(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded focus:border-[#0f2942] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Executive Technical Summary <span className="text-rose-600">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={propSummary}
                onChange={(e) => setPropSummary(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded focus:border-[#0f2942] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Technical Methodology & Lab Facilities
              </label>
              <textarea
                required
                rows={3}
                value={propApproach}
                onChange={(e) => setPropApproach(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded focus:border-[#0f2942] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Estimated R&D Budget (INR ₹)
                </label>
                <input
                  type="number"
                  required
                  value={propBudget}
                  onChange={(e) => setPropBudget(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded font-mono font-bold text-emerald-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Project Duration (Months)
                </label>
                <input
                  type="number"
                  required
                  value={propDuration}
                  onChange={(e) => setPropDuration(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded font-mono"
                />
              </div>
            </div>

            <div className="bg-amber-50/70 border border-amber-300 p-3 rounded flex items-center justify-between">
              <div>
                <span className="font-bold text-amber-950 block text-xs">
                  Request Industry / CSR Co-Funding & Mentorship?
                </span>
                <p className="text-[11px] text-amber-900 mt-0.5">
                  When checked, this proposal is listed on the Open Innovation Marketplace for Tata Steel, Coal India & MSMEs.
                </p>
              </div>
              <input
                type="checkbox"
                checked={needsIndustrySupport}
                onChange={(e) => setNeedsIndustrySupport(e.target.checked)}
                className="w-5 h-5 text-emerald-700"
              />
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0f2942] hover:bg-[#163b5f] text-white rounded font-semibold flex items-center space-x-1.5"
              >
                {proposalSubmitted ? (
                  <span>Proposal Submitted for State Review ✓</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Proposal to State Council &rarr;</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. Milestone Faculty Sign-off Gate */}
      {activeTab === "milestone_gate" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-slate-900">
                Milestone Dual Sign-Off Gate (Faculty Verification)
              </h3>
              <p className="text-xs text-slate-500">
                Inspect student deliverables and apply your formal Academic Sign-off stamp
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3 text-xs">
              <div className="flex justify-between items-start pb-2 border-b border-slate-100">
                <div>
                  <span className="font-mono text-slate-500 text-[11px] block">Project: JalShuddhi (BIT Mesra)</span>
                  <h4 className="font-heading font-bold text-slate-900 text-sm mt-0.5">
                    Milestone 3: Field Testing & Fluoride Sensor Calibration (Angara Block)
                  </h4>
                </div>
                <span className="bg-amber-50 text-amber-900 font-bold px-2 py-0.5 rounded border border-amber-300">
                  ACTION REQUIRED
                </span>
              </div>

              <p className="text-slate-600 leading-relaxed">
                Student team led by Rahul Kumar uploaded 14-day field continuous flow test telemetry showing 0.4 ppm residual fluoride (NABL certified). Inspect documentation before stamping.
              </p>

              <div className="bg-slate-50 p-3 rounded border border-slate-200 flex items-center justify-between">
                <span className="font-mono text-slate-700">Field_Installation_Photos_and_GPS_Geotag.pdf (5.6 MB)</span>
                <button
                  onClick={() => alert("Downloading field test sheet...")}
                  className="text-blue-700 hover:text-blue-900 font-semibold"
                >
                  Download & Verify &rarr;
                </button>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Sign-off required prior to Govt Officer fund release</span>
                <button
                  onClick={() => {
                    approveMilestoneFaculty("ms-003", currentUser?.fullName || "Prof. Ananya Sen");
                    confetti({ particleCount: 60, spread: 50 });
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-semibold flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Apply Faculty Academic Sign-Off Stamp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <TeamBuilderModal
        problem={selectedProbForTeam}
        onClose={() => setSelectedProbForTeam(null)}
      />
    </PortalLayout>
  );
};
