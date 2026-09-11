import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Plus, User } from "lucide-react";
export const KanbanBoard = ({ teamId }) => {
    const { kanbanTasks, updateTaskStatus, createTask, currentUser } = useApp();
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const teamTasks = kanbanTasks.filter((t) => t.teamId === teamId || teamId === "all");
    const columns = [
        { key: "backlog", label: "📋 Backlog / Research", bg: "bg-slate-50", border: "border-slate-200" },
        { key: "in_progress", label: "⚡ In Progress / Prototyping", bg: "bg-amber-50/40", border: "border-amber-200" },
        { key: "review", label: "🔍 Lab Review / Testing", bg: "bg-indigo-50/40", border: "border-indigo-200" },
        { key: "completed", label: "✅ Milestone Completed", bg: "bg-emerald-50/40", border: "border-emerald-200" }
    ];
    const handleQuickAdd = (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim())
            return;
        createTask({
            teamId,
            title: newTaskTitle,
            description: "Standard task assigned by team lead.",
            assignedTo: currentUser.id,
            assignedName: currentUser.fullName,
            status: "backlog",
            priority: "medium",
            milestoneName: "research_design",
            dueDate: "2026-03-25"
        });
        setNewTaskTitle("");
        setIsAdding(false);
    };
    return (<div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading font-bold text-base text-slate-900 flex items-center space-x-2">
            <span>Multidisciplinary Sprint Kanban Board</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold border border-emerald-300">
              {teamTasks.length} Active Tasks
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            Real-time student sprint workflow tracking across engineering, design, and rural validation
          </p>
        </div>

        <button onClick={() => setIsAdding(!isAdding)} className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition">
          <Plus className="w-4 h-4"/>
          <span>Add Sprint Task</span>
        </button>
      </div>

      {isAdding && (<form onSubmit={handleQuickAdd} className="bg-white p-3 rounded-xl border border-emerald-300 shadow-sm flex items-center space-x-2 animate-in fade-in">
          <input type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="e.g. Calibrate optical sensor in Angara field trial station..." className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" autoFocus/>
          <button type="submit" className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition">
            Create
          </button>
          <button type="button" onClick={() => setIsAdding(false)} className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800">
            Cancel
          </button>
        </form>)}

      {/* Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
            const tasksInCol = teamTasks.filter((t) => t.status === col.key);
            return (<div key={col.key} className={`${col.bg} border ${col.border} rounded-2xl p-3 flex flex-col min-h-[380px]`}>
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80">
                <span className="font-heading font-bold text-xs text-slate-800">
                  {col.label}
                </span>
                <span className="text-[11px] font-mono font-bold bg-white text-slate-700 px-2 py-0.5 rounded-full border border-slate-200 shadow-xs">
                  {tasksInCol.length}
                </span>
              </div>

              <div className="flex-1 space-y-2.5 overflow-y-auto">
                {tasksInCol.length === 0 ? (<div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl text-[11px] text-slate-400">
                    No tasks
                  </div>) : (tasksInCol.map((task) => (<div key={task.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-2">
                      <div className="flex items-start justify-between">
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${task.priority === "high"
                        ? "bg-rose-100 text-rose-800 border border-rose-200"
                        : "bg-slate-100 text-slate-700"}`}>
                          {task.priority} priority
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Due {task.dueDate}
                        </span>
                      </div>

                      <h5 className="font-heading font-bold text-xs text-slate-900 leading-snug">
                        {task.title}
                      </h5>

                      <p className="text-[11px] text-slate-600 line-clamp-2">
                        {task.description}
                      </p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="flex items-center space-x-1 text-slate-600 font-medium truncate max-w-[120px]">
                          <User className="w-3 h-3 text-emerald-600 shrink-0"/>
                          <span>{task.assignedName}</span>
                        </span>

                        {/* Move Status Buttons */}
                        <select value={task.status} onChange={(e) => updateTaskStatus(task.id, e.target.value)} className="text-[10px] bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 font-medium">
                          <option value="backlog">Backlog</option>
                          <option value="in_progress">In Progress</option>
                          <option value="review">Review</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>)))}
              </div>
            </div>);
        })}
      </div>
    </div>);
};
