import React from "react";

export const SdgBadge: React.FC<{ tag: string }> = ({ tag }) => {
  const getBadgeColor = () => {
    if (tag.includes("SDG 6")) return "bg-sky-100 text-sky-800 border-sky-300";
    if (tag.includes("SDG 2")) return "bg-amber-100 text-amber-800 border-amber-300";
    if (tag.includes("SDG 3")) return "bg-emerald-100 text-emerald-800 border-emerald-300";
    if (tag.includes("SDG 9")) return "bg-indigo-100 text-indigo-800 border-indigo-300";
    if (tag.includes("SDG 11")) return "bg-orange-100 text-orange-800 border-orange-300";
    if (tag.includes("SDG 13")) return "bg-teal-100 text-teal-800 border-teal-300";
    if (tag.includes("SDG 8")) return "bg-rose-100 text-rose-800 border-rose-300";
    return "bg-slate-100 text-slate-800 border-slate-300";
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${getBadgeColor()}`}>
      {tag}
    </span>
  );
};
