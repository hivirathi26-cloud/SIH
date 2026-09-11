import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { StatusPill } from "../../components/common/StatusPill";
import { Search } from "lucide-react";
export const PublicTrackPage = () => {
    const { problems } = useApp();
    const [ticketInput, setTicketInput] = useState("JSICP-2026-0841");
    const [searchedProblem, setSearchedProblem] = useState(problems[0]);
    const handleSearch = (e) => {
        e.preventDefault();
        const found = problems.find((p) => p.ticketNumber.toLowerCase() === ticketInput.trim().toLowerCase());
        if (found) {
            setSearchedProblem(found);
        }
        else {
            alert("Ticket not found. Try JSICP-2026-0841 or JSICP-2026-0192");
        }
    };
    const getStepIndex = (status) => {
        switch (status) {
            case "submitted": return 1;
            case "under_ai_review": return 2;
            case "pending_nodal_review": return 3;
            case "routed": return 4;
            case "accepted_by_hei": return 5;
            case "team_formed": return 6;
            case "in_progress": return 7;
            case "industry_matched": return 8;
            case "field_pilot": return 9;
            case "deployed":
            case "closed": return 10;
            default: return 1;
        }
    };
    return (<div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6 text-xs">
      <div className="text-center space-y-1">
        <h2 className="font-heading font-extrabold text-xl text-[#0f2942]">
          सार्वजनिक समस्या अनुवर्तन पटल (Public Challenge Tracker)
        </h2>
        <p className="text-slate-600">
          Enter your 10-digit ticket number to monitor academic routing, prototyping, and ground deployment.
        </p>
      </div>

      <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex gap-3">
        <input type="text" value={ticketInput} onChange={(e) => setTicketInput(e.target.value)} placeholder="e.g. JSICP-2026-0841" className="flex-1 p-2.5 border border-slate-300 rounded font-mono font-bold text-slate-800 focus:border-[#0f2942] focus:outline-none"/>
        <button type="submit" className="px-5 py-2.5 bg-[#0f2942] hover:bg-[#163b5f] text-white font-semibold rounded flex items-center space-x-1.5 shrink-0">
          <Search className="w-3.5 h-3.5"/>
          <span>Track Status</span>
        </button>
      </form>

      {searchedProblem && (<div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <span className="font-mono font-bold text-slate-800 text-sm bg-slate-100 px-2.5 py-0.5 rounded">
                {searchedProblem.ticketNumber}
              </span>
              <h3 className="font-heading font-bold text-base text-slate-900 mt-1">
                {searchedProblem.title}
              </h3>
            </div>
            <StatusPill status={searchedProblem.status}/>
          </div>

          <p className="text-slate-600 leading-relaxed">{searchedProblem.description}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded border border-slate-200">
            <div>
              <span className="text-slate-500 block text-[11px]">Location</span>
              <span className="font-bold text-slate-800">{searchedProblem.district}, {searchedProblem.block}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Allocated HEI</span>
              <span className="font-bold text-slate-800">
                {searchedProblem.assignedUniversityName ||
                searchedProblem.aiExplanation?.suggestedUniversities?.[0]?.universityName ||
                "Pending Nodal Routing"}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Assigned Mentor</span>
              <span className="font-bold text-slate-800">
                {searchedProblem.assignedFacultyName ||
                (searchedProblem.assignedUniversityName ? "Faculty Assignment in Progress" : "Pending Allocation")}
              </span>
            </div>
          </div>

          {/* Stepper */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              10-Stage Resolution Lifecycle (Step {getStepIndex(searchedProblem.status)} of 10)
            </span>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full transition-all duration-500" style={{ width: `${getStepIndex(searchedProblem.status) * 10}%` }}></div>
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 font-medium">
              <span>1. Submitted</span>
              <span>3. Nodal Review</span>
              <span>5. HEI Accepted</span>
              <span>7. Prototyping</span>
              <span>9. Field Trial</span>
              <span>10. Deployed</span>
            </div>
          </div>
        </div>)}
    </div>);
};
