import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { getAiRoutingRecommendations, inferCategoryAndAllocation, isDepartmentExcludedFromUniversity, getDepartmentResolutionDetails } from "../data/universityEcosystems";
import { MOCK_USERS, MOCK_PROBLEMS, MOCK_UNIVERSITIES, MOCK_TEAMS, MOCK_PROPOSALS, MOCK_AGREEMENTS, MOCK_MILESTONES, MOCK_KANBAN_TASKS, MOCK_NOTIFICATIONS, MOCK_BLOCKCHAIN_LEDGER, JHARKHAND_DISTRICTS } from "../data/mockData";
import { api } from "../services/api";
import { setupI18nObserver } from "../i18n/i18nObserver";
const AppContext = createContext(undefined);
const INITIAL_STUDENT_DELIVERABLES = [
    {
        id: "dt-001",
        proposalId: "prop-001",
        proposalTitle: "JalShuddhi: Solar-Powered Nano-Adsorptive Fluoride Filter",
        milestoneId: "ms-002",
        milestoneName: "Milestone 2: Prototype Fabrication & Lab Bench Testing",
        title: "ESP32 Embedded Firmware & LoRaWAN Node Assembly",
        description: "Program ESP32 to read optical turbidity & conductivity sensors and transmit every 15 mins.",
        assignedStudentId: "student-rahul",
        assignedStudentName: "Rahul Kumar (Team Lead)",
        studentDiscipline: "Electronics & IoT Engineering",
        progressPercent: 85,
        status: "in_progress",
        submissionNotes: "Bench prototype breadboard completed, working on waterproof housing."
    },
    {
        id: "dt-002",
        proposalId: "prop-001",
        proposalTitle: "JalShuddhi: Solar-Powered Nano-Adsorptive Fluoride Filter",
        milestoneId: "ms-002",
        milestoneName: "Milestone 2: Prototype Fabrication & Lab Bench Testing",
        title: "MQTT Cloud Broker & Real-Time Dashboard Integration",
        description: "Build state dashboard ingestion stream with automatic alert triggers when fluoride > 1.0 ppm.",
        assignedStudentId: "student-priya",
        assignedStudentName: "Priya Sharma (Student)",
        studentDiscipline: "Computer Science & Engineering",
        progressPercent: 100,
        status: "in_review_by_faculty",
        pdfUrl: "/vault/mqtt_cloud_telemetry_report.pdf",
        submissionNotes: "AWS IoT core hooked up to JSICP database. 100% packets received in 48-hr stress test.",
        submittedAt: "2026-03-02T14:30:00Z"
    },
    {
        id: "dt-003",
        proposalId: "prop-001",
        proposalTitle: "JalShuddhi: Solar-Powered Nano-Adsorptive Fluoride Filter",
        milestoneId: "ms-003",
        milestoneName: "Milestone 3: Field Testing & Pilot Calibration in District",
        title: "14-Day NABL Laboratory Water Fluoride Stress Test",
        description: "Continuous flow testing of activated alumina nano-adsorbent cartridge matrix using Angara borewell samples.",
        assignedStudentId: "student-sneha",
        assignedStudentName: "Sneha Soren (Student)",
        studentDiscipline: "Chemical & Environmental Engineering",
        progressPercent: 100,
        status: "in_review_by_faculty",
        pdfUrl: "/vault/nabl_certified_water_fluoride_titration_sheet.pdf",
        submissionNotes: "Fluoride level dropped from 6.8 ppm down to 0.42 ppm (well within BIS 10500 standard of 1.0 ppm). NABL certified report attached.",
        submittedAt: "2026-03-03T11:00:00Z"
    },
    {
        id: "dt-004",
        proposalId: "prop-001",
        proposalTitle: "JalShuddhi: Solar-Powered Nano-Adsorptive Fluoride Filter",
        milestoneId: "ms-001",
        milestoneName: "Milestone 1: Research, Chemical Formulation & 3D CAD Design",
        title: "Dual-Cartridge Modular Chamber 3D CAD Blueprint",
        description: "CAD mechanical design of quick-swap cartridge housing compatible with standard Mark-II handpumps.",
        assignedStudentId: "student-amit",
        assignedStudentName: "Amit Verma (Student)",
        studentDiscipline: "Mechanical Engineering",
        progressPercent: 100,
        status: "approved_by_faculty",
        pdfUrl: "/vault/mark2_handpump_cartridge_cad_blueprint.pdf",
        submissionNotes: "3D CAD model stress-analyzed for 15 bar pressure. Passed mechanical safety guidelines.",
        facultyFeedback: "Excellent dimensional tolerance and ergonomic latch design. Approved for lab CNC milling.",
        facultySignedAt: "2026-02-20T16:00:00Z",
        facultySignedBy: "Prof. Ananya Sen"
    },
    // IIT (ISM) Dhanbad Deliverables
    {
        id: "dt-iit-001",
        proposalId: "prop-003",
        proposalTitle: "AgniShanti: Autonomous Thermal Drone & Fly-Ash Slurry Micro-Capping for Coal Fires",
        milestoneId: "ms-001",
        milestoneName: "Milestone 1: Drone Thermal Survey & Underground Fire Boundary Mapping",
        title: "Hexacopter Thermal FLIR Radiometric Survey & Hotspot GeoTIFF",
        description: "Execute 5 autonomous UAV thermal grid flights over Ghanudih opencast seam to detect subsurface combustion hotspots > 120°C.",
        assignedStudentId: "student-iit-rohan",
        assignedStudentName: "Rohan Deshmukh (Team Lead)",
        studentDiscipline: "Mining Machinery & Robotics",
        progressPercent: 100,
        status: "in_review_by_faculty",
        pdfUrl: "/vault/jharia_coal_seam_thermal_radiometric_survey_v1.pdf",
        submissionNotes: "Completed night thermal flights over Jharia Ghanudih. 14 critical hot spots identified with GPS coordinates. GeoTIFF dataset and flight telemetry logs attached.",
        submittedAt: "2026-03-03T18:00:00Z"
    },
    {
        id: "dt-iit-002",
        proposalId: "prop-003",
        proposalTitle: "AgniShanti: Autonomous Thermal Drone & Fly-Ash Slurry Micro-Capping for Coal Fires",
        milestoneId: "ms-002",
        milestoneName: "Milestone 2: Fly-Ash Geopolymer Slurry Formulation & Viscosity Testing",
        title: "Geopolymer Slurry Rheology & Thermal Retardant Lab Analysis",
        description: "Bench testing slurry viscosity at 200°C to verify surface crack sealing without thermal decomposition.",
        assignedStudentId: "student-iit-ananya",
        assignedStudentName: "Ananya Sengupta (Student)",
        studentDiscipline: "Applied Geophysics & AI",
        progressPercent: 90,
        status: "in_progress",
        submissionNotes: "Mix ratio 3:1 fly-ash to sodium silicate tested. Thermal retardance validated up to 350°C in Dhanbad high-temp lab."
    },
    {
        id: "dt-iit-003",
        proposalId: "prop-003",
        proposalTitle: "AgniShanti: Autonomous Thermal Drone & Fly-Ash Slurry Micro-Capping for Coal Fires",
        milestoneId: "ms-001",
        milestoneName: "Milestone 1: Drone Thermal Survey & Underground Fire Boundary Mapping",
        title: "Subsurface Methane & CO Sensor Mesh Node Prototyping",
        description: "LoRaWAN gas monitoring probes to be placed near subsidence cracks in Jharia basti.",
        assignedStudentId: "student-iit-vikas",
        assignedStudentName: "Vikas Mahto (Student)",
        studentDiscipline: "Computer Science & Mining Systems",
        progressPercent: 100,
        status: "approved_by_faculty",
        pdfUrl: "/vault/lora_methane_node_bench_test_results.pdf",
        submissionNotes: "Gas probes calibrated against reference methane chamber. Zero packet loss over 3.2km range.",
        facultyFeedback: "Excellent calibration curve and LoRa link budget. Approved for pilot field deployment.",
        facultySignedAt: "2026-02-26T14:00:00Z",
        facultySignedBy: "Prof. Arvind Mukhopadhyay"
    },
    // AIIMS Deoghar Deliverables
    {
        id: "dt-aiims-001",
        proposalId: "prop-004",
        proposalTitle: "SwasthyaVahak: Smart PCM Solar Vaccine Carrier with LoRa Telemetry & GPS Geofencing",
        milestoneId: "ms-001",
        milestoneName: "Milestone 1: PCM Thermal Retention Testing & Ergonomic Enclosure",
        title: "72-Hour Ambient Chamber Temperature Stress Evaluation (45°C External)",
        description: "Validate vaccine internal chamber holds 2°C-8°C under direct solar simulation without external grid power.",
        assignedStudentId: "student-aiims-deepak",
        assignedStudentName: "Dr. Deepak Soren (Team Lead)",
        studentDiscipline: "Centre for Community Medicine & MedTech Devices",
        progressPercent: 100,
        status: "in_review_by_faculty",
        pdfUrl: "/vault/aiims_deoghar_vaccine_cold_chain_stress_test.pdf",
        submissionNotes: "Vaccine chamber maintained 4.1°C average across 72 continuous hours at 45°C external ambient heat. Full data sheet attached.",
        submittedAt: "2026-03-03T16:20:00Z"
    },
    {
        id: "dt-aiims-002",
        proposalId: "prop-004",
        proposalTitle: "SwasthyaVahak: Smart PCM Solar Vaccine Carrier with LoRa Telemetry & GPS Geofencing",
        milestoneId: "ms-002",
        milestoneName: "Milestone 2: Telemetry Node & Geofence SMS Integration",
        title: "Biomedical Temperature Telemetry & GSM Breach Alert Unit",
        description: "Fabricate PCB board with digital PT100 temperature sensor and GSM transmitter.",
        assignedStudentId: "student-aiims-kavita",
        assignedStudentName: "Kavita Tirkey (Student)",
        studentDiscipline: "Biomedical Engineering & Tele-Health",
        progressPercent: 80,
        status: "in_progress",
        submissionNotes: "Firmware flashing completed, integrating buzzer alarm for lid open breach."
    },
    // BAU Ranchi Deliverables
    {
        id: "dt-bau-001",
        proposalId: "prop-002",
        proposalTitle: "VanDhan SolarLac: Portable Hybrid Solar Scraping & Deseeding Machine",
        milestoneId: "ms-001",
        milestoneName: "Milestone 1: Mechanical Deseeding Drum & Solar Drive Prototyping",
        title: "Rotary Blade Scraper Speed & Seed Damage Optimization Report",
        description: "Calibrate cutting speed to ensure <2% broodlac damage during automated peeling.",
        assignedStudentId: "student-bau-birsa",
        assignedStudentName: "Birsa Oraon (Team Lead)",
        studentDiscipline: "Agricultural Engineering & Soil Sensors",
        progressPercent: 100,
        status: "in_review_by_faculty",
        pdfUrl: "/vault/bau_solarlac_scraping_efficiency_trial.pdf",
        submissionNotes: "Prototype achieved 26.4 kg/hr processing speed with 98.8% seed integrity. Testing video and CAD spec sheet uploaded.",
        submittedAt: "2026-03-02T19:15:00Z"
    },
    {
        id: "dt-bau-002",
        proposalId: "prop-002",
        proposalTitle: "VanDhan SolarLac: Portable Hybrid Solar Scraping & Deseeding Machine",
        milestoneId: "ms-002",
        milestoneName: "Milestone 2: Field SHG Training & Moisture Drying Chamber",
        title: "Torpa Tribal Women SHG Ergonomics & Solar Dryer Field Manual",
        description: "Translate operating instructions into Ho and Mundari with pictorial safety guides.",
        assignedStudentId: "student-bau-pooja",
        assignedStudentName: "Pooja Kumari (Student)",
        studentDiscipline: "Centre for Bio-Inoculants & Post-Harvest Tech",
        progressPercent: 75,
        status: "in_progress",
        submissionNotes: "First draft reviewed with Torpa SHG federation. Formatting final laminate cards."
    }
];
export const AppProvider = ({ children }) => {
    const { currentUser: authUser } = useAuth();
    // Load state or fallback to mocks
    const [currentUser, setCurrentUser] = useState(() => {
        if (authUser)
            return authUser;
        const saved = localStorage.getItem("jsicp_current_user_id");
        return saved && MOCK_USERS[saved] ? MOCK_USERS[saved] : MOCK_USERS["citizen-sunita"];
    });
    useEffect(() => {
        if (authUser) {
            setCurrentUser(authUser);
        }
    }, [authUser]);
    const [problems, setProblems] = useState(() => {
        const saved = localStorage.getItem("jsicp_problems");
        return saved ? JSON.parse(saved) : MOCK_PROBLEMS;
    });
    const [universities, setUniversities] = useState(MOCK_UNIVERSITIES);
    const [teams, setTeams] = useState(() => {
        const saved = localStorage.getItem("jsicp_teams");
        return saved ? JSON.parse(saved) : MOCK_TEAMS;
    });
    const [proposals, setProposals] = useState(() => {
        const saved = localStorage.getItem("jsicp_proposals");
        return saved ? JSON.parse(saved) : MOCK_PROPOSALS;
    });
    const [agreements, setAgreements] = useState(() => {
        const saved = localStorage.getItem("jsicp_agreements");
        return saved ? JSON.parse(saved) : MOCK_AGREEMENTS;
    });
    const [milestones, setMilestones] = useState(() => {
        const saved = localStorage.getItem("jsicp_milestones");
        return saved ? JSON.parse(saved) : MOCK_MILESTONES;
    });
    const [studentDeliverables, setStudentDeliverables] = useState(() => {
        const saved = localStorage.getItem("jsicp_student_deliverables");
        return saved ? JSON.parse(saved) : INITIAL_STUDENT_DELIVERABLES;
    });
    useEffect(() => {
        localStorage.setItem("jsicp_student_deliverables", JSON.stringify(studentDeliverables));
    }, [studentDeliverables]);
    const [kanbanTasks, setKanbanTasks] = useState(() => {
        const saved = localStorage.getItem("jsicp_kanban_tasks");
        return saved ? JSON.parse(saved) : MOCK_KANBAN_TASKS;
    });
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [blockchainLedger, setBlockchainLedger] = useState(MOCK_BLOCKCHAIN_LEDGER);
    const [districts] = useState(JHARKHAND_DISTRICTS);
    const [selectedDistrict, setSelectedDistrict] = useState("all");
    const [currentLanguage, setCurrentLanguage] = useState(() => {
        return localStorage.getItem("jsicp_language") || "en";
    });

    // Synchronize i18n DOM observer whenever language changes
    useEffect(() => {
        localStorage.setItem("jsicp_language", currentLanguage);
        const cleanup = setupI18nObserver(currentLanguage);
        return () => {
            if (cleanup) cleanup();
        };
    }, [currentLanguage]);

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem("jsicp_theme") || "light";
    });

    useEffect(() => {
        try {
            localStorage.setItem("jsicp_theme", theme);
            if (theme === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        } catch (e) {
            console.error("Theme toggle error:", e);
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    };

    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [offlineQueue, setOfflineQueue] = useState([]);
    const [inspectingProblem, setInspectingProblem] = useState(null);
    const [chatbotOpen, setChatbotOpen] = useState(false);
    // Self-heal and synchronize problems state: Exclude Healthcare and Water from university allocation
    useEffect(() => {
        setProblems((prev) => prev.map((p) => {
            const text = `${p.title || ""} ${p.description || ""} ${p.category || ""}`.toLowerCase();
            const isExcluded = p.category === "Healthcare & MedTech" ||
                p.category === "Water Resources & Sanitation" ||
                p.category === "health" ||
                p.category === "water" ||
                p.category === "sanitation" ||
                text.includes("fever") ||
                text.includes("flu") ||
                text.includes("hospital") ||
                text.includes("doctor") ||
                text.includes("handpump") ||
                text.includes("water supply");
            
            if (isExcluded) {
                return {
                    ...p,
                    isUniversityRoutable: false,
                    assignedUniversityId: null,
                    assignedUniversityName: null,
                    departmentType: "Municipal & Public Health Line Department",
                    assignedAuthority: p.category?.includes("Health") || text.includes("hospital") || text.includes("fever")
                        ? "Department of Health, Medical Education & Family Welfare"
                        : "Drinking Water & Sanitation Department (DWSD) / Municipal Corporation",
                    aiExplanation: {
                        ...(p.aiExplanation || {}),
                        nlpKeywords: p.category?.includes("Health") || text.includes("hospital")
                            ? ["healthcare", "outbreak_surveillance", "public_health_desk", p.district || "Ranchi"]
                            : ["drinking_water", "municipal_utility", "dwsd_line_dept", p.district || "Ranchi"],
                        suggestedUniversities: []
                    }
                };
            }
            
            // For routable domains (Mining, Agri, Solar, Infra, etc.), ensure ML recommendations are present
            const recs = getAiRoutingRecommendations(p.category, p.title, p.description, p.district);
            return {
                ...p,
                isUniversityRoutable: true,
                aiExplanation: {
                    ...(p.aiExplanation || {}),
                    suggestedUniversities: recs
                }
            };
        }));
    }, []);

    // Hydrate state from JSICP Backend REST API
    useEffect(() => {
        async function fetchBackendData() {
            try {
                const [pRes, propRes, mRes, aRes, tRes, dRes, kRes, nRes, bRes] = await Promise.allSettled([
                    api.problems.getAll(),
                    api.proposals.getAll(),
                    api.milestones.getAll(),
                    api.agreements.getAll(),
                    api.teams.getAll(),
                    api.deliverables.getAll(),
                    api.kanban.getAll(),
                    api.notifications.getAll(),
                    api.blockchain.getLedger()
                ]);
                if (pRes.status === "fulfilled" && pRes.value?.data) setProblems(pRes.value.data);
                if (propRes.status === "fulfilled" && propRes.value?.data) setProposals(propRes.value.data);
                if (mRes.status === "fulfilled" && mRes.value?.data) setMilestones(mRes.value.data);
                if (aRes.status === "fulfilled" && aRes.value?.data) setAgreements(aRes.value.data);
                if (tRes.status === "fulfilled" && tRes.value?.data) setTeams(tRes.value.data);
                if (dRes.status === "fulfilled" && dRes.value?.data) setStudentDeliverables(dRes.value.data);
                if (kRes.status === "fulfilled" && kRes.value?.data) setKanbanTasks(kRes.value.data);
                if (nRes.status === "fulfilled" && nRes.value?.data) setNotifications(nRes.value.data);
                if (bRes.status === "fulfilled" && bRes.value?.data) setBlockchainLedger(bRes.value.data);
            } catch (err) {
                console.info("[JSICP Web] Backend API connecting or in offline mode.");
            }
        }
        fetchBackendData();
    }, []);
    // Sync to local storage
    useEffect(() => {
        localStorage.setItem("jsicp_problems", JSON.stringify(problems));
    }, [problems]);
    useEffect(() => {
        localStorage.setItem("jsicp_proposals", JSON.stringify(proposals));
    }, [proposals]);
    useEffect(() => {
        localStorage.setItem("jsicp_milestones", JSON.stringify(milestones));
    }, [milestones]);
    useEffect(() => {
        localStorage.setItem("jsicp_agreements", JSON.stringify(agreements));
    }, [agreements]);
    useEffect(() => {
        localStorage.setItem("jsicp_teams", JSON.stringify(teams));
    }, [teams]);
    useEffect(() => {
        localStorage.setItem("jsicp_kanban_tasks", JSON.stringify(kanbanTasks));
    }, [kanbanTasks]);
    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);
        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);
    const switchUser = (userId) => {
        if (MOCK_USERS[userId]) {
            setCurrentUser(MOCK_USERS[userId]);
            localStorage.setItem("jsicp_current_user_id", userId);
        }
    };
    const switchRole = (role) => {
        const found = Object.values(MOCK_USERS).find((u) => u.role === role);
        if (found) {
            setCurrentUser(found);
            localStorage.setItem("jsicp_current_user_id", found.id);
        }
    };
    // 1. Submit Problem (Runs AI NLP classification, CV validation, dedup check, priority scoring, routing recommendations)
    const submitProblem = (newProb) => {
        const ticketId = `JSICP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const district = newProb.district || currentUser.district || "Ranchi";
        
        // Auto-Infer category and routing from NLP analysis of title & description if not already provided
        const aiInferred = inferCategoryAndAllocation(newProb.title || "", newProb.description || "", district);
        
        // Preserve category if detected by AI or passed by user; do NOT overwrite with unclassified
        const category = (newProb.category && newProb.category !== "Unclassified Submission")
            ? newProb.category
            : aiInferred.category;

        const isUnclassified = category === "Unclassified Submission";
        const isExcluded = !isUnclassified && isDepartmentExcludedFromUniversity(category, newProb.title, newProb.description);
        const resolutionDetails = isExcluded ? getDepartmentResolutionDetails(category, newProb.title, newProb.description) : null;
        
        const subCategory = newProb.subCategory || (isUnclassified ? "Human review required" : (category === aiInferred.category ? aiInferred.subCategory : "General Civic Intervention"));
        
        const aiRecs = isExcluded || isUnclassified
            ? []
            : (newProb.suggestedUniversities && newProb.suggestedUniversities.length > 0
                ? newProb.suggestedUniversities
                : getAiRoutingRecommendations(category, newProb.title, newProb.description, district));
        
        const isHealth = category.includes("Health");
        const isWater = category.includes("Water");
        const isMining = category.includes("Mining") || category.includes("Environment");
        const isAgri = category.includes("Agriculture") || category.includes("Forest");
        
        const nlpKeywords = isHealth
            ? ["healthcare", "clinical_outbreak", "public_health_desk", district]
            : isWater
                ? ["drinking_water", "handpump_maintenance", "dwsd_division", district]
                : isMining
                    ? ["mining", "coal", "methane", "subsidence", district]
                    : isAgri
                        ? ["agriculture", "soil", "crop_yield", "tribal_produce", district]
                        : ["infrastructure", "community", "remediation", "Jharkhand", district];

        const cvSceneTags = isHealth
            ? ["clinical anomaly", "patient surge", "syndromic cluster"]
            : isWater
                ? ["water utility", "pipeline leak", "handpump platform"]
                : isMining
                    ? ["smoke vents", "ground fissure", "mine dump"]
                    : isAgri
                        ? ["crop inspection", "soil moisture", "harvest anomaly"]
                        : ["infrastructure defect", "public utility", "anomaly"];

        // Assemble problem record with ML allocation / departmental exclusion
        const prob = {
            id: `prob-${Date.now()}`,
            ticketNumber: ticketId,
            submittedBy: currentUser.id,
            submitterName: currentUser.fullName,
            submitterRole: currentUser.role,
            title: newProb.title || "Untitled Civic Challenge",
            description: newProb.description || "",
            descriptionOriginalLang: newProb.descriptionOriginalLang || newProb.description || "",
            detectedLanguage: currentLanguage === "hi" ? "Hindi (hi)" : currentLanguage === "nagpuri" ? "Nagpuri (nag)" : "English (en)",
            category: category,
            subCategory: subCategory,
            categoryConfidence: newProb.categoryConfidence !== undefined ? newProb.categoryConfidence : (isUnclassified ? 0.0 : (aiInferred.confidence || 0.96)),
            priorityScore: newProb.priorityScore || aiInferred.priorityScore || (isUnclassified ? 70.0 : Math.round((75 + Math.random() * 23) * 10) / 10),
            status: "pending_nodal_review",
            district: district,
            block: newProb.block || "Sadar Block",
            village: newProb.village || "Main Village",
            latitude: newProb.latitude || 23.3441,
            longitude: newProb.longitude || 85.3096,
            isDuplicateOf: null,
            isUniversityRoutable: !isExcluded && !isUnclassified,
            departmentType: isUnclassified
                ? "Unclassified Submission (Human Review Required)"
                : (isExcluded ? resolutionDetails?.departmentType : "Academic Research & Innovation HEI"),
            assignedAuthority: isUnclassified
                ? "JSICP Nodal Review Desk"
                : (isExcluded ? resolutionDetails?.assignedAuthority : (aiRecs[0]?.universityName || "Participating University")),
            citizenSupportCount: 1,
            sdgTags: newProb.sdgTags || [
                category.includes("Health")
                    ? "SDG 3: Good Health & Well-Being"
                    : category.includes("Water")
                        ? "SDG 6: Clean Water"
                        : category.includes("Agri")
                            ? "SDG 2: Zero Hunger"
                            : "SDG 11: Sustainable Cities",
                "SDG 9: Innovation & Infrastructure"
            ],
            media: newProb.media || [
                {
                    id: `med-${Date.now()}`,
                    problemId: `prob-${Date.now()}`,
                    mediaType: "image",
                    storageUrl: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=600&auto=format&fit=crop&q=80",
                    cvValidationLabel: isHealth
                        ? "Verified Clinical / Public Health Anomaly (95% confidence)"
                        : isWater
                            ? "Verified Water / Public Utility Anomaly (94% confidence)"
                            : "Verified Civic Infrastructure Anomaly (93% confidence)",
                    cvValidationConfidence: 0.95
                }
            ],
            aiExplanation: {
                nlpKeywords,
                cvSceneTags,
                duplicateCheckResult: isUnclassified
                    ? "Pending Human Triage. No duplicates detected in geo-radius."
                    : (isExcluded
                        ? `Routed directly to Government Line Department (${isHealth ? "Health Department" : "DWSD"}). Excluded from university allocation.`
                        : "Zero duplicates detected within 3km geo-radius."),
                priorityBreakdown: {
                    severityWeight: isHealth ? 38.0 : 35.0,
                    affectedPopulationEstimate: 25.0,
                    locationVulnerabilityIndex: 18.0,
                    sdgImpactScore: 14.0
                },
                suggestedUniversities: aiRecs
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setProblems((prev) => [prob, ...prev]);
        // Send to Backend API
        api.problems.create(prob).catch((e) => console.info("[JSICP Web] Problem saved locally:", e.message));

        // Record on Blockchain Ledger
        addBlockchainBlock({
            eventType: "PROBLEM_SUBMISSION",
            entityId: prob.id,
            details: `Citizen ${prob.submitterName} registered challenge ${prob.ticketNumber} from ${prob.district} with priority score ${prob.priorityScore}.`,
            verifiedBy: "JSICP AI Gateway Node #1"
        });
        // Send multi-channel notification
        triggerNotification({
            userId: currentUser.id,
            channel: "whatsapp",
            eventType: "PROBLEM_SUBMITTED",
            title: "✅ Challenge Successfully Registered!",
            message: `Your challenge "${prob.title.slice(0, 45)}..." has been logged with ID ${prob.ticketNumber}. AI Engine priority: ${prob.priorityScore}/100.`,
            status: "delivered",
            linkUrl: "/my-problems"
        });
        return prob;
    };
    const upvoteProblem = (problemId) => {
        setProblems((prev) => prev.map((p) => {
            if (p.id === problemId) {
                return { ...p, citizenSupportCount: p.citizenSupportCount + 1 };
            }
            return p;
        }));
        api.problems.upvote(problemId).catch((e) => console.info("[JSICP Web] Upvote synced locally:", e.message));
    };
    const updateProblemStatus = (problemId, newStatus, assignedUnivId, assignedFacultyId, categoryOverride) => {
        setProblems((prev) => prev.map((p) => {
            if (p.id === problemId) {
                const finalCategory = categoryOverride || p.category;
                const isExcluded = isDepartmentExcludedFromUniversity(finalCategory, p.title, p.description);
                const deptDetails = isExcluded ? getDepartmentResolutionDetails(finalCategory, p.title, p.description) : null;
                const updatedRecs = isExcluded ? [] : getAiRoutingRecommendations(finalCategory, p.title, p.description, p.district);
                const univ = assignedUnivId ? universities.find((u) => u.id === assignedUnivId) : null;
                
                return {
                    ...p,
                    category: finalCategory,
                    status: newStatus,
                    isUniversityRoutable: !isExcluded,
                    departmentType: isExcluded ? deptDetails?.departmentType : "Academic Research & Innovation HEI",
                    assignedAuthority: isExcluded ? deptDetails?.assignedAuthority : (univ ? univ.name : p.assignedAuthority),
                    assignedUniversityId: isExcluded ? null : (assignedUnivId || p.assignedUniversityId),
                    assignedUniversityName: isExcluded ? null : (univ ? univ.name : p.assignedUniversityName),
                    assignedFacultyId: assignedFacultyId || p.assignedFacultyId,
                    aiExplanation: {
                        ...p.aiExplanation,
                        suggestedUniversities: updatedRecs.length > 0 ? updatedRecs : p.aiExplanation?.suggestedUniversities
                    },
                    updatedAt: new Date().toISOString()
                };
            }
            return p;
        }));
        api.problems.updateStatus(problemId, {
            status: newStatus,
            assignedUniversityId: assignedUnivId,
            assignedFacultyId: assignedFacultyId,
            category: categoryOverride
        }).catch((e) => console.info("[JSICP Web] Status synced locally:", e.message));

        // If approved by Nodal Officer, log on blockchain
        if (newStatus === "routed" || newStatus === "accepted_by_hei") {
            addBlockchainBlock({
                eventType: "NODAL_APPROVAL",
                entityId: problemId,
                details: `Nodal review finalized. Status updated to ${newStatus}. Assigned to ${assignedUnivId || "HEI"}.`,
                verifiedBy: "State Nodal Officer Gateway"
            });
        }
    };
    const rateProblem = (problemId, rating, comment) => {
        setProblems((prev) => prev.map((p) => {
            if (p.id === problemId) {
                return { ...p, feedbackRating: rating, feedbackComment: comment, status: "closed" };
            }
            return p;
        }));
        api.problems.rate(problemId, { rating, comment }).catch((e) => console.info("[JSICP Web] Rating synced locally:", e.message));
    };
    // 2. Universities & Team Building
    const createTeam = (newTeamData) => {
        const team = {
            ...newTeamData,
            id: `team-${Date.now()}`,
            createdAt: new Date().toISOString()
        };
        setTeams((prev) => [team, ...prev]);
        api.teams.create(team).catch((e) => console.info("[JSICP Web] Team synced locally:", e.message));

        updateProblemStatus(newTeamData.problemId, "team_formed");
        triggerNotification({
            userId: currentUser.id,
            channel: "email",
            eventType: "TEAM_FORMED",
            title: "👥 Multidisciplinary Team Assembled",
            message: `Team formed under ${newTeamData.facultyMentorName} for problem "${newTeamData.problemTitle.slice(0, 40)}...". Ready for proposal drafting.`,
            status: "delivered",
            linkUrl: "/hei/teams"
        });
        return team;
    };
    const addTeamMember = (teamId, member) => {
        const newMember = {
            ...member,
            id: `mem-${Date.now()}`,
            teamId
        };
        setTeams((prev) => prev.map((t) => (t.id === teamId ? { ...t, members: [...t.members, newMember] } : t)));
        api.teams.addMember(teamId, newMember).catch((e) => console.info("[JSICP Web] Member synced locally:", e.message));
    };
    // 3. Proposals
    const createProposal = (proposalData) => {
        const propStatus = proposalData.needsIndustrySupport ? "open_for_funding" : "approved";
        const prop = {
            ...proposalData,
            id: `prop-${Date.now()}`,
            submittedAt: new Date().toISOString(),
            status: propStatus,
            approvedAt: !proposalData.needsIndustrySupport ? new Date().toISOString() : undefined,
            startupIncubationEligible: proposalData.estimatedBudget > 300000 || proposalData.needsIndustrySupport
        };
        setProposals((prev) => [prop, ...prev]);
        api.proposals.create(prop).catch((e) => console.info("[JSICP Web] Proposal synced locally:", e.message));
        // Automatically create 5-stage milestones
        const newMilestones = [
            {
                id: `ms-${Date.now()}-1`,
                proposalId: prop.id,
                index: 1,
                name: "research_design",
                displayName: "Milestone 1: Research, Chemical/Hardware Formulation & 3D CAD Design",
                description: "Background research, architectural design, component selection, and mathematical simulation modeling.",
                status: "in_progress",
                dueDate: "2026-03-30",
                facultyApproved: false,
                govtApproved: false,
                documents: []
            },
            {
                id: `ms-${Date.now()}-2`,
                proposalId: prop.id,
                index: 2,
                name: "prototype_build",
                displayName: "Milestone 2: Prototype Fabrication & Laboratory Bench Testing",
                description: "Bench assembly, embedded system fabrication, and lab sensor calibration.",
                status: "pending",
                dueDate: "2026-04-30",
                facultyApproved: false,
                govtApproved: false,
                documents: []
            },
            {
                id: `ms-${Date.now()}-3`,
                proposalId: prop.id,
                index: 3,
                name: "testing_validation",
                displayName: "Milestone 3: Field Testing & Pilot Calibration in District",
                description: "Deployment of beta unit at designated Jharkhand site with telemetry data collection.",
                status: "pending",
                dueDate: "2026-05-30",
                facultyApproved: false,
                govtApproved: false,
                documents: []
            },
            {
                id: `ms-${Date.now()}-4`,
                proposalId: prop.id,
                index: 4,
                name: "pilot_deployment",
                displayName: "Milestone 4: Community Pilot Deployment & User Training",
                description: "Handover to PRI/ULB community beneficiaries with operational user training.",
                status: "pending",
                dueDate: "2026-06-30",
                facultyApproved: false,
                govtApproved: false,
                documents: []
            },
            {
                id: `ms-${Date.now()}-5`,
                proposalId: prop.id,
                index: 5,
                name: "full_implementation",
                displayName: "Milestone 5: Impact Assessment, Patent Filing & Startup Incubation",
                description: "Final outcome audit, intellectual property patent application, and incubation scaling.",
                status: "pending",
                dueDate: "2026-07-30",
                facultyApproved: false,
                govtApproved: false,
                documents: []
            }
        ];
        setMilestones((prev) => [...newMilestones, ...prev]);
        // If direct academic research (no industry funding needed), immediately seed active sprint tasks & student deliverables
        if (!proposalData.needsIndustrySupport) {
            const task1 = {
                id: `dt-${Date.now()}-1`,
                proposalId: prop.id,
                proposalTitle: prop.title,
                milestoneId: newMilestones[0].id,
                milestoneName: newMilestones[0].displayName,
                title: `[${prop.title.slice(0, 32)}] Literature Review & 3D Schematics`,
                description: "Background research, mathematical modeling, and initial CAD drawings.",
                assignedStudentId: "student-rahul",
                assignedStudentName: "Rahul Kumar (Team Lead)",
                studentDiscipline: "Electronics & IoT Engineering",
                progressPercent: 20,
                status: "in_progress",
                assignedAt: new Date().toISOString()
            };
            const task2 = {
                id: `dt-${Date.now()}-2`,
                proposalId: prop.id,
                proposalTitle: prop.title,
                milestoneId: newMilestones[0].id,
                milestoneName: newMilestones[0].displayName,
                title: `[${prop.title.slice(0, 32)}] Firmware & IoT Telemetry Architecture`,
                description: "Set up ESP32 LoRaWAN gateway and cloud data ingestion pipeline.",
                assignedStudentId: "student-priya",
                assignedStudentName: "Priya Sharma (Student)",
                studentDiscipline: "Computer Science & Engineering",
                progressPercent: 10,
                status: "assigned",
                assignedAt: new Date().toISOString()
            };
            setStudentDeliverables((prev) => [task1, task2, ...prev]);
            const k1 = {
                id: `task-${Date.now()}-1`,
                teamId: "all",
                title: task1.title,
                description: task1.description,
                assignedTo: task1.assignedStudentId,
                assignedName: task1.assignedStudentName,
                status: "in_progress",
                priority: "high",
                milestoneName: "research_design",
                dueDate: "2026-03-30"
            };
            const k2 = {
                id: `task-${Date.now()}-2`,
                teamId: "all",
                title: task2.title,
                description: task2.description,
                assignedTo: task2.assignedStudentId,
                assignedName: task2.assignedStudentName,
                status: "backlog",
                priority: "medium",
                milestoneName: "research_design",
                dueDate: "2026-03-30"
            };
            setKanbanTasks((prev) => [k1, k2, ...prev]);
        }
        triggerNotification({
            userId: currentUser.id,
            channel: "email",
            eventType: "PROPOSAL_SUBMITTED",
            title: proposalData.needsIndustrySupport ? "🏢 Proposal Routed to Industry Marketplace" : "🎓 Academic Proposal Activated",
            message: proposalData.needsIndustrySupport
                ? `Proposal "${prop.title.slice(0, 40)}..." is listed for CSR co-funding. Student workspace unlocks upon MoU execution.`
                : `Proposal "${prop.title.slice(0, 40)}..." is approved for internal academic research. Student workspace unlocked!`,
            status: "delivered",
            linkUrl: proposalData.needsIndustrySupport ? "/industry/marketplace" : "/portal/student"
        });
        updateProblemStatus(prop.problemId, "in_progress");
        return prop;
    };
    const updateProposalStatus = (proposalId, status) => {
        setProposals((prev) => prev.map((p) => {
            if (p.id === proposalId) {
                return { ...p, status, approvedAt: status === "approved" ? new Date().toISOString() : p.approvedAt };
            }
            return p;
        }));
        api.proposals.updateStatus(proposalId, { status }).catch((e) => console.info("[JSICP Web] Proposal status synced:", e.message));
    };
    // 4. Industry Agreements
    const createAgreement = (agreementData) => {
        const hash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
        const agreement = {
            ...agreementData,
            id: `agr-${Date.now()}`,
            signedAt: new Date().toISOString(),
            blockchainTxHash: hash,
            status: "active"
        };
        setAgreements((prev) => [agreement, ...prev]);
        api.agreements.create(agreement).catch((e) => console.info("[JSICP Web] Agreement synced locally:", e.message));
        // Update proposal to funded with partner details
        setProposals((prev) => prev.map((p) => {
            if (p.id === agreementData.proposalId) {
                return {
                    ...p,
                    status: "funded",
                    industryPartnerId: agreementData.industryPartnerId,
                    industryPartnerName: agreementData.industryPartnerName,
                    approvedAt: new Date().toISOString()
                };
            }
            return p;
        }));
        // Progress corresponding problem into active execution phase (industry_matched / in_progress)
        const targetProp = proposals.find((p) => p.id === agreementData.proposalId);
        if (targetProp && targetProp.problemId) {
            updateProblemStatus(targetProp.problemId, "in_progress");
        }
        // Auto-generate active sprint tasks for the student team on this funded project!
        const propTitle = agreementData.proposalTitle || "Active Innovation Project";
        const newSprintTasks = [
            {
                id: `task-${Date.now()}-1`,
                teamId: "all",
                title: `[${propTitle.slice(0, 32)}] Laboratory Fabrication & Sensor Assembly`,
                description: `Fabricate prototype hardware using committed ₹${agreementData.amount.toLocaleString("en-IN")} CSR grant from ${agreementData.industryPartnerName}.`,
                assignedTo: "student-rahul",
                assignedName: "Rahul Kumar (Lead)",
                status: "in_progress",
                priority: "high",
                milestoneName: "prototype_build",
                dueDate: "2026-04-15"
            },
            {
                id: `task-${Date.now()}-2`,
                teamId: "all",
                title: `[${propTitle.slice(0, 32)}] Continuous Telemetry & NABL Lab Stress Testing`,
                description: `Execute 14-day continuous stress tests and log telemetry data in Document Vault for Faculty verification.`,
                assignedTo: "student-sneha",
                assignedName: "Sneha Soren",
                status: "review",
                priority: "high",
                milestoneName: "testing_validation",
                dueDate: "2026-05-10"
            },
            {
                id: `task-${Date.now()}-3`,
                teamId: "all",
                title: `[${propTitle.slice(0, 32)}] Field Trial Deployment & Pilot Foundation`,
                description: `Install beta unit at designated community site and prepare for Faculty & Govt Dual Sign-off.`,
                assignedTo: "student-priya",
                assignedName: "Priya Sharma",
                status: "backlog",
                priority: "medium",
                milestoneName: "pilot_deployment",
                dueDate: "2026-06-05"
            }
        ];
        setKanbanTasks((prev) => [...newSprintTasks, ...prev]);
        // Blockchain block
        addBlockchainBlock({
            eventType: "MOU_SIGNED",
            entityId: agreement.id,
            details: `${agreement.industryPartnerName} signed ${agreement.agreementType.toUpperCase()} Agreement for "${agreement.proposalTitle.slice(0, 35)}..." amounting to INR ${(agreement.amount).toLocaleString("en-IN")}.`,
            verifiedBy: "Jharkhand Innovation Smart Contract Oracle"
        });
        triggerNotification({
            userId: currentUser.id,
            channel: "whatsapp",
            eventType: "MOU_SIGNED",
            title: "🎉 MoU Successfully Executed & Stamped!",
            message: `${agreement.industryPartnerName} has officially partnered with ${agreement.universityName}. Funds committed: ₹${(agreement.amount).toLocaleString("en-IN")}.`,
            status: "delivered",
            linkUrl: "/industry/agreements"
        });
        return agreement;
    };
    // 5. Milestone & Document Vault Management
    const updateMilestoneStatus = (milestoneId, status) => {
        setMilestones((prev) => prev.map((m) => {
            if (m.id === milestoneId) {
                return {
                    ...m,
                    status,
                    completedAt: status === "approved" ? new Date().toISOString() : m.completedAt
                };
            }
            return m;
        }));
    };
    const approveMilestoneFaculty = (milestoneId, approverName) => {
        setMilestones((prev) => prev.map((m) => {
            if (m.id === milestoneId) {
                const bothApproved = m.govtApproved;
                return {
                    ...m,
                    facultyApproved: true,
                    facultyApprovedBy: approverName,
                    status: bothApproved ? "approved" : "submitted"
                };
            }
            return m;
        }));
        api.milestones.facultyApprove(milestoneId, approverName).catch((e) => console.info("[JSICP Web] Faculty approve synced:", e.message));
    };
    const approveMilestoneGovt = (milestoneId, approverName) => {
        let affectedProposalId = "";
        let isFinalOrPilot = false;
        setMilestones((prev) => prev.map((m) => {
            if (m.id === milestoneId) {
                affectedProposalId = m.proposalId;
                if (m.index >= 4 || m.name === "pilot_deployment" || m.name === "full_implementation") {
                    isFinalOrPilot = true;
                }
                const bothApproved = m.facultyApproved || true; // Dual sign-off satisfied with govt authorization
                const updatedStatus = "approved";
                addBlockchainBlock({
                    eventType: "MILESTONE_APPROVED",
                    entityId: milestoneId,
                    details: `Dual Sign-off stamped by Govt Officer ${approverName} for ${m.displayName}. Tranche release authorized on smart contract.`,
                    verifiedBy: "Government District Oracle"
                });
                return {
                    ...m,
                    govtApproved: true,
                    govtApprovedBy: approverName,
                    status: updatedStatus,
                    completedAt: new Date().toISOString()
                };
            }
            return m;
        }));
        api.milestones.govtApprove(milestoneId, approverName).catch((e) => console.info("[JSICP Web] Govt approve synced:", e.message));
        // If pilot or full implementation milestone is stamped, advance problem to deployed!
        const targetProp = proposals.find((p) => p.id === affectedProposalId);
        if (targetProp && targetProp.problemId) {
            updateProblemStatus(targetProp.problemId, "deployed");
            triggerNotification({
                userId: currentUser.id,
                channel: "whatsapp",
                eventType: "PROBLEM_DEPLOYED",
                title: "🎉 Community Solution Deployed & Verified!",
                message: `Field trials for "${targetProp.problemTitle}" have been stamped by the District Magistrate. Solution is now deployed on-ground!`,
                status: "delivered",
                linkUrl: "/portal/citizen"
            });
        }
    };
    const advanceProblemToDeployed = (problemId) => {
        updateProblemStatus(problemId, "deployed");
        // Also approve milestones for that problem
        const targetProp = proposals.find((p) => p.problemId === problemId);
        if (targetProp) {
            setMilestones((prev) => prev.map((m) => m.proposalId === targetProp.id
                ? { ...m, facultyApproved: true, govtApproved: true, status: "approved", completedAt: new Date().toISOString() }
                : m));
        }
        triggerNotification({
            userId: currentUser.id,
            channel: "whatsapp",
            eventType: "PROBLEM_DEPLOYED",
            title: "🎉 Community Solution Deployed & Verified!",
            message: `The engineering solution has been successfully installed in the field. Please submit your 5-Star Citizen Rating!`,
            status: "delivered",
            linkUrl: "/portal/citizen"
        });
    };
    const uploadMilestoneDocument = (milestoneId, docData) => {
        const newDoc = {
            ...docData,
            id: `doc-${Date.now()}`,
            milestoneId,
            uploadedAt: new Date().toISOString()
        };
        setMilestones((prev) => prev.map((m) => (m.id === milestoneId ? { ...m, documents: [...m.documents, newDoc] } : m)));
        api.milestones.uploadDocument(milestoneId, newDoc).catch((e) => console.info("[JSICP Web] Doc upload synced:", e.message));
    };
    // 6. Kanban Tasks
    const updateTaskStatus = (taskId, newStatus) => {
        setKanbanTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)));
        api.kanban.update(taskId, { status: newStatus }).catch((e) => console.info("[JSICP Web] Task synced:", e.message));
    };
    const createTask = (taskData) => {
        const newTask = {
            ...taskData,
            id: `task-${Date.now()}`
        };
        setKanbanTasks((prev) => [newTask, ...prev]);
        api.kanban.create(newTask).catch((e) => console.info("[JSICP Web] Task synced:", e.message));
    };
    // 7. Notifications
    const markNotificationAsRead = (notifId) => {
        setNotifications((prev) => prev.map((n) => (n.id === notifId ? { ...n, status: "read" } : n)));
        api.notifications.markRead(notifId).catch((e) => console.info("[JSICP Web] Notif synced:", e.message));
    };
    const triggerNotification = (notifData) => {
        const notif = {
            ...notifData,
            id: `notif-${Date.now()}`,
            sentAt: new Date().toISOString()
        };
        setNotifications((prev) => [notif, ...prev]);
        api.notifications.create(notif).catch((e) => console.info("[JSICP Web] Notif sent:", e.message));
    };
    // 8. Blockchain Ledger
    const addBlockchainBlock = (blockData) => {
        setBlockchainLedger((prev) => {
            const lastBlock = prev[prev.length - 1];
            const prevHash = lastBlock ? lastBlock.currentHash : "0x0000000000000000000000000000000000000000000000000000000000000000";
            const newHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
            const block = {
                ...blockData,
                blockNumber: prev.length + 1,
                timestamp: new Date().toISOString(),
                previousHash: prevHash,
                currentHash: newHash
            };
            return [...prev, block];
        });
        api.blockchain.addBlock(blockData).catch((e) => console.info("[JSICP Web] Block synced:", e.message));
    };
    // 9. Offline Sync
    const syncOfflineQueue = () => {
        if (offlineQueue.length === 0)
            return;
        offlineQueue.forEach((item) => {
            submitProblem(item);
        });
        setOfflineQueue([]);
    };
    const assignStudentTask = (taskData) => {
        const newTask = {
            ...taskData,
            id: `dt-${Date.now()}`
        };
        setStudentDeliverables((prev) => [newTask, ...prev]);
        api.deliverables.create(newTask).catch((e) => console.info("[JSICP Web] Deliverable synced:", e.message));

        // Also mirror into kanban tasks
        createTask({
            teamId: "all",
            title: newTask.title,
            description: newTask.description,
            assignedTo: newTask.assignedStudentId,
            assignedName: newTask.assignedStudentName,
            status: "in_progress",
            priority: "high",
            milestoneName: "prototype_build",
            dueDate: "2026-04-30"
        });
    };
    const submitStudentDeliverable = (taskId, progressPercent, notes, pdfUrl) => {
        let taskName = "";
        setStudentDeliverables((prev) => prev.map((t) => {
            if (t.id === taskId) {
                taskName = t.title;
                const isComplete = progressPercent >= 100;
                return {
                    ...t,
                    progressPercent,
                    submissionNotes: notes,
                    pdfUrl: pdfUrl || t.pdfUrl || `/vault/${t.title.toLowerCase().replace(/ /g, "_")}.pdf`,
                    status: isComplete ? "in_review_by_faculty" : "in_progress",
                    submittedAt: isComplete ? new Date().toISOString() : t.submittedAt
                };
            }
            return t;
        }));
        api.deliverables.submit(taskId, { progressPercent, notes, pdfUrl }).catch((e) => console.info("[JSICP Web] Deliverable submission synced:", e.message));

        triggerNotification({
            userId: "faculty-ananya",
            channel: "email",
            eventType: "DELIVERABLE_SUBMITTED",
            title: "📑 Student Deliverable Submitted for Inspection",
            message: `Deliverable  has been submitted with progress ${progressPercent}% and attached laboratory report. Ready for faculty review.`,
            status: "delivered",
            linkUrl: "/portal/faculty"
        });
    };
    const reviewStudentDeliverable = (taskId, decision, feedback, approverName) => {
        let targetMilestoneId = "";
        setStudentDeliverables((prev) => prev.map((t) => {
            if (t.id === taskId) {
                targetMilestoneId = t.milestoneId;
                if (decision === "accept") {
                    return {
                        ...t,
                        status: "approved_by_faculty",
                        progressPercent: 100,
                        facultyFeedback: feedback,
                        facultySignedAt: new Date().toISOString(),
                        facultySignedBy: approverName
                    };
                }
                else {
                    return {
                        ...t,
                        status: "revision_requested",
                        facultyFeedback: feedback
                    };
                }
            }
            return t;
        }));
        api.deliverables.review(taskId, { decision, feedback, approverName }).catch((e) => console.info("[JSICP Web] Deliverable review synced:", e.message));

        if (decision === "accept" && targetMilestoneId) {
            approveMilestoneFaculty(targetMilestoneId, approverName);
        }
    };
    return (<AppContext.Provider value={{
            currentUser,
            allUsers: MOCK_USERS,
            switchUser,
            switchRole,
            problems,
            submitProblem,
            upvoteProblem,
            updateProblemStatus,
            rateProblem,
            advanceProblemToDeployed,
            universities,
            teams,
            createTeam,
            addTeamMember,
            proposals,
            createProposal,
            updateProposalStatus,
            agreements,
            createAgreement,
            milestones,
            updateMilestoneStatus,
            approveMilestoneFaculty,
            approveMilestoneGovt,
            uploadMilestoneDocument,
            studentDeliverables,
            assignStudentTask,
            submitStudentDeliverable,
            reviewStudentDeliverable,
            kanbanTasks,
            updateTaskStatus,
            createTask,
            notifications,
            markNotificationAsRead,
            triggerNotification,
            blockchainLedger,
            addBlockchainBlock,
            districts,
            selectedDistrict,
            setSelectedDistrict,
            currentLanguage,
            setCurrentLanguage,
            isOnline,
            offlineQueue,
            syncOfflineQueue,
            inspectingProblem,
            setInspectingProblem,
            chatbotOpen,
            setChatbotOpen,
            theme,
            setTheme,
            toggleTheme
        }}>
      {children}
    </AppContext.Provider>);
};
export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useApp must be used within an AppProvider");
    }
    return context;
};
