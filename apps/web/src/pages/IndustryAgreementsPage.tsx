import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { FileSignature, ShieldCheck, Download, ExternalLink, Hash } from "lucide-react";

export const IndustryAgreementsPage: React.FC = () => {
  const { agreements } = useApp();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
            Executed Innovation MoUs & CSR Grant Vault
          </h1>
          <p className="text-xs text-slate-500">
            Legally stamped bilateral innovation agreements verified on Blockchain ledger
          </p>
        </div>

        <Link
          to="/industry/marketplace"
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition"
        >
          &larr; Back to Marketplace
        </Link>
      </div>

      {/* Agreements Cards */}
      <div className="space-y-4">
        {agreements.map((agr) => (
          <div
            key={agr.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full uppercase">
                    {agr.agreementType.replace(/_/g, " ")}
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold">
                    ACTIVE MOU
                  </span>
                </div>
                <h3 className="font-heading font-bold text-base text-slate-900 mt-1">
                  {agr.proposalTitle}
                </h3>
              </div>

              <div className="text-right">
                <span className="font-mono font-extrabold text-lg text-emerald-700 block">
                  ₹{(agr.amount).toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Executed {new Date(agr.signedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500 block">Industry Anchor Partner:</span>
                <span className="font-bold text-slate-900 block">{agr.industryPartnerName}</span>
                <span className="text-[10px] text-slate-400 uppercase font-mono">{agr.industryType}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-500 block">Academic Research Institution:</span>
                <span className="font-bold text-slate-900 block">{agr.universityName}</span>
                <span className="text-[10px] text-slate-400 font-mono">Government Approved HEI</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed italic bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
              "{agr.terms}"
            </p>

            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
              <div className="flex items-center space-x-1.5 truncate max-w-md font-mono text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">Tx: {agr.blockchainTxHash}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => alert("Downloading official Jharkhand Innovation Bilateral MoU (PDF with digital e-Sign timestamp)!")}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Signed MoU (PDF)</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
