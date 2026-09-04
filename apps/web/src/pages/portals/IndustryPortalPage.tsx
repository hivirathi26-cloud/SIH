import React, { useState } from "react";
import { PortalLayout, NavItem } from "../../components/layout/PortalLayout";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { MoUSigningModal } from "../../components/industry/MoUSigningModal";
import {
  Briefcase,
  Building,
  GraduationCap,
  FileSignature,
  Filter,
  DollarSign,
  Clock,
  Rocket,
  CheckCircle2,
  Download,
  ShieldCheck
} from "lucide-react";

export const IndustryPortalPage: React.FC = () => {
  const { proposals, agreements, currentUser } = useApp();
  const [activeTab, setActiveTab] = useState("marketplace");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [signingProposal, setSigningProposal] = useState<any>(null);

  const filteredProposals = proposals.filter((p) => {
    return selectedCategory === "all" || p.problemCategory === selectedCategory;
  });

  const navItems: NavItem[] = [
    { id: "marketplace", label: "Open Innovation Marketplace", icon: Briefcase, badge: filteredProposals.length },
    { id: "agreements", label: "Executed MoUs & Grants", icon: FileSignature, badge: agreements.length },
    { id: "portfolio", label: "CSR Portfolio & Impact", icon: Building }
  ];

  return (
    <PortalLayout
      portalTitle="Industry & CSR Co-Creation Marketplace"
      portalSubtitle="उद्योग एवं निगमित सामाजिक उत्तरदायित्व (CSR) पटल — Tata Steel CSR"
      navItems={navItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {/* 1. Open Innovation Marketplace */}
      {activeTab === "marketplace" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
            <div>
              <h3 className="font-heading font-bold text-sm text-slate-900">
                Verified Higher Education Research Proposals ({filteredProposals.length})
              </h3>
              <p className="text-xs text-slate-500">
                Vetted by State Government for Section 135 CSR Innovation Co-Funding
              </p>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-500 font-semibold">Filter Sector:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-1.5 border border-slate-300 rounded bg-slate-50 text-xs focus:border-[#0f2942]"
              >
                <option value="all">All Sectors</option>
                <option value="Water Resources & Sanitation">Water Resources & Sanitation</option>
                <option value="Agriculture & Allied Technologies">AgriTech & Tools</option>
                <option value="Environment & Mining Remediation">Mining CleanTech</option>
                <option value="Healthcare & MedTech">MedTech & Cold Chain</option>
                <option value="Forest & Tribal Livelihoods">Forest & Tribal Livelihoods</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {filteredProposals.map((pr) => (
              <div key={pr.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-[#0f2942] bg-slate-100 px-2 py-0.5 rounded">{pr.problemCategory}</span>
                    <span className="text-slate-500 font-mono">Duration: {pr.durationMonths} Months</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-emerald-800 text-sm block">
                      ₹{(pr.estimatedBudget).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-900">{pr.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Lead HEI: <strong>{pr.universityName}</strong> • Faculty Mentor: {pr.facultyMentorName} • District: {pr.district}
                  </p>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{pr.summary}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-slate-700 block text-[11px]">Technical Methodology:</span>
                  <p className="text-slate-600 text-[11px]">{pr.technicalApproach}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-emerald-800 font-semibold">
                    Eligible for 100% Tax-Deductible CSR Grant
                  </span>

                  <button
                    onClick={() => setSigningProposal(pr)}
                    className="px-4 py-1.5 bg-[#0f2942] hover:bg-[#163b5f] text-white rounded font-semibold flex items-center space-x-1.5 shadow-xs"
                  >
                    <FileSignature className="w-3.5 h-3.5" />
                    <span>Partner & E-Sign MoU &rarr;</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Executed MoUs & Grants */}
      {activeTab === "agreements" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Executed Innovation MoUs & Blockchain Ledger Records ({agreements.length})
            </h3>
          </div>

          <div className="space-y-4">
            {agreements.map((a) => (
              <div key={a.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3 text-xs">
                <div className="flex justify-between items-start pb-2 border-b border-slate-100">
                  <div>
                    <span className="font-mono uppercase font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[10px] border border-emerald-200">
                      {a.agreementType.replace("_", " ")}
                    </span>
                    <h4 className="font-heading font-bold text-sm text-slate-900 mt-1">{a.proposalTitle}</h4>
                  </div>
                  <span className="font-mono font-bold text-emerald-800 text-sm">
                    ₹{(a.amount).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                  <p>Partner: <strong>{a.industryPartnerName}</strong></p>
                  <p>Institution: <strong>{a.universityName}</strong></p>
                </div>

                <p className="italic text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200">
                  "{a.terms}"
                </p>

                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
                  <div className="flex items-center space-x-1 font-mono text-slate-400 truncate max-w-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="truncate">Tx: {a.blockchainTxHash}</span>
                  </div>

                  <button
                    onClick={() => alert("Downloading official Jharkhand Innovation MoU (PDF with digital e-Sign timestamp)...")}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold flex items-center space-x-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download Signed MoU (PDF)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. CSR Portfolio */}
      {activeTab === "portfolio" && (
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-heading font-bold text-sm text-slate-900">
            Corporate Social Responsibility (CSR) Impact Overview
          </h3>
          <p className="text-slate-600 leading-relaxed">
            Under Schedule VII of the Companies Act 2013 and Jharkhand Innovation Policy, CSR contributions to academic incubators and HEI research projects qualify for 100% corporate CSR obligations.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-50 p-3.5 rounded border border-slate-200">
              <span className="text-slate-500 block">Total Committed Grants</span>
              <span className="font-bold text-lg font-mono text-emerald-800">₹67.5 Lakhs</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded border border-slate-200">
              <span className="text-slate-500 block">Villages Impacted</span>
              <span className="font-bold text-lg font-mono text-slate-900">38 Villages</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded border border-slate-200">
              <span className="text-slate-500 block">Beneficiaries Reached</span>
              <span className="font-bold text-lg font-mono text-blue-800">18,500+ Citizens</span>
            </div>
          </div>
        </div>
      )}

      {/* MoU Modal */}
      <MoUSigningModal
        proposal={signingProposal}
        onClose={() => setSigningProposal(null)}
      />
    </PortalLayout>
  );
};
