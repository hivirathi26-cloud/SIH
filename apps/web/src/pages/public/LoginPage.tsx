import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, getPortalPath } from "../../context/AuthContext";
import { ShieldCheck, User as UserIcon } from "lucide-react";

export const LoginPage: React.FC = () => {
  const { loginAsRole, loginWithCredentials, demoUsers } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginWithCredentials(username || "sunita.devi.ranchi@gmail.com", password || "password");
    navigate("/portal/citizen");
  };

  const handleRoleQuickLogin = (roleKey: any) => {
    loginAsRole(roleKey);
    navigate(getPortalPath(roleKey));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 text-xs">
      <div className="text-center space-y-1">
        <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-[#0f2942]">
          झारखंड सामाजिक नवाचार सहयोग पोर्टल — प्रवेश (Sign In)
        </h2>
        <p className="text-slate-600">
          Official Single Sign-On (Parichay / DigiLocker / Academic Identity Gateway)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Official Login Form */}
        <div className="md:col-span-6 bg-white p-6 rounded-lg border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <span className="font-bold text-slate-800 text-sm">Parichay / Official SSO Login</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded border border-emerald-200">
              DigiLocker eKYC
            </span>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Official Email / Mobile / Parichay ID
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. nodal.innovation@bitmesra.ac.in"
                className="w-full p-2.5 border border-slate-300 rounded focus:border-[#0f2942] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Password / OTP
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-2.5 border border-slate-300 rounded focus:border-[#0f2942] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#0f2942] hover:bg-[#163b5f] text-white font-semibold rounded shadow-xs"
            >
              Sign In to Authenticated Portal &rarr;
            </button>
          </form>

          <div className="pt-2 text-[11px] text-slate-500 text-center">
            Secured by National Informatics Centre (NIC) and Aadhaar eKYC regulations.
          </div>
        </div>

        {/* Right Column: 1-Click Demo Stakeholder Switcher for Judges */}
        <div className="md:col-span-6 bg-[#f8fafc] p-6 rounded-lg border border-slate-200 space-y-4 max-h-[620px] overflow-y-auto">
          <div className="border-b border-slate-200 pb-2">
            <span className="font-bold text-slate-800 text-xs uppercase tracking-wider block">
              Evaluation & Multi-Actor Role Switcher
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Click any verified stakeholder below to instantly authenticate into their isolated workspace:
            </p>
          </div>

          {/* Categorized Groups */}
          {[
            {
              category: "🏛️ BIT Mesra Ecosystem (Water, Environment & IoT)",
              keys: ["hei_nodal", "faculty", "student", "student_priya", "student_sneha", "student_amit"]
            },
            {
              category: "⛏️ IIT (ISM) Dhanbad Ecosystem (Mining Tech & Robotics)",
              keys: ["hei_iit_dhanbad", "faculty_iit", "student_iit_rohan", "student_iit_ananya", "student_iit_vikas"]
            },
            {
              category: "🏥 AIIMS Deoghar Ecosystem (MedTech & Cold-Chain)",
              keys: ["hei_aiims_deoghar", "faculty_aiims", "student_aiims_deepak", "student_aiims_kavita"]
            },
            {
              category: "🌾 Birsa Agricultural University - BAU (AgriTech & Bio-Processing)",
              keys: ["hei_bau_ranchi", "faculty_bau", "student_bau_birsa", "student_bau_pooja"]
            },
            {
              category: "🏭 Industry & CSR Co-Funding Anchors",
              keys: ["industry"]
            },
            {
              category: "🏛️ State Apex Command & District Administration",
              keys: ["govt_admin"]
            },
            {
              category: "👥 Grassroots Citizens & Panchayati Raj (PRI)",
              keys: ["citizen", "pri"]
            }
          ].map((group) => (
            <div key={group.category} className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                {group.category}
              </span>
              <div className="space-y-1.5">
                {group.keys.map((k) => {
                  const u = demoUsers[k];
                  if (!u) return null;
                  return (
                    <button
                      key={k}
                      onClick={() => handleRoleQuickLogin(k)}
                      className="w-full text-left p-2 bg-white hover:bg-blue-50/60 border border-slate-200 rounded transition flex items-center justify-between group shadow-2xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 group-hover:text-[#0f2942] block text-xs">
                          {u.fullName}
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate max-w-xs">{u.roleTitle}</span>
                      </div>
                      <span className="text-[9px] bg-slate-100 group-hover:bg-[#0f2942] group-hover:text-white text-slate-700 font-mono font-semibold px-2 py-0.5 rounded transition shrink-0 ml-2">
                        Enter Workspace &rarr;
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
