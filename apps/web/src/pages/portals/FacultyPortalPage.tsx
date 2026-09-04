import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  ExternalLink,
  Info,
  ArrowRight
} from "lucide-react";
import confetti from "canvas-confetti";

export const FacultyPortalPage: React.FC = () => {
  const { problems, teams, proposals, milestones, createProposal, approveMilestoneFaculty, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState("challenges");
  const [selectedProbForTeam, setSelectedProbForTeam] = useState<any>(null);

  const assignedProblems = problems.filter(
    (p) => p.assignedUniversityId === "univ-bit-mesra" || p.assignedFacultyName?.includes("Ananya") || p.district === "Ranchi" || p.district === "Dhanbad"
  );

  // Proposal drafting state
  const [selectedProblemId, setSelectedProblemId] = useState(assignedProblems[0]?.id || "");
  const [propTitle, setPropTitle] = useState("Automated Drainage Siphon & Smart Water Logging Telemetry");
  const [propSummary, setPropSummary] = useState("IoT ultrasound water-level detection network coupled with solar-assisted low-head axial pumps to rapidly clear waterlogged low-lying areas.");
  const [propApproach, setPropApproach] = useState("Ultrasonic water depth sensors + ESP32 LoRaWAN gateway + automated solar siphoning pumps for community flood prevention.");
  const [propOutcome, setPropOutcome] = useState("Rapid water evacuation within 45 minutes of heavy precipitation, zero vector-borne outbreak risk, real-time municipality alerts.");
  const [propBudget, setPropBudget] = useState(250000);
  const [propDuration, setPropDuration] = useState(4);
  const [needsIndustrySupport, setNeedsIndustrySupport] = useState(true);
  const [lastSubmittedProposalId, setLastSubmittedProposalId] = useState<string | null>(null);

  const navItems: NavItem[] = [
    { id: "challenges", label: "Assigned Challenges", icon: FileText, badge: assignedProblems.length },
    { id: "team_builder", label: "Multidisciplinary Teams", icon: Users, badge: teams.length },
    { id: "proposal", label: "Draft Research Proposal", icon: FileText },
    { id: "milestone_gate", label: "Milestone Faculty Sign-off", icon: ShieldCheck }
  ];

  const handleSelectProblemForProposal = (p: any) => {
    setSelectedProblemId(p.id);
    setPropTitle(`Engineering Solution: ${p.title}`);
    setPropSummary(`Targeted research & development plan addressing: ${p.description.slice(0, 120)}...`);
    setActiveTab("proposal");
  };

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetProb = assignedProblems.find((p) => p.id === selectedProblemId) || assignedProblems[0];

    const newProp = createProposal({
      teamId: teams[0]?.id || "team-001",
      problemId: targetProb?.id || "prob-001",
      problemTitle: targetProb?.title || "Societal Challenge",
      problemCategory: targetProb?.category || "Water Resources & Sanitation",
      district: targetProb?.district || "Ranchi",
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

    setLastSubmittedProposalId(newProp.id);
    confetti({ particleCount: 80, spread: 70 });
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
          <div className="bg-blue-50/70 border border-blue-200 p-3.5 rounded-lg flex items-start space-x-3 text-xs">
            <Info className="w-4 h-4 text-[#0f2942] shrink-0 mt-0.5" />
            <div className="text-slate-700 leading-relaxed">
              <span className="font-bold text-[#0f2942]">Lifecycle Progression:</span> Once an assigned challenge has a multidisciplinary student team formed and a research proposal submitted, its status updates to <strong>IN PROGRESS / PROPOSAL DRAFTED</strong> and is routed to the Open Innovation Marketplace for CSR funding and Stage 1 Milestone Tracking.
            </div>
          </div>

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
            {assignedProblems.map((p) => {
              const existingTeam = teams.find(
                (t) => t.problemId === p.id || t.problemTitle.toLowerCase() === p.title.toLowerCase()
              );
              const existingProposal = proposals.find(
                (pr) => pr.problemId === p.id || pr.problemTitle.toLowerCase() === p.title.toLowerCase() || pr.title.toLowerCase().includes(p.title.toLowerCase().slice(0, 20))
              );

              return (
                <div
                  key={p.id}
                  className={`bg-white p-5 rounded-lg border shadow-xs space-y-3 transition ${
                    existingProposal ? "border-emerald-300 bg-emerald-50/10" : "border-slate-200"
                  }`}
                >
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

                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-500">Priority Score:</span>
                      <span className="font-mono font-bold text-amber-700">{p.priorityScore}/100</span>
                    </div>

                    {/* Dynamic Action Buttons based on whether Team / Proposal already exists! */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Team Status */}
                      {existingTeam ? (
                        <button
                          onClick={() => setActiveTab("team_builder")}
                          className="bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 font-bold px-3 py-1.5 rounded text-xs flex items-center space-x-1.5 transition"
                          title="Click to view student roster"
                        >
                          <Users className="w-3.5 h-3.5 text-purple-700" />
                          <span>✓ Team Formed ({existingTeam.members.length} Innovators)</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedProbForTeam(p)}
                          className="px-3.5 py-1.5 bg-[#0f2942] hover:bg-[#163b5f] text-white rounded font-semibold flex items-center space-x-1.5"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>Form Student Cohort</span>
                        </button>
                      )}

                      {/* Proposal Status */}
                      {existingProposal ? (
                        <div className="flex items-center space-x-2">
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold px-3 py-1.5 rounded text-xs flex items-center space-x-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>✓ Proposal Drafted (₹{existingProposal.estimatedBudget.toLocaleString("en-IN")})</span>
                          </span>

                          <Link
                            to={`/lifecycle/${existingProposal.id}`}
                            className="px-3 py-1.5 bg-[#0f2942] hover:bg-[#163b5f] text-white rounded text-xs font-semibold flex items-center space-x-1 shadow-xs"
                          >
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span>Track Milestones & Lifecycle &rarr;</span>
                          </Link>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleSelectProblemForProposal(p)}
                          className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-semibold flex items-center space-x-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Draft Proposal &rarr;</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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

          {lastSubmittedProposalId ? (
            <div className="p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="font-heading font-bold text-base text-slate-900">
                Research Proposal Successfully Registered & Dispatched!
              </h4>
              <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                Proposal has been logged into the state repository, listed on the <strong>Open Innovation Marketplace</strong> for CSR matching (Tata Steel / Coal India), and initialized in the <strong>5-Stage Project Lifecycle Manager</strong>.
              </p>

              <div className="flex justify-center items-center space-x-3 pt-2">
                <button
                  onClick={() => {
                    setLastSubmittedProposalId(null);
                    setActiveTab("challenges");
                  }}
                  className="px-4 py-2 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  &larr; Back to Assigned Challenges
                </button>

                <Link
                  to={`/lifecycle/${lastSubmittedProposalId}`}
                  className="px-4 py-2 bg-[#0f2942] hover:bg-[#163b5f] text-white rounded text-xs font-semibold flex items-center space-x-1"
                >
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Open 5-Stage Project Lifecycle (Gantt) &rarr;</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProposalSubmit} className="p-6 space-y-4 text-xs">
              {/* Select target challenge */}
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Select Target Societal Challenge / आवंटित समस्या <span className="text-rose-600">*</span>
                </label>
                <select
                  value={selectedProblemId}
                  onChange={(e) => {
                    setSelectedProblemId(e.target.value);
                    const found = assignedProblems.find((p) => p.id === e.target.value);
                    if (found) {
                      setPropTitle(`Engineering Solution: ${found.title}`);
                    }
                  }}
                  className="w-full p-2.5 border border-slate-300 rounded bg-slate-50 focus:border-[#0f2942] font-semibold text-slate-800"
                >
                  {assignedProblems.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.ticketNumber}] {p.title} ({p.district})
                    </option>
                  ))}
                </select>
              </div>

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
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Proposal to State Council & Marketplace &rarr;</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* 4. Milestone Faculty Sign-off Gate */}
      {activeTab === "milestone_gate" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-slate-900">
                Milestone Dual Sign-Off Gate (Faculty Academic Verification)
              </h3>
              <p className="text-xs text-slate-500">
                Inspect laboratory deliverables, test telemetry, and apply your formal Academic Sign-Off Stamp
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {milestones.map((m) => {
              const targetProp = proposals.find((p) => p.id === m.proposalId) || proposals[0];
              const isFacultyApproved = m.facultyApproved;

              return (
                <div
                  key={m.id}
                  className={`bg-white p-5 rounded-lg border shadow-xs space-y-3 text-xs transition ${
                    isFacultyApproved ? "border-emerald-300 bg-emerald-50/10" : "border-slate-200"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div>
                      <span className="font-mono text-slate-500 text-[11px] block">
                        Project: {targetProp?.title || "BIT Mesra Research Cohort"}
                      </span>
                      <h4 className="font-heading font-bold text-slate-900 text-sm mt-0.5">
                        {m.displayName}
                      </h4>
                    </div>

                    <div>
                      {isFacultyApproved ? (
                        <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2.5 py-1 rounded text-[11px] flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>FACULTY STAMP APPLIED</span>
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded text-[10px]">
                          ACTION REQUIRED: PENDING FACULTY STAMP
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-slate-600 leading-relaxed">{m.description}</p>

                  <div className="bg-slate-50 p-2.5 rounded border border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-700">Lab_Telemetry_and_Calibration_Logs.pdf (3.2 MB)</span>
                    <button
                      onClick={() => alert("Downloading student laboratory deliverable from Document Vault...")}
                      className="text-blue-700 hover:text-blue-900 font-semibold"
                    >
                      Download & Verify &rarr;
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-slate-500 text-[11px]">
                      Academic Mentor: <strong>{currentUser?.fullName || "Prof. Ananya Sen"}</strong>
                    </span>

                    {!isFacultyApproved ? (
                      <button
                        onClick={() => {
                          approveMilestoneFaculty(m.id, currentUser?.fullName || "Prof. Ananya Sen");
                          confetti({ particleCount: 70, spread: 60 });
                        }}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-semibold flex items-center space-x-1.5 shadow-xs"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Apply Faculty Academic Sign-Off Stamp</span>
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Signed off by {m.facultyApprovedBy || "Prof. Ananya Sen"} • Awaiting District Stamp</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
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
