import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { JharkhandSahayakChatbot } from "./components/ai/JharkhandSahayakChatbot";

import { HomePage } from "./pages/HomePage";
import { CitizenSubmitPage } from "./pages/CitizenSubmitPage";
import { MyProblemsPage } from "./pages/MyProblemsPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { HeiDashboardPage } from "./pages/HeiDashboardPage";
import { HeiTeamsPage } from "./pages/HeiTeamsPage";
import { HeiProposalNewPage } from "./pages/HeiProposalNewPage";
import { IndustryMarketplacePage } from "./pages/IndustryMarketplacePage";
import { IndustryAgreementsPage } from "./pages/IndustryAgreementsPage";
import { ProjectLifecyclePage } from "./pages/ProjectLifecyclePage";
import { GovtAnalyticsPage } from "./pages/GovtAnalyticsPage";
import { NotificationsPage } from "./pages/NotificationsPage";

export const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/submit" element={<CitizenSubmitPage />} />
              <Route path="/my-problems" element={<MyProblemsPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              
              {/* HEI Routes */}
              <Route path="/hei/dashboard" element={<HeiDashboardPage />} />
              <Route path="/hei/teams" element={<HeiTeamsPage />} />
              <Route path="/hei/proposals/new" element={<HeiProposalNewPage />} />
              
              {/* Industry Routes */}
              <Route path="/industry/marketplace" element={<IndustryMarketplacePage />} />
              <Route path="/industry/agreements" element={<IndustryAgreementsPage />} />
              
              {/* Project Lifecycle */}
              <Route path="/lifecycle" element={<ProjectLifecyclePage />} />
              <Route path="/lifecycle/:proposalId" element={<ProjectLifecyclePage />} />
              
              {/* Govt Analytics */}
              <Route path="/govt/dashboard" element={<GovtAnalyticsPage />} />
              
              {/* Notification Hub */}
              <Route path="/notifications" element={<NotificationsPage />} />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          <Footer />
          <JharkhandSahayakChatbot />
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
