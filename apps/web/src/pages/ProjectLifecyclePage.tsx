import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { GanttChart } from "../components/lifecycle/GanttChart";
import { BlockchainLedgerModal } from "../components/lifecycle/BlockchainLedgerModal";
import { StartupIncubationBanner } from "../components/lifecycle/StartupIncubationBanner";
import { StatusPill } from "../components/common/StatusPill";
import {
  Layers,
  Upload,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Check,
  Rocket,
  Download,
  Clock,
  Award,
  Link2
} from "lucide-react";
import confetti from "canvas-confetti";

export const ProjectLifecyclePage: React.FC = () => {
  const { proposalId } = useParams();
  const { proposals, milestones, approveMilestoneFaculty, approveMilestoneGovt, uploadMilestoneDocument, currentUser } = useApp();
  const [blockchainModalOpen, setBlockchainModalOpen] = useState(false);
  const [uploadDocTitle, setUploadDocTitle] = useState("");
  const [activeMilestoneId, setActiveMilestoneId] = useState(milestones[0]?.id || "ms-001");

  const proposal = proposals.find((p) => p.id === proposalId) || proposals[0];
  const projectMilestones = milestones.filter((m) => m.proposalId === proposal?.id || m.proposalId === "prop-001");

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadDocTitle.trim()) return;

    uploadMilestoneDocument(activeMilestoneId, {
      milestoneId: activeMilestoneId,
      title: uploadDocTitle,
      docType: "report",
      storageUrl: `/vault/${uploadDocTitle.toLowerCase().replace(/ /g, "_")}.pdf`,
      fileSize: "3.2 MB",
      uploadedBy: currentUser.id,
      uploadedByName: currentUser.fullName
    });

    setUploadDocTitle("");
    confetti({ particleCount: 50, spread: 50 });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="bg-teal-500/30 text-teal-200 text-xs font-bold px-2.5 py-1 rounded-full border border-teal-400/30 uppercase">
              MODULE E: PROJECT LIFECYCLE & DUAL-SIGN OFF
            </span>
            <span className="text-xs text-teal-300">TRL 6 Prototype Validated</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl">
            {proposal.title}
          </h1>
          <p className="text-xs sm:text-sm text-teal-200 max-w-2xl leading-relaxed">
            Lead Institution: {proposal.universityName} • Faculty Mentor: {proposal.facultyMentorName} • District: {proposal.district}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setBlockchainModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 rounded-xl text-xs font-bold transition shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Audit Blockchain Ledger</span>
          </button>
        </div>
      </div>

      {/* State Startup Incubation Banner */}
      <StartupIncubationBanner
        proposalTitle={proposal.title}
        universityName={proposal.universityName}
      />

      {/* Gantt & Milestones Container */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <GanttChart milestones={projectMilestones} />

        {/* Dual Sign-off Action Gate */}
        <div className="pt-6 border-t border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-heading font-bold text-base text-slate-900 flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Dual Approval Sign-Off Gate (Milestone 3: Field Testing)</span>
              </h4>
              <p className="text-xs text-slate-500">
                Both Faculty Research Mentor and Government District Officer must stamp approval to release next grant tranche
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gate 1: Faculty */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase block">1. Faculty Academic Sign-Off:</span>
              <p className="text-xs text-slate-600">
                Verifies laboratory compliance, telemetry test accuracy, and engineering safety.
              </p>
              <button
                onClick={() => {
                  approveMilestoneFaculty("ms-003", currentUser.fullName);
                  confetti({ particleCount: 60, spread: 60 });
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Apply Faculty Sign-off Stamp</span>
              </button>
            </div>

            {/* Gate 2: Govt Officer */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase block">2. Government District Sign-Off:</span>
              <p className="text-xs text-slate-600">
                Verifies ground beneficiary impact, site inspection, and authorizes fund disbursement.
              </p>
              <button
                onClick={() => {
                  approveMilestoneGovt("ms-003", currentUser.fullName);
                  confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Apply Govt District Officer Stamp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Document Vault Section */}
        <div className="pt-6 border-t border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-heading font-bold text-base text-slate-900">
                Secure Document & Telemetry Vault
              </h4>
              <p className="text-xs text-slate-500">
                NABL lab certificates, 3D CAD models, drone imagery, and patent disclosures
              </p>
            </div>
          </div>

          {/* Upload Document Form */}
          <form onSubmit={handleUpload} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={uploadDocTitle}
              onChange={(e) => setUploadDocTitle(e.target.value)}
              placeholder="Enter document title (e.g. NABL_Water_Purity_Certificate.pdf)..."
              className="flex-1 text-xs p-2.5 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 flex items-center space-x-1 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
            >
              <Upload className="w-4 h-4" />
              <span>Upload to Vault</span>
            </button>
          </form>

          {/* Vault Documents List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {projectMilestones.flatMap((m) => m.documents).map((doc) => (
              <div key={doc.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-start justify-between text-xs space-y-1">
                <div className="space-y-1 truncate pr-2">
                  <div className="flex items-center space-x-1.5 text-slate-800 font-bold truncate">
                    <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">{doc.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    {doc.fileSize} • Uploaded by {doc.uploadedByName}
                  </span>
                </div>
                <button
                  onClick={() => alert(`Downloading ${doc.title} from encrypted cloud storage vault!`)}
                  className="text-slate-400 hover:text-slate-800 p-1"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Blockchain Ledger Modal */}
      {blockchainModalOpen && (
        <BlockchainLedgerModal onClose={() => setBlockchainModalOpen(false)} />
      )}
    </div>
  );
};
