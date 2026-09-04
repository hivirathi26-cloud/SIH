import React, { useState } from "react";
import { PortalLayout, NavItem } from "../../components/layout/PortalLayout";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import { StatusPill } from "../../components/common/StatusPill";
import { SdgBadge } from "../../components/common/SdgBadge";
import { VoiceRecorderModal } from "../../components/citizen/VoiceRecorderModal";
import { CitizenRatingModal } from "../../components/citizen/CitizenRatingModal";
import {
  FileText,
  PlusCircle,
  FileCheck,
  Users,
  Award,
  MapPin,
  Mic,
  Camera,
  Heart,
  Star,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  Search,
  Zap,
  Briefcase
} from "lucide-react";
import confetti from "canvas-confetti";

export const CitizenPortalPage: React.FC = () => {
  const { problems, submitProblem, upvoteProblem, advanceProblemToDeployed, currentUser, agreements } = useApp();
  const { currentRole } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionOriginalLang, setDescriptionOriginalLang] = useState("");
  const [category, setCategory] = useState<any>("Water Resources & Sanitation");
  const [subCategory, setSubCategory] = useState("");
  const [district, setDistrict] = useState(currentUser?.district || "Ranchi");
  const [block, setBlock] = useState("");
  const [village, setVillage] = useState("");
  const [latitude, setLatitude] = useState(23.3441);
  const [longitude, setLongitude] = useState(85.3096);
  const [mediaUrl, setMediaUrl] = useState("https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=600&auto=format&fit=crop&q=80");
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [ratingProb, setRatingProb] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // My Problems
  const myProblems = problems.filter((p) => p.submittedBy === currentUser?.id || p.submittedBy === "citizen-sunita" || p.district === "Ranchi" || p.district === "Dhanbad");
  const districtProblems = problems.filter((p) => p.district.toLowerCase() === (currentUser?.district || "Ranchi").toLowerCase());

  const navItems: NavItem[] = [
    { id: "dashboard", label: "Overview & Status", icon: FileText },
    { id: "submit", label: "File New Challenge", icon: PlusCircle },
    { id: "my_issues", label: "My Tracked Issues", icon: FileCheck, badge: myProblems.length },
    { id: "community", label: "District Issues & Support", icon: Users, badge: districtProblems.length },
    { id: "leaderboard", label: "Civic Points & Badges", icon: Award }
  ];

  const handleVoiceTranscribed = (text: string, lang: string) => {
    setDescription(text);
    setDescriptionOriginalLang(text);
    if (!title) {
      setTitle(text.slice(0, 50) + "...");
    }
  };

  const handleDetectGPS = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
        },
        () => {
          setLatitude(23.3441);
          setLongitude(85.3096);
        }
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setIsSubmitting(true);

    setTimeout(() => {
      submitProblem({
        title,
        description,
        descriptionOriginalLang,
        category,
        subCategory: subCategory || "Community Scale Challenge",
        district,
        block: block || "Sadar Block",
        village: village || "Gram Panchayat",
        latitude,
        longitude,
        media: [
          {
            id: `med-${Date.now()}`,
            problemId: "",
            mediaType: "image",
            storageUrl: mediaUrl,
            cvValidationLabel: "Verified Ground Anomaly (94% Match)",
            cvValidationConfidence: 0.94
          }
        ]
      });

      confetti({ particleCount: 70, spread: 60 });
      setIsSubmitting(false);
      setTitle("");
      setDescription("");
      setActiveTab("my_issues");
    }, 800);
  };

  const getStepIndex = (status: string) => {
    switch (status) {
      case "submitted": return 1;
      case "under_ai_review": return 2;
      case "pending_nodal_review": return 3;
      case "routed": return 4;
      case "accepted_by_hei": return 5;
      case "team_formed": return 6;
      case "in_progress": return 8; // Step 8: Industry Co-Funded & Prototyping Active!
      case "industry_matched": return 8;
      case "field_pilot": return 9;
      case "deployed":
      case "closed": return 10;
      default: return 1;
    }
  };

  return (
    <PortalLayout
      portalTitle="Citizen & PRI Innovation Portal"
      portalSubtitle="नागरिक, स्वयं सहायता समूह (SHG) एवं पंचायती राज पटल"
      navItems={navItems}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {/* 1. Dashboard View */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Welcome Card */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Welcome, {currentUser?.fullName}
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Role: <strong>{currentUser?.roleTitle}</strong> • District: <strong>{currentUser?.district}</strong>
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                You can report civic challenges, track progress across universities, and review deployed community solutions.
              </p>
            </div>

            <button
              onClick={() => setActiveTab("submit")}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#0f2942] hover:bg-[#163b5f] text-white text-xs font-semibold rounded shadow-xs shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report a New Challenge</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200 text-left">
              <span className="text-[11px] text-slate-500 block">My Submissions</span>
              <span className="font-heading font-extrabold text-xl text-slate-900 font-mono mt-0.5 block">
                {myProblems.length}
              </span>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 text-left">
              <span className="text-[11px] text-slate-500 block">In Academic Research</span>
              <span className="font-heading font-extrabold text-xl text-blue-700 font-mono mt-0.5 block">
                {myProblems.filter((p) => p.status === "in_progress" || p.status === "team_formed").length}
              </span>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 text-left">
              <span className="text-[11px] text-slate-500 block">Solutions Deployed</span>
              <span className="font-heading font-extrabold text-xl text-emerald-700 font-mono mt-0.5 block">
                {myProblems.filter((p) => p.status === "deployed" || p.status === "closed").length}
              </span>
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-200 text-left">
              <span className="text-[11px] text-slate-500 block">Civic Impact Points</span>
              <span className="font-heading font-extrabold text-xl text-amber-700 font-mono mt-0.5 block">
                {currentUser?.reputationPoints || 420} pts
              </span>
            </div>
          </div>

          {/* Recent Tracked Challenge */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-800">
                Latest Active Challenge Status
              </h4>
              <button
                onClick={() => setActiveTab("my_issues")}
                className="text-xs font-semibold text-blue-700 hover:text-blue-900"
              >
                View All Tracked &rarr;
              </button>
            </div>

            {myProblems.length > 0 ? (
              <div className="p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-slate-500">{myProblems[0].ticketNumber}</span>
                    <h4 className="font-heading font-bold text-sm text-slate-900 mt-0.5">{myProblems[0].title}</h4>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{myProblems[0].description}</p>
                  </div>
                  <div className="shrink-0">
                    <StatusPill status={myProblems[0].status} />
                  </div>
                </div>

                {/* Stepper */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-700 uppercase">
                    <span>Current Resolution Step: {getStepIndex(myProblems[0].status)} of 10</span>
                    <span className="text-emerald-700 font-mono">
                      {getStepIndex(myProblems[0].status) >= 8 ? "✓ Industry CSR Funded & Lab Active" : "In Progress"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full transition-all duration-500"
                      style={{ width: `${getStepIndex(myProblems[0].status) * 10}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-medium">
                    <span>1. Submitted</span>
                    <span>4. HEI Routed</span>
                    <span>6. Team Formed</span>
                    <span>8. CSR Funded</span>
                    <span>10. Deployed</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-500">
                No active challenges yet. Click "File New Challenge" to report a community problem.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. File New Challenge Form */}
      {activeTab === "submit" && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-[#0f2942] text-white px-5 py-3 border-b border-[#163b5f]">
            <h3 className="font-heading font-bold text-sm">
              नागरिक समस्या पंजीकरण प्रपत्र (Societal Challenge Ingestion Form)
            </h3>
            <p className="text-[11px] text-slate-300">
              Please enter accurate details. Issues are categorized by AI and reviewed by District / University nodal desks.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
            {/* Regional Voice Ingestion Alert */}
            <div className="bg-[#f0fdf4] border border-emerald-300 p-3.5 rounded flex items-center justify-between gap-4">
              <div>
                <span className="font-bold text-emerald-900 block text-xs">
                  Regional Voice Recording / बोलकर समस्या दर्ज करें
                </span>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Available in Hindi, Nagpuri, Santali, Mundari or Kurukh (IndicTrans2 auto-translation enabled).
                </p>
              </div>

              <button
                type="button"
                onClick={() => setVoiceModalOpen(true)}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-semibold flex items-center space-x-1 shrink-0"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Voice Note</span>
              </button>
            </div>

            {/* Title */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Challenge Title / समस्या का शीर्षक <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Excessive Fluoride Contamination in Angara Block Borewells"
                className="w-full p-2.5 border border-slate-300 rounded focus:border-[#0f2942] focus:outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Detailed Description / विस्तृत विवरण <span className="text-rose-600">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the affected population, symptoms/severity, location specifics, and historical attempts to fix..."
                className="w-full p-2.5 border border-slate-300 rounded focus:border-[#0f2942] focus:outline-none"
              />
            </div>

            {/* Category & District */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Thematic Sector / श्रेणी
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded bg-slate-50 focus:border-[#0f2942]"
                >
                  <option value="Water Resources & Sanitation">Water Resources & Sanitation</option>
                  <option value="Agriculture & Allied Technologies">Agriculture & Allied Technologies</option>
                  <option value="Healthcare & MedTech">Healthcare & MedTech</option>
                  <option value="Rural Infrastructure & Transport">Rural Infrastructure & Transport</option>
                  <option value="Education & Smart Learning">Education & Smart Learning</option>
                  <option value="Environment & Mining Remediation">Environment & Mining Remediation</option>
                  <option value="Renewable Energy & Off-Grid Power">Renewable Energy & Off-Grid Power</option>
                  <option value="Forest & Tribal Livelihoods">Forest & Tribal Livelihoods</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  District in Jharkhand / जिला
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded bg-slate-50 focus:border-[#0f2942]"
                >
                  <option value="Ranchi">Ranchi (राँची)</option>
                  <option value="Dhanbad">Dhanbad (धनबाद)</option>
                  <option value="East Singhbhum">East Singhbhum (पूर्वी सिंहभूम)</option>
                  <option value="Bokaro">Bokaro (बोकारो)</option>
                  <option value="Hazaribagh">Hazaribagh (हज़ारीबाग)</option>
                  <option value="Khunti">Khunti (खूंटी)</option>
                  <option value="Dumka">Dumka (दुमका)</option>
                  <option value="Deoghar">Deoghar (देवघर)</option>
                  <option value="Palamu">Palamu (पलामू)</option>
                  <option value="Giridih">Giridih (गिरिडीह)</option>
                </select>
              </div>
            </div>

            {/* Block, Village & GPS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Block / प्रखंड</label>
                <input
                  type="text"
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  placeholder="e.g. Angara"
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Village / Ward / टोला</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="e.g. Hesal Village"
                  className="w-full p-2 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">GPS Coordinates</label>
                <div className="flex items-center space-x-1">
                  <span className="p-2 bg-slate-100 border border-slate-200 rounded text-slate-600 font-mono text-[11px] flex-1 truncate">
                    {latitude.toFixed(4)}, {longitude.toFixed(4)}
                  </span>
                  <button
                    type="button"
                    onClick={handleDetectGPS}
                    className="p-2 bg-slate-200 hover:bg-slate-300 rounded text-slate-700"
                    title="Auto-detect GPS"
                  >
                    <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                  </button>
                </div>
              </div>
            </div>

            {/* Photo / Media Evidence */}
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Photo Evidence / फ़ोटो प्रमाण
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="Image URL or upload"
                  className="flex-1 p-2 border border-slate-300 rounded"
                />
                <span className="text-[11px] text-slate-500 font-mono">CV Tagging Ready</span>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-[#0f2942] hover:bg-[#163b5f] text-white font-semibold rounded shadow-xs flex items-center space-x-1.5"
              >
                {isSubmitting ? (
                  <span>Submitting to State Registry...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Challenge &rarr;</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. My Tracked Issues */}
      {activeTab === "my_issues" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-slate-900">
              My Registered Societal Challenges ({myProblems.length})
            </h3>
            <span className="text-xs text-slate-500">Live 10-Step Resolution Pipeline</span>
          </div>

          <div className="space-y-4">
            {myProblems.map((p) => {
              const currentStep = getStepIndex(p.status);
              const isDeployed = p.status === "deployed" || p.status === "closed";
              const isFundedOrProgress = p.status === "in_progress" || p.status === "industry_matched";

              return (
                <div key={p.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                        {p.ticketNumber}
                      </span>
                      <StatusPill status={p.status} />
                      <span className="text-slate-500 text-xs">{p.district} ({p.block || "Sadar"})</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Rating Button */}
                      {isDeployed && (
                        <button
                          onClick={() => setRatingProb(p)}
                          className="px-3.5 py-1.5 bg-amber-50 text-amber-900 border border-amber-400 rounded font-bold text-xs hover:bg-amber-100 flex items-center space-x-1.5 shadow-xs"
                        >
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{p.feedbackRating ? `Rated ${p.feedbackRating}★ (Edit)` : "⭐ Submit Ground Feedback"}</span>
                        </button>
                      )}

                      {/* Demo Simulator button */}
                      {!isDeployed && (
                        <button
                          onClick={() => {
                            advanceProblemToDeployed(p.id);
                            confetti({ particleCount: 70, spread: 60 });
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold flex items-center space-x-1"
                          title="Simulate all milestones completed and advance to Deployed stage"
                        >
                          <Zap className="w-3 h-3 text-amber-500" />
                          <span>Fast-Track to Deployed (Demo)</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-heading font-bold text-sm text-slate-900">{p.title}</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{p.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        {p.category}
                      </span>
                      {p.sdgTags.map((tag, i) => (
                        <SdgBadge key={i} tag={tag} />
                      ))}
                    </div>
                  </div>

                  {/* Lifecycle Event Callout */}
                  {isFundedOrProgress && (
                    <div className="bg-emerald-50/70 border border-emerald-300 p-3 rounded text-xs flex items-center space-x-2.5">
                      <Briefcase className="w-4 h-4 text-emerald-800 shrink-0" />
                      <div className="text-emerald-950">
                        <strong>Milestone Update:</strong> Bilateral MoU executed with <strong>Tata Steel CSR Foundation</strong>. R&D grant funds committed. Multi-disciplinary student team active in BIT Mesra laboratory prototyping.
                      </div>
                    </div>
                  )}

                  {isDeployed && p.feedbackRating && (
                    <div className="bg-amber-50/70 border border-amber-300 p-3 rounded text-xs flex items-center space-x-2">
                      <Star className="w-4 h-4 text-amber-600 fill-amber-500 shrink-0" />
                      <div className="text-amber-950">
                        <strong>Verified Citizen Rating:</strong> {p.feedbackRating}/5 Stars — <em>"{p.feedbackComment || "Clean drinking water delivered to all households."}"</em>
                      </div>
                    </div>
                  )}

                  {/* 10-Step Progress Stepper */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-700 uppercase">
                      <span>10-Stage Closed Loop Resolution (Step {currentStep} of 10):</span>
                      <span className="text-emerald-700 font-mono">
                        {currentStep === 10 ? "✓ Ground Deployment Verified" : currentStep >= 8 ? "✓ CSR Co-Funded & Lab Testing" : "In Progress"}
                      </span>
                    </div>

                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full transition-all duration-500"
                        style={{ width: `${currentStep * 10}%` }}
                      ></div>
                    </div>

                    <div className="grid grid-cols-5 text-[9px] text-slate-500 font-medium text-center pt-1">
                      <span className={currentStep >= 1 ? "font-bold text-slate-800" : ""}>1. Logged</span>
                      <span className={currentStep >= 4 ? "font-bold text-slate-800" : ""}>4. HEI Routed</span>
                      <span className={currentStep >= 6 ? "font-bold text-slate-800" : ""}>6. Team Built</span>
                      <span className={currentStep >= 8 ? "font-bold text-emerald-800" : ""}>8. CSR Funded</span>
                      <span className={currentStep === 10 ? "font-bold text-emerald-800" : ""}>10. Deployed ⭐</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Community Issues & Support */}
      {activeTab === "community" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Community Issues in {currentUser?.district || "Ranchi"} ({districtProblems.length})
            </h3>
            <span className="text-xs text-slate-500">Endorse issues you face locally</span>
          </div>

          <div className="space-y-3">
            {districtProblems.map((p) => (
              <div key={p.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[11px] text-slate-500 font-bold">{p.ticketNumber}</span>
                    <StatusPill status={p.status} />
                  </div>
                  <h4 className="font-heading font-bold text-xs text-slate-900">{p.title}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-1">{p.description}</p>
                </div>

                <button
                  onClick={() => upvoteProblem(p.id)}
                  className="px-3 py-1.5 border border-slate-300 hover:border-rose-300 hover:bg-rose-50 text-slate-700 rounded text-xs font-semibold flex items-center space-x-1 shrink-0"
                >
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span>{p.citizenSupportCount} Supports</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Leaderboard */}
      {activeTab === "leaderboard" && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 font-heading font-bold text-xs uppercase tracking-wider text-slate-800">
            Jharkhand Civic Hero Leaderboard & Reputation
          </div>

          <table className="gov-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Citizen / PRI Representative</th>
                <th>District</th>
                <th>Submissions</th>
                <th>Impact Points</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-bold text-slate-900 font-mono">#1</td>
                <td>
                  <span className="font-bold text-slate-900 block">Shri Birsa Munda (Mukhia)</span>
                  <span className="text-[11px] text-slate-500">Gram Panchayat Torpa</span>
                </td>
                <td>Khunti</td>
                <td>14 Issues</td>
                <td className="font-mono font-bold text-emerald-700">1,480 pts</td>
              </tr>
              <tr>
                <td className="font-bold text-slate-900 font-mono">#2</td>
                <td>
                  <span className="font-bold text-slate-900 block">Dr. Pratima Tigga</span>
                  <span className="text-[11px] text-slate-500">PHC Medical Officer</span>
                </td>
                <td>Dumka</td>
                <td>11 Issues</td>
                <td className="font-mono font-bold text-emerald-700">1,320 pts</td>
              </tr>
              <tr>
                <td className="font-bold text-slate-900 font-mono">#3</td>
                <td>
                  <span className="font-bold text-slate-900 block">Smt. Sunita Devi (You)</span>
                  <span className="text-[11px] text-slate-500">Angara SHG Federation</span>
                </td>
                <td>Ranchi</td>
                <td>9 Issues</td>
                <td className="font-mono font-bold text-emerald-700">1,140 pts</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <VoiceRecorderModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onTranscriptionComplete={handleVoiceTranscribed}
      />

      <CitizenRatingModal
        problem={ratingProb}
        onClose={() => setRatingProb(null)}
      />
    </PortalLayout>
  );
};
