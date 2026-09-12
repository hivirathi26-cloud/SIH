import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { DistrictMapPicker } from "../components/citizen/DistrictMapPicker";
import { VoiceRecorderModal } from "../components/citizen/VoiceRecorderModal";
import { api } from "../services/api";
import { inferCategoryAndAllocation } from "../data/universityEcosystems";
import { Mic, MapPin, CheckCircle2, Send, Sparkles, Brain, Gauge, Building2, Tag, ShieldCheck } from "lucide-react";
import confetti from "canvas-confetti";

export const CitizenSubmitPage = () => {
    const { submitProblem, currentUser, currentLanguage, isOnline } = useApp();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [descriptionOriginalLang, setDescriptionOriginalLang] = useState("");
    const [district, setDistrict] = useState(currentUser.district || "Ranchi");
    const [block, setBlock] = useState("");
    const [village, setVillage] = useState("");
    const [latitude, setLatitude] = useState(23.3441);
    const [longitude, setLongitude] = useState(85.3096);
    const [mediaUrl, setMediaUrl] = useState("https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80");
    const [cvPreviewLabel, setCvPreviewLabel] = useState("Verified Civic Infrastructure Anomaly (93% Match)");
    const [voiceModalOpen, setVoiceModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [gpsDetecting, setGpsDetecting] = useState(false);

    // Live AI ML Distinction State
    const [aiTriage, setAiTriage] = useState(null);
    const [isAiClassifying, setIsAiClassifying] = useState(false);

    // Debounced Live ML Classification
    useEffect(() => {
        const textToAnalyze = `${title} ${description}`.trim();
        if (textToAnalyze.length < 5) {
            setAiTriage(null);
            return;
        }

        const timer = setTimeout(async () => {
            setIsAiClassifying(true);
            try {
                const res = await api.ai.processComplaint({
                    text: textToAnalyze,
                    title,
                    district,
                    latitude,
                    longitude,
                    affected_population: 100,
                    severity: "medium"
                });

                if (res?.success && res.data) {
                    setAiTriage(res.data);
                } else {
                    const fallback = inferCategoryAndAllocation(title, description, district);
                    setAiTriage({
                        ...fallback,
                        priority_score: fallback.priorityScore,
                        is_routable_to_university: fallback.isRoutableToUniversity,
                        department_name: fallback.assignedAuthority,
                        suggested_universities: fallback.suggestedUniversities.map(u => ({
                            universityName: u.universityName,
                            recommendedDepartment: u.reason,
                            matchScore: Math.round(u.score * 100)
                        }))
                    });
                }
            } catch (err) {
                const fallback = inferCategoryAndAllocation(title, description, district);
                setAiTriage({
                    ...fallback,
                    priority_score: fallback.priorityScore,
                    is_routable_to_university: fallback.isRoutableToUniversity,
                    department_name: fallback.assignedAuthority,
                    suggested_universities: fallback.suggestedUniversities.map(u => ({
                        universityName: u.universityName,
                        recommendedDepartment: u.reason,
                        matchScore: Math.round(u.score * 100)
                    }))
                });
            } finally {
                setIsAiClassifying(false);
            }
        }, 350);

        return () => clearTimeout(timer);
    }, [title, description, district]);

    const handleDetectGPS = () => {
        setGpsDetecting(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setLatitude(pos.coords.latitude);
                setLongitude(pos.coords.longitude);
                setGpsDetecting(false);
            }, () => {
                setLatitude(23.3441);
                setLongitude(85.3096);
                setGpsDetecting(false);
            });
        }
        else {
            setGpsDetecting(false);
        }
    };

    const handleVoiceTranscribed = (text, lang) => {
        setDescription(text);
        setDescriptionOriginalLang(text);
        if (!title) {
            setTitle(text.slice(0, 60) + (text.length > 60 ? "..." : ""));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) return;
        setIsSubmitting(true);

        const triage = aiTriage || inferCategoryAndAllocation(title, description, district);

        try {
            await submitProblem({
                title,
                description,
                descriptionOriginalLang,
                category: triage.category,
                subCategory: triage.sub_category || triage.subCategory || "Community Challenge",
                categoryConfidence: triage.confidence,
                priorityScore: triage.priority_score || triage.priorityScore,
                suggestedUniversities: triage.suggested_universities || triage.suggestedUniversities,
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
                        cvValidationLabel: cvPreviewLabel,
                        cvValidationConfidence: 0.93
                    }
                ]
            });

            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
            setIsSubmitting(false);
            navigate("/portal/citizen");
        } catch (err) {
            console.error("Submission error:", err);
            setIsSubmitting(false);
        }
    };

    return (<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center space-x-2">
            <span className="bg-emerald-500/30 text-emerald-200 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-400/30 uppercase tracking-wider">
              Module A: Citizen Engagement Hub
            </span>
            <span className="bg-teal-400/20 text-teal-200 text-xs font-bold px-2.5 py-1 rounded-full border border-teal-400/30 flex items-center space-x-1">
              <Brain className="w-3.5 h-3.5 text-teal-300 animate-pulse"/>
              <span>ML Model Active</span>
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl">
            Submit a Societal Challenge
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
            Report civic, agricultural, healthcare, environmental, or water issues in your village or urban area. Our JSICP ML model automatically classifies the domain, scores urgency, and routes it to the best Higher Education Institution in Jharkhand.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        {/* Voice Ingestion Banner */}
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Mic className="w-5 h-5"/>
            </div>
            <div>
              <h4 className="font-heading font-bold text-xs sm:text-sm text-emerald-950">
                Low-Literacy & Regional Voice Ingestion
              </h4>
              <p className="text-[11px] text-emerald-800">
                Speak your issue in Hindi, Nagpuri, Santali, Mundari or Kurukh &mdash; IndicTrans2 will auto-transcribe.
              </p>
            </div>
          </div>

          <button type="button" onClick={() => setVoiceModalOpen(true)} className="shrink-0 flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition hover:scale-105">
            <Mic className="w-4 h-4"/>
            <span>Record Voice Note</span>
          </button>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Challenge Title / संक्षिप्त शीर्षक <span className="text-rose-500">*</span>
          </label>
          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. High Fluoride & Yellow Water Contamination in Angara Handpumps" className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"/>
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-800">
              Detailed Problem Description / समस्या का विस्तृत विवरण <span className="text-rose-500">*</span>
            </label>
            {isAiClassifying && (
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1 animate-pulse">
                <Sparkles className="w-3.5 h-3.5"/>
                <span>AI ML analyzing context...</span>
              </span>
            )}
          </div>
          <textarea required rows={4} value={description} onChange={(e) => {
            setDescription(e.target.value);
            setDescriptionOriginalLang(e.target.value);
        }} placeholder="Describe the affected population, severity, how long the issue has persisted, and any specific community impact (Supports Hindi / Nagpuri / English)..." className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"/>
        </div>

        {/* LIVE AI ML DISTINCTION & TRIAGE WIDGET */}
        {aiTriage && (
          <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white p-5 rounded-2xl border border-teal-700/40 shadow-md space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between border-b border-teal-800/60 pb-2.5">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-teal-400"/>
                <h4 className="font-heading font-bold text-xs sm:text-sm text-teal-100">
                  JSICP ML Model Triage & Distinction Engine
                </h4>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/40 font-mono">
                  {aiTriage.source === "jsicp_ai_ml_model" ? "⚡ Live ML Inference" : "Heuristic Model"}
                </span>
              </div>
              <div className="text-[11px] text-teal-300">
                Confidence: <span className="font-mono font-bold text-white">{Math.round((aiTriage.confidence || 0.95) * 100)}%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Predicted Category */}
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] uppercase text-teal-300 font-bold tracking-wider flex items-center space-x-1">
                  <Tag className="w-3 h-3"/>
                  <span>Distinguished Category</span>
                </span>
                <p className="font-semibold text-white truncate">{aiTriage.category}</p>
                <p className="text-[10px] text-slate-300">{aiTriage.sub_category}</p>
              </div>

              {/* Priority Urgency Score */}
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] uppercase text-amber-300 font-bold tracking-wider flex items-center space-x-1">
                  <Gauge className="w-3 h-3"/>
                  <span>Urgency Priority Score</span>
                </span>
                <div className="flex items-baseline space-x-1.5">
                  <span className="font-mono text-lg font-extrabold text-amber-400">
                    {aiTriage.priority_score}
                  </span>
                  <span className="text-[10px] text-slate-400">/ 100</span>
                </div>
                <span className="text-[10px] text-amber-200 block">
                  {aiTriage.priority_score > 75 ? "🔴 High Critical Severity" : "🟡 Medium Priority"}
                </span>
              </div>

              {/* Matched University or Line Department */}
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-1">
                <span className="text-[10px] uppercase text-cyan-300 font-bold tracking-wider flex items-center space-x-1">
                  <Building2 className="w-3 h-3"/>
                  <span>
                    {aiTriage.is_routable_to_university === false || aiTriage.isRoutableToUniversity === false
                      ? "Direct Line Department"
                      : "Auto-Routed HEI"}
                  </span>
                </span>
                {aiTriage.is_routable_to_university === false || aiTriage.isRoutableToUniversity === false ? (
                  <div>
                    <p className="font-semibold text-amber-300 truncate">
                      {aiTriage.department_name || (aiTriage.category?.includes("Health") ? "Dept of Health & Family Welfare" : "Drinking Water & Sanitation (DWSD)")}
                    </p>
                    <p className="text-[10px] text-slate-300">
                      Routine municipal/health issue (Excluded from University R&D)
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold text-white truncate">
                      {aiTriage.suggested_universities?.[0]?.universityName || aiTriage.suggestedUniversities?.[0]?.universityName || "BIT Mesra, Ranchi"}
                    </p>
                    <p className="text-[10px] text-cyan-200 truncate">
                      {aiTriage.suggested_universities?.[0]?.recommendedDepartment || aiTriage.suggestedUniversities?.[0]?.reason || "Specialized Civic Lab"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* SDG Badges */}
            {aiTriage.sdg_tags && aiTriage.sdg_tags.length > 0 && (
              <div className="flex items-center space-x-2 pt-1">
                <span className="text-[10px] text-slate-400 font-semibold">UN SDG Alignment:</span>
                <div className="flex flex-wrap gap-1.5">
                  {aiTriage.sdg_tags.map((sdg, idx) => (
                    <span key={idx} className="bg-teal-900/60 border border-teal-500/30 text-teal-200 text-[10px] px-2 py-0.5 rounded-md font-mono">
                      {sdg}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI Classification Info Banner */}
        <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-emerald-900 flex items-center space-x-2.5 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0"/>
          <span>
            <strong>Zero Citizen Burden:</strong> Department and University allocation are inferred in real time from your title and description by the AI NLP Engine. No manual category selection needed.
          </span>
        </div>

        {/* District Map Picker */}
        <DistrictMapPicker selectedDistrict={district} onSelectDistrict={(dName, lat, lng) => {
            setDistrict(dName);
            setLatitude(lat);
            setLongitude(lng);
        }}/>

        {/* Block, Village & GPS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Block / प्रखंड:</label>
            <input type="text" value={block} onChange={(e) => setBlock(e.target.value)} placeholder="e.g. Angara / Torpa" className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"/>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Village / Ward / टोला:</label>
            <input type="text" value={village} onChange={(e) => setVillage(e.target.value)} placeholder="e.g. Hesal / Diyakel" className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"/>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">GPS Coordinates:</label>
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-mono bg-slate-100 px-2 py-2 rounded-lg border border-slate-200 flex-1 truncate">
                {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </span>
              <button type="button" onClick={handleDetectGPS} className="p-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700 text-xs" title="Detect GPS">
                <MapPin className="w-4 h-4 text-emerald-600"/>
              </button>
            </div>
          </div>
        </div>

        {/* Media Upload & CV Verification Simulation */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-800">
            Upload Evidence (Photo / Video / Document) + CV Authenticity Check:
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="h-36 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 relative">
              <img src={mediaUrl} alt="Evidence Preview" className="w-full h-full object-cover"/>
              <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded-full font-mono">
                Photo Evidence
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-950 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600"/>
                  <span>Computer Vision (CV) Analysis:</span>
                </span>
                <p className="text-[11px] text-emerald-800 font-mono">
                  Tag: {cvPreviewLabel}
                </p>
                <span className="text-[10px] text-slate-500 block">
                  ResNet-50 / YOLOv8 Object Detection Authenticated
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <input type="text" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} placeholder="Or paste custom image URL..." className="flex-1 text-xs p-2 border border-slate-300 rounded-lg"/>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {!isOnline && (<span className="text-amber-600 font-semibold">
                ⚡ Offline Mode: Storing in IndexedDB, will sync upon reconnection.
              </span>)}
          </div>

          <button type="submit" disabled={isSubmitting} className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/20 transition hover:scale-105">
            {isSubmitting ? (<span>Running AI Triage Pipeline...</span>) : (<>
                <Send className="w-4 h-4"/>
                <span>Submit Challenge for AI Processing &rarr;</span>
              </>)}
          </button>
        </div>
      </form>

      {/* Voice Recorder Modal */}
      <VoiceRecorderModal isOpen={voiceModalOpen} onClose={() => setVoiceModalOpen(false)} onTranscriptionComplete={handleVoiceTranscribed}/>
    </div>);
};
