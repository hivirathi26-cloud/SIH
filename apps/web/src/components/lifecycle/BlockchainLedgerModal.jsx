import React from "react";
import { useApp } from "../../context/AppContext";
import { ShieldCheck, Hash, CheckCircle2, X } from "lucide-react";
export const BlockchainLedgerModal = ({ onClose }) => {
    const { blockchainLedger } = useApp();
    return (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full p-6 animate-in fade-in zoom-in-95 space-y-5">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6"/>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-heading font-bold text-base text-slate-900">
                  JSICP Cryptographic Audit Ledger
                </h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                  IMMUTABLE HASH CHAIN
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Transparent verification of problem submissions, nodal approvals, CSR fund disbursements, and milestone sign-offs
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Chain Blocks List */}
        <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-1">
          {blockchainLedger.map((block) => (<div key={block.blockNumber} className="bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2 relative">
              <div className="flex items-center justify-between text-emerald-400 font-bold">
                <span className="flex items-center space-x-1.5">
                  <Hash className="w-3.5 h-3.5"/>
                  <span>BLOCK #{block.blockNumber} • {block.eventType}</span>
                </span>
                <span className="text-[10px] text-slate-400 font-sans">
                  {new Date(block.timestamp).toLocaleString()}
                </span>
              </div>

              <p className="text-slate-300 font-sans text-xs">{block.details}</p>

              <div className="space-y-1 text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                <div className="truncate">
                  <span className="text-slate-500">Prev Hash: </span>
                  <span className="text-slate-400">{block.previousHash}</span>
                </div>
                <div className="truncate">
                  <span className="text-slate-500">Block Hash: </span>
                  <span className="text-emerald-400 font-bold">{block.currentHash}</span>
                </div>
                <div className="flex justify-between items-center pt-1 text-[9px] text-slate-500 font-sans">
                  <span>Verified By: {block.verifiedBy}</span>
                  <span className="text-emerald-400 flex items-center space-x-1 font-bold">
                    <CheckCircle2 className="w-3 h-3"/>
                    <span>Consensus Reached</span>
                  </span>
                </div>
              </div>
            </div>))}
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button onClick={onClose} className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold">
            Close Ledger Explorer
          </button>
        </div>
      </div>
    </div>);
};
