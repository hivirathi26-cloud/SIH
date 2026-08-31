import React from "react";
import { ProblemStatus, ProposalStatus, MilestoneStatus } from "../../types";

export const StatusPill: React.FC<{ status: ProblemStatus | ProposalStatus | MilestoneStatus | string }> = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      case "submitted":
        return "bg-slate-100 text-slate-700 border-slate-300";
      case "under_ai_review":
        return "bg-indigo-100 text-indigo-800 border-indigo-300 animate-pulse";
      case "pending_nodal_review":
        return "bg-amber-100 text-amber-900 border-amber-300";
      case "routed":
        return "bg-cyan-100 text-cyan-800 border-cyan-300";
      case "accepted_by_hei":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "team_formed":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "industry_matched":
      case "funded":
        return "bg-emerald-100 text-emerald-800 border-emerald-300 font-bold";
      case "field_pilot":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "deployed":
      case "approved":
        return "bg-teal-100 text-teal-800 border-teal-400 font-bold";
      case "closed":
        return "bg-slate-200 text-slate-800 border-slate-300";
      case "rejected":
        return "bg-rose-100 text-rose-800 border-rose-300";
      case "pending":
        return "bg-slate-100 text-slate-600 border-slate-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  const getLabel = () => {
    return status.replace(/_/g, " ").toUpperCase();
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStyle()}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 inline-block"></span>
      {getLabel()}
    </span>
  );
};
