import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { GanttChart } from "../components/lifecycle/GanttChart";
import { BlockchainLedgerModal } from "../components/lifecycle/BlockchainLedgerModal";
import { StartupIncubationBanner } from "../components/lifecycle/StartupIncubationBanner";
import { Upload, ShieldCheck, Check, Download, Home, Info } from "lucide-react";
import confetti from "canvas-confetti";
export const ProjectLifecyclePage = () => {
    const { proposalId } = useParams();
    const { proposals, milestones, approveMilestoneFaculty, approveMilestoneGovt, uploadMilestoneDocument, currentUser } = useApp();
    const [blockchainModalOpen, setBlockchainModalOpen] = useState(false);
    const [uploadDocTitle, setUploadDocTitle] = useState("");
    const [activeMilestoneId, setActiveMilestoneId] = useState(milestones[0]?.id || "ms-001");
    const proposal = proposals.find((p) => p.id === proposalId) || proposals[0];
    const projectMilestones = milestones.filter((m) => m.proposalId === proposal?.id || m.proposalId === "prop-001");
    const handleUpload = (e) => {
        e.preventDefault();
        if (!uploadDocTitle.trim())
            return;
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
    return (<div className="min-h-screen bg-[#f8fafc]">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-2.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2 text-slate-500">
            <Link to="/" className="hover:text-slate-800 flex items-center space-x-1">
              <Home className="w-3.5 h-3.5"/>
              <span>Home</span>
            </Link>
            <span>&rarr;</span>
            <Link to="/portal/industry" className="hover:text-slate-800">Industry Hub</Link>
            <span>&rarr;</span>
            <span className="text-slate-900 font-semibold">5-Stage Project Lifecycle</span>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-slate-600">
            <span className="font-mono bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded font-bold">
              NEP 2020 Experiential Cohort
            </span>
            <span className="text-slate-300">|</span>
            <span>Blockchain Smart Contract Active</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Official Banner */}
        <div className="bg-[#0f2942] text-white p-6 rounded-lg border border-[#1e3a5f] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 uppercase tracking-wider">
                MODULE E: 5-STAGE PROJECT LIFECYCLE & DUAL-SIGN OFF
              </span>
              <span className="text-[11px] text-slate-300 font-mono">Stage: Prototyping & Lab Calibration</span>
            </div>

            <h1 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
              {proposal.title}
            </h1>

            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Lead Institution: <strong>{proposal.universityName}</strong> • Faculty Mentor: <strong>{proposal.facultyMentorName}</strong> • District: <strong>{proposal.district}</strong>
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button onClick={() => setBlockchainModalOpen(true)} className="flex items-center space-x-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 rounded text-xs font-bold transition shadow-xs">
              <ShieldCheck className="w-4 h-4"/>
              <span>Audit Blockchain Ledger</span>
            </button>
          </div>
        </div>

        {/* Informational Guidance Callout */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-start space-x-3 text-xs">
          <Info className="w-4 h-4 text-[#0f2942] shrink-0 mt-0.5"/>
          <div className="text-slate-700 leading-relaxed">
            <strong>Where is the problem now?</strong> Following bilateral MoU execution with Industry/CSR, this societal challenge entered active research execution. Student teams assemble hardware/software in University labs (Milestones 1 & 2), validate sensors (Milestone 3), deploy pilot units in the target village (Milestone 4), and finalize community adoption with citizen ratings (Milestone 5).
          </div>
        </div>

        {/* State Startup Incubation Banner */}
        <StartupIncubationBanner proposalTitle={proposal.title} universityName={proposal.universityName}/>

        {/* Gantt & Milestones Container */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-6">
          <GanttChart milestones={projectMilestones}/>

          {/* Dual Sign-off Action Gate */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <div>
              <h4 className="font-heading font-bold text-sm text-slate-900 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700"/>
                <span>Dual Approval Sign-Off Gate (Milestone 3: Field Testing)</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Both Faculty Research Mentor and Government District Officer must stamp approval to release next grant tranche
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Gate 1: Faculty */}
              <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2.5">
                <span className="font-bold text-slate-800 uppercase text-[11px] block">
                  1. Faculty Academic Sign-Off:
                </span>
                <p className="text-slate-600 text-[11px]">
                  Verifies laboratory compliance, telemetry test accuracy, and engineering safety.
                </p>
                <button onClick={() => {
            approveMilestoneFaculty("ms-003", currentUser.fullName);
            confetti({ particleCount: 60, spread: 60 });
        }} className="w-full py-2 bg-[#0f2942] hover:bg-[#163b5f] text-white rounded text-xs font-semibold transition flex items-center justify-center space-x-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400"/>
                  <span>Apply Faculty Sign-off Stamp</span>
                </button>
              </div>

              {/* Gate 2: Govt Officer */}
              <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2.5">
                <span className="font-bold text-slate-800 uppercase text-[11px] block">
                  2. Government District Sign-Off:
                </span>
                <p className="text-slate-600 text-[11px]">
                  Verifies ground beneficiary impact, site inspection, and authorizes fund disbursement.
                </p>
                <button onClick={() => {
            approveMilestoneGovt("ms-003", currentUser.fullName);
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        }} className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-semibold transition flex items-center justify-center space-x-1.5">
                  <Check className="w-3.5 h-3.5"/>
                  <span>Apply Govt District Officer Stamp</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Document Vault */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h4 className="font-heading font-bold text-sm text-slate-900">
                Secure Document & Telemetry Vault
              </h4>
              <p className="text-xs text-slate-500">
                Upload and inspect NABL reports, CAD models, lab test certificates, and drone geotags
              </p>
            </div>
          </div>

          <form onSubmit={handleUpload} className="flex flex-col sm:flex-row items-center gap-3 text-xs">
            <input type="text" required value={uploadDocTitle} onChange={(e) => setUploadDocTitle(e.target.value)} placeholder="e.g. Angara_Field_Trial_Fluoride_Sensor_Telemetry_Week2.xlsx" className="flex-1 p-2 border border-slate-300 rounded focus:border-[#0f2942] focus:outline-none"/>
            <button type="submit" className="px-4 py-2 bg-[#0f2942] hover:bg-[#163b5f] text-white rounded font-semibold flex items-center space-x-1.5 shrink-0">
              <Upload className="w-3.5 h-3.5"/>
              <span>Upload Deliverable</span>
            </button>
          </form>

          <table className="gov-table mt-4">
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Category</th>
                <th>Size</th>
                <th>Uploaded By</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {projectMilestones.flatMap((m) => m.documents).map((doc) => (<tr key={doc.id}>
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
      </div>

      {blockchainModalOpen && (<BlockchainLedgerModal onClose={() => setBlockchainModalOpen(false)}/>)}
    </div>);
};
