import React, { useState } from "react";
import { JHARKHAND_DISTRICTS } from "../../data/mockData";
import { DistrictGeoData } from "../../types";
import { MapPin, ArrowUpRight, Filter, Layers } from "lucide-react";

export const JharkhandHeatmap: React.FC<{
  selectedDistrict: string;
  onSelectDistrict: (districtId: string) => void;
}> = ({ selectedDistrict, onSelectDistrict }) => {
  const [metric, setMetric] = useState<"total" | "resolved" | "vulnerability">("total");

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-heading font-bold text-base text-slate-900">
              Jharkhand 24-District Interactive Civic Heatmap
            </h3>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-300">
              PostGIS Geo-Tagged
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real-time societal challenge density, resolution throughput, and vulnerability indices
          </p>
        </div>

        {/* Metric Switcher */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs">
          <button
            onClick={() => setMetric("total")}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              metric === "total" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-600"
            }`}
          >
            Submissions
          </button>
          <button
            onClick={() => setMetric("resolved")}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              metric === "resolved" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-600"
            }`}
          >
            Resolved
          </button>
          <button
            onClick={() => setMetric("vulnerability")}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              metric === "vulnerability" ? "bg-white text-slate-900 shadow-xs font-bold" : "text-slate-600"
            }`}
          >
            Vulnerability
          </button>
        </div>
      </div>

      {/* District Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 max-h-96 overflow-y-auto pr-1">
        {JHARKHAND_DISTRICTS.map((d) => {
          const isSelected = selectedDistrict.toLowerCase() === d.name.toLowerCase() || selectedDistrict === d.id;
          
          let intensityColor = "bg-emerald-50 text-emerald-900 border-emerald-200";
          if (metric === "total") {
            intensityColor = d.totalProblems > 80
              ? "bg-rose-50 text-rose-900 border-rose-300"
              : d.totalProblems > 50
              ? "bg-amber-50 text-amber-900 border-amber-300"
              : "bg-emerald-50 text-emerald-900 border-emerald-200";
          } else if (metric === "vulnerability") {
            intensityColor = d.vulnerabilityIndex > 0.75
              ? "bg-rose-50 text-rose-900 border-rose-300"
              : d.vulnerabilityIndex > 0.55
              ? "bg-amber-50 text-amber-900 border-amber-300"
              : "bg-emerald-50 text-emerald-900 border-emerald-200";
          }

          return (
            <button
              key={d.id}
              onClick={() => onSelectDistrict(d.name)}
              className={`p-3 rounded-xl border text-left transition transform hover:scale-102 flex flex-col justify-between ${
                isSelected
                  ? "ring-2 ring-emerald-600 bg-emerald-600 text-white shadow-md"
                  : `${intensityColor} hover:shadow-sm`
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-heading font-bold text-xs truncate">{d.name}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60 shrink-0" />
                </div>
                <span className={`text-[10px] block ${isSelected ? "text-emerald-100" : "text-slate-500"}`}>
                  {d.hindiName}
                </span>
              </div>

              <div className="mt-2 pt-1.5 border-t border-current/10 flex items-end justify-between">
                <div>
                  <span className="text-[9px] uppercase font-mono block opacity-80">
                    {metric === "total" ? "Total" : metric === "resolved" ? "Resolved" : "Vulner."}
                  </span>
                  <span className="font-mono font-bold text-xs">
                    {metric === "total" ? d.totalProblems : metric === "resolved" ? d.resolvedProblems : `${(d.vulnerabilityIndex * 100).toFixed(0)}%`}
                  </span>
                </div>
                <span className={`text-[9px] font-medium px-1 rounded ${isSelected ? "bg-white/20 text-white" : "bg-black/5"}`}>
                  {d.division.split(" ")[0]}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
