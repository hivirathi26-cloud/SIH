import React from "react";
import { MOCK_LEADERBOARD } from "../data/mockData";
import { Trophy } from "lucide-react";
export const LeaderboardPage = () => {
    return (<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white p-8 rounded-3xl shadow-lg space-y-2 text-center relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <Trophy className="w-12 h-12 mx-auto text-amber-200 animate-bounce"/>
          <h1 className="font-heading font-extrabold text-3xl">
            Jharkhand Civic Innovation Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 max-w-xl mx-auto leading-relaxed">
            Recognizing active citizens, Panchayat Mukhias, SHG leaders, and community sentinels who report impactful civic challenges across Jharkhand.
          </p>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* Rank 2 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3 md:order-1 order-2">
          <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-700 font-heading font-extrabold text-lg flex items-center justify-center mx-auto">
            #2
          </div>
          <h3 className="font-heading font-bold text-base text-slate-900">{MOCK_LEADERBOARD[1].name}</h3>
          <p className="text-xs text-slate-500">{MOCK_LEADERBOARD[1].role} • {MOCK_LEADERBOARD[1].district}</p>
          <div className="font-mono font-extrabold text-xl text-emerald-600">{MOCK_LEADERBOARD[1].points} pts</div>
          <div className="flex flex-wrap justify-center gap-1">
            {MOCK_LEADERBOARD[1].badges.map((b, i) => (<span key={i} className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                {b}
              </span>))}
          </div>
        </div>

        {/* Rank 1 */}
        <div className="bg-gradient-to-b from-amber-50 to-white p-8 rounded-3xl border-2 border-amber-400 shadow-lg text-center space-y-3 md:order-2 order-1 transform md:-translate-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-400 text-amber-950 font-heading font-extrabold text-2xl flex items-center justify-center mx-auto shadow-md">
            👑 #1
          </div>
          <h3 className="font-heading font-bold text-lg text-slate-900">{MOCK_LEADERBOARD[0].name}</h3>
          <p className="text-xs text-slate-500">{MOCK_LEADERBOARD[0].role} • {MOCK_LEADERBOARD[0].district}</p>
          <div className="font-mono font-extrabold text-2xl text-amber-600">{MOCK_LEADERBOARD[0].points} Impact Pts</div>
          <div className="flex flex-wrap justify-center gap-1">
            {MOCK_LEADERBOARD[0].badges.map((b, i) => (<span key={i} className="text-[10px] bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full font-bold">
                {b}
              </span>))}
          </div>
        </div>

        {/* Rank 3 */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3 md:order-3 order-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 font-heading font-extrabold text-lg flex items-center justify-center mx-auto">
            #3
          </div>
          <h3 className="font-heading font-bold text-base text-slate-900">{MOCK_LEADERBOARD[2].name}</h3>
          <p className="text-xs text-slate-500">{MOCK_LEADERBOARD[2].role} • {MOCK_LEADERBOARD[2].district}</p>
          <div className="font-mono font-extrabold text-xl text-emerald-600">{MOCK_LEADERBOARD[2].points} pts</div>
          <div className="flex flex-wrap justify-center gap-1">
            {MOCK_LEADERBOARD[2].badges.map((b, i) => (<span key={i} className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                {b}
              </span>))}
          </div>
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-heading font-bold text-sm text-slate-800">
          Top Community Reporters & Impact Rankings
        </div>

        <div className="divide-y divide-slate-100">
          {MOCK_LEADERBOARD.map((u) => (<div key={u.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50 transition">
              <div className="flex items-center space-x-3">
                <span className="font-mono font-bold text-sm w-6 text-center text-slate-600">#{u.rank}</span>
                <div>
                  <span className="font-bold text-slate-900 text-sm block">{u.name}</span>
                  <span className="text-slate-500">{u.role} • District: {u.district}</span>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-right hidden sm:block">
                  <span className="font-bold text-slate-800 block">{u.problemsSubmitted} Submitted</span>
                  <span className="text-[11px] text-emerald-600">{u.solutionsImplemented} Implemented</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-sm text-emerald-700">{u.points} pts</span>
                </div>
              </div>
            </div>))}
        </div>
      </div>
    </div>);
};
