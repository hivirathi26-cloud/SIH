import React, { useEffect, useRef, useState } from "react";
import { AlertCircle, Mic, RefreshCw, Square, X } from "lucide-react";
import { api } from "../../services/api";

const DIALECT_LOCALES = {
    "Hindi (Regional)": "hi-IN",
    "Nagpuri (नागपुरी)": "hi-IN",
    "Santali (संताली)": "hi-IN",
    Mundari: "hi-IN",
    Kurukh: "hi-IN"
};

export const VoiceRecorderModal = ({ isOpen, onClose, onTranscriptionComplete }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [selectedDialect, setSelectedDialect] = useState("Hindi (Regional)");
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [audioUrl, setAudioUrl] = useState("");
    const [error, setError] = useState("");
    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const chunksRef = useRef([]);
    const shouldTranscribeRef = useRef(false);

    const stopTracks = () => {
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current?.state === "recording") {
            mediaRecorderRef.current.stop();
        } else {
            stopTracks();
        }
        setIsRecording(false);
    };

    const resetRecording = () => {
        stopRecording();
        setTranscript("");
        shouldTranscribeRef.current = false;
        setError("");
        setSeconds(0);
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioUrl("");
    };

    const handleClose = () => {
        stopRecording();
        onClose();
    };

    useEffect(() => {
        let timer;
        if (isRecording) timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
        return () => window.clearInterval(timer);
    }, [isRecording]);

    useEffect(() => () => {
        stopRecording();
        if (audioUrl) URL.revokeObjectURL(audioUrl);
    }, [audioUrl]);

    const transcribeRecording = async (recording) => {
        try {
            const audioBase64 = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(recording);
            });
            const response = await api.ai.transcribe(audioBase64, recording.type || "audio/webm", DIALECT_LOCALES[selectedDialect]);
            const completedTranscript = response?.data?.transcript?.trim();
            if (!response?.success || !completedTranscript) {
                throw new Error(response?.error || "No speech was detected in this recording.");
            }
            setTranscript(completedTranscript);
            onTranscriptionComplete(completedTranscript, selectedDialect);
            handleClose();
        } catch (transcriptionError) {
            setError(transcriptionError?.message || "The recording was saved, but transcription failed. Please try again.");
        } finally {
            setIsTranscribing(false);
        }
    };

    const handleStartRecording = async () => {
        if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
            setError("Voice recording requires a modern browser and a secure (HTTPS or localhost) connection.");
            return;
        }

        resetRecording();
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            const recorder = new MediaRecorder(stream);
            chunksRef.current = [];
            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) chunksRef.current.push(event.data);
            };
            recorder.onstop = () => {
                stopTracks();
                if (chunksRef.current.length) {
                    const recording = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
                    setAudioUrl(URL.createObjectURL(recording));
                    if (shouldTranscribeRef.current) {
                        shouldTranscribeRef.current = false;
                        transcribeRecording(recording);
                    }
                } else if (shouldTranscribeRef.current) {
                    shouldTranscribeRef.current = false;
                    setIsTranscribing(false);
                    setError("No audio was captured. Please check microphone access and try again.");
                }
                mediaRecorderRef.current = null;
            };
            mediaRecorderRef.current = recorder;
            recorder.start();
            setIsRecording(true);
        } catch (requestError) {
            setError(requestError?.name === "NotAllowedError"
                ? "Microphone permission was denied. Allow microphone access in your browser and try again."
                : "Unable to access the microphone. Check that another app is not using it and try again.");
            stopTracks();
        }
    };

    const handleStopAndTranscribe = () => {
        setIsTranscribing(true);
        shouldTranscribeRef.current = true;
        if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop();
        else {
            shouldTranscribeRef.current = false;
            stopTracks();
            setIsTranscribing(false);
            setError("No active recording was found. Please record your voice note again.");
        }
        setIsRecording(false);
    };

    if (!isOpen) return null;

    return (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-center animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2 text-left">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold"><Mic className="w-5 h-5" /></div>
            <div><h3 className="font-heading font-bold text-sm text-slate-900">Voice-to-Text Regional Ingestion</h3><p className="text-[11px] text-slate-500">Speak freely in your regional dialect (Santali / Nagpuri / Hindi)</p></div>
          </div>
          <button type="button" onClick={handleClose} aria-label="Close voice recorder" className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
        </div>

        <div className="mb-6 text-left">
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Select Speaking Language / Dialect:</label>
          <select value={selectedDialect} disabled={isRecording} onChange={(event) => setSelectedDialect(event.target.value)} className="w-full text-xs p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:opacity-60">
            <option value="Hindi (Regional)">हिन्दी (Hindi - Regional Jharkhand Dialect)</option>
            <option value="Nagpuri (नागपुरी)">नागपुरी (Nagpuri / Sadri)</option>
            <option value="Santali (संताली)">संताली (Santali - Ol Chiki / Phonetic)</option>
            <option value="Mundari">मुंडारी (Mundari)</option><option value="Kurukh">कुड़ुख़ (Kurukh / Oraon)</option>
          </select>
        </div>

        <div className="py-6 flex flex-col items-center justify-center">
          <div className={`w-28 h-28 rounded-full flex items-center justify-center transition-all ${isRecording ? "bg-rose-500 text-white shadow-xl shadow-rose-500/40 animate-pulse scale-110" : "bg-emerald-50 text-emerald-700 border-2 border-dashed border-emerald-300"}`}><Mic className="w-12 h-12" /></div>
          <div className="mt-4 min-h-5">{isRecording ? <span className="text-sm font-mono font-bold text-rose-600 flex items-center justify-center space-x-2"><span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" /><span>Recording... 00:{String(seconds).padStart(2, "0")}</span></span> : isTranscribing ? <span className="text-xs font-bold text-emerald-700 flex items-center justify-center space-x-1.5"><RefreshCw className="w-4 h-4 animate-spin" /><span>Finalising transcription...</span></span> : <span className="text-xs text-slate-500 font-medium">{audioUrl ? "Recording saved. Review the text or try again." : "Tap button below to start voice recording"}</span>}</div>
        </div>

        {transcript && <div className="mb-4 text-left rounded-xl bg-slate-50 border border-slate-200 p-3"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 mb-1">Recognised text</p><p className="text-xs text-slate-700 leading-relaxed">{transcript}</p></div>}
        {audioUrl && <audio controls className="w-full mb-4" src={audioUrl}>Your browser cannot play this recording.</audio>}
        {error && <div role="alert" className="mb-4 flex gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3 text-left text-xs text-amber-800"><AlertCircle className="w-4 h-4 shrink-0 mt-0.5" /><span>{error}</span></div>}

        <div className="flex items-center justify-center space-x-3 mt-4">
          {!isRecording ? <button type="button" disabled={isTranscribing} onClick={handleStartRecording} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition hover:scale-105">{audioUrl ? "Record Again" : "Start Recording"}</button> : <button type="button" onClick={handleStopAndTranscribe} className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 transition hover:scale-105 flex items-center space-x-1.5"><Square className="w-4 h-4 fill-white" /><span>Done & Transcribe</span></button>}
          {transcript && !isRecording && <button type="button" onClick={() => { onTranscriptionComplete(transcript.trim(), selectedDialect); handleClose(); }} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition">Use Text</button>}
        </div>
      </div>
    </div>);
};
