import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Star, X } from "lucide-react";
import confetti from "canvas-confetti";
export const CitizenRatingModal = ({ problem, onClose }) => {
    const { rateProblem } = useApp();
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitted, setSubmitted] = useState(false);
    if (!problem)
        return null;
    const handleSubmit = (e) => {
        e.preventDefault();
        rateProblem(problem.id, rating, comment);
        setSubmitted(true);
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => {
            onClose();
        }, 1200);
    };
    return (<div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-center animate-in fade-in zoom-in-95">
        <div className="flex justify-between items-center mb-4">
          <div className="text-left">
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Citizen Impact & Solution Rating
            </h3>
            <p className="text-[11px] text-slate-500">
              Rate the deployed solution by {problem.assignedUniversityName || "Academic Team"}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5"/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-slate-50 p-3 rounded-xl text-left text-xs text-slate-700 border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">{problem.title}</span>
            <span className="text-slate-500">Ticket: {problem.ticketNumber} • District: {problem.district}</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              How well did the deployed solution solve your community issue?
            </label>
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (<button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className="p-1 transition transform hover:scale-125">
                  <Star className={`w-8 h-8 ${(hoverRating || rating) >= star
                ? "text-amber-400 fill-amber-400"
                : "text-slate-300"}`}/>
                </button>))}
            </div>
            <span className="text-xs font-bold text-amber-600 block mt-1">
              {rating === 5 ? "⭐⭐⭐⭐⭐ Outstanding Community Impact!" : rating === 4 ? "⭐⭐⭐⭐ Great Solution" : "Satisfactory"}
            </span>
          </div>

          <div className="text-left">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Community Feedback & Ground Impact Notes:
            </label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="e.g. The water filtration unit is working reliably for 150+ households. Water taste is very clean and children are healthy..." rows={3} className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"/>
          </div>

          <button type="submit" disabled={submitted} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition hover:scale-105">
            {submitted ? "Rating Recorded! Closed Loop Completed ✓" : "Submit Ground Feedback & Rate"}
          </button>
        </form>
      </div>
    </div>);
};
