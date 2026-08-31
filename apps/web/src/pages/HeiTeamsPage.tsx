import React from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { KanbanBoard } from "../components/hei/KanbanBoard";
import { Users, GraduationCap, Plus, FolderGit2, ArrowRight } from "lucide-react";

export const HeiTeamsPage: React.FC = () => {
  const { teams, currentUser } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
            Faculty Mentors & Multidisciplinary Teams
          </h1>
          <p className="text-xs text-slate-500">
            Student teams collaborating across Electronics, Computer Science, Biotechnology, Civil & Rural Economics
          </p>
        </div>

        <Link
          to="/hei/proposals/new"
          className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
        >
          <span>Draft Solution Proposal</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Team Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-heading font-bold text-sm text-slate-900 block">
                    Team JalRakshak
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Mentor: {team.facultyMentorName} ({team.facultyDepartment})
                  </span>
                </div>
              </div>
              <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2.5 py-0.5 rounded-full">
                {team.members.length} Innovators
              </span>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Target Societal Problem:</span>
              <p className="text-xs font-semibold text-slate-900">{team.problemTitle}</p>
            </div>

            {/* Members Avatars Grid */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Cross-Discipline Roster:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {team.members.map((m) => (
                  <div key={m.id} className="bg-slate-50 p-2 rounded-xl border border-slate-200 flex items-center space-x-2 text-xs">
                    <img
                      src={m.avatarUrl || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150"}
                      alt=""
                      className="w-7 h-7 rounded-full object-cover border border-slate-300 shrink-0"
                    />
                    <div className="truncate">
                      <span className="font-bold text-slate-900 block truncate">{m.studentName}</span>
                      <span className="text-[10px] text-slate-500 block truncate">{m.discipline} • {m.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Kanban Board Container */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <KanbanBoard teamId="all" />
      </div>
    </div>
  );
};
