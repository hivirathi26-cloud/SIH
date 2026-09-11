import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { MoUSigningModal } from "../components/industry/MoUSigningModal";
import { GraduationCap, FileSignature, Filter, Rocket, Search } from "lucide-react";
export const IndustryMarketplacePage = () => {
    const { proposals, currentUser } = useApp();
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [signingProposal, setSigningProposal] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const filteredProposals = proposals.filter((prop) => {
        const matchCategory = selectedCategory === "all" || prop.problemCategory === selectedCategory;
        const matchSearch = prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            prop.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
            prop.universityName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-800 via-orange-800 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <span className="bg-amber-500/30 text-amber-200 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-400/30 uppercase">
            MODULE D: INDUSTRY PARTNERSHIP & OPEN INNOVATION
          </span>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl">
            Industry, CSR & Startup Co-Creation Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 max-w-2xl leading-relaxed">
            Discover vetted university research proposals, co-fund high-impact prototypes, sponsor lab equipment, and execute digital MoUs with tax-deductible CSR innovation credits.
          </p>
        </div>

        <Link to="/industry/agreements" className="flex items-center space-x-1.5 px-5 py-3 bg-white text-slate-900 hover:bg-amber-50 rounded-xl text-xs font-bold shadow-md transition">
          <FileSignature className="w-4 h-4 text-amber-600"/>
          <span>View Signed MoUs & Grants</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400"/>
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search proposals, universities, tech keywords..." className="w-full text-xs p-1.5 focus:outline-none"/>
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400"/>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="text-xs p-2 border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-amber-500 focus:outline-none">
            <option value="all">All Innovation Sectors</option>
            <option value="Water Resources & Sanitation">Water Resources & Sanitation</option>
            <option value="Agriculture & Allied Technologies">AgriTech & Rural Tools</option>
            <option value="Environment & Mining Remediation">Mining & CleanTech</option>
            <option value="Healthcare & MedTech">MedTech & Telemedicine</option>
            <option value="Forest & Tribal Livelihoods">Forest & Tribal Livelihoods</option>
          </select>
        </div>
      </div>

      {/* Proposals Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProposals.map((prop) => (<div key={prop.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
                  {prop.problemCategory}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  {prop.durationMonths} Months Duration
                </span>
              </div>

              <h3 className="font-heading font-bold text-lg text-slate-900 leading-snug">
                {prop.title}
              </h3>

              <div className="flex items-center space-x-2 text-xs text-slate-600">
                <GraduationCap className="w-4 h-4 text-blue-600 shrink-0"/>
                <span className="font-semibold">{prop.universityName}</span>
                <span>•</span>
                <span>Mentor: {prop.facultyMentorName}</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {prop.summary}
              </p>

              {/* Approach & Budget Highlights */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span className="text-slate-500">Estimated Project Budget:</span>
                  <span className="font-mono font-extrabold text-emerald-700">
                    ₹{(prop.estimatedBudget).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span className="text-slate-500">Target District:</span>
                  <span className="font-semibold text-slate-900">{prop.district}</span>
                </div>
              </div>

              {prop.startupIncubationEligible && (<div className="flex items-center space-x-1.5 text-[11px] font-bold text-purple-700 bg-purple-50 p-2 rounded-lg border border-purple-200">
                  <Rocket className="w-3.5 h-3.5"/>
                  <span>State Startup Incubation Auto-Trigger Active</span>
                </div>)}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <Link to={`/lifecycle/${prop.id}`} className="text-xs font-bold text-slate-700 hover:text-slate-900">
                View Milestone Gantt &rarr;
              </Link>

              <button onClick={() => setSigningProposal(prop)} className="flex items-center space-x-1.5 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-600/20 transition hover:scale-105">
                <FileSignature className="w-4 h-4"/>
                <span>Partner & E-Sign MoU &rarr;</span>
              </button>
            </div>
          </div>))}
      </div>

      {/* MoU Modal */}
      <MoUSigningModal proposal={signingProposal} onClose={() => setSigningProposal(null)}/>
    </div>);
};
