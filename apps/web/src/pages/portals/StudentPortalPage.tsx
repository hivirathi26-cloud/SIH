import React, { useState } from "react";
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
  AlertCircle
} from "lucide-react";
import confetti from "canvas-confetti";

export const StudentPortalPage: React.FC = () => {
  const { milestones, uploadMilestoneDocument, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState("sprint");
  const [uploadTitle, setUploadTitle] = useState("");

  const navItems: NavItem[] = [
    { id: "sprint", label: "Sprint Kanban Board", icon: Layers },
    { id: "milestones", label: "Milestone Roadmap", icon: Clock },
    { id: "vault", label: "Document & Telemetry Vault", icon: FileText }
  ];

  const handleUploadDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    uploadMilestoneDocument("ms-003", {
      milestoneId: "ms-003",
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
      {/* 1. Kanban Sprint Board */}
      {activeTab === "sprint" && (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <KanbanBoard teamId="all" />
        </div>
      )}

      {/* 2. Milestone Roadmap */}
      {activeTab === "milestones" && (
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <GanttChart milestones={milestones} />
        </div>
      )}

      {/* 3. Document Vault */}
      {activeTab === "vault" && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Upload Laboratory Telemetry / Field Calibration Data
            </h3>

            <form onSubmit={handleUploadDoc} className="flex flex-col sm:flex-row items-center gap-3 text-xs">
              <input
                type="text"
                required
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="e.g. Angara_Field_Trial_Fluoride_Sensor_Telemetry_Week2.xlsx"
                className="flex-1 p-2.5 border border-slate-300 rounded focus:border-[#0f2942] focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-[#0f2942] hover:bg-[#163b5f] text-white rounded font-semibold flex items-center space-x-1.5 shrink-0"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload to Vault</span>
              </button>
            </form>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 font-heading font-bold text-xs uppercase tracking-wider text-slate-800">
              Uploaded Test Sheets & CAD Files
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
