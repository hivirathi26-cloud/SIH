import React, { useState } from "react";
import { Problem, TeamMember } from "../../types";
import { useApp } from "../../context/AppContext";
import { Users, Plus, Trash2, CheckCircle2, X, GraduationCap } from "lucide-react";
import confetti from "canvas-confetti";

export const TeamBuilderModal: React.FC<{
  problem: Problem | null;
  onClose: () => void;
}> = ({ problem, onClose }) => {
  const { createTeam, currentUser, universities } = useApp();
  const [facultyDept, setFacultyDept] = useState("Dept of Environmental & Water Engineering");
  const [members, setMembers] = useState<Omit<TeamMember, "id" | "teamId">[]>([
    {
      studentId: "student-rahul",
      studentName: "Rahul Kumar",
      discipline: "Electronics & IoT Engineering",
      yearOfStudy: "3rd Year B.Tech",
      role: "Team Lead",
      email: "rahul.iot@bitmesra.ac.in"
    },
    {
      studentId: "student-priya",
      studentName: "Priya Sharma",
      discipline: "Chemical & Membrane Tech",
      yearOfStudy: "4th Year B.Tech",
      role: "Hardware Lead",
      email: "priya.chem@bitmesra.ac.in"
    },
    {
      studentId: "student-amit",
      studentName: "Amit Oraon",
      discipline: "Computer Science & Cloud Systems",
      yearOfStudy: "3rd Year B.Tech",
      role: "Software Lead",
      email: "amit.cs@bitmesra.ac.in"
    },
    {
      studentId: "student-sneha",
      studentName: "Sneha Soren",
      discipline: "Rural Management & Field Social Work",
      yearOfStudy: "2nd Year M.Tech",
      role: "Field Researcher",
      email: "sneha.rural@bitmesra.ac.in"
    }
  ]);

  const [newStudentName, setNewStudentName] = useState("");
  const [newDiscipline, setNewDiscipline] = useState("Mechanical Engineering");
  const [newRole, setNewRole] = useState<TeamMember["role"]>("Design Specialist");

  if (!problem) return null;

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;
    setMembers([
      ...members,
      {
        studentId: `stu-${Date.now()}`,
        studentName: newStudentName,
        discipline: newDiscipline,
        yearOfStudy: "3rd Year B.Tech",
        role: newRole,
        email: `${newStudentName.toLowerCase().replace(/ /g, ".")}@univ.ac.in`
      }
    ]);
    setNewStudentName("");
  };

  const handleRemoveMember = (idx: number) => {
    setMembers(members.filter((_, i) => i !== idx));
  };

  const handleFinalizeTeam = () => {
    createTeam({
      problemId: problem.id,
      problemTitle: problem.title,
      universityId: problem.assignedUniversityId || "univ-bit-mesra",
      universityName: problem.assignedUniversityName || "Birla Institute of Technology, Mesra",
      facultyMentorId: currentUser.id,
      facultyMentorName: currentUser.fullName,
      facultyDepartment: facultyDept,
      members: members.map((m, i) => ({ ...m, id: `mem-${Date.now()}-${i}`, teamId: "" }))
    });
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 animate-in fade-in zoom-in-95 space-y-5">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Form Multidisciplinary Student Team
              </h3>
              <p className="text-xs text-slate-500">
                Assign cross-department student innovators to solve: {problem.title.slice(0, 45)}...
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Faculty Mentor Details */}
        <div className="bg-purple-50/60 p-3.5 rounded-xl border border-purple-200 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-purple-900 block">Faculty Mentor</span>
            <span className="font-bold text-slate-900">{currentUser.fullName}</span>
            <span className="text-slate-500 block">{facultyDept}</span>
          </div>
          <span className="bg-purple-200 text-purple-900 px-2.5 py-1 rounded font-mono font-bold">
            Lead Mentor ✓
          </span>
        </div>

        {/* Team Members List */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-800">
            Team Members ({members.length} Multidisciplinary Innovators):
          </label>

          <div className="max-h-48 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl">
            {members.map((m, idx) => (
              <div key={idx} className="p-2.5 flex items-center justify-between text-xs hover:bg-slate-50">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[11px]">
                    {m.studentName[0]}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">{m.studentName}</span>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                      <span>{m.discipline}</span>
                      <span>•</span>
                      <span className="font-semibold text-emerald-700">{m.role}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveMember(idx)}
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add Member Row */}
        <form onSubmit={handleAddMember} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
          <span className="text-[11px] font-bold text-slate-600 uppercase block">
            Add Another Student Innovator:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              value={newStudentName}
              onChange={(e) => setNewStudentName(e.target.value)}
              placeholder="Student Full Name"
              className="text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
            <select
              value={newDiscipline}
              onChange={(e) => setNewDiscipline(e.target.value)}
              className="text-xs p-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="Computer Science">Computer Science & AI</option>
              <option value="Electronics & IoT">Electronics & IoT</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Civil & Environmental Engg">Civil & Environmental Engg</option>
              <option value="Biotechnology">Biotechnology</option>
              <option value="Rural Development & Social Work">Rural Development</option>
            </select>
            <button
              type="submit"
              className="flex items-center justify-center space-x-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold py-2 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Member</span>
            </button>
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleFinalizeTeam}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-600/20 transition hover:scale-105"
          >
            Finalize Team & Open Proposal Desk &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
