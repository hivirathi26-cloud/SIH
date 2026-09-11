import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Home, ShieldCheck, MapPin } from "lucide-react";
export const PortalLayout = ({ portalTitle, portalSubtitle, navItems, activeTab, setActiveTab, children }) => {
    const { currentUser, currentRole } = useAuth();
    const location = useLocation();
    return (<div className="min-h-screen bg-[#f8fafc]">
      {/* 1. Official Department Breadcrumb Strip */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2 text-slate-500">
            <Link to="/" className="hover:text-slate-800 flex items-center space-x-1">
              <Home className="w-3.5 h-3.5"/>
              <span>Home</span>
            </Link>
            <span>&rarr;</span>
            <span className="text-slate-800 font-semibold">{portalTitle}</span>
          </div>

          {currentUser && (<div className="flex items-center space-x-3 text-[11px] text-slate-600">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-emerald-700"/>
                <span>District: <strong>{currentUser.district}</strong></span>
              </span>
              <span className="text-slate-300">|</span>
              <span>{currentUser.organizationName || currentUser.roleTitle}</span>
              {currentUser.aadhaarVerified && (<span className="bg-emerald-50 text-emerald-800 font-bold px-1.5 py-0.5 rounded border border-emerald-200 text-[9px] flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3"/>
                  <span>eKYC Verified</span>
                </span>)}
            </div>)}
        </div>
      </div>

      {/* 2. Main Portal Workspace (Sidebar + Workspace Body) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Government Menu Sidebar */}
          <aside className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
              <div className="bg-[#0f2942] text-white p-3.5 border-b border-[#163b5f]">
                <h2 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-200">
                  {portalTitle}
                </h2>
                <p className="text-[11px] text-slate-300 mt-0.5 font-normal">
                  {portalSubtitle}
                </p>
              </div>

              <nav className="p-1.5 space-y-0.5">
                {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (<button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition text-left ${isActive
                    ? "bg-[#0f2942] text-white font-semibold shadow-xs"
                    : "text-slate-700 hover:bg-slate-100"}`}>
                      <div className="flex items-center space-x-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-amber-400" : "text-slate-500"}`}/>
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge !== undefined && (<span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600 border border-slate-200"}`}>
                          {item.badge}
                        </span>)}
                    </button>);
        })}
              </nav>
            </div>

            {/* Quick Officer / Stakeholder Credentials Card */}
            {currentUser && (<div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs space-y-2 text-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Logged In Identity
                </span>
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-900 block">{currentUser.fullName}</span>
                  <span className="text-[11px] text-slate-600 block">{currentUser.roleTitle}</span>
                  <span className="text-[10px] text-slate-400 block font-mono">{currentUser.email}</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                  <span className="text-emerald-700 font-semibold">Status: Active Session</span>
                  <span className="text-slate-400 font-mono">RBAC Secured</span>
                </div>
              </div>)}
          </aside>

          {/* Right Workspace Main Panel */}
          <main className="lg:col-span-9 space-y-6">
            {children}
          </main>
        </div>
      </div>
    </div>);
};
