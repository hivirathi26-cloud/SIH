import React from "react";
import { JHARKHAND_DISTRICTS } from "../../data/mockData";
import { MapPin, Check } from "lucide-react";

export const DistrictMapPicker: React.FC<{
  selectedDistrict: string;
  onSelectDistrict: (districtName: string, lat: number, lng: number) => void;
}> = ({ selectedDistrict, onSelectDistrict }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-800 flex items-center space-x-1.5">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span>Select District in Jharkhand (24 Districts):</span>
        </label>
        <span className="text-[11px] text-slate-500">Auto-coordinates mapped</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-200 rounded-xl bg-slate-50/50">
        {JHARKHAND_DISTRICTS.map((d) => {
          const isSelected = selectedDistrict.toLowerCase() === d.name.toLowerCase();
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => onSelectDistrict(d.name, d.latitude, d.longitude)}
              className={`flex items-center justify-between p-2 rounded-lg text-xs font-medium border text-left transition ${
                isSelected
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300"
              }`}
            >
              <div>
                <span className="block font-semibold">{d.name}</span>
                <span className={`text-[10px] block ${isSelected ? "text-emerald-100" : "text-slate-400"}`}>
                  {d.hindiName}
                </span>
              </div>
              {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
