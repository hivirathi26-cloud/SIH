import React, { useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import {
  ShieldCheck,
  Bell,
  Wifi,
  WifiOff,
  ChevronDown,
  Sparkles,
  Globe,
  Award,
  Layers,
  GraduationCap,
  Briefcase,
  BarChart3,
  PlusCircle,
  FileCheck,
  Sun,
  Moon,
  X
} from "lucide-react";

export const Navbar: React.FC = () => {
  const {
    currentUser,
    allUsers,
    switchUser,
    notifications,
    markNotificationAsRead,
    isOnline,
    offlineQueue,
    currentLanguage,
    setCurrentLanguage,
    setChatbotOpen,
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

  const unreadNotifs = notifications.filter((n) => n.status !== "read");

  const navLinks = [
    { name: "Home", path: "/", icon: Layers },
    { name: "Submit Challenge", path: "/submit", icon: PlusCircle },
    { name: "My Challenges", path: "/my-problems", icon: FileCheck },
    { name: "HEI Workspace", path: "/hei/dashboard", icon: GraduationCap },
    { name: "Industry Marketplace", path: "/industry/marketplace", icon: Briefcase },
    { name: "Govt Analytics", path: "/govt/dashboard", icon: BarChart3 },
    { name: "Civic Leaderboard", path: "/leaderboard", icon: Award },
  ];

  return (
    <header ref={headerRef} className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      {/* Top Official Govt Strip */}
      <div className="bg-slate-900 text-slate-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1 font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-live-dot inline-block"></span>
            <span>Government of Jharkhand</span>
          </span>
          <span className="text-slate-500">|</span>
          <span className="hidden sm:inline text-slate-300">
            Department of Higher & Technical Education • SIH 2026
          </span>
        </div>

        <div className="flex items-center space-x-4">
          {/* Offline/Online Indicator */}
          <div className="flex items-center space-x-1.5">
            {isOnline ? (
              <span className="flex items-center space-x-1 text-emerald-400 text-xs">
                <Wifi className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Online (Live Cloud Sync)</span>
              </span>
            ) : (
              <span className="flex items-center space-x-1 text-amber-400 text-xs font-semibold">
                <WifiOff className="w-3.5 h-3.5" />
                <span>Offline Mode ({offlineQueue.length} queued)</span>
              </span>
            )}
          </div>

          {/* Font Size Accessibility Controls */}
          <div className="flex items-center space-x-1 text-slate-300 text-xs">
            <span className="hidden sm:inline text-slate-400 text-[10px]">Font:</span>
            <button
              type="button"
              onClick={decreaseFontSize}
              disabled={fontSizeStep <= -10}
              title="Decrease font size"
              aria-label="Decrease font size"
              className={`px-1.5 py-0.5 rounded font-mono transition text-xs ${
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
              className={`px-1.5 py-0.5 rounded font-mono transition text-xs ${
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
              className={`px-1.5 py-0.5 rounded font-mono transition text-xs ${
                fontSizeStep > 0
                  ? "font-bold text-white bg-slate-800"
                  : "hover:bg-slate-800 text-slate-200"
              } ${fontSizeStep >= 10 ? "opacity-30 cursor-not-allowed" : "cursor-pointer active:scale-95"}`}
            >
              A+
            </button>
          </div>

          <span className="text-slate-600 hidden sm:inline">|</span>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            title="Toggle Theme"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>

          <span className="text-slate-600 hidden sm:inline">|</span>

          {/* Language Selector */}
          <div className="relative" translate="no" data-no-translate="true">
            <button
              type="button"
              onClick={() => toggleHeaderPanel("language")}
              className={`flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded text-xs text-slate-200 border border-slate-700 cursor-pointer ${
                activeHeaderPanel === "language" ? "ring-1 ring-emerald-400" : ""
              }`}
              title="Select Language"
              aria-label="Select Language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-semibold text-slate-100">
                {currentLanguage === "en"
                  ? "English"
                  : currentLanguage === "hi"
                  ? "हिन्दी (Hindi)"
                  : currentLanguage === "nagpuri"
                  ? "नागपुरी (Nagpuri)"
                  : "संताली (Santali)"}
              </span>
              <ChevronDown className={`w-3 h-3 text-slate-400 shrink-0 transition-transform duration-200 ${activeHeaderPanel === "language" ? "rotate-180" : ""}`} />
            </button>
            {activeHeaderPanel === "language" && (
              <div className="absolute right-0 mt-1 w-40 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 py-1 z-50 text-xs panel-animate-enter">
                <button
                  type="button"
                  onClick={() => { setCurrentLanguage("en"); closeAllPanels(); }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 flex items-center justify-between ${currentLanguage === "en" ? "font-bold text-emerald-700 bg-emerald-50" : ""}`}
                >
                  <span>English</span>
                  {currentLanguage === "en" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                </button>
                <button
                  type="button"
                  onClick={() => { setCurrentLanguage("hi"); closeAllPanels(); }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 flex items-center justify-between ${currentLanguage === "hi" ? "font-bold text-emerald-700 bg-emerald-50" : ""}`}
                >
                  <span>हिन्दी (Hindi)</span>
                  {currentLanguage === "hi" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                </button>
                <button
                  type="button"
                  onClick={() => { setCurrentLanguage("nagpuri"); closeAllPanels(); }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 flex items-center justify-between ${currentLanguage === "nagpuri" ? "font-bold text-emerald-700 bg-emerald-50" : ""}`}
                >
                  <span>नागपुरी (Nagpuri)</span>
                  {currentLanguage === "nagpuri" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                </button>
                <button
                  type="button"
                  onClick={() => { setCurrentLanguage("santali"); closeAllPanels(); }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-emerald-50 flex items-center justify-between ${currentLanguage === "santali" ? "font-bold text-emerald-700 bg-emerald-50" : ""}`}
                >
                  <span>संताली (Santali)</span>
                  {currentLanguage === "santali" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Portal Identity */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-lg tracking-wider">JS</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-heading font-extrabold text-xl text-slate-900 tracking-tight">
                  JSICP
                </span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide border border-emerald-300">
                  JHARKHAND
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Societal Innovation Collaboration Portal
              </p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                  <span>{t(item.name)}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Hub: AI Chatbot, Notifications, Persona Switcher */}
          <div className="flex items-center space-x-3">
            {/* AI Sahayak Assistant Trigger */}
            <button
              onClick={() => setChatbotOpen(true)}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm shadow-emerald-500/20 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Sahayak</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => toggleHeaderPanel("notifications")}
                className={`relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer ${
                  activeHeaderPanel === "notifications" ? "bg-slate-100 text-slate-900 ring-2 ring-emerald-500/20" : ""
                }`}
                title="Notifications"
                aria-label="Toggle notifications panel"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {activeHeaderPanel === "notifications" && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 panel-animate-enter">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-heading font-bold text-sm text-slate-800">
                      Multi-Channel Notifications
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-slate-500">{notifications.length} updates</span>
                      <button
                        type="button"
                        onClick={closeAllPanels}
                        className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
                        title="Close"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.slice(0, 5).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationAsRead(n.id)}
                        className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition ${
                          n.status !== "read" ? "bg-emerald-50/50" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-800">{n.title}</span>
                          <span className="uppercase text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                            {n.channel}
                          </span>
                        </div>
                        <p className="text-slate-600 line-clamp-2">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {new Date(n.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 border-t border-slate-100 text-center">
                    <Link
                      to="/notifications"
                      onClick={closeAllPanels}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                    >
                      View All Notifications & SMS Dispatches →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Persona Switcher (Crucial for SIH Demo & Evaluation) */}
            <div className="relative">
              <button
                onClick={() => toggleHeaderPanel("role")}
                className={`flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2.5 py-1.5 rounded-xl transition cursor-pointer ${
                  activeHeaderPanel === "role" ? "ring-2 ring-emerald-500/30 bg-slate-200" : ""
                }`}
              >
                <img
                  src={currentUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                  alt={currentUser.fullName}
                  className="w-7 h-7 rounded-full object-cover border border-emerald-500"
                />
                <div className="text-left hidden md:block">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs font-bold text-slate-800 truncate max-w-[110px]">
                      {currentUser.fullName}
                    </span>
                    {currentUser.aadhaarVerified && (
                      <span title="DigiLocker / Aadhaar eKYC Verified"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /></span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium block truncate max-w-[120px]">
                    {currentUser.roleTitle}
                  </span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${activeHeaderPanel === "role" ? "rotate-180" : ""}`} />
              </button>

              {activeHeaderPanel === "role" && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 panel-animate-enter">
                  <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/70 rounded-t-xl flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        ⚡ Quick Role / Persona Switcher
                      </span>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Instantly test the platform from any user perspective:
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={closeAllPanels}
                      className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer ml-2 shrink-0"
                      title="Close"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 py-1">
                    {Object.values(allUsers).map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          closeAllPanels();
                        }}
                        className={`w-full text-left px-4 py-2.5 flex items-start space-x-3 hover:bg-emerald-50/70 transition cursor-pointer ${
                          u.id === currentUser.id ? "bg-emerald-50 border-l-4 border-emerald-600" : ""
                        }`}
                      >
                        <img
                          src={u.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"}
                          alt={u.fullName}
                          className="w-8 h-8 rounded-full object-cover border border-slate-300 shrink-0 mt-0.5"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {u.fullName}
                            </span>
                            {u.aadhaarVerified && (
                              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded border border-emerald-300">
                                eKYC ✓
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 leading-snug">{u.roleTitle}</p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            District: {u.district}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="p-3 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500 rounded-b-xl flex items-center justify-between">
                    <span>DigiLocker / Aadhaar Verified</span>
                    <span className="font-bold text-emerald-600 font-mono">RBAC Active</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
