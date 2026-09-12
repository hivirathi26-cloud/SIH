import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PortalLayout } from "../../components/layout/PortalLayout";
import { useApp } from "../../context/AppContext";
import { KanbanBoard } from "../../components/hei/KanbanBoard";
import { getEcosystemByUserId } from "../../data/universityEcosystems";
import { Users, Layers, Upload, FileText, Clock, CheckCircle2, Download, Briefcase, Info, Send, CheckSquare } from "lucide-react";
import confetti from "canvas-confetti";
export const StudentPortalPage = () => {
    const { proposals, agreements, milestones, studentDeliverables, submitStudentDeliverable, assignStudentTask, uploadMilestoneDocument, currentUser } = useApp();
    const [activeTab, setActiveTab] = useState("my_tasks");
    // Dynamic institution resolution
    const eco = getEcosystemByUserId(currentUser?.id, currentUser?.organizationName);
    // Progress submission modal / card state
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [progressInput, setProgressInput] = useState(100);
    const [notesInput, setNotesInput] = useState("");
    const [pdfFileName, setPdfFileName] = useState("");
    // Task Delegation state (for team lead or faculty)
    const [delTitle, setDelTitle] = useState("");
    const [delDesc, setDelDesc] = useState("");
    const [delStudentId, setDelStudentId] = useState(eco.students[1]?.id || eco.students[0]?.id || "student-priya");
    const [delMilestoneName, setDelMilestoneName] = useState("Milestone 2: Prototype Fabrication & Laboratory Bench Testing");
    const [delMilestoneId, setDelMilestoneId] = useState(milestones[0]?.id || "ms-001");
    React.useEffect(() => {
        if (eco.students[1]) {
            setDelStudentId(eco.students[1].id);
        }
        else if (eco.students[0]) {
            setDelStudentId(eco.students[0].id);
        }
    }, [eco.id]);
    // Document Vault state
    const [uploadDocTitle, setUploadDocTitle] = useState("");
    const [targetMilestoneId, setTargetMilestoneId] = useState(milestones[0]?.id || "ms-001");
    // Filter tasks assigned to current student or visible to team lead
    const isTeamLead = currentUser?.roleTitle?.toLowerCase().includes("lead") ||
        currentUser?.id === eco.students[0]?.id;
    const myTasks = studentDeliverables.filter((t) => {
        const isDirectlyAssigned = t.assignedStudentId === currentUser?.id;
        const isOurEcosystem = eco.students.some((s) => s.id === t.assignedStudentId);
        if (isTeamLead) {
            return isOurEcosystem || isDirectlyAssigned;
        }
        return isDirectlyAssigned || (!t.assignedStudentId && isOurEcosystem);
    });
    const univProposals = proposals.filter((pr) => pr.universityName?.toLowerCase().includes(eco.shortName.toLowerCase()) ||
        pr.universityName?.toLowerCase().includes(eco.name.toLowerCase()) ||
        pr.facultyMentorName === eco.faculty.fullName);
    const navItems = [
        { id: "my_tasks", label: "My Milestone Deliverables", icon: CheckSquare, badge: myTasks.length },
        { id: "projects", label: "Active Projects & MoUs", icon: Briefcase, badge: univProposals.length },
        { id: "team_sprint", label: "Team Sprint Kanban", icon: Layers },
        { id: "task_delegator", label: "Delegate Tasks to Team", icon: Users },
        { id: "vault", label: "Document Vault", icon: FileText }
    ];
    const handleStartSubmit = (task) => {
        setEditingTaskId(task.id);
        setProgressInput(task.progressPercent || 100);
        setNotesInput(task.submissionNotes || "");
        setPdfFileName(`${task.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}_test_report.pdf`);
    };
    const handleConfirmSubmit = (e) => {
        e.preventDefault();
        if (!editingTaskId)
            return;
        submitStudentDeliverable(editingTaskId, Number(progressInput), notesInput, `/vault/${pdfFileName}`);
        setEditingTaskId(null);
        confetti({ particleCount: 70, spread: 60 });
    };
    const handleDelegateTask = (e) => {
        e.preventDefault();
        if (!delTitle.trim() || !delMilestoneName.trim())
            return;
        const targetMilestone = milestones.find((m) => m.id === delMilestoneId) || milestones[0];
        const targetStudent = eco.students.find((s) => s.id === delStudentId) || eco.students[0];
        const finalMilestoneName = delMilestoneName.trim();
        assignStudentTask({
            proposalId: targetMilestone?.proposalId || eco.defaultProposalId,
            proposalTitle: targetMilestone?.displayName || `${eco.shortName} Innovation Project`,
            milestoneId: targetMilestone?.id || `ms-${Date.now()}`,
            milestoneName: finalMilestoneName,
            title: delTitle,
            description: delDesc || `Deliverable assigned as part of ${eco.shortName} student innovation cohort.`,
            assignedStudentId: targetStudent.id,
            assignedStudentName: `${targetStudent.fullName} (${targetStudent.role})`,
            studentDiscipline: targetStudent.discipline,
            progressPercent: 0,
            status: "assigned"
        });
        setDelTitle("");
        setDelDesc("");
        setDelMilestoneName("Milestone 2: Prototype Fabrication & Laboratory Bench Testing");
        confetti({ particleCount: 50, spread: 50 });
        setActiveTab("my_tasks");
    };
    const handleUploadDoc = (e) => {
        e.preventDefault();
        if (!uploadDocTitle.trim())
            return;
        uploadMilestoneDocument(targetMilestoneId, {
            milestoneId: targetMilestoneId,
            title: uploadDocTitle,
            docType: "test_data",
            storageUrl: `/vault/${uploadDocTitle.toLowerCase().replace(/ /g, "_")}.pdf`,
            fileSize: "2.8 MB",
            uploadedBy: currentUser?.id || "student-rahul",
            uploadedByName: currentUser?.fullName || "Student Innovator"
        });
        setUploadDocTitle("");
        confetti({ particleCount: 50, spread: 50 });
    };
    return (<PortalLayout portalTitle="Student Innovator Workspace" portalSubtitle={`छात्र नवाचार एवं स्प्रिंट पटल — ${currentUser?.fullName || "Student Innovator"} • ${eco.shortName}`} navItems={navItems} activeTab={activeTab} setActiveTab={setActiveTab}>
      {/* 1. My Milestone Deliverables (Individual Student Progress & PDF Upload) */}
      {activeTab === "my_tasks" && (<div className="space-y-4">
          <div className="bg-blue-50/70 border border-blue-200 p-3.5 rounded-lg flex items-start space-x-3 text-xs">
            <Info className="w-4 h-4 text-[#0f2942] shrink-0 mt-0.5"/>
            <div className="text-slate-700 leading-relaxed">
              <strong>Your Personal Innovation Roster:</strong> As an individual team member, report your milestone progress %, attach laboratory test sheets or CAD PDFs, and submit for <strong>Faculty Mentor (${eco.faculty.fullName}) inspection & E-Signature</strong>.
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-sm text-slate-900">
                Milestone Deliverables Assigned to You ({myTasks.length})
              </h3>
              <p className="text-xs text-slate-500">
                Logged in as: <strong>{currentUser?.fullName}</strong> ({currentUser?.roleTitle})
              </p>
            </div>
          </div>

          {/* Submission Modal / Card */}
          {editingTaskId && (<div className="bg-white p-5 rounded-lg border-2 border-[#0f2942] shadow-md space-y-4 animate-in fade-in text-xs">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                  <Upload className="w-4 h-4 text-[#0f2942]"/>
                  <span>Submit Deliverable Report & Progress</span>
                </span>
                <button onClick={() => setEditingTaskId(null)} className="text-slate-400 hover:text-slate-700 font-bold">
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleConfirmSubmit} className="space-y-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Progress Completed: <strong className="text-emerald-700">{progressInput}%</strong>
                  </label>
                  <input type="range" min={10} max={100} step={5} value={progressInput} onChange={(e) => setProgressInput(Number(e.target.value))} className="w-full accent-[#0f2942] cursor-pointer"/>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>25% Prototype</span>
                    <span>50% Bench Tested</span>
                    <span>75% Field Trial</span>
                    <span>100% Ready for Faculty Stamp</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Attach Lab Telemetry / Test Report (PDF)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input type="text" required value={pdfFileName} onChange={(e) => setPdfFileName(e.target.value)} placeholder="e.g. nabl_certified_water_fluoride_titration_sheet.pdf" className="flex-1 p-2 border border-slate-300 rounded font-mono text-xs focus:border-[#0f2942]"/>
                    <span className="text-[11px] text-slate-500 font-mono">.PDF</span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Laboratory Observations & Test Notes for Faculty Mentor
                  </label>
                  <textarea rows={3} required value={notesInput} onChange={(e) => setNotesInput(e.target.value)} placeholder="Describe laboratory readings, tolerance thresholds, sensor accuracy, or field site observations..." className="w-full p-2 border border-slate-300 rounded text-xs focus:border-[#0f2942]"/>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-end space-x-2">
                  <button type="button" onClick={() => setEditingTaskId(null)} className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 font-semibold">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-1.5 bg-[#0f2942] hover:bg-[#163b5f] text-white font-semibold rounded flex items-center space-x-1.5 shadow-xs">
                    <Send className="w-3.5 h-3.5"/>
                    <span>Submit to Faculty for E-Sign &rarr;</span>
                  </button>
                </div>
              </form>
            </div>)}

          {/* List of Tasks */}
          <div className="space-y-3">
            {myTasks.map((t) => (<div key={t.id} className={`bg-white p-5 rounded-lg border shadow-xs space-y-3 text-xs transition ${t.status === "approved_by_faculty"
                    ? "border-emerald-300 bg-emerald-50/15"
                    : t.status === "in_review_by_faculty"
                        ? "border-blue-300 bg-blue-50/15"
                        : "border-slate-200"}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      {t.milestoneName} • {t.proposalTitle}
                    </span>
                    <h4 className="font-heading font-bold text-sm text-slate-900 mt-0.5">{t.title}</h4>
                  </div>

                  <div>
                    {t.status === "approved_by_faculty" && (<span className="bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold px-2.5 py-1 rounded text-[11px] flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700"/>
                        <span>FACULTY E-SIGNED & APPROVED</span>
                      </span>)}
                    {t.status === "in_review_by_faculty" && (<span className="bg-blue-100 text-blue-900 border border-blue-300 font-bold px-2.5 py-1 rounded text-[11px] flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-blue-700"/>
                        <span>IN REVIEW BY {eco.faculty.fullName.toUpperCase()}</span>
                      </span>)}
                    {t.status === "in_progress" && (<span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2.5 py-1 rounded text-[11px]">
                        IN PROGRESS ({t.progressPercent}%)
                      </span>)}
                    {t.status === "revision_requested" && (<span className="bg-rose-100 text-rose-900 border border-rose-300 font-bold px-2.5 py-1 rounded text-[11px]">
                        ⚠️ REVISIONS REQUESTED
                      </span>)}
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed">{t.description}</p>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-600">
                    <span>Task Progress</span>
                    <span className="font-mono">{t.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-500 ${t.progressPercent >= 100 ? "bg-emerald-600" : "bg-blue-600"}`} style={{ width: `${t.progressPercent}%` }}></div>
                  </div>
                </div>

                {/* Attached PDF & Notes if submitted */}
                {t.pdfUrl && (<div className="bg-slate-50 p-2.5 rounded border border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="font-mono text-slate-700 truncate max-w-sm">
                      Attached: <strong>{t.pdfUrl.replace("/vault/", "")}</strong>
                    </span>
                    <button onClick={() => alert(`Opening ${t.pdfUrl}...`)} className="text-blue-700 hover:text-blue-900 font-semibold flex items-center space-x-1">
                      <Download className="w-3 h-3"/>
                      <span>View PDF</span>
                    </button>
                  </div>)}

                {t.submissionNotes && (<p className="text-[11px] text-slate-600 italic bg-white p-2 rounded border border-slate-100">
                    Student Notes: "{t.submissionNotes}"
                  </p>)}

                {/* Faculty Feedback if approved or rejected */}
                {t.facultyFeedback && (<div className="bg-emerald-50/70 border border-emerald-300 p-2.5 rounded text-[11px] text-emerald-950">
                    <strong>Faculty Feedback:</strong> {t.facultyFeedback}
                    {t.facultySignedBy && (<span className="block text-[10px] text-emerald-800 mt-0.5">
                        Digitally E-Signed by: {t.facultySignedBy} on {new Date(t.facultySignedAt || "").toLocaleDateString()}
                      </span>)}
                  </div>)}

                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500">
                    Assigned to: <strong>{t.assignedStudentName}</strong> ({t.studentDiscipline})
                  </span>

                  {t.status !== "approved_by_faculty" && (<button onClick={() => handleStartSubmit(t)} className="px-3.5 py-1.5 bg-[#0f2942] hover:bg-[#163b5f] text-white font-semibold rounded flex items-center space-x-1 shadow-xs">
                      <Upload className="w-3.5 h-3.5"/>
                      <span>Update Progress & Attach Report &rarr;</span>
                    </button>)}
                </div>
              </div>))}
          </div>
        </div>)}

      {/* 2. Active Projects & Funded MoUs */}
      {activeTab === "projects" && (<div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Active Research Projects & Innovation MoUs — {eco.shortName} ({univProposals.length})
            </h3>
          </div>

          <div className="space-y-4">
            {univProposals.map((pr) => {
                const linkedAgr = agreements.find((a) => a.proposalId === pr.id || a.proposalTitle.toLowerCase() === pr.title.toLowerCase());
                const isFunded = pr.status === "funded" || !!linkedAgr;
                return (<div key={pr.id} className={`bg-white p-5 rounded-lg border shadow-xs space-y-3 transition ${isFunded ? "border-emerald-300 bg-emerald-50/10" : "border-slate-200"}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-[#0f2942] bg-slate-100 px-2 py-0.5 rounded">
                        {pr.problemCategory}
                      </span>
                      <span className="text-slate-500 font-mono">Duration: {pr.durationMonths} Months</span>

                      {isFunded ? (<span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700"/>
                          <span>MOU EXECUTED & CSR CO-FUNDED</span>
                        </span>) : !pr.needsIndustrySupport ? (<span className="bg-blue-50 text-blue-900 border border-blue-300 text-[10px] font-bold px-2 py-0.5 rounded">
                          DIRECT ACADEMIC RESEARCH (ACTIVE)
                        </span>) : (<span className="bg-amber-50 text-amber-950 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-amber-700"/>
                          <span>AWAITING INDUSTRY MOU & CSR GRANT (LOCKED)</span>
                        </span>)}
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-800 text-sm block">
                        ₹{(pr.estimatedBudget).toLocaleString("en-IN")}
                      </span>
                      {isFunded ? (<span className="text-[10px] text-slate-500 font-medium block">
                          Partner: {linkedAgr?.industryPartnerName || "Tata Steel CSR Foundation"}
                        </span>) : pr.needsIndustrySupport ? (<span className="text-[10px] text-amber-700 font-semibold block">
                          Listed on Open Innovation Marketplace
                        </span>) : (<span className="text-[10px] text-blue-700 font-semibold block">
                          Internal Institute Grant
                        </span>)}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-heading font-bold text-base text-slate-900">{pr.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Target Problem: <strong>{pr.problemTitle}</strong> • District: {pr.district} • Faculty Mentor: <strong>{pr.facultyMentorName}</strong>
                    </p>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{pr.summary}</p>
                  </div>

                  {pr.needsIndustrySupport && !isFunded && (<div className="bg-amber-50/70 border border-amber-200 p-2.5 rounded text-[11px] text-amber-950 flex items-center justify-between">
                      <span>
                        🔒 <strong>Awaiting MoU Digital Execution:</strong> This project is currently seeking industry co-funding on the Marketplace. Once an MoU is e-signed by Tata Steel / Coal India, laboratory sprint fabrication will unlock.
                      </span>
                      <Link to="/portal/industry" className="text-[#0f2942] hover:underline font-bold shrink-0 ml-2">
                        Inspect Industry Marketplace &rarr;
                      </Link>
                    </div>)}

                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-1.5 text-[11px] text-slate-600">
                      <Users className="w-3.5 h-3.5 text-purple-700"/>
                      <span>Assigned Cohort: <strong>Team JalRakshak (Rahul, Priya, Sneha, Amit)</strong></span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button onClick={() => setActiveTab("my_tasks")} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold flex items-center space-x-1">
                        <CheckSquare className="w-3.5 h-3.5"/>
                        <span>My Deliverables</span>
                      </button>

                      <Link to={`/lifecycle/${pr.id}`} className={`px-3.5 py-1.5 rounded font-semibold flex items-center space-x-1 shadow-xs ${pr.needsIndustrySupport && !isFunded
                        ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                        : "bg-[#0f2942] hover:bg-[#163b5f] text-white"}`}>
                        <Clock className="w-3.5 h-3.5 text-amber-400"/>
                        <span>5-Stage Lifecycle & Gantt &rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>);
            })}
          </div>
        </div>)}

      {/* 3. Team Sprint Kanban Board */}
      {activeTab === "team_sprint" && (<div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <KanbanBoard teamId="all"/>
        </div>)}

      {/* 4. Delegate Milestone Tasks to Team Members */}
      {activeTab === "task_delegator" && (<div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-[#0f2942] text-white px-5 py-3 border-b border-[#163b5f]">
            <h3 className="font-heading font-bold text-sm">
              छात्र टीम कार्य वितरण (Milestone Task Delegation to Students)
            </h3>
            <p className="text-[11px] text-slate-300">
              Break down project milestones into specific hardware, software, chemical, and CAD tasks for individual team members.
            </p>
          </div>

          <form onSubmit={handleDelegateTask} className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Target Project Milestone / Phase <span className="text-rose-600">*</span>
                </label>
                <input 
                  type="text" 
                  required 
                  list="milestone-suggestions"
                  value={delMilestoneName} 
                  onChange={(e) => setDelMilestoneName(e.target.value)} 
                  placeholder="e.g. Milestone 2: Prototype Fabrication & LoRaWAN Node Assembly..." 
                  className="w-full p-2.5 border border-slate-300 rounded focus:border-[#0f2942] focus:outline-none text-xs font-medium bg-white"
                />
                <datalist id="milestone-suggestions">
                  {milestones.map((m) => (
                    <option key={m.id} value={m.displayName} />
                  ))}
                  <option value="Milestone 1: Research, Chemical Formulation & 3D CAD Design" />
                  <option value="Milestone 2: Prototype Fabrication & Laboratory Bench Testing" />
                  <option value="Milestone 3: Field Testing & Pilot Calibration in District" />
                  <option value="Milestone 4: Community Pilot Deployment & User Training" />
                  <option value="Milestone 5: Impact Assessment, Patent Filing & Startup Incubation" />
                </datalist>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assign to Student Innovator <span className="text-rose-600">*</span>
                </label>
                <select value={delStudentId} onChange={(e) => setDelStudentId(e.target.value)} className="w-full p-2.5 border border-slate-300 rounded bg-slate-50 focus:border-[#0f2942] text-xs font-medium">
                  {eco.students.map((s) => (<option key={s.id} value={s.id}>
                      {s.fullName} ({s.role} - {s.discipline})
                    </option>))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Specific Task Title <span className="text-rose-600">*</span>
              </label>
              <input type="text" required value={delTitle} onChange={(e) => setDelTitle(e.target.value)} placeholder="e.g. Calibrate optical fluoride sensor in Angara field trial station..." className="w-full p-2.5 border border-slate-300 rounded focus:border-[#0f2942]"/>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Deliverable Requirements</label>
              <textarea rows={3} value={delDesc} onChange={(e) => setDelDesc(e.target.value)} placeholder="Specify laboratory benchmarks, test conditions, or CAD output formats required..." className="w-full p-2 border border-slate-300 rounded focus:border-[#0f2942]"/>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-end">
              <button type="submit" className="px-5 py-2.5 bg-[#0f2942] hover:bg-[#163b5f] text-white font-semibold rounded shadow-xs flex items-center space-x-1.5">
                <Send className="w-3.5 h-3.5"/>
                <span>Assign Task to Student &rarr;</span>
              </button>
            </div>
          </form>
        </div>)}

      {/* 5. Document Vault */}
      {activeTab === "vault" && (<div className="space-y-4">
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
            <div>
              <h3 className="font-heading font-bold text-sm text-slate-900">
                Upload Laboratory Telemetry / Field Calibration Data
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Files uploaded here are instantly visible in the Faculty Mentor Gate and Government District Approval Gate.
              </p>
            </div>

            <form onSubmit={handleUploadDoc} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block font-semibold text-slate-700 mb-1">Target Milestone</label>
                  <select value={targetMilestoneId} onChange={(e) => setTargetMilestoneId(e.target.value)} className="w-full p-2 border border-slate-300 rounded bg-slate-50 focus:border-[#0f2942]">
                    {milestones.map((m) => (<option key={m.id} value={m.id}>
                        {m.displayName.slice(0, 45)}...
                      </option>))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Deliverable Title / File Name</label>
                  <div className="flex gap-2">
                    <input type="text" required value={uploadDocTitle} onChange={(e) => setUploadDocTitle(e.target.value)} placeholder="e.g. Field_Trial_Telemetry_Sensor_Calibration_Week2.pdf" className="flex-1 p-2 border border-slate-300 rounded focus:border-[#0f2942] focus:outline-none"/>
                    <button type="submit" className="px-4 py-2 bg-[#0f2942] hover:bg-[#163b5f] text-white rounded font-semibold flex items-center space-x-1.5 shrink-0 shadow-xs">
                      <Upload className="w-3.5 h-3.5"/>
                      <span>Upload & Certify</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 font-heading font-bold text-xs uppercase tracking-wider text-slate-800">
              Uploaded Test Sheets, Telemetry & CAD Files in Vault
            </div>

            <table className="gov-table">
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Uploaded By</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {milestones.flatMap((m) => m.documents).map((doc) => (<tr key={doc.id}>
                    <td className="font-semibold text-slate-900">{doc.title}</td>
                    <td className="uppercase text-slate-500 text-[10px] font-mono">{doc.docType}</td>
                    <td className="text-slate-500 font-mono text-[10px]">{doc.fileSize}</td>
                    <td>{doc.uploadedByName}</td>
                    <td>
                      <button onClick={() => alert(`Downloading ${doc.title}...`)} className="text-blue-700 hover:text-blue-900 font-semibold flex items-center space-x-1">
                        <Download className="w-3 h-3"/>
                        <span>Download</span>
                      </button>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>)}
    </PortalLayout>);
};
const PlusSquareIcon = ({ className }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
  </svg>);
