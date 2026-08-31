import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { DistrictMapPicker } from "../components/citizen/DistrictMapPicker";
import { VoiceRecorderModal } from "../components/citizen/VoiceRecorderModal";
import {
  Sparkles,
  Camera,
  Upload,
  Mic,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileText,
  Layers,
  Send
} from "lucide-react";
import confetti from "canvas-confetti";

export const CitizenSubmitPage: React.FC = () => {
  const { submitProblem, currentUser, currentLanguage, isOnline } = useApp();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionOriginalLang, setDescriptionOriginalLang] = useState("");
  const [category, setCategory] = useState<any>("Water Resources & Sanitation");
  const [subCategory, setSubCategory] = useState("");
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

  const handleDetectGPS = () => {
    setGpsDetecting(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
          setGpsDetecting(false);
        },
        () => {
          // Fallback to Ranchi center
          setLatitude(23.3441);
          setLongitude(85.3096);
          setGpsDetecting(false);
        }
      );
    } else {
      setGpsDetecting(false);
    }
  };

  const handleVoiceTranscribed = (text: string, lang: string) => {
    setDescription(text);
    setDescriptionOriginalLang(text);
    if (!title) {
      setTitle(text.slice(0, 60) + "...");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const created = submitProblem({
        title,
        description,
        descriptionOriginalLang,
        category,
        subCategory: subCategory || "Community Scale Problem",
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
            cvValidationConfidence: 0.94
          }
        ]
      });

      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      setIsSubmitting(false);
      navigate("/my-problems");
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="bg-emerald-500/30 text-emerald-200 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-400/30 uppercase tracking-wider">
            Module A: Citizen Engagement Hub
          </span>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl">
            Submit a Societal Challenge
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
            Report civic, agricultural, healthcare, environmental, or water issues in your village or urban area. Our AI engine will categorize, prioritize, and route it to the best Higher Education Institution in Jharkhand.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        {/* Voice Ingestion Banner */}
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Mic className="w-5 h-5" />
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

          <button
            type="button"
            onClick={() => setVoiceModalOpen(true)}
            className="shrink-0 flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition hover:scale-105"
          >
            <Mic className="w-4 h-4" />
            <span>Record Voice Note</span>
          </button>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Challenge Title / संक्षिप्त शीर्षक <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. High Fluoride & Yellow Water Contamination in Angara Handpumps"
            className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Detailed Problem Description / समस्या का विस्तृत विवरण <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setDescriptionOriginalLang(e.target.value);
            }}
            placeholder="Describe the affected population, severity, how long the issue has persisted, and any specific community impact..."
            className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Category & Subcategory */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Domain / Category (AI Classifier Will Refine):
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full text-xs p-3 border border-slate-300 rounded-xl bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
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
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Sub-Category / Specific Focus Area:
            </label>
            <input
              type="text"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              placeholder="e.g. Fluoride Filtration, Solar Drying, Cold Chain"
              className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* District Map Picker */}
        <DistrictMapPicker
          selectedDistrict={district}
          onSelectDistrict={(dName, lat, lng) => {
            setDistrict(dName);
            setLatitude(lat);
            setLongitude(lng);
          }}
        />

        {/* Block, Village & GPS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Block / प्रखंड:</label>
            <input
              type="text"
              value={block}
              onChange={(e) => setBlock(e.target.value)}
              placeholder="e.g. Angara / Torpa"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Village / Ward / टोला:</label>
            <input
              type="text"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              placeholder="e.g. Hesal / Diyakel"
              className="w-full text-xs p-2.5 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">GPS Coordinates:</label>
            <div className="flex items-center space-x-1.5">
              <span className="text-[11px] font-mono bg-slate-100 px-2 py-2 rounded-lg border border-slate-200 flex-1 truncate">
                {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </span>
              <button
                type="button"
                onClick={handleDetectGPS}
                className="p-2 bg-slate-200 hover:bg-slate-300 rounded-lg text-slate-700 text-xs"
                title="Detect GPS"
              >
                <MapPin className="w-4 h-4 text-emerald-600" />
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
              <img src={mediaUrl} alt="Evidence Preview" className="w-full h-full object-cover" />
              <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded-full font-mono">
                Photo Evidence
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 space-y-1">
                <span className="font-bold text-emerald-950 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Computer Vision (CV) Analysis Simulation:</span>
                </span>
                <p className="text-[11px] text-emerald-800 font-mono">
                  Tag: {cvPreviewLabel}
                </p>
                <span className="text-[10px] text-slate-500 block">
                  ResNet-50 / YOLOv8 Object Detection Authenticated
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  placeholder="Or paste custom image URL..."
                  className="flex-1 text-xs p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {!isOnline && (
              <span className="text-amber-600 font-semibold">
                ⚡ Offline Mode: Storing in IndexedDB, will sync upon reconnection.
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/20 transition hover:scale-105"
          >
            {isSubmitting ? (
              <span>Running AI Triage Pipeline...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Challenge for AI Processing &rarr;</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Voice Recorder Modal */}
      <VoiceRecorderModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onTranscriptionComplete={handleVoiceTranscribed}
      />
    </div>
  );
};
