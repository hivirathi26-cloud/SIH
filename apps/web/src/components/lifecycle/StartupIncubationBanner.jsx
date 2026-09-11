import React from "react";
import { Rocket, Sparkles, ExternalLink } from "lucide-react";
export const StartupIncubationBanner = ({ proposalTitle, universityName }) => {
    return (<div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-lg border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-start space-x-3.5">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0">
          <Rocket className="w-6 h-6"/>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs bg-purple-500/30 text-purple-200 font-bold px-2 py-0.5 rounded border border-purple-400/40">
              COMMERCIAL VIABILITY AUTO-TRIGGERED
            </span>
            <span className="text-xs text-amber-300 font-bold flex items-center space-x-1">
              <Sparkles className="w-3 h-3"/>
              <span>Jharkhand Startup Policy 2026 Eligible</span>
            </span>
          </div>
          <h4 className="font-heading font-bold text-base text-white mt-1">
            Fast-Track Seed Grant & Incubation Cell Onboarding
          </h4>
          <p className="text-xs text-purple-200 mt-0.5 leading-relaxed">
            This university solution demonstrates high technology readiness level (TRL 6+). Direct eligibility for ₹15 Lakhs Seed Grant and incubation at Atal Incubation Centre / {universityName} Tech Park.
          </p>
        </div>
      </div>

      <button onClick={() => alert("Redirecting to Jharkhand State Startup Portal (startup.jharkhand.gov.in) with pre-filled innovation dossier!")} className="shrink-0 flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-500/30 transition hover:scale-105">
        <span>Apply for State Incubation Grant</span>
        <ExternalLink className="w-4 h-4"/>
      </button>
    </div>);
};
