import React from "react";
import { ShieldCheck, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                JS
              </div>
              <span className="font-heading font-extrabold text-lg text-white tracking-tight">
                JSICP Jharkhand
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Jharkhand Societal Innovation Collaboration Portal — closing the loop from citizen challenge to academic research, industry funding, and deployed community solutions.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Smart India Hackathon (SIH 2026) Official Solution</span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-heading font-bold text-slate-200 text-sm mb-3">Key Stakeholders</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#citizens" className="hover:text-emerald-400 transition">Citizens, SHGs, PRIs & ULBs</a></li>
              <li><a href="#heis" className="hover:text-emerald-400 transition">Universities & Research HEIs (BIT, IIT, NIT, BAU)</a></li>
              <li><a href="#faculty" className="hover:text-emerald-400 transition">Faculty Mentors & Multidisciplinary Teams</a></li>
              <li><a href="#industry" className="hover:text-emerald-400 transition">Startups, MSMEs & CSR Foundations</a></li>
              <li><a href="#govt" className="hover:text-emerald-400 transition">State Nodal Admin & District Magistrates</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-heading font-bold text-slate-200 text-sm mb-3">UN SDG Alignment</h4>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="bg-blue-900/60 text-blue-300 px-2 py-1 rounded border border-blue-700">SDG 6: Clean Water</span>
              <span className="bg-amber-900/60 text-amber-300 px-2 py-1 rounded border border-amber-700">SDG 2: Zero Hunger</span>
              <span className="bg-emerald-900/60 text-emerald-300 px-2 py-1 rounded border border-emerald-700">SDG 3: Good Health</span>
              <span className="bg-indigo-900/60 text-indigo-300 px-2 py-1 rounded border border-indigo-700">SDG 9: Innovation</span>
              <span className="bg-teal-900/60 text-teal-300 px-2 py-1 rounded border border-teal-700">SDG 11: Sustainable Cities</span>
              <span className="bg-green-900/60 text-green-300 px-2 py-1 rounded border border-green-700">SDG 13: Climate Action</span>
            </div>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="font-heading font-bold text-slate-200 text-sm mb-3">Govt Technical Compliance</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• NIC MeghRaj Cloud Ready</li>
              <li>• PostGIS 4326 Geo-Spatial Indexing</li>
              <li>• DigiLocker / Aadhaar eKYC Sandbox</li>
              <li>• Explainable AI Validation Gate</li>
              <li>• Immutable Blockchain Milestone Ledger</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 Government of Jharkhand. Designed for SIH 2026 Societal Innovation Track.</p>
          <p className="mt-2 sm:mt-0 flex items-center space-x-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Jharkhand 24 Districts</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
