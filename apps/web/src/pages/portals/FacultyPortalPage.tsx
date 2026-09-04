import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PortalLayout, NavItem } from "../../components/layout/PortalLayout";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { StatusPill } from "../../components/common/StatusPill";
import { SdgBadge } from "../../components/common/SdgBadge";
import { TeamBuilderModal } from "../../components/hei/TeamBuilderModal";
import { getEcosystemByUserId } from "../../data/universityEcosystems";
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
  ArrowRight,
  CheckSquare,
  FileCheck,
  AlertCircle,
  Download,
  X,
  Eye,
  Sliders
} from "lucide-react";
import confetti from "canvas-confetti";

export const FacultyPortalPage: React.FC = () => {
  const {
    problems,
    teams,
    proposals,
    milestones,
    createProposal,
    approveMilestoneFaculty,
    studentDeliverables,
    reviewStudentDeliverable,
    assignStudentTask,
    currentUser
  } = useApp();
  const [activeTab, setActiveTab] = useState("challenges");
  const [selectedProbForTeam, setSelectedProbForTeam] = useState<any>(null);

  // Dynamic institution resolution
  const eco = getEcosystemByUserId(currentUser?.id, currentUser?.organizationName);

  const assignedProblems = problems.filter(
    (p) =>
      p.assignedUniversityId === eco.id ||
      p.assignedFacultyId === eco.faculty.id ||
      p.assignedFacultyName?.toLowerCase().includes(eco.faculty.fullName.toLowerCase()) ||
      (p.district === eco.district && p.status !== "pending_nodal_review" && p.status !== "routed")
  );

  const univTeams = teams.filter(
    (t) => t.universityId === eco.id || t.facultyMentorId === eco.faculty.id || t.facultyMentorName === eco.faculty.fullName
  );

  // Proposal drafting state
  const [selectedProblemId, setSelectedProblemId] = useState(assignedProblems[0]?.id || "");
  const [propTitle, setPropTitle] = useState("Automated Sensor & IoT Telemetry System");
  const [propSummary, setPropSummary] = useState("Decentralized technology intervention addressing community challenge with robust field telemetry and sustainable rural deployment.");
  const [propApproach, setPropApproach] = useState("Hardware prototype fabrication + low-power sensor mesh + automated cloud telemetry burst to JSICP gateway.");
  const [propOutcome, setPropOutcome] = useState("Direct community empowerment, measurable environmental/health impact, and zero maintenance downtime.");
  const [propBudget, setPropBudget] = useState(320000);
  const [propDuration, setPropDuration] = useState(5);
  const [needsIndustrySupport, setNeedsIndustrySupport] = useState(true);
  const [lastSubmittedProposalId, setLastSubmittedProposalId] = useState<string | null>(null);

  // Student Deliverables Review Desk state
  const [deliverableFilter, setDeliverableFilter] = useState<string>("all");
  const [feedbackNotes, setFeedbackNotes] = useState<Record<string, string>>({});
  const [inspectingDoc, setInspectingDoc] = useState<any>(null);

  // Faculty task assignment state
  const [showAssignTask, setShowAssignTask] = useState<boolean>(false);
  const [assignMilestoneId, setAssignMilestoneId] = useState<string>(milestones[0]?.id || "");
  const [assignTitle, setAssignTitle] = useState<string>("");
  const [assignDesc, setAssignDesc] = useState<string>("");
  const [assignStudentId, setAssignStudentId] = useState<string>(eco.students[0]?.id || "student-rahul");

  React.useEffect(() => {
    if (eco.students[0]) {
      setAssignStudentId(eco.students[0].id);
    }
  }, [eco.id]);

  const univDeliverables = studentDeliverables.filter((d) => {
    const isOurStudent = eco.students.some((s) => s.id === d.assignedStudentId);
    const isOurProposal = proposals.some(
      (pr) =>
        pr.id === d.proposalId &&
        (pr.universityName?.toLowerCase().includes(eco.shortName.toLowerCase()) ||
          pr.facultyMentorName === eco.faculty.fullName)
    );
    return isOurStudent || isOurProposal || studentDeliverables.length <= 4;
  });

  const pendingDeliverables = univDeliverables.filter(
    (d) => d.status === "in_review_by_faculty"
  );
  const pendingMilestones = milestones.filter((m) => !m.facultyApproved);

  const navItems: NavItem[] = [
    { id: "challenges", label: "Assigned Challenges", icon: FileText, badge: assignedProblems.length },
    { id: "team_builder", label: "Multidisciplinary Teams", icon: Users, badge: teams.length },
    { id: "proposal", label: "Draft Research Proposal", icon: FileText },
    {
      id: "student_deliverables",
      label: "Student Deliverables Review",
      icon: CheckSquare,
      badge: pendingDeliverables.length
    },
    { id: "milestone_gate", label: "Milestone Faculty Sign-off", icon: ShieldCheck, badge: pendingMilestones.length }
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
      teamId: univTeams[0]?.id || eco.defaultTeamId,
      problemId: targetProb?.id || eco.defaultProblemId,
      problemTitle: targetProb?.title || "Societal Challenge",
      problemCategory: targetProb?.category || "Water Resources & Sanitation",
      district: targetProb?.district || eco.district,
      universityName: eco.name,
      facultyMentorName: currentUser?.fullName || eco.faculty.fullName,
      title: propTitle,
      summary: propSummary,
      technicalApproach: propApproach,
      expectedOutcome: propOutcome,
      estimatedBudget: Number(propBudget),
      durationMonths: Number(propDuration),
      needsIndustrySupport,
      supportTypeNeeded: needsIndustrySupport ? ["funding", "prototyping", "tech_transfer"] : [],
      status: needsIndustrySupport ? "open_for_funding" : "approved"
    });

    setLastSubmittedProposalId(newProp.id);
    confetti({ particleCount: 80, spread: 70 });
  };

  const handleReviewDeliverable = (taskId: string, decision: "accept" | "reject") => {
    const feedback = feedbackNotes[taskId] || (decision === "accept"
      ? "Laboratory test observations verified against NABL standards. Hardware telemetry parameters compliant."
      : "Sensor calibration curves show drift at elevated temperature. Re-calibrate with thermal compensation.");

    reviewStudentDeliverable(
      taskId,
      decision,
      feedback,
      currentUser?.fullName || `${eco.faculty.fullName} (${eco.shortName})`
    );

    if (decision === "accept") {
      confetti({ particleCount: 75, spread: 60 });
    }
  };

  const handleAssignTaskByFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignTitle.trim()) return;

    const targetMilestone = milestones.find((m) => m.id === assignMilestoneId) || milestones[0];
    const targetStudent = eco.students.find((s) => s.id === assignStudentId) || eco.students[0];

    assignStudentTask({
      proposalId: targetMilestone?.proposalId || eco.defaultProposalId,
      proposalTitle: targetMilestone?.displayName || `${eco.shortName} Innovation Project`,
      milestoneId: targetMilestone.id,
      milestoneName: targetMilestone.displayName,
      title: assignTitle,
      description: assignDesc || `Task assigned directly by ${eco.faculty.fullName} for laboratory milestone verification.`,
      assignedStudentId: targetStudent.id,
      assignedStudentName: `${targetStudent.fullName} (${targetStudent.role})`,
      studentDiscipline: targetStudent.discipline,
      progressPercent: 0,
      status: "assigned"
    });

    setAssignTitle("");
    setAssignDesc("");
    setShowAssignTask(false);
    confetti({ particleCount: 50, spread: 50 });
  };

  const filteredDeliverables = univDeliverables.filter((d) => {
    if (deliverableFilter === "pending") return d.status === "in_review_by_faculty";
    if (deliverableFilter === "approved") return d.status === "approved_by_faculty";
    if (deliverableFilter === "revisions") return d.status === "revision_requested";
    return true;
  });

  return (
    <PortalLayout
      portalTitle="Faculty Mentor Workspace"
      portalSubtitle={`प्राध्यापक परामर्शदाता एवं शोध पटल — ${eco.name} (${eco.shortName})`}
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

              <div className="max-w-xl mx-auto bg-slate-50 border border-slate-200 rounded p-4 text-xs text-left space-y-2">
                <div className="flex items-center justify-between pb-1 border-b border-slate-200">
                  <span className="text-slate-500">Routing Pathway:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      needsIndustrySupport
                        ? "bg-amber-100 text-amber-900 border border-amber-300"
                        : "bg-emerald-100 text-emerald-900 border border-emerald-300"
                    }`}
                  >
                    {needsIndustrySupport ? "Path A: Industry / CSR Marketplace" : "Path B: Direct Academic Research"}
                  </span>
                </div>

                <p className="text-slate-700 leading-relaxed">
                  {needsIndustrySupport ? (
                    <>
                      <strong>Industry Co-Funding Track:</strong> Proposal is listed on the{" "}
                      <strong>Open Innovation Marketplace</strong> for corporate sponsors (e.g. Tata Steel CSR). Once the
                      bilateral MoU is digitally e-signed, sprint execution will unlock in the student workspace.
                    </>
                  ) : (
                    <>
                      <strong>Direct Academic Track:</strong> Proposal has bypassed industry marketplace and{" "}
                      <strong>unlocked immediately in the Student Innovator Workspace</strong>. Initial sprint deliverables
                      have been assigned to the student roster!
                    </>
                  )}
                </p>
              </div>

              <div className="flex justify-center items-center space-x-3 pt-2">
                <button
                  onClick={() => {
                    setLastSubmittedProposalId(null);
                    setActiveTab("challenges");
                  }}
                  className="px-4 py-2 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  &larr; Back to Challenges
                </button>

                <button
                  onClick={() => {
                    setLastSubmittedProposalId(null);
                    setActiveTab("student_deliverables");
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold flex items-center space-x-1"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Open Student Deliverables Desk &rarr;</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProposalSubmit} className="p-6 space-y-5 text-xs">
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
                  <label className="block font-semibold text-slate-800 mb-1">Estimated R&D Budget (INR ₹)</label>
                  <input
                    type="number"
                    required
                    value={propBudget}
                    onChange={(e) => setPropBudget(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded font-mono font-bold text-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Project Duration (Months)</label>
                  <input
                    type="number"
                    required
                    value={propDuration}
                    onChange={(e) => setPropDuration(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              {/* DUAL PATHWAY SELECTOR CARDS */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-900">
                  Funding & Execution Pathway / वित्तपोषण एवं निष्पादन मार्ग <span className="text-rose-600">*</span>
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Path A */}
                  <div
                    onClick={() => setNeedsIndustrySupport(true)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition ${
                      needsIndustrySupport
                        ? "border-[#0f2942] bg-blue-50/70 ring-2 ring-[#0f2942]"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-900 block text-xs flex items-center space-x-1.5">
                          <Building className="w-4 h-4 text-amber-700" />
                          <span>Path A: Request Industry / CSR Co-Funding</span>
                        </span>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Listed on <strong>Open Innovation Marketplace</strong> for Tata Steel CSR / Coal India. Unlocks
                          in Student Workspace <strong>only after MoU digital e-signing</strong>.
                        </p>
                      </div>
                      <input
                        type="radio"
                        checked={needsIndustrySupport}
                        onChange={() => setNeedsIndustrySupport(true)}
                        className="w-4 h-4 text-[#0f2942] mt-0.5"
                      />
                    </div>
                  </div>

                  {/* Path B */}
                  <div
                    onClick={() => setNeedsIndustrySupport(false)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition ${
                      !needsIndustrySupport
                        ? "border-[#0f2942] bg-emerald-50/70 ring-2 ring-[#0f2942]"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-900 block text-xs flex items-center space-x-1.5">
                          <GraduationCap className="w-4 h-4 text-emerald-700" />
                          <span>Path B: Direct Academic Research (Self-Funded)</span>
                        </span>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Bypasses Industry Marketplace entirely. Directly approved and{" "}
                          <strong>unlocks immediately in Student Workspace</strong> with active sprint tasks.
                        </p>
                      </div>
                      <input
                        type="radio"
                        checked={!needsIndustrySupport}
                        onChange={() => setNeedsIndustrySupport(false)}
                        className="w-4 h-4 text-[#0f2942] mt-0.5"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0f2942] hover:bg-[#163b5f] text-white rounded font-semibold flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Proposal & Dispatch to Workflow &rarr;</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* 4. Student Deliverables Review Desk (NEW) */}
      {activeTab === "student_deliverables" && (
        <div className="space-y-4">
          <div className="bg-blue-50/70 border border-blue-200 p-3.5 rounded-lg flex items-start space-x-3 text-xs">
            <Info className="w-4 h-4 text-[#0f2942] shrink-0 mt-0.5" />
            <div className="text-slate-700 leading-relaxed">
              <span className="font-bold text-[#0f2942]">Academic Verification & E-Signature Desk:</span> Inspect student
              laboratory test reports, firmware telemetry logs, and CAD schematics submitted by the student cohort. You can{" "}
              <strong>[Accept & Apply Academic E-Sign]</strong> (which forwards the verified milestone to District Officer
              for Dual Sign-off) or <strong>[Request Revisions]</strong> back to the student.
            </div>
          </div>

          {/* Subheader with filters and Assign Task Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-slate-200">
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="font-semibold text-slate-600 mr-1">Filter:</span>
              <button
                onClick={() => setDeliverableFilter("all")}
                className={`px-2.5 py-1 rounded font-semibold ${
                  deliverableFilter === "all" ? "bg-[#0f2942] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                All ({studentDeliverables.length})
              </button>
              <button
                onClick={() => setDeliverableFilter("pending")}
                className={`px-2.5 py-1 rounded font-semibold ${
                  deliverableFilter === "pending"
                    ? "bg-amber-600 text-white"
                    : "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"
                }`}
              >
                Pending Review ({pendingDeliverables.length})
              </button>
              <button
                onClick={() => setDeliverableFilter("approved")}
                className={`px-2.5 py-1 rounded font-semibold ${
                  deliverableFilter === "approved"
                    ? "bg-emerald-700 text-white"
                    : "bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100"
                }`}
              >
                E-Signed & Approved ({studentDeliverables.filter((d) => d.status === "approved_by_faculty").length})
              </button>
              <button
                onClick={() => setDeliverableFilter("revisions")}
                className={`px-2.5 py-1 rounded font-semibold ${
                  deliverableFilter === "revisions"
                    ? "bg-rose-700 text-white"
                    : "bg-rose-50 text-rose-900 border border-rose-200 hover:bg-rose-100"
                }`}
              >
                Revisions ({studentDeliverables.filter((d) => d.status === "revision_requested").length})
              </button>
            </div>

            <button
              onClick={() => setShowAssignTask(!showAssignTask)}
              className="px-3 py-1.5 bg-[#0f2942] hover:bg-[#163b5f] text-white text-xs font-semibold rounded flex items-center space-x-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Assign Deliverable to Student</span>
            </button>
          </div>

          {/* Quick Task Assignment Form */}
          {showAssignTask && (
            <div className="bg-slate-50 border border-slate-300 rounded-lg p-4 space-y-3 text-xs animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h4 className="font-bold text-slate-900">
                  Assign Milestone Deliverable to Student Cohort Member
                </h4>
                <button
                  onClick={() => setShowAssignTask(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAssignTaskByFaculty} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Milestone</label>
                  <select
                    value={assignMilestoneId}
                    onChange={(e) => setAssignMilestoneId(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded bg-white text-slate-800"
                  >
                    {milestones.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.displayName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assign To Student Innovator</label>
                  <select
                    value={assignStudentId}
                    onChange={(e) => setAssignStudentId(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded bg-white text-slate-800 font-semibold"
                  >
                    {eco.students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.fullName} ({s.role} - {s.discipline})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Task Deliverable Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Conduct NABL Spectrophotometric Fluoride Re-Test & Attach Sheet"
                    value={assignTitle}
                    onChange={(e) => setAssignTitle(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Technical Instructions / Scope</label>
                  <textarea
                    rows={2}
                    placeholder="Specify testing parameters, expected tolerance, and required PDF format..."
                    value={assignDesc}
                    onChange={(e) => setAssignDesc(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded bg-white"
                  />
                </div>

                <div className="sm:col-span-2 flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAssignTask(false)}
                    className="px-3 py-1.5 border border-slate-300 rounded font-semibold text-slate-600 hover:bg-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#0f2942] hover:bg-[#163b5f] text-white font-semibold rounded"
                  >
                    Dispatch Task to Student Workspace &rarr;
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Deliverables List */}
          <div className="space-y-4">
            {filteredDeliverables.length === 0 ? (
              <div className="bg-white p-8 rounded-lg border border-slate-200 text-center text-slate-500 text-xs">
                No deliverables found matching the selected filter.
              </div>
            ) : (
              filteredDeliverables.map((task) => {
                const isUnderReview = task.status === "in_review_by_faculty";
                const isApproved = task.status === "approved_by_faculty";
                const isRevision = task.status === "revision_requested";

                return (
                  <div
                    key={task.id}
                    className={`bg-white p-5 rounded-lg border shadow-xs space-y-3 text-xs transition ${
                      isApproved
                        ? "border-emerald-300 bg-emerald-50/10"
                        : isUnderReview
                        ? "border-amber-300 bg-amber-50/15"
                        : isRevision
                        ? "border-rose-300 bg-rose-50/10"
                        : "border-slate-200"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                      <div>
                        <span className="font-mono text-slate-500 text-[11px] block">
                          Milestone: {task.milestoneName}
                        </span>
                        <h4 className="font-heading font-bold text-sm text-slate-900 mt-0.5">{task.title}</h4>
                      </div>

                      <div>
                        {isApproved && (
                          <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2.5 py-1 rounded text-[11px] flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>ACADEMIC E-SIGN APPLIED</span>
                          </span>
                        )}
                        {isUnderReview && (
                          <span className="bg-amber-100 text-amber-950 border border-amber-300 font-bold px-2.5 py-1 rounded text-[11px] animate-pulse">
                            ⏳ ACTION REQUIRED: PENDING FACULTY E-SIGN
                          </span>
                        )}
                        {isRevision && (
                          <span className="bg-rose-100 text-rose-900 border border-rose-300 font-bold px-2.5 py-1 rounded text-[11px]">
                            ⚠️ REVISIONS REQUESTED
                          </span>
                        )}
                        {!isApproved && !isUnderReview && !isRevision && (
                          <span className="bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded text-[11px]">
                            IN LAB PROGRESS ({task.progressPercent}%)
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-600 leading-relaxed">{task.description}</p>

                    {/* Progress Bar & Submitter */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded border border-slate-200 text-[11px]">
                      <div>
                        <span className="text-slate-500 block">Assigned Student Innovator:</span>
                        <span className="font-bold text-slate-900">{task.assignedStudentName}</span>
                        <span className="text-slate-500 block text-[10px]">{task.studentDiscipline}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between font-semibold text-slate-700">
                          <span>Reported Progress:</span>
                          <span className="font-mono">{task.progressPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              task.progressPercent >= 100 ? "bg-emerald-600" : "bg-blue-600"
                            }`}
                            style={{ width: `${task.progressPercent}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Attached PDF & Student Notes */}
                    <div className="bg-white p-3 rounded border border-slate-200 space-y-2 text-[11px]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-blue-700" />
                          <span className="font-mono text-slate-800 font-semibold">
                            {task.pdfUrl?.replace("/vault/", "") || "laboratory_telemetry_test_report.pdf"}
                          </span>
                          <span className="text-slate-400">(2.8 MB)</span>
                        </div>

                        <button
                          onClick={() =>
                            setInspectingDoc({
                              title: task.title,
                              pdfName: task.pdfUrl?.replace("/vault/", "") || "laboratory_telemetry_test_report.pdf",
                              student: task.assignedStudentName,
                              milestone: task.milestoneName,
                              notes: task.submissionNotes
                            })
                          }
                          className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-300 hover:bg-blue-100 rounded font-semibold flex items-center space-x-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-700" />
                          <span>Inspect Report / PDF &rarr;</span>
                        </button>
                      </div>

                      {task.submissionNotes && (
                        <p className="text-slate-600 italic bg-slate-50 p-2 rounded border border-slate-100">
                          <strong>Student Observation:</strong> "{task.submissionNotes}"
                        </p>
                      )}
                    </div>

                    {/* Verification Actions or Existing Stamps */}
                    {isApproved ? (
                      <div className="bg-emerald-50/80 border border-emerald-300 p-3 rounded text-[11px] text-emerald-950 space-y-1">
                        <div className="flex items-center space-x-1.5 font-bold text-emerald-900">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                          <span>ACADEMIC E-SIGNATURE VERIFIED</span>
                        </div>
                        <p className="text-emerald-900">
                          Digitally stamped by: <strong>{task.facultySignedBy || "Prof. Ananya Sen"}</strong> on{" "}
                          {new Date(task.facultySignedAt || "").toLocaleDateString()}
                        </p>
                        <p className="text-emerald-800 italic">Faculty Feedback: "{task.facultyFeedback}"</p>
                        <span className="block text-[10px] text-emerald-700 font-medium pt-1 border-t border-emerald-200">
                          ✓ Milestone dual-sign-off status updated. Forwarded to Government District Officer (Dr. Shailesh Kumar, IAS) for fund release.
                        </span>
                      </div>
                    ) : (
                      <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-3">
                        <div>
                          <label className="block font-semibold text-slate-800 mb-1">
                            Academic Verification Notes & Laboratory Feedback:
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Enter your formal observations regarding test parameters, calibration data, and safety tolerances..."
                            value={feedbackNotes[task.id] || ""}
                            onChange={(e) =>
                              setFeedbackNotes((prev) => ({ ...prev, [task.id]: e.target.value }))
                            }
                            className="w-full p-2 border border-slate-300 rounded bg-white text-xs focus:border-[#0f2942] focus:outline-none"
                          />
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-200">
                          <span className="text-[11px] text-slate-600">
                            Academic Signatory: <strong>{currentUser?.fullName || eco.faculty.fullName}</strong> ({eco.shortName})
                          </span>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleReviewDeliverable(task.id, "reject")}
                              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 font-semibold rounded text-xs"
                            >
                              ✕ Request Revisions
                            </button>

                            <button
                              onClick={() => handleReviewDeliverable(task.id, "accept")}
                              className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded text-xs flex items-center space-x-1.5 shadow-xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>✓ Accept & Apply Academic E-Sign</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* 5. Milestone Faculty Sign-off Gate */}
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
                      onClick={() =>
                        setInspectingDoc({
                          title: m.displayName,
                          pdfName: "Lab_Telemetry_and_Calibration_Logs.pdf",
                          student: "Team JalRakshak Cohort",
                          milestone: m.displayName,
                          notes: "Bench assembly telemetry and flow-rate sensor verification data."
                        })
                      }
                      className="text-blue-700 hover:text-blue-900 font-semibold"
                    >
                      Download & Verify &rarr;
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-slate-500 text-[11px]">
                      Academic Mentor: <strong>{currentUser?.fullName || eco.faculty.fullName}</strong>
                    </span>

                    {!isFacultyApproved ? (
                      <button
                        onClick={() => {
                          approveMilestoneFaculty(m.id, currentUser?.fullName || eco.faculty.fullName);
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

      {/* Team Builder Modal */}
      <TeamBuilderModal
        problem={selectedProbForTeam}
        onClose={() => setSelectedProbForTeam(null)}
      />

      {/* Laboratory PDF Document Inspection Modal */}
      {inspectingDoc && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-2xl overflow-hidden animate-in fade-in">
            {/* Modal Header */}
            <div className="bg-[#0f2942] text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="font-heading font-bold text-sm">
                    Academic Deliverable Document Inspection
                  </h4>
                  <p className="text-[10px] text-slate-300 font-mono">
                    SHA-256 Hash: 0x7f4c9a8b12e3d4c5b6a7... (Tamper-Proof)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectingDoc(null)}
                className="text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Body */}
            <div className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="border-b border-slate-200 pb-3 flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                    {eco.name} — Central Innovation & Research Laboratory
                  </span>
                  <h3 className="font-heading font-bold text-base text-slate-900 mt-0.5">
                    {inspectingDoc.title}
                  </h3>
                  <p className="text-slate-600 text-xs mt-1">
                    Submitted by: <strong>{inspectingDoc.student}</strong> • Target:{" "}
                    <strong>{inspectingDoc.milestone}</strong>
                  </p>
                </div>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold px-2 py-0.5 rounded text-[10px]">
                  NABL CALIBRATED
                </span>
              </div>

              {/* Simulated Telemetry / Sensor Report */}
              <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-3">
                <span className="font-bold text-slate-800 block text-xs">
                  Telemetry & Bench Trial Readings:
                </span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Sensor Precision</span>
                    <span className="font-mono font-bold text-emerald-800 text-sm">± 1.2 mm</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Sampling Frequency</span>
                    <span className="font-mono font-bold text-blue-800 text-sm">10 Hz</span>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">Operating Temp</span>
                    <span className="font-mono font-bold text-amber-800 text-sm">18°C — 44°C</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 block text-[11px]">Laboratory Notes:</span>
                  <p className="text-slate-600 italic leading-relaxed">
                    "{inspectingDoc.notes || "Continuous 72-hour benchmark testing conducted in Hydraulic Simulation Chamber. Zero sensor packet loss over LoRaWAN link."}"
                  </p>
                </div>
              </div>

              {/* Verification Stamp Box */}
              <div className="p-3 bg-blue-50/60 rounded border border-blue-200 text-slate-700 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#0f2942] block">National Informatics Centre (NIC) Vault Stamp</span>
                  <span className="text-[10px] text-slate-500">
                    Authenticated against DigiLocker Academic Bank of Credits (ABC)
                  </span>
                </div>
                <button
                  onClick={() => alert(`Downloading ${inspectingDoc.pdfName} from Document Vault...`)}
                  className="px-3 py-1.5 bg-[#0f2942] text-white font-semibold rounded text-xs flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setInspectingDoc(null)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 font-semibold rounded text-xs text-slate-700"
              >
                Close Inspection Window
              </button>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
};
