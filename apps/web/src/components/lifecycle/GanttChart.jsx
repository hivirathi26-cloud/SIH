import React from "react";
import { CheckCircle2 } from "lucide-react";
export const GanttChart = ({ milestones }) => {
    const sortedMilestones = [...milestones].sort((a, b) => a.index - b.index);
    return (<div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-heading font-bold text-sm text-slate-900">
          5-Stage Project Milestone Timeline & Gantt Tracker
        </h4>
        <span className="text-xs text-slate-500 font-mono">
          Dual Sign-Off Gate: Faculty + District Govt Officer
        </span>
      </div>

      <div className="space-y-3">
        {sortedMilestones.map((m, idx) => {
            const isDone = m.status === "approved";
            const isInProgress = m.status === "in_progress";
            const isSubmitted = m.status === "submitted";
            let progressPercent = isDone ? 100 : isInProgress ? 60 : isSubmitted ? 90 : 0;
            let barColor = isDone
                ? "bg-emerald-500"
                : isInProgress
                    ? "bg-amber-500"
                    : isSubmitted
                        ? "bg-indigo-500"
                        : "bg-slate-200";
            return (<div key={m.id} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${isDone
                    ? "bg-emerald-600 text-white"
                    : isInProgress
                        ? "bg-amber-500 text-white"
                        : "bg-slate-300 text-slate-700"}`}>
                    {m.index}
                  </span>
                  <div>
                    <span className="font-heading font-bold text-slate-900">{m.displayName}</span>
                    <p className="text-[11px] text-slate-500">{m.description}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase ${isDone
                    ? "bg-emerald-100 text-emerald-800"
                    : isInProgress
                        ? "bg-amber-100 text-amber-800"
                        : isSubmitted
                            ? "bg-indigo-100 text-indigo-800"
                            : "bg-slate-200 text-slate-600"}`}>
                    {m.status.replace(/_/g, " ")}
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Due: {m.dueDate}</span>
                </div>
              </div>

              {/* Progress Track */}
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div className={`h-full ${barColor} transition-all duration-500`} style={{ width: `${progressPercent}%` }}></div>
              </div>

              {/* Dual Gate Approvals Info */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <CheckCircle2 className={`w-3 h-3 ${m.facultyApproved ? "text-emerald-600" : "text-slate-300"}`}/>
                    <span>Faculty Sign-off: {m.facultyApproved ? m.facultyApprovedBy || "Approved ✓" : "Pending"}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <CheckCircle2 className={`w-3 h-3 ${m.govtApproved ? "text-emerald-600" : "text-slate-300"}`}/>
                    <span>Govt Officer Sign-off: {m.govtApproved ? m.govtApprovedBy || "Approved ✓" : "Pending"}</span>
                  </span>
                </div>

                <span>{m.documents.length} Vault Documents Uploaded</span>
              </div>
            </div>);
        })}
      </div>
    </div>);
};
