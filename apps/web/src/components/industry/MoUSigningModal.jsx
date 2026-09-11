import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { FileSignature, ShieldCheck, X } from "lucide-react";
import confetti from "canvas-confetti";
export const MoUSigningModal = ({ proposal, onClose }) => {
    const { createAgreement, currentUser } = useApp();
    const [agreementType, setAgreementType] = useState("csr_grant");
    const [fundingAmount, setFundingAmount] = useState(proposal ? proposal.estimatedBudget : 350000);
    const [signerName, setSignerName] = useState(currentUser.fullName);
    const [signatureDrawn, setSignatureDrawn] = useState(false);
    const [signedSuccess, setSignedSuccess] = useState(false);
    if (!proposal)
        return null;
    const handleSignAgreement = (e) => {
        e.preventDefault();
        createAgreement({
            proposalId: proposal.id,
            proposalTitle: proposal.title,
            universityName: proposal.universityName,
            industryPartnerId: currentUser.id,
            industryPartnerName: currentUser.organizationName || currentUser.fullName,
            industryType: currentUser.role === "csr" ? "csr" : "startup",
            agreementType: agreementType,
            amount: Number(fundingAmount),
            status: "active",
            terms: `Formal Innovation Partnership MoU under Jharkhand State Innovation Framework. ${currentUser.organizationName || currentUser.fullName} agrees to provide INR ${Number(fundingAmount).toLocaleString("en-IN")} and prototyping mentorship to ${proposal.universityName}.`
        });
        setSignedSuccess(true);
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        setTimeout(() => {
            onClose();
        }, 1500);
    };
    return (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 animate-in fade-in zoom-in-95 space-y-5">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileSignature className="w-5 h-5"/>
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Digital MoU & Funding Agreement E-Signing
              </h3>
              <p className="text-xs text-slate-500">
                Execute legally compliant bilateral innovation contract on Blockchain
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Agreement Preview Sheet */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
          <div className="flex justify-between items-start pb-2 border-b border-slate-200">
            <div>
              <span className="font-bold text-slate-900 block">{proposal.title}</span>
              <span className="text-slate-500">Academic Institution: {proposal.universityName}</span>
            </div>
            <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
              E-STAMPED DRAFT
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Partnership / Agreement Mode:
              </label>
              <select value={agreementType} onChange={(e) => setAgreementType(e.target.value)} className="w-full p-2 border border-slate-300 rounded-lg bg-white text-xs">
                <option value="csr_grant">CSR Innovation Grant (100% Tax Deductible)</option>
                <option value="funding">Direct Seed Funding & Equity Option</option>
                <option value="mentorship">Industrial Mentorship & Lab Facility Access</option>
                <option value="prototyping">Prototyping & Pilot Manufacturing Support</option>
                <option value="tech_transfer">Exclusive / Non-Exclusive Tech Transfer</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Grant / Investment Amount (INR):
              </label>
              <input type="number" value={fundingAmount} onChange={(e) => setFundingAmount(Number(e.target.value))} className="w-full p-2 border border-slate-300 rounded-lg bg-white text-xs font-mono font-bold text-emerald-700"/>
            </div>
          </div>
        </div>

        {/* Digital Signature Pad Simulation */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800">
            Digital Signature & Authorization:
          </label>
          <div onClick={() => setSignatureDrawn(true)} className={`h-28 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition ${signatureDrawn
            ? "bg-emerald-50/50 border-emerald-400 text-emerald-800"
            : "bg-slate-50 border-slate-300 text-slate-400 hover:bg-slate-100"}`}>
            {signatureDrawn ? (<div className="text-center">
                <span className="font-heading font-extrabold text-2xl italic tracking-wider text-slate-900 block font-serif">
                  {signerName}
                </span>
                <span className="text-[10px] text-emerald-600 font-mono flex items-center justify-center space-x-1 mt-1">
                  <ShieldCheck className="w-3 h-3"/>
                  <span>Aadhaar / DigiLocker e-Sign Timestamped • 2026-09-01</span>
                </span>
              </div>) : (<div className="text-center">
                <FileSignature className="w-6 h-6 mx-auto mb-1 text-slate-400"/>
                <span className="text-xs font-medium">Click here to apply digital e-Signature</span>
              </div>)}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center space-x-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600"/>
            <span>Immutable Hash will be generated on JSICP Blockchain Ledger</span>
          </div>

          <div className="flex items-center space-x-2">
            <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">
              Cancel
            </button>
            <button onClick={handleSignAgreement} disabled={signedSuccess} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition hover:scale-105">
              {signedSuccess ? "MoU Signed & Recorded! ✓" : "Execute & Sign MoU Agreement"}
            </button>
          </div>
        </div>
      </div>
    </div>);
};
