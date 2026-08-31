import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { StatusPill } from "../components/common/StatusPill";
import { SdgBadge } from "../components/common/SdgBadge";
import {
  Sparkles,
  ArrowRight,
  PlusCircle,
  ShieldCheck,
  Award,
  Users,
  GraduationCap,
  Briefcase,
  Layers,
  Search,
  CheckCircle2,
  TrendingUp,
  MapPin,
  Heart,
  ChevronRight
} from "lucide-react";

export const HomePage: React.FC = () => {
  const { problems, universities, proposals, agreements, upvoteProblem, setSelectedDistrict } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const totalFundsMobilized = agreements.reduce((sum, a) => sum + (a.amount || 0), 0);
  const resolvedCount = problems.filter((p) => p.status === "deployed" || p.status === "closed").length;

  const filteredProblems = problems.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.district.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = filterCategory === "all" || p.category === filterCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 rounded-b-3xl shadow-xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Official Badge */}
          <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-300 backdrop-blur-sm animate-in fade-in slide-in-from-top-4">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Smart India Hackathon 2026 • Jharkhand Societal Innovation Track</span>
          </div>

          {/* Master Heading */}
          <h1 className="font-heading font-extrabold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-tight">
            Closing the Loop from <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
              Citizen Challenge &rarr; Academic Solution &rarr; Deployed Reality
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            An AI-enabled, 3-sided collaborative innovation ecosystem uniting <strong>Citizens & PRIs</strong>, <strong>Higher Education Institutions</strong> (BIT Mesra, IIT ISM, NIT, BAU), and <strong>Industry/CSR Partners</strong> across all 24 districts of Jharkhand.
          </p>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <Link
              to="/submit"
              className="flex items-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/30 transition hover:scale-105"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Submit a Societal Challenge</span>
            </Link>

            <Link
              to="/my-problems"
              className="flex items-center space-x-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-sm font-semibold transition"
            >
              <span>Track Challenge Status</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/industry/marketplace"
              className="flex items-center space-x-2 px-6 py-3.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-xl text-sm font-semibold transition"
            >
              <Briefcase className="w-4 h-4" />
              <span>Industry & CSR Marketplace</span>
            </Link>
          </div>
        </div>

        {/* Live Metrics Ribbon */}
        <div className="relative max-w-6xl mx-auto mt-14 grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
          <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl">
            <span className="font-heading font-extrabold text-2xl sm:text-3xl text-emerald-400 block font-mono">
              {problems.length + 580}
            </span>
            <span className="text-xs text-slate-300 font-medium">Challenges Submitted</span>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl">
            <span className="font-heading font-extrabold text-2xl sm:text-3xl text-teal-300 block font-mono">
              24 / 24
            </span>
            <span className="text-xs text-slate-300 font-medium">Districts Covered</span>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl">
            <span className="font-heading font-extrabold text-2xl sm:text-3xl text-blue-400 block font-mono">
              {universities.length} HEIs
            </span>
            <span className="text-xs text-slate-300 font-medium">BIT, IIT, NIT, BAU</span>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl">
            <span className="font-heading font-extrabold text-2xl sm:text-3xl text-amber-400 block font-mono">
              ₹{(totalFundsMobilized / 100000 + 45.2).toFixed(1)} L
            </span>
            <span className="text-xs text-slate-300 font-medium">CSR Funds Mobilized</span>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-md p-4 rounded-2xl col-span-2 md:col-span-1">
            <span className="font-heading font-extrabold text-2xl sm:text-3xl text-purple-400 block font-mono">
              {resolvedCount + 142}
            </span>
            <span className="text-xs text-slate-300 font-medium">Deployed Solutions</span>
          </div>
        </div>
      </section>

      {/* 3-Sided Workflow Architecture Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs uppercase font-bold text-emerald-600 tracking-wider">
            3-Sided Collaborative Platform Architecture
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
            How JSICP Works Across Stakeholders
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
            From rural problem submission to AI triage, academic multidisciplinary research, CSR co-funding, and field impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Side 1: Citizens & PRIs */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">Side 1: Ground Truth</span>
              <h3 className="font-heading font-bold text-lg text-slate-900 mt-1">
                Citizens, PRIs & ULBs
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Submit local challenges via voice-to-text in Hindi/Nagpuri/Santali, upload geo-tagged photos, and track resolution through 10-step progress steppers with post-deployment feedback ratings.
              </p>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Multilingual & Voice Dialect Ingestion</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>GPS Auto-Tagging & Offline Caching</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Gamified Badges & Civic Points</span>
              </li>
            </ul>
          </div>

          {/* Side 2: Academic HEIs */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wide">Side 2: Innovation Hub</span>
              <h3 className="font-heading font-bold text-lg text-slate-900 mt-1">
                Universities & Student Teams
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Receive AI-routed societal challenges matched to faculty domains. Form multidisciplinary student teams, run sprint Kanban boards, and draft solution proposals for government review.
              </p>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Smart Academic Routing Recommender</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Multidisciplinary Kanban Workspace</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>5-Stage Milestone Lifecycle & Vault</span>
              </li>
            </ul>
          </div>

          {/* Side 3: Industry & Government */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">Side 3: Scale & Deployment</span>
              <h3 className="font-heading font-bold text-lg text-slate-900 mt-1">
                Industry, CSR & Govt Admins
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Startups, MSMEs, and CSR Foundations browse verified proposals, e-sign MoUs with digital signatures, disburse grant funding, and monitor state-wide impact through real-time BI dashboards.
              </p>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Open Innovation Marketplace</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Blockchain Milestone & Funding Ledger</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                <span>24-District Interactive Heatmaps</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Active Societal Challenges Stream */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading font-extrabold text-2xl text-slate-900">
              Active Societal Challenges in Jharkhand
            </h2>
            <p className="text-xs text-slate-500">
              Explore live citizen-submitted issues undergoing academic research and pilot deployment
            </p>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search challenges or districts..."
                className="text-xs pl-9 pr-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none w-56 sm:w-64"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="all">All Domains</option>
              <option value="Water Resources & Sanitation">Water Resources & Sanitation</option>
              <option value="Agriculture & Allied Technologies">Agriculture & Allied Tech</option>
              <option value="Environment & Mining Remediation">Mining & Environment</option>
              <option value="Healthcare & MedTech">Healthcare & MedTech</option>
              <option value="Forest & Tribal Livelihoods">Forest & Tribal Livelihoods</option>
              <option value="Rural Infrastructure & Transport">Rural Infrastructure</option>
            </select>
          </div>
        </div>

        {/* Problems Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map((prob) => (
            <div
              key={prob.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Media Image Banner */}
                {prob.media && prob.media[0] && (
                  <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                    <img
                      src={prob.media[0].storageUrl}
                      alt={prob.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <StatusPill status={prob.status} />
                    </div>
                    <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                      Priority: {prob.priorityScore}/100
                    </div>
                  </div>
                )}

                <div className="p-5 space-y-3">
                  <div className="flex items-center space-x-2 text-[11px] text-slate-500 font-mono">
                    <span>{prob.ticketNumber}</span>
                    <span>•</span>
                    <span className="flex items-center space-x-0.5 text-slate-700 font-semibold">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      <span>{prob.district}</span>
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-base text-slate-900 leading-snug line-clamp-2">
                    {prob.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {prob.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {prob.sdgTags.map((tag, i) => (
                      <SdgBadge key={i} tag={tag} />
                    ))}
                  </div>

                  {prob.assignedUniversityName && (
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-[11px] flex items-center space-x-2">
                      <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="text-slate-700 font-medium truncate">
                        Assigned HEI: <strong>{prob.assignedUniversityName}</strong>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => upvoteProblem(prob.id)}
                  className="flex items-center space-x-1.5 text-xs text-slate-600 hover:text-emerald-700 transition"
                  title="I face this issue too"
                >
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span className="font-bold">{prob.citizenSupportCount} Citizen Supports</span>
                </button>

                <Link
                  to="/my-problems"
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center space-x-1"
                >
                  <span>Track Lifecycle</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
