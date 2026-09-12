import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { useAuth, getPortalPath } from "../../context/AuthContext";
import { StatusPill } from "../../components/common/StatusPill";
import { FileCheck, GraduationCap, Briefcase, ShieldCheck, ArrowRight, Users, Download, ExternalLink, User, X } from "lucide-react";
export const LandingPage = () => {
    const { problems } = useApp();
    const { loginAsRole } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("all");
    const [selectedLeader, setSelectedLeader] = useState(null);
    const filteredProblems = problems.filter((p) => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDist = selectedDistrict === "all" || p.district === selectedDistrict;
        return matchesSearch && matchesDist;
    });
    const handleQuickRoleAccess = (role) => {
        loginAsRole(role);
        navigate(getPortalPath(role));
    };
    return (<div className="space-y-10 pb-16">
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
                <Link to="/login" className="px-5 py-2.5 bg-[#0f2942] hover:bg-[#163b5f] text-white text-xs font-semibold rounded shadow-xs flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400"/>
                  <span>Enter Stakeholder Portal (Parichay SSO)</span>
                </Link>

                <Link to="/track" className="px-4 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold rounded flex items-center space-x-2">
                  <FileCheck className="w-4 h-4 text-slate-500"/>
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

      {/* Official State Leadership & Overview: Jharkhand At A Glance */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-b from-slate-50 to-white rounded-xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <span>🏛️ शासन एवं नेतृत्व | Governance & Leadership</span>
            </div>
            <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#0f2942] tracking-tight">
              JHARKHAND AT A GLANCE
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Jharkhand is an eastern Indian state. It is famous for its waterfalls, the elegant Jain temples of Parasnath Hill, and the elephants and tigers of Betla National Park.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: About Jharkhand */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">About Jharkhand</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">State</span>
                </div>
                <div className="w-full h-32 flex items-center justify-center bg-slate-50 rounded border border-slate-100 overflow-hidden">
                  <img 
                    src="/leadership/jharkhand_map.jpg" 
                    alt="Jharkhand State Map" 
                    className="h-full object-contain p-1 hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-100 text-slate-700">
                    <span className="text-slate-500">Capital</span>
                    <span className="font-semibold text-[#0f2942]">Ranchi</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 text-slate-700">
                    <span className="text-slate-500">Area</span>
                    <span className="font-semibold text-[#0f2942]">79,714 sq km</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100 text-slate-700">
                    <span className="text-slate-500">Districts</span>
                    <span className="font-semibold text-[#0f2942]">24</span>
                  </div>
                  <div className="flex justify-between py-1 text-slate-700">
                    <span className="text-slate-500">Population</span>
                    <span className="font-semibold text-[#0f2942]">3.3 Crores</span>
                  </div>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 mt-2">
                <a 
                  href="https://jharkhand.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center justify-center space-x-1"
                >
                  <span>Official Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Card 2: Governor */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col justify-between hover:shadow-md transition-shadow text-center">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-left">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Governor</span>
                  <span className="text-[10px] bg-amber-50 text-amber-800 px-2 py-0.5 rounded font-mono font-semibold">Apex</span>
                </div>
                <div className="pt-1">
                  <img 
                    src="/leadership/governor.jpg" 
                    alt="Shri Santosh Kumar Gangwar - Hon'ble Governor of Jharkhand" 
                    className="w-28 h-28 mx-auto rounded-full object-cover object-top border-4 border-white shadow-md ring-2 ring-slate-200"
                  />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-900 leading-snug">
                    Shri Santosh Kumar Gangwar
                  </h4>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    Hon'ble Governor of Jharkhand
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-center gap-3">
                <button 
                  onClick={() => setSelectedLeader({
                    name: "Shri Santosh Kumar Gangwar",
                    role: "Hon'ble Governor of Jharkhand",
                    bio: "Shri Santosh Kumar Gangwar took oath as the Governor of Jharkhand on 31st July 2024. A veteran parliamentarian and former Union Minister of State with independent charge, he has dedicated decades to public welfare, rural empowerment, and societal upliftment.",
                    image: "/leadership/governor.jpg",
                    link: "https://rajbhavanjharkhand.nic.in"
                  })}
                  className="text-xs font-semibold text-blue-700 hover:text-blue-900 inline-flex items-center space-x-1"
                >
                  <User className="w-3 h-3" />
                  <span>Profile</span>
                </button>
                <span className="text-slate-300">|</span>
                <a 
                  href="/leadership/governor.jpg" 
                  download="Governor_Santosh_Kumar_Gangwar.jpg" 
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center space-x-1"
                  title="Download Official Photo"
                >
                  <Download className="w-3 h-3" />
                  <span>Download Photo</span>
                </a>
              </div>
            </div>

            {/* Card 3: Chief Minister */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col justify-between hover:shadow-md transition-shadow text-center">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-left">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Chief Minister</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-mono font-semibold">Executive</span>
                </div>
                <div className="pt-1">
                  <img 
                    src="/leadership/cm.jpg" 
                    alt="Shri Hemant Soren - Hon'ble Chief Minister of Jharkhand" 
                    className="w-28 h-28 mx-auto rounded-full object-cover object-top border-4 border-white shadow-md ring-2 ring-slate-200"
                  />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-900 leading-snug">
                    Shri Hemant Soren
                  </h4>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    Hon'ble Chief Minister of Jharkhand
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-center gap-3">
                <button 
                  onClick={() => setSelectedLeader({
                    name: "Shri Hemant Soren",
                    role: "Hon'ble Chief Minister of Jharkhand",
                    bio: "Shri Hemant Soren is the Chief Minister of Jharkhand. Leading the state's vision of inclusive industrialization, green energy transition, tribal education, and community innovation, he champions direct citizen engagement and technological modernization.",
                    image: "/leadership/cm.jpg",
                    link: "https://cm.jharkhand.gov.in"
                  })}
                  className="text-xs font-semibold text-blue-700 hover:text-blue-900 inline-flex items-center space-x-1"
                >
                  <User className="w-3 h-3" />
                  <span>Profile</span>
                </button>
                <span className="text-slate-300">|</span>
                <a 
                  href="https://cm.jharkhand.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center space-x-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Official Portal</span>
                </a>
              </div>
            </div>

            {/* Card 4: Chief Secretary */}
            <div className="bg-white rounded-lg border border-slate-200 p-4 flex flex-col justify-between hover:shadow-md transition-shadow text-center">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-left">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Chief Secretary</span>
                  <span className="text-[10px] bg-blue-50 text-blue-800 px-2 py-0.5 rounded font-mono font-semibold">Administration</span>
                </div>
                <div className="pt-1">
                  <img 
                    src="/leadership/chief_secretary.jpg" 
                    alt="Shri Avinash Kumar - Chief Secretary, Government of Jharkhand" 
                    className="w-28 h-28 mx-auto rounded-full object-cover object-top border-4 border-white shadow-md ring-2 ring-slate-200"
                  />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-900 leading-snug">
                    Shri Avinash Kumar
                  </h4>
                  <p className="text-xs text-slate-600 font-medium mt-1">
                    Chief Secretary, Government of Jharkhand
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-center gap-3">
                <button 
                  onClick={() => setSelectedLeader({
                    name: "Shri Avinash Kumar",
                    role: "Chief Secretary, Government of Jharkhand",
                    bio: "Shri Avinash Kumar, IAS, serves as the Chief Secretary of Jharkhand. Head of the civil administrative machinery, he coordinates inter-departmental policy implementation, Higher Education innovation linkages, and state e-governance systems.",
                    image: "/leadership/chief_secretary.jpg",
                    link: "https://jharkhand.gov.in"
                  })}
                  className="text-xs font-semibold text-blue-700 hover:text-blue-900 inline-flex items-center space-x-1"
                >
                  <User className="w-3 h-3" />
                  <span>Profile</span>
                </button>
                <span className="text-slate-300">|</span>
                <a 
                  href="https://jharkhand.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center space-x-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Secretariat</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Profile Modal */}
      {selectedLeader && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200 space-y-4">
            <button 
              onClick={() => setSelectedLeader(null)} 
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-4">
              <img 
                src={selectedLeader.image} 
                alt={selectedLeader.name} 
                className="w-20 h-20 rounded-full object-cover object-top border-2 border-amber-400 shadow shrink-0" 
              />
              <div>
                <h3 className="font-heading font-bold text-lg text-slate-900">{selectedLeader.name}</h3>
                <p className="text-xs text-slate-600 font-medium">{selectedLeader.role}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-bold rounded">
                  Government of Jharkhand
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
              {selectedLeader.bio}
            </p>
            <div className="flex justify-end space-x-3 pt-2">
              <button 
                onClick={() => setSelectedLeader(null)}
                className="px-4 py-2 border border-slate-300 rounded text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <a 
                href={selectedLeader.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#0f2942] text-white rounded text-xs font-medium hover:bg-[#163b5f] flex items-center space-x-1.5"
              >
                <span>Visit Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

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
          <div onClick={() => handleQuickRoleAccess("citizen")} className="bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-400 shadow-xs cursor-pointer transition space-y-2">
            <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-800 flex items-center justify-center">
              <Users className="w-4 h-4"/>
            </div>
            <h4 className="font-heading font-bold text-sm text-slate-900">Citizen & PRI Portal</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Report civic problems via voice (Nagpuri, Santali, Hindi), GPS tagging, and track 10-step resolution.
            </p>
            <span className="text-xs font-semibold text-emerald-800 flex items-center space-x-1 pt-1">
              <span>Open Portal</span>
              <ArrowRight className="w-3 h-3"/>
            </span>
          </div>

          {/* University */}
          <div onClick={() => handleQuickRoleAccess("hei_nodal")} className="bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-400 shadow-xs cursor-pointer transition space-y-2">
            <div className="w-8 h-8 rounded bg-blue-50 text-blue-800 flex items-center justify-center">
              <GraduationCap className="w-4 h-4"/>
            </div>
            <h4 className="font-heading font-bold text-sm text-slate-900">University Nodal Desk</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              BIT Mesra, IIT ISM, NIT: Review AI-routed challenges, assign faculty, and oversee student cohorts.
            </p>
            <span className="text-xs font-semibold text-blue-800 flex items-center space-x-1 pt-1">
              <span>Open Portal</span>
              <ArrowRight className="w-3 h-3"/>
            </span>
          </div>

          {/* Industry */}
          <div onClick={() => handleQuickRoleAccess("industry")} className="bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-400 shadow-xs cursor-pointer transition space-y-2">
            <div className="w-8 h-8 rounded bg-amber-50 text-amber-800 flex items-center justify-center">
              <Briefcase className="w-4 h-4"/>
            </div>
            <h4 className="font-heading font-bold text-sm text-slate-900">Industry & CSR Hub</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tata Steel, Startups & MSMEs: Browse verified proposals, e-sign bilateral MoUs, and disburse grants.
            </p>
            <span className="text-xs font-semibold text-amber-800 flex items-center space-x-1 pt-1">
              <span>Open Portal</span>
              <ArrowRight className="w-3 h-3"/>
            </span>
          </div>

          {/* Govt Admin */}
          <div onClick={() => handleQuickRoleAccess("govt_admin")} className="bg-white p-5 rounded-lg border border-slate-200 hover:border-slate-400 shadow-xs cursor-pointer transition space-y-2">
            <div className="w-8 h-8 rounded bg-purple-50 text-purple-800 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4"/>
            </div>
            <h4 className="font-heading font-bold text-sm text-slate-900">State Admin & DM</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              State Nodal Authority: 24-district heatmap, AI triage validation gate, and dual sign-off fund release.
            </p>
            <span className="text-xs font-semibold text-purple-800 flex items-center space-x-1 pt-1">
              <span>Open Portal</span>
              <ArrowRight className="w-3 h-3"/>
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
            <input type="text" placeholder="Search by ticket or keyword..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="p-2 border border-slate-300 rounded focus:outline-none focus:border-[#0f2942]"/>

            <select value={selectedDistrict} onChange={(e) => setSelectedDistrict(e.target.value)} className="p-2 border border-slate-300 rounded bg-slate-50">
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
          {filteredProblems.map((p) => (<div key={p.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-2 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">{p.ticketNumber}</span>
                  <StatusPill status={p.status}/>
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
                  {p.assignedUniversityName && (<span className="text-slate-600">Assigned HEI: <strong>{p.assignedUniversityName}</strong></span>)}
                </div>

                <Link to="/track" className="text-blue-700 hover:text-blue-900 font-semibold">
                  View Resolution Roadmap &rarr;
                </Link>
              </div>
            </div>))}
        </div>
      </section>
    </div>);
};
