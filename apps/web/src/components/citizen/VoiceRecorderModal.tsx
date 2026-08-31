import React, { useState, useEffect } from "react";
import { Mic, Square, Volume2, CheckCircle2, X, RefreshCw } from "lucide-react";

export const VoiceRecorderModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onTranscriptionComplete: (text: string, detectedLang: string) => void;
}> = ({ isOpen, onClose, onTranscriptionComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [selectedDialect, setSelectedDialect] = useState<string>("Hindi (Regional)");
  const [simulatedTranscribing, setSimulatedTranscribing] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      setSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  if (!isOpen) return null;

  const sampleTranscriptions: Record<string, string> = {
    "Hindi (Regional)": "हमारे गांव अनगड़ा में चापाकल से बहुत गंदा और फ्लोराइड वाला पानी निकल रहा है। बच्चों के दांत खराब हो रहे हैं और पीने के पानी की भारी किल्लत है। कृपया सौर ऊर्जा से चलने वाला वाटर फिल्टर लगवाएं।",
    "Nagpuri (नागपुरी)": "हमार टोला में पानी के बहुत दिक्कत आहे। चापाकल कर पानी पियले पेट में दर्द होवेला। सोलर वाला मशीन लगाय देले बेस होवतई।",
    "Santali (संताली)": "Our village needs clean solar water filter for contaminated well in Shikaripara forest cluster."
  };

  const handleStopAndTranscribe = () => {
    setIsRecording(false);
    setSimulatedTranscribing(true);

    setTimeout(() => {
      setSimulatedTranscribing(false);
      const text = sampleTranscriptions[selectedDialect] || sampleTranscriptions["Hindi (Regional)"];
      onTranscriptionComplete(text, selectedDialect);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-center animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2 text-left">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-slate-900">
                Voice-to-Text Regional Ingestion
              </h3>
              <p className="text-[11px] text-slate-500">
                Speak freely in your regional dialect (Santali / Nagpuri / Hindi)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dialect Selector */}
        <div className="mb-6 text-left">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Select Speaking Language / Dialect:
          </label>
          <select
            value={selectedDialect}
            onChange={(e) => setSelectedDialect(e.target.value)}
            className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="Hindi (Regional)">हिन्दी (Hindi - Regional Jharkhand Dialect)</option>
            <option value="Nagpuri (नागपुरी)">नागपुरी (Nagpuri / Sadri)</option>
            <option value="Santali (संताली)">संताली (Santali - Ol Chiki / Phonetic)</option>
            <option value="Mundari">मुंडारी (Mundari)</option>
            <option value="Kurukh">कुड़ुख़ (Kurukh / Oraon)</option>
          </select>
        </div>

        {/* Big Mic Animation Area */}
        <div className="py-6 flex flex-col items-center justify-center">
          <div
            className={`w-28 h-28 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? "bg-rose-500 text-white shadow-xl shadow-rose-500/40 animate-pulse scale-110"
                : "bg-emerald-50 text-emerald-700 border-2 border-dashed border-emerald-300"
            }`}
          >
            <Mic className="w-12 h-12" />
          </div>

          <div className="mt-4">
            {isRecording ? (
              <span className="text-sm font-mono font-bold text-rose-600 flex items-center justify-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                <span>Recording... 00:{seconds < 10 ? `0${seconds}` : seconds}</span>
              </span>
            ) : simulatedTranscribing ? (
              <span className="text-xs font-bold text-emerald-700 flex items-center space-x-1.5">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Translating & Transcribing with IndicTrans2...</span>
              </span>
            ) : (
              <span className="text-xs text-slate-500 font-medium">
                Tap button below to start voice recording
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center space-x-3 mt-4">
          {!isRecording ? (
            <button
              onClick={() => setIsRecording(true)}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition hover:scale-105"
            >
              Start Recording
            </button>
          ) : (
            <button
              onClick={handleStopAndTranscribe}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition hover:scale-105 flex items-center space-x-1.5"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>Done & Transcribe</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
