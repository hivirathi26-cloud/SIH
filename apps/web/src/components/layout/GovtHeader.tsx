import React, { useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth, getPortalPath } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import {
  ShieldCheck,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Globe,
  Bell,
  FileCheck,
  Sun,
  Moon,
  X
} from "lucide-react";

export const GovtHeader: React.FC = () => {
  const { currentUser, isAuthenticated, logout, loginAsRole, demoUsers } = useAuth();
  const {
    currentLanguage,
    setCurrentLanguage,
    notifications,
    markNotificationAsRead,
    fontSizeStep,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    theme,
    toggleTheme,
    activeHeaderPanel,
    toggleHeaderPanel,
    closeAllPanels,
    t
  } = useApp();

  const navigate = useNavigate();
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);

  // Close open panels on route change
  useEffect(() => {
    closeAllPanels();
  }, [location.pathname]);

  // Global click outside and escape key handling
  useEffect(() => {
    if (activeHeaderPanel === "none") return;

    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        closeAllPanels();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeAllPanels();
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 20);

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeHeaderPanel, closeAllPanels]);

  const handleRoleSwitch = (roleKey: any) => {
    loginAsRole(roleKey);
    closeAllPanels();
    navigate(getPortalPath(roleKey));
  };

  const unreadNotifs = notifications.filter((n) => n.status !== "read");

  return (
    <header ref={headerRef} className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* 1. Top Government of India & Jharkhand Strip */}
      <div className="bg-[#0b1d33] text-slate-200 text-[11px] px-4 sm:px-8 py-1.5 flex flex-wrap items-center justify-between border-b border-[#163b5f]">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-slate-100 flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
            <span>झारखंड सरकार | Government of Jharkhand</span>
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-300 hidden md:inline">
            उच्च एवं तकनीकी शिक्षा विभाग (Dept. of Higher & Technical Education)
          </span>
        </div>

        {/* Accessibility & Language */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-slate-300 text-[10px]">
            <span className="hidden sm:inline text-slate-400">Font Size:</span>
            <button
              type="button"
              onClick={decreaseFontSize}
              disabled={fontSizeStep <= -10}
              title="Decrease font size"
              aria-label="Decrease font size"
              className={`px-1.5 py-0.5 rounded font-mono transition text-[11px] ${
                fontSizeStep < 0
                  ? "font-bold text-white bg-slate-800"
                  : "hover:bg-slate-800 text-slate-200"
              } ${fontSizeStep <= -10 ? "opacity-30 cursor-not-allowed" : "cursor-pointer active:scale-95"}`}
            >
              A-
            </button>
            <button
              type="button"
              onClick={resetFontSize}
              title="Normal font size"
              aria-label="Normal font size"
              className={`px-1.5 py-0.5 rounded font-mono transition text-[11px] ${
                fontSizeStep === 0
                  ? "font-bold text-white bg-slate-800"
                  : "hover:bg-slate-800 text-slate-200"
              } cursor-pointer active:scale-95`}
            >
              A
            </button>
            <button
              type="button"
              onClick={increaseFontSize}
              disabled={fontSizeStep >= 10}
              title="Increase font size"
              aria-label="Increase font size"
              className={`px-1.5 py-0.5 rounded font-mono transition text-[11px] ${
                fontSizeStep > 0
                  ? "font-bold text-white bg-slate-800"
                  : "hover:bg-slate-800 text-slate-200"
              } ${fontSizeStep >= 10 ? "opacity-30 cursor-not-allowed" : "cursor-pointer active:scale-95"}`}
            >
              A+
            </button>
          </div>

          <span className="text-slate-600 hidden sm:inline">|</span>

          {/* Minimal Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center justify-center cursor-pointer active:scale-95 border border-transparent hover:border-slate-700"
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? (
              <Sun className="w-3.5 h-3.5 text-amber-400 transition-transform duration-200 hover:rotate-45" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-sky-200 transition-transform duration-200 hover:-rotate-12" />
            )}
          </button>

          <span className="text-slate-600 hidden sm:inline">|</span>

          {/* Language Switcher */}
          <div className="relative" translate="no" data-no-translate="true">
            <button
              type="button"
              onClick={() => toggleHeaderPanel("language")}
              className={`flex items-center space-x-1.5 px-2 py-0.5 rounded text-slate-200 hover:bg-slate-800 text-[11px] border border-slate-700/60 bg-slate-800/40 cursor-pointer transition ${
                activeHeaderPanel === "language" ? "ring-1 ring-emerald-400 bg-slate-800" : ""
              }`}
              title="Select Language"
              aria-label="Select Language"
            >
              <Globe className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="font-semibold text-slate-100">
                {currentLanguage === "en"
                  ? "English"
                  : currentLanguage === "hi"
                  ? "हिन्दी (Hindi)"
                  : currentLanguage === "nagpuri"
                  ? "नागपुरी (Nagpuri)"
                  : "संताली (Santali)"}
              </span>
              <ChevronDown className={`w-2.5 h-2.5 text-slate-400 shrink-0 transition-transform duration-200 ${activeHeaderPanel === "language" ? "rotate-180" : ""}`} />
            </button>
            {activeHeaderPanel === "language" && (
              <div className="absolute right-0 mt-1 w-40 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1 z-50 text-xs panel-animate-enter">
                <button
                  type="button"
                  onClick={() => { setCurrentLanguage("en"); closeAllPanels(); }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center justify-between ${currentLanguage === "en" ? "font-bold text-emerald-700 bg-emerald-50" : ""}`}
                >
                  <span>English</span>
                  {currentLanguage === "en" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                </button>
                <button
                  type="button"
                  onClick={() => { setCurrentLanguage("hi"); closeAllPanels(); }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center justify-between ${currentLanguage === "hi" ? "font-bold text-emerald-700 bg-emerald-50" : ""}`}
                >
                  <span>हिन्दी (Hindi)</span>
                  {currentLanguage === "hi" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                </button>
                <button
                  type="button"
                  onClick={() => { setCurrentLanguage("nagpuri"); closeAllPanels(); }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center justify-between ${currentLanguage === "nagpuri" ? "font-bold text-emerald-700 bg-emerald-50" : ""}`}
                >
                  <span>नागपुरी (Nagpuri)</span>
                  {currentLanguage === "nagpuri" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                </button>
                <button
                  type="button"
                  onClick={() => { setCurrentLanguage("santali"); closeAllPanels(); }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center justify-between ${currentLanguage === "santali" ? "font-bold text-emerald-700 bg-emerald-50" : ""}`}
                >
                  <span>संताली (Santali)</span>
                  {currentLanguage === "santali" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Official Portal Identity Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Seal */}
          <Link to="/" className="flex items-center space-x-3.5 group">
            <div className="w-11 h-11 rounded bg-[#0f2942] text-white flex flex-col items-center justify-center font-serif font-bold text-xs tracking-wider border border-[#1e3a5f] shrink-0">
              <span className="text-[9px] uppercase font-sans text-amber-400 font-semibold tracking-tighter">GOVT OF</span>
              <span className="text-sm leading-none font-bold text-white">JH</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading font-extrabold text-base sm:text-lg text-[#0f2942] tracking-tight">
                  JSICP
                </span>
                <span className="bg-[#f1f5f9] text-[#0f2942] text-[10px] font-bold px-2 py-0.5 rounded border border-slate-300">
                  झारखंड पोर्टल
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium leading-tight">
                झारखंड सामाजिक नवाचार सहयोग पोर्टल
              </p>
              <p className="text-[10px] text-slate-500 hidden sm:block">
                Jharkhand Societal Innovation Collaboration Portal • SIH 2026
              </p>
            </div>
          </Link>

          {/* Right Action Area */}
          <div className="flex items-center space-x-3">
            {isAuthenticated && currentUser ? (
              <>
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => toggleHeaderPanel("notifications")}
                    className={`p-2 rounded text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition relative cursor-pointer ${
                      activeHeaderPanel === "notifications" ? "bg-slate-100 text-slate-900 ring-2 ring-emerald-500/20" : ""
                    }`}
                    title="Notifications"
                    aria-label="Toggle notifications panel"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadNotifs.length > 0 && (
                      <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {unreadNotifs.length}
                      </span>
                    )}
                  </button>

                  {activeHeaderPanel === "notifications" && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-xs panel-animate-enter">
                      <div className="px-3 py-2 border-b border-slate-100 font-bold text-slate-800 flex justify-between items-center">
                        <span>Official Alerts</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-500 font-normal">{notifications.length} total</span>
                          <button
                            type="button"
                            onClick={closeAllPanels}
                            className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                            title="Close"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                        {notifications.slice(0, 4).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markNotificationAsRead(n.id);
                            }}
                            className={`p-2.5 hover:bg-slate-50 cursor-pointer ${n.status !== "read" ? "bg-amber-50/50" : ""}`}
                          >
                            <div className="flex justify-between text-[11px] font-semibold text-slate-900">
                              <span>{n.title}</span>
                              <span className="uppercase text-[9px] text-slate-500 font-mono">{n.channel}</span>
                            </div>
                            <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                          </div>
                        ))}
                      </div>
                      <div className="px-3 py-1.5 border-t border-slate-100 text-center bg-slate-50/50">
                        <Link
                          to="/notifications"
                          onClick={closeAllPanels}
                          className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700"
                        >
                          View Notification Hub →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* Role Switcher & User Profile */}
                <div className="relative">
                  <button
                    onClick={() => toggleHeaderPanel("role")}
                    className={`flex items-center space-x-2 bg-[#f8fafc] hover:bg-slate-100 border border-slate-300 px-2.5 py-1.5 rounded transition cursor-pointer ${
                      activeHeaderPanel === "role" ? "ring-2 ring-emerald-500/30 bg-slate-100" : ""
                    }`}
                    aria-label="Toggle role switch panel"
                  >
                    <div className="w-6 h-6 rounded bg-[#0f2942] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {currentUser.fullName[0]}
                    </div>
                    <div className="text-left hidden md:block">
                      <div className="flex items-center space-x-1">
                        <span className="text-xs font-bold text-slate-900 max-w-[120px] truncate">
                          {currentUser.fullName}
                        </span>
                        {currentUser.aadhaarVerified && (
                          <span title="DigiLocker / Aadhaar eKYC Verified">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 block truncate max-w-[120px]">
                        {currentUser.roleTitle}
                      </span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${activeHeaderPanel === "role" ? "rotate-180" : ""}`} />
                  </button>

                  {activeHeaderPanel === "role" && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-xs panel-animate-enter">
                      <div className="px-3.5 py-2 border-b border-slate-100 bg-slate-50 text-slate-700 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-[11px] text-slate-800 uppercase tracking-wider block">
                            Switch Dedicated Stakeholder Portal:
                          </span>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Test the system from each actor isolated workspace:
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={closeAllPanels}
                          className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer ml-2 shrink-0"
                          title="Close"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="py-1 max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {[
            {
              category: "🏛️ BIT Mesra Ecosystem (Water, Environment & IoT)",
              keys: ["hei_nodal", "faculty", "student", "student_priya", "student_sneha", "student_amit"]
            },
            {
              category: "⛏️ IIT (ISM) Dhanbad Ecosystem (Mining Tech & Robotics)",
              keys: ["hei_iit_dhanbad", "faculty_iit", "student_iit_rohan", "student_iit_ananya", "student_iit_vikas"]
            },
            {
              category: "🏥 AIIMS Deoghar Ecosystem (MedTech & Cold-Chain)",
              keys: ["hei_aiims_deoghar", "faculty_aiims", "student_aiims_deepak", "student_aiims_kavita"]
            },
            {
              category: "🌾 Birsa Agricultural University - BAU (AgriTech & Bio-Processing)",
              keys: ["hei_bau_ranchi", "faculty_bau", "student_bau_birsa", "student_bau_pooja"]
            },
            {
              category: "🏭 Industry & CSR Co-Funding Anchors",
              keys: ["industry"]
            },
            {
              category: "🏛️ State Apex Command & District Administration",
              keys: ["govt_admin"]
            },
            {
              category: "👥 Grassroots Citizens & Panchayati Raj (PRI)",
              keys: ["citizen", "pri"]
            }
          ].map((grp) => (
                          <div key={grp.category} className="py-1">
                            <span className="px-3.5 py-0.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider block bg-slate-50/70">
                              {grp.category}
                            </span>
                            {grp.keys.map((roleKey) => {
                              const u = demoUsers[roleKey];
                              if (!u) return null;
                              const isActive = currentUser.id === u.id;
                              return (
                                <button
                                  key={roleKey}
                                  onClick={() => handleRoleSwitch(roleKey as any)}
                                  className={`w-full text-left px-3.5 py-1.5 hover:bg-blue-50/60 transition flex items-center space-x-2 cursor-pointer ${
                                    isActive ? "bg-blue-50 font-bold border-l-2 border-[#0f2942]" : ""
                                  }`}
                                >
                                  <div className="w-5 h-5 rounded bg-slate-200 text-slate-700 flex items-center justify-center text-[9px] font-bold shrink-0">
                                    {u.fullName[0]}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-semibold text-slate-900 truncate">
                                        {u.fullName}
                                      </span>
                                      <span className="text-[8px] bg-slate-100 text-slate-500 font-mono px-1 rounded uppercase">
                                        {roleKey.replace("student_", "").replace("hei_", "")}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 truncate">{u.roleTitle}</p>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        ))}
                      </div>

                      <div className="px-3 py-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <button
                          onClick={() => {
                            logout();
                            navigate("/login");
                            closeAllPanels();
                          }}
                          className="flex items-center space-x-1 text-rose-700 hover:text-rose-900 font-semibold cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                        <span className="text-[10px] text-slate-400 font-mono">DigiLocker SSO</span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/track"
                  className="hidden sm:inline-flex items-center space-x-1 px-3 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>{t("Track Complaint / Ticket Status")}</span>
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#0f2942] hover:bg-[#163b5f] text-white rounded text-xs font-semibold shadow-xs"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>{t("Sign In / Portal Login")}</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
