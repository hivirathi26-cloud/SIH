import React from "react";
export const GovtFooter = () => {
    return (<footer className="bg-[#0b1d33] text-slate-400 text-xs border-t border-[#163b5f] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded bg-[#0f2942] border border-[#1e3a5f] text-amber-400 flex items-center justify-center font-bold text-xs">
                JH
              </div>
              <span className="font-heading font-bold text-sm text-slate-100">
                JSICP — झारखंड सरकार
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              झारखंड सामाजिक नवाचार सहयोग पोर्टल (Jharkhand Societal Innovation Collaboration Portal). Operationalizing experiential, community-linked research under NEP 2020.
            </p>
            <div className="text-[10px] text-slate-400">
              Department of Higher & Technical Education, Government of Jharkhand.
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">
              Participating Institutions
            </h4>
            <ul className="space-y-1 text-[11px] text-slate-400">
              <li>Birla Institute of Technology (BIT Mesra, Ranchi)</li>
              <li>Indian Institute of Technology (IIT ISM Dhanbad)</li>
              <li>National Institute of Technology (NIT Jamshedpur)</li>
              <li>Birsa Agricultural University (BAU Kanke, Ranchi)</li>
              <li>Ranchi University & Kolhan University</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">
              Mandates & Compliance
            </h4>
            <ul className="space-y-1 text-[11px] text-slate-400">
              <li>• NEP 2020 Experiential Learning Framework</li>
              <li>• Jharkhand State Startup Policy 2026</li>
              <li>• Section 135 Companies Act (CSR Innovation)</li>
              <li>• PostGIS 4326 Geo-Spatial Standard</li>
              <li>• MeghRaj Cloud / NIC Security Compliance</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-200 text-xs uppercase tracking-wider">
              Helpdesk & Nodal Contact
            </h4>
            <p className="text-[11px] text-slate-400">
              State Project Directorate, Higher Education Department, Nepal House, Doranda, Ranchi - 834002.
            </p>
            <p className="text-[11px] text-slate-300 font-mono">
              Toll-Free: 1800-345-6541
            </p>
            <p className="text-[11px] text-slate-400">
              Email: support.jsicp@jharkhand.gov.in
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#163b5f] flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
          <p>© 2026 Government of Jharkhand. All Rights Reserved. Smart India Hackathon (SIH 2026).</p>
          <div className="flex items-center space-x-4 mt-2 sm:mt-0">
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-300">Accessibility Statement</a>
          </div>
        </div>
      </div>
    </footer>);
};
