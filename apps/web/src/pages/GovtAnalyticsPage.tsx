import React from "react";
import { useApp } from "../context/AppContext";
import { JharkhandHeatmap } from "../components/analytics/JharkhandHeatmap";
import { AnalyticsCharts } from "../components/analytics/AnalyticsCharts";
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  Building,
  GraduationCap,
  Users,
  ShieldCheck,
  TrendingUp,
  MapPin
} from "lucide-react";

export const GovtAnalyticsPage: React.FC = () => {
  const { problems, universities, agreements, selectedDistrict, setSelectedDistrict } = useApp();

  const handleExportPDF = () => {
    alert("Exporting Executive Jharkhand Societal Innovation BI Report (PDF)...");
  };

  const handleExportExcel = () => {
    alert("Exporting Raw District & HEI Innovation Ledger (.xlsx)...");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="bg-indigo-500/30 text-indigo-200 text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-400/30 uppercase">
              MODULE F: GOVERNMENT & DISTRICT ANALYTICS
            </span>
            <span className="text-xs text-indigo-300">Executive Decision Portal</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl">
            State Innovation & Impact Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-2xl leading-relaxed">
            Real-time visual analytics across 24 Jharkhand districts, university participation rankings, CSR fund tracking, and closed-loop societal outcomes.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportPDF}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Top High-Level Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium block">Total State Challenges</span>
          <span className="font-heading font-extrabold text-3xl text-slate-900 font-mono mt-1 block">
            {problems.length + 580}
          </span>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">↑ 18% month-over-month</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium block">Academic Projects Active</span>
          <span className="font-heading font-extrabold text-3xl text-blue-600 font-mono mt-1 block">
            66
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Across BIT, IIT, NIT, BAU</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium block">CSR Funds Mobilized</span>
          <span className="font-heading font-extrabold text-3xl text-emerald-600 font-mono mt-1 block">
            ₹52.8 L
          </span>
          <span className="text-[11px] text-emerald-600 font-bold mt-1 block">100% Verified on Chain</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium block">Deployed Community Fixes</span>
          <span className="font-heading font-extrabold text-3xl text-purple-600 font-mono mt-1 block">
            146
          </span>
          <span className="text-[11px] text-purple-700 font-bold mt-1 block">4.9★ Citizen Satisfaction</span>
        </div>
      </div>

      {/* 24-District Interactive Heatmap */}
      <JharkhandHeatmap
        selectedDistrict={selectedDistrict}
        onSelectDistrict={(d) => setSelectedDistrict(d)}
      />

      {/* Analytics Charts */}
      <AnalyticsCharts />
    </div>
  );
};
