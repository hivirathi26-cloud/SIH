import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PortalLayout, NavItem } from "../../components/layout/PortalLayout";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { KanbanBoard } from "../../components/hei/KanbanBoard";
import { GanttChart } from "../../components/lifecycle/GanttChart";
import {
  Users,
  Layers,
  Upload,
  FileText,
  Clock,
  CheckCircle2,
  Download,
  Briefcase,
  Building,
  ShieldCheck,
  ArrowRight,
  Info
} from "lucide-react";
import confetti from "canvas-confetti";

export const StudentPortalPage: React.FC = () => {
  const { proposals, agreements, milestones, uploadMilestoneDocument, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState("projects");
  const [uploadTitle, setUploadTitle] = useState("");
  const [targetMilestoneId, setTargetMilestoneId] = useState(milestones[0]?.id || "ms-001");

  // All active proposals assigned to the student team
  const studentProposals = proposals;
  const fundedProposals = studentProposals.filter(
    (p) => p.status === "funded" || agreements.some((a) => a.proposalId === p.id || a.proposalTitle.toLowerCase() === p.title.toLowerCase())
  );

  const navItems: NavItem[] = [
    { id: "projects", label: "Active Projects & MoUs", icon: Briefcase, badge: studentProposals.length },
    { id: "sprint", label: "Sprint Kanban Board", icon: Layers },
    { id: "milestones", label: "Milestone Roadmap", icon: Clock },
    { id: "vault", label: "Document & Telemetry Vault", icon: FileText }
  ];

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    uploadMilestoneDocument(targetMilestoneId, {
      milestoneId: targetMilestoneId,
      title: uploadTitle,
      docType: "test_data",
      storageUrl: `/vault/${uploadTitle.toLowerCase().replace(/ /g, "_")}.pdf`,
      fileSize: "2.8 MB",
      uploadedBy: currentUser?.id || "student-rahul",
      uploadedByName: currentUser?.fullName || "Rahul Kumar"
    });

    setUploadTitle("");
    confetti({ particleCount: 50, spread: 50 });
  };

  return (
    <PortalLayout
      portalTitle="Student Innovator Workspace"
      portalSubtitle="छात्र नवाचार एवं स्प्रिंट पटल — Team JalRakshak, BIT Mesra"
      navItems={navItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {/* 1. Active Projects & Funded MoUs */}
      {activeTab === "projects" && (
        <div className="space-y-4">
          <div className="bg-blue-50/70 border border-blue-200 p-3.5 rounded-lg flex items-start space-x-3 text-xs">
            <Info className="w-4 h-4 text-[#0f2942] shrink-0 mt-0.5" />
            <div className="text-slate-700 leading-relaxed">
              <span className="font-bold text-[#0f2942]">Active Student R&D Portfolio:</span> When an industry partner (Tata Steel CSR / Startup) e-signs an MoU, the funded project immediately appears here in your active project workspace. You can formulate hardware schematics, log sprint tasks on the Kanban board, and upload telemetry to the Document Vault for Faculty & Govt dual sign-offs.
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Assigned Research Projects & Industry MoUs ({studentProposals.length})
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Team JalRakshak (Electronics + Chemical + CS + Rural Mgmt)
            </span>
          </div>

          <div className="space-y-4">
            {studentProposals.map((pr) => {
              const linkedAgr = agreements.find(
                (a) => a.proposalId === pr.id || a.proposalTitle.toLowerCase() === pr.title.toLowerCase()
              );
              const isFunded = pr.status === "funded" || !!linkedAgr;

              return (
                <div
                  key={pr.id}
                  className={`bg-white p-5 rounded-lg border shadow-xs space-y-3.5 transition ${
                    isFunded ? "border-emerald-300 bg-emerald-50/10" : "border-slate-200"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-[#0f2942] bg-slate-100 px-2 py-0.5 rounded">
                        {pr.problemCategory}
                      </span>
                      <span className="text-slate-500 font-mono">Duration: {pr.durationMonths} Months</span>

                      {isFunded ? (
                        <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                          <span>MOU EXECUTED & CSR FUNDED</span>
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-900 border border-amber-300 text-[10px] font-bold px-2 py-0.5 rounded">
                          PROPOSAL IN REVIEW
                        </span>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-emerald-800 text-sm block">
                        ₹{(pr.estimatedBudget).toLocaleString("en-IN")}
                      </span>
                      {isFunded && (
                        <span className="text-[10px] text-slate-500 font-medium block">
                          Partner: {linkedAgr?.industryPartnerName || "Tata Steel CSR Foundation"}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-heading font-bold text-base text-slate-900">{pr.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Target Problem: <strong>{pr.problemTitle}</strong> • District: {pr.district} • Faculty Mentor: <strong>{pr.facultyMentorName}</strong>
                    </p>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{pr.summary}</p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs space-y-1">
                    <span className="font-bold text-slate-700 block text-[11px]">Engineering Methodology:</span>
                    <p className="text-slate-600 text-[11px]">{pr.technicalApproach}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                    <div className="flex items-center space-x-1.5 text-[11px] text-slate-600">
                      <Users className="w-3.5 h-3.5 text-purple-700" />
                      <span>Assigned Cohort: <strong>Team JalRakshak (Rahul, Priya, Sneha, Amit)</strong></span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => setActiveTab("sprint")}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold flex items-center space-x-1"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Sprint Tasks</span>
                      </button>

                      <button
                        onClick={() => setActiveTab("vault")}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold flex items-center space-x-1"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Lab Data</span>
                      </button>

                      <Link
                        to={`/lifecycle/${pr.id}`}
                        className="px-3.5 py-1.5 bg-[#0f2942] hover:bg-[#163b5f] text-white rounded font-semibold flex items-center space-x-1 shadow-xs"
                      >
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>5-Stage Lifecycle & Gantt &rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Kanban Sprint Board */}
      {activeTab === "sprint" && (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <KanbanBoard teamId="all" />
        </div>
      )}

      {/* 3. Milestone Roadmap */}
      {activeTab === "milestones" && (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <GanttChart milestones={milestones} />
        </div>
      )}

      {/* 4. Document Vault */}
      {activeTab === "vault" && (
        <div className="space-y-4">
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
                  <select
                    value={targetMilestoneId}
                    onChange={(e) => setTargetMilestoneId(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded bg-slate-50 focus:border-[#0f2942]"
                  >
                    {milestones.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.displayName.slice(0, 45)}...
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Deliverable Title / File Name</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      placeholder="e.g. Field_Trial_Telemetry_Sensor_Calibration_Week2.pdf"
                      className="flex-1 p-2 border border-slate-300 rounded focus:border-[#0f2942] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#0f2942] hover:bg-[#163b5f] text-white rounded font-semibold flex items-center space-x-1.5 shrink-0 shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
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
                {milestones.flatMap((m) => m.documents).map((doc) => (
                  <tr key={doc.id}>
                    <td className="font-semibold text-slate-900">{doc.title}</td>
                    <td className="uppercase text-slate-500 text-[10px] font-mono">{doc.docType}</td>
                    <td className="text-slate-500 font-mono text-[10px]">{doc.fileSize}</td>
                    <td>{doc.uploadedByName}</td>
                    <td>
                      <button
                        onClick={() => alert(`Downloading ${doc.title}...`)}
                        className="text-blue-700 hover:text-blue-900 font-semibold flex items-center space-x-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PortalLayout>
  );
};
