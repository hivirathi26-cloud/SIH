import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { getEcosystemByUserId } from "../../data/universityEcosystems";
import { Users, Plus, Trash2, CheckCircle2, X } from "lucide-react";
import confetti from "canvas-confetti";
export const TeamBuilderModal = ({ problem, onClose }) => {
    const { createTeam, currentUser, universities } = useApp();
    const eco = getEcosystemByUserId(currentUser?.id, currentUser?.organizationName, problem?.assignedUniversityId);
    const [facultyDept, setFacultyDept] = useState(eco.faculty.dept);
    const [members, setMembers] = useState(() => eco.students.map((s) => ({
        studentId: s.id,
        studentName: s.fullName,
        discipline: s.discipline,
        yearOfStudy: s.yearOfStudy,
        role: s.role,
        email: s.email
    })));
    const [newStudentName, setNewStudentName] = useState("");
    const [newDiscipline, setNewDiscipline] = useState("Engineering & Prototyping");
    const [newRole, setNewRole] = useState("Design Specialist");
    if (!problem)
        return null;
    const handleAddMember = (e) => {
        e.preventDefault();
        if (!newStudentName.trim())
            return;
        setMembers([
            ...members,
            {
                studentId: `stu-${Date.now()}`,
                studentName: newStudentName,
                discipline: newDiscipline,
                yearOfStudy: "3rd Year",
                role: newRole,
                email: `${newStudentName.toLowerCase().replace(/ /g, ".")}@${eco.id.replace("univ-", "")}.ac.in`
            }
        ]);
        setNewStudentName("");
    };
    const handleRemoveMember = (idx) => {
        setMembers(members.filter((_, i) => i !== idx));
    };
    const handleFinalizeTeam = () => {
        createTeam({
            problemId: problem.id,
            problemTitle: problem.title,
            universityId: problem.assignedUniversityId || eco.id,
            universityName: problem.assignedUniversityName || eco.name,
            facultyMentorId: currentUser.id,
            facultyMentorName: currentUser.fullName || eco.faculty.fullName,
            facultyDepartment: facultyDept,
            members: members.map((m, i) => ({ ...m, id: `mem-${Date.now()}-${i}`, teamId: "" }))
        });
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        onClose();
    };
    return (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 animate-in fade-in zoom-in-95 space-y-5">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Users className="w-5 h-5"/>
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Form Multidisciplinary Student Team
              </h3>
              <p className="text-xs text-slate-500">
                {eco.name} ({eco.shortName}) Innovation Cohort
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
            <X className="w-5 h-5"/>
          </button>
        </div>

        {/* Problem context */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Target Challenge</span>
          <p className="font-semibold text-xs text-slate-800">{problem.title}</p>
          <div className="flex items-center space-x-2 text-[11px] text-slate-500">
            <span>District: {problem.district}</span>
            <span>•</span>
            <span>Category: {problem.category}</span>
          </div>
        </div>

        {/* Department input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Faculty Department / Anchor Laboratory
          </label>
          <input type="text" value={facultyDept} onChange={(e) => setFacultyDept(e.target.value)} className="w-full p-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2942]"/>
        </div>

        {/* Current members */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Assigned Student Innovators ({members.length})
            </span>
            <span className="text-[11px] text-slate-400">Recommended: 3 to 5 multidisciplinary students</span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {members.map((m, idx) => (<div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[11px]">
                    {m.studentName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="font-semibold text-slate-800">{m.studentName}</span>
                      <span className="px-1.5 py-0.2 bg-purple-100 text-purple-700 rounded text-[9px] font-bold">
                        {m.role}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {m.discipline} • {m.yearOfStudy}
                    </span>
                  </div>
                </div>

                <button type="button" onClick={() => handleRemoveMember(idx)} className="p-1 text-slate-400 hover:text-rose-600 transition">
                  <Trash2 className="w-3.5 h-3.5"/>
                </button>
              </div>))}
          </div>
        </div>

        {/* Add extra member form */}
        <form onSubmit={handleAddMember} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-700 block">Add Additional Student</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <input type="text" placeholder="Student Full Name" value={newStudentName} onChange={(e) => setNewStudentName(e.target.value)} className="p-2 border border-slate-200 rounded-lg bg-white focus:outline-none"/>
            <input type="text" placeholder="Discipline / Branch" value={newDiscipline} onChange={(e) => setNewDiscipline(e.target.value)} className="p-2 border border-slate-200 rounded-lg bg-white focus:outline-none"/>
            <select value={newRole} onChange={(e) => setNewRole(e.target.value)} className="p-2 border border-slate-200 rounded-lg bg-white focus:outline-none">
              <option value="Team Lead">Team Lead</option>
              <option value="Hardware Lead">Hardware Lead</option>
              <option value="Software Lead">Software Lead</option>
              <option value="Field Researcher">Field Researcher</option>
              <option value="Design Specialist">Design Specialist</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button type="submit" className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold flex items-center space-x-1">
              <Plus className="w-3.5 h-3.5"/>
              <span>Add Member</span>
            </button>
          </div>
        </form>

        {/* Finalize button */}
        <div className="pt-2 border-t border-slate-100 flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 text-slate-600 font-semibold text-xs rounded-xl hover:bg-slate-50">
            Cancel
          </button>
          <button type="button" onClick={handleFinalizeTeam} className="px-5 py-2 bg-[#0f2942] hover:bg-[#163b5f] text-white font-semibold text-xs rounded-xl flex items-center space-x-1.5 shadow-md shadow-slate-900/10">
            <CheckCircle2 className="w-4 h-4 text-emerald-400"/>
            <span>Confirm & Lock Innovation Cohort &rarr;</span>
          </button>
        </div>
      </div>
    </div>);
};
