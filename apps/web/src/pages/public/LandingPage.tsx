import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useAuth, getPortalPath } from "../../context/AuthContext";
import { StatusPill } from "../../components/common/StatusPill";
import {
  Search,
  FileCheck,
  PlusCircle,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  ArrowRight,
  Users
} from "lucide-react";

export const LandingPage: React.FC = () => {
  const { problems } = useApp();
  const { loginAsRole } = useAuth();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");

  const filteredProblems = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDist = selectedDistrict === "all" || p.district === selectedDistrict;
    return matchesSearch && matchesDist;
  });

  const handleQuickRoleAccess = (role: any) => {
    loginAsRole(role);
    navigate(getPortalPath(role));
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Official Government Hero Header */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center space-x-2 bg-slate-100 text-[#0f2942] px-3 py-1 rounded text-xs font-semibold border border-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>NEP 2020 & Jharkhand State Innovation Policy 2026 Mandate</span>
              </div>

              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#0f2942] tracking-tight leading-tight">
                झारखंड सामाजिक नवाचार सहयोग पोर्टल
              </h1>
              <h2 className="font-heading font-bold text-lg sm:text-xl text-slate-700">
                Jharkhand Societal Innovation Collaboration Portal (JSICP)
              </h2>

              <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
                A unified three-sided governmental platform bridging <strong>Citizens & Panchayati Raj</strong> with <strong>Higher Education Institutions</strong> (BIT Mesra, IIT ISM, NIT, BAU) and <strong>Industry/CSR Partners</strong> to solve real ground challenges across Jharkhand 24 districts.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 bg-[#0f2942] hover:bg-[#163b5f] text-white text-xs font-semibold rounded shadow-xs flex items-center space-x-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Enter Stakeholder Portal (Parichay SSO)</span>
                </Link>

                <Link
                  to="/track"
                  className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded flex items-center space-x-2"
                >
                  <FileCheck className="w-4 h-4 text-slate-500" />
                  <span>Track Complaint / Ticket Status</span>
                </Link>
              </div>
            </div>

            {/* Quick Stats Panel */}
            <div className="lg:col-span-4 bg-[#f8fafc] p-5 rounded-lg border border-slate-200 space-y-4">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block border-b border-slate-200 pb-2">
                Real-Time State Indicators
              </span>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Civic Challenges</span>
                  <span className="font-mono font-bold text-lg text-slate-900">{problems.length + 580}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Partner HEIs</span>
                  <span className="font-mono font-bold text-lg text-blue-800">5 Premier HEIs</span>
                </div>
                <div>
                  <span className="text-slate-500 block">CSR Committed</span>
                  <span className="font-mono font-bold text-lg text-emerald-800">₹52.8 Lakhs</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Districts Covered</span>
                  <span className="font-mono font-bold text-lg text-amber-800">24 / 24 Districts</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                100% Cryptographically verified on state milestone audit ledger.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Stakeholder Portals Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4">
          <h3 className="font-heading font-bold text-base text-slate-900">
            Dedicated Stakeholder Workspaces (RBAC)
          </h3>
          <p className="text-xs text-slate-500">
            Click to enter any stakeholder environment with authenticated role permissions:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Citizen */}
          <div
            onClick={() => handleQuickRoleAccess("citizen")}
            className="bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-400 shadow-xs cursor-pointer transition space-y-2"
          >
            <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-bold text-sm text-slate-900">Citizen & PRI Portal</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Report civic problems via voice (Nagpuri, Santali, Hindi), GPS tagging, and track 10-step resolution.
            </p>
            <span className="text-xs font-semibold text-emerald-800 flex items-center space-x-1 pt-1">
              <span>Open Portal</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          {/* University */}
          <div
            onClick={() => handleQuickRoleAccess("hei_nodal")}
            className="bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-400 shadow-xs cursor-pointer transition space-y-2"
          >
            <div className="w-8 h-8 rounded bg-blue-50 text-blue-800 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-bold text-sm text-slate-900">University Nodal Desk</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              BIT Mesra, IIT ISM, NIT: Review AI-routed challenges, assign faculty, and oversee student cohorts.
            </p>
            <span className="text-xs font-semibold text-blue-800 flex items-center space-x-1 pt-1">
              <span>Open Portal</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          {/* Industry */}
          <div
            onClick={() => handleQuickRoleAccess("industry")}
            className="bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-400 shadow-xs cursor-pointer transition space-y-2"
          >
            <div className="w-8 h-8 rounded bg-amber-50 text-amber-800 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-bold text-sm text-slate-900">Industry & CSR Hub</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tata Steel, Startups & MSMEs: Browse verified proposals, e-sign bilateral MoUs, and disburse grants.
            </p>
            <span className="text-xs font-semibold text-amber-800 flex items-center space-x-1 pt-1">
              <span>Open Portal</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>

          {/* Govt Admin */}
          <div
            onClick={() => handleQuickRoleAccess("govt_admin")}
            className="bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-400 shadow-xs cursor-pointer transition space-y-2"
          >
            <div className="w-8 h-8 rounded bg-purple-50 text-purple-800 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-bold text-sm text-slate-900">State Admin & DM</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              State Nodal Authority: 24-district heatmap, AI triage validation gate, and dual sign-off fund release.
            </p>
            <span className="text-xs font-semibold text-purple-800 flex items-center space-x-1 pt-1">
              <span>Open Portal</span>
              <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </section>

      {/* Searchable Public Directory of Challenges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
          <div>
            <h3 className="font-heading font-bold text-base text-slate-900">
              सार्वजनिक समस्या निर्देशिका (Public Challenge Directory)
            </h3>
            <p className="text-xs text-slate-500">
              Browse ground societal issues currently routed to Higher Education Institutions
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <input
              type="text"
              placeholder="Search by ticket or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border border-slate-300 rounded focus:outline-none focus:border-[#0f2942]"
            />

            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="p-2 border border-slate-300 rounded bg-slate-50"
            >
              <option value="all">All 24 Districts</option>
              <option value="Ranchi">Ranchi</option>
              <option value="Dhanbad">Dhanbad</option>
              <option value="East Singhbhum">East Singhbhum</option>
              <option value="Khunti">Khunti</option>
              <option value="Bokaro">Bokaro</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredProblems.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-2 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{p.ticketNumber}</span>
                  <StatusPill status={p.status} />
                  <span className="text-slate-500">District: {p.district} ({p.block || "Sadar"})</span>
                </div>
                <span className="font-mono text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</span>
              </div>

              <div>
                <h4 className="font-heading font-bold text-sm text-slate-900">{p.title}</h4>
                <p className="text-slate-600 mt-1 line-clamp-2 leading-relaxed">{p.description}</p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px]">
                <div className="flex items-center space-x-2">
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">{p.category}</span>
                  {p.assignedUniversityName && (
                    <span className="text-slate-600">Assigned HEI: <strong>{p.assignedUniversityName}</strong></span>
                  )}
                </div>

                <Link
                  to="/track"
                  className="text-blue-700 hover:text-blue-900 font-semibold"
                >
                  View Resolution Roadmap &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
