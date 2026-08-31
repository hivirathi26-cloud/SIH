# JSICP — Jharkhand Societal Innovation Collaboration Portal
### Smart India Hackathon (SIH 2026) — Complete Technical Solution

> **Problem Statement**: Societal Challenge Collection, Academic Routing & Industry Collaboration Platform for Jharkhand  
> **Theme**: Smart Education / Governance / MedTech-Agri-Adjacent Cross-Sector Innovation  

---

## 1. Solution Overview
JSICP is an AI-powered, 3-sided collaborative platform connecting:
1. **Citizens & PRIs**: Report ground challenges via voice in Hindi/Nagpuri/Santali, GPS auto-tagging, and photo evidence.
2. **Universities & HEIs**: BIT Mesra, IIT ISM Dhanbad, NIT Jamshedpur, BAU Ranchi receive AI-routed challenges matched to faculty domains, form multidisciplinary student teams, run sprint Kanban boards, and draft solution proposals.
3. **Industry & Government**: Startups, MSMEs, and CSR Foundations browse open innovation proposals, e-sign MoUs on Blockchain, disburse grant funds, and monitor real-time impact on 24-district heatmaps.

---

## 2. Key Modules & Technical Highlights (1:1 with PDF Specification)

- **Module A: Citizen Engagement Hub**  
  - Multilingual problem submission (English, Hindi, Nagpuri, Santali).
  - Speech-to-Text voice ingestion with regional dialect recognition.
  - Computer Vision (CV) image authenticity preview.
  - Interactive 24-District Jharkhand Map Selector & GPS tagging.
  - Offline-first caching with sync queue.
  - 10-Step visual progress tracker & post-deployment 5-Star Citizen Rating.
  - Civic Gamification Leaderboard & Badges.

- **Module B: AI Problem Engine & Explainable AI (XAI)**  
  - NLP multi-label classification across 8 civic domains.
  - FAISS Vector Duplicate Search with 2km geo-radius match.
  - XGBoost priority formula scoring (0–100 scale).
  - Smart Academic Routing Recommender (Top-3 HEI match).
  - **Human-in-the-loop Nodal Review Gate** with full XAI transparency.

- **Module C: University Workspace**  
  - University Nodal Officer dashboard to accept/decline challenges.
  - Multidisciplinary Team Builder (Engineering, Science, Design, Rural Social Work).
  - Sprint Kanban Board for task assignments and lab testing telemetry.
  - Solution Proposal & Research Plan Builder with CSR support toggle.

- **Module D: Industry & CSR Marketplace**  
  - Open Innovation portal filtered by domain/district.
  - Digital MoU & Funding Agreement builder with e-signature pad and PDF certificate generator.
  - Active CSR investments & grant disbursement tracking.

- **Module E: Project Lifecycle Manager & Document Vault**  
  - 5-Stage Milestone Gantt chart & roadmap.
  - **Dual Sign-Off Gate**: Stamped by Faculty Mentor + Govt District Officer.
  - Secure Document Vault for NABL lab tests, CAD models, and drone telemetry.
  - **State Startup Policy 2026 Incubation Auto-Trigger** for TRL 6+ solutions.
  - **Cryptographic Blockchain Audit Ledger** for immutable milestone verification.

- **Module F: Government & District BI Analytics**  
  - Interactive 24-District Jharkhand Heatmap with drilldown.
  - Domain distribution bar charts, University rankings, CSR funding trends.
  - One-click PDF & Excel BI export.

- **Module G: Multi-Channel Notification Hub**  
  - Real-time SMS (Gupshup), WhatsApp Business, Email (SendGrid), and Push dispatches.

- **Module H: Jharkhand Sahayak AI Chatbot**  
  - 24/7 floating civic assistant with ticket lookup, multilingual FAQs, and form guidance.

---

## 3. Quick Start & Running the Platform

### Running the Web Platform (React + Vite + TailwindCSS):
```bash
cd apps/web
npm install
npm run dev
```
The application will launch on **http://localhost:3000**.

### Persona Switcher:
Click the profile icon in the top right navigation bar to instantly switch between:
- **Citizen / SHG Leader**: Smt. Sunita Devi (Ranchi)
- **Gram Panchayat Mukhia**: Shri Birsa Munda (Torpa, Khunti)
- **University Nodal Officer**: Dr. Rajesh Verma (BIT Mesra)
- **Faculty Mentor**: Prof. Ananya Sen (Dept of Water & Environmental Engg)
- **Student Team Lead**: Rahul Kumar (Lead Innovator, Team JalRakshak)
- **Industry CSR Head**: Mr. Alok Sanyal (Tata Steel CSR Foundation)
- **State Nodal Admin**: Dr. Shailesh Kumar, IAS (Higher Education Dept)

---

## 4. SIH 2026 End-to-End Demo Script for Judges

1. **Citizen Ingestion**:
   - Navigate to `/submit`. Click **Record Voice Note** in Nagpuri or Hindi. Choose **Ranchi & Angara Block**.
   - See instant CV validation and submit challenge.
   - Go to `/my-problems` to view the 10-step lifecycle stepper and upvote other issues.

2. **Explainable AI & Nodal Gate**:
   - Switch persona to **State Nodal Admin**.
   - Click **Inspect Explainable AI &rarr;** on the ticket.
   - Inspect NLP confidence (96%), CV scene tags, zero-duplicate verification, and Top-3 HEI match (BIT Mesra 96%).
   - Click **Confirm & Route to University**.

3. **University Collaboration**:
   - Switch persona to **University Nodal Officer (BIT Mesra)** at `/hei/dashboard`.
   - Accept the challenge and assign faculty mentor Prof. Ananya Sen.
   - Form multidisciplinary student team (IoT + Chemical + CS + Rural Management).
   - Go to `/hei/teams` to view the active sprint Kanban board.
   - Submit a formal research proposal at `/hei/proposals/new` with ₹3.85 Lakhs budget.

4. **Industry & CSR Matchmaking**:
   - Switch persona to **Tata Steel CSR Head** at `/industry/marketplace`.
   - Discover the approved JalShuddhi proposal.
   - Click **Partner & E-Sign MoU**. Apply digital signature and execute agreement.

5. **Project Lifecycle & Dual Sign-Off Gate**:
   - Visit `/lifecycle/prop-001`.
   - Inspect the 5-stage Gantt chart and Document Vault.
   - Apply **Faculty Sign-off** and **Govt District Officer Stamp** to complete Milestone 3.
   - Click **Audit Blockchain Ledger** to view immutable cryptographic hash blocks.
   - Note the **Jharkhand Startup Incubation Auto-Trigger** banner.

6. **Government BI Analytics**:
   - Visit `/govt/dashboard`.
   - Explore the 24-district Jharkhand heatmap, domain distribution charts, university rankings, and test PDF/Excel export.
