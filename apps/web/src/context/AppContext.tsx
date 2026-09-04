import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  UserRole,
  Problem,
  University,
  Team,
  TeamMember,
  Proposal,
  Agreement,
  Milestone,
  KanbanTask,
  NotificationItem,
  BlockchainLedgerBlock,
  DistrictGeoData,
  ProblemStatus,
  MilestoneStatus,
  DocumentVaultItem
} from "../types";
import {
  MOCK_USERS,
  MOCK_PROBLEMS,
  MOCK_UNIVERSITIES,
  MOCK_TEAMS,
  MOCK_PROPOSALS,
  MOCK_AGREEMENTS,
  MOCK_MILESTONES,
  MOCK_KANBAN_TASKS,
  MOCK_NOTIFICATIONS,
  MOCK_BLOCKCHAIN_LEDGER,
  JHARKHAND_DISTRICTS
} from "../data/mockData";

export interface AppContextType {
  currentUser: User;
  allUsers: Record<string, User>;
  switchUser: (userId: string) => void;
  switchRole: (role: UserRole) => void;
  
  problems: Problem[];
  submitProblem: (newProb: Partial<Problem>) => Problem;
  upvoteProblem: (problemId: string) => void;
  updateProblemStatus: (problemId: string, newStatus: ProblemStatus, assignedUnivId?: string, assignedFacultyId?: string) => void;
  rateProblem: (problemId: string, rating: number, comment: string) => void;
  
  universities: University[];
  teams: Team[];
  createTeam: (team: Omit<Team, "id" | "createdAt">) => Team;
  addTeamMember: (teamId: string, member: Omit<TeamMember, "id" | "teamId">) => void;
  
  proposals: Proposal[];
  createProposal: (proposal: Omit<Proposal, "id" | "submittedAt">) => Proposal;
  updateProposalStatus: (proposalId: string, status: Proposal["status"]) => void;
  
  agreements: Agreement[];
  createAgreement: (agreement: Omit<Agreement, "id" | "signedAt" | "blockchainTxHash">) => Agreement;
  
  milestones: Milestone[];
  updateMilestoneStatus: (milestoneId: string, status: MilestoneStatus) => void;
  approveMilestoneFaculty: (milestoneId: string, approverName: string) => void;
  approveMilestoneGovt: (milestoneId: string, approverName: string) => void;
  uploadMilestoneDocument: (milestoneId: string, doc: Omit<DocumentVaultItem, "id" | "uploadedAt">) => void;
  
  kanbanTasks: KanbanTask[];
  updateTaskStatus: (taskId: string, newStatus: KanbanTask["status"]) => void;
  createTask: (task: Omit<KanbanTask, "id">) => void;
  
  notifications: NotificationItem[];
  markNotificationAsRead: (notifId: string) => void;
  triggerNotification: (notif: Omit<NotificationItem, "id" | "sentAt">) => void;
  
  blockchainLedger: BlockchainLedgerBlock[];
  addBlockchainBlock: (block: Omit<BlockchainLedgerBlock, "blockNumber" | "timestamp" | "previousHash" | "currentHash">) => void;
  
  districts: DistrictGeoData[];
  selectedDistrict: string;
  setSelectedDistrict: (districtId: string) => void;
  
  currentLanguage: "en" | "hi" | "nagpuri" | "santali";
  setCurrentLanguage: (lang: "en" | "hi" | "nagpuri" | "santali") => void;
  
  isOnline: boolean;
  offlineQueue: any[];
  syncOfflineQueue: () => void;
  
  inspectingProblem: Problem | null;
  setInspectingProblem: (prob: Problem | null) => void;
  
  chatbotOpen: boolean;
  setChatbotOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state or fallback to mocks
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem("jsicp_current_user_id");
    return saved && MOCK_USERS[saved] ? MOCK_USERS[saved] : MOCK_USERS["citizen-sunita"];
  });

  const [problems, setProblems] = useState<Problem[]>(() => {
    const saved = localStorage.getItem("jsicp_problems");
    return saved ? JSON.parse(saved) : MOCK_PROBLEMS;
  });

  const [universities, setUniversities] = useState<University[]>(MOCK_UNIVERSITIES);
  const [teams, setTeams] = useState<Team[]>(() => {
    const saved = localStorage.getItem("jsicp_teams");
    return saved ? JSON.parse(saved) : MOCK_TEAMS;
  });

  const [proposals, setProposals] = useState<Proposal[]>(() => {
    const saved = localStorage.getItem("jsicp_proposals");
    return saved ? JSON.parse(saved) : MOCK_PROPOSALS;
  });

  const [agreements, setAgreements] = useState<Agreement[]>(() => {
    const saved = localStorage.getItem("jsicp_agreements");
    return saved ? JSON.parse(saved) : MOCK_AGREEMENTS;
  });

  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    const saved = localStorage.getItem("jsicp_milestones");
    return saved ? JSON.parse(saved) : MOCK_MILESTONES;
  });

  const [kanbanTasks, setKanbanTasks] = useState<KanbanTask[]>(() => {
    const saved = localStorage.getItem("jsicp_kanban_tasks");
    return saved ? JSON.parse(saved) : MOCK_KANBAN_TASKS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [blockchainLedger, setBlockchainLedger] = useState<BlockchainLedgerBlock[]>(MOCK_BLOCKCHAIN_LEDGER);
  const [districts] = useState<DistrictGeoData[]>(JHARKHAND_DISTRICTS);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "hi" | "nagpuri" | "santali">("en");
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);
  const [inspectingProblem, setInspectingProblem] = useState<Problem | null>(null);
  const [chatbotOpen, setChatbotOpen] = useState<boolean>(false);

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

  const switchUser = (userId: string) => {
    if (MOCK_USERS[userId]) {
      setCurrentUser(MOCK_USERS[userId]);
      localStorage.setItem("jsicp_current_user_id", userId);
    }
  };

  const switchRole = (role: UserRole) => {
    const found = Object.values(MOCK_USERS).find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem("jsicp_current_user_id", found.id);
    }
  };

  // 1. Submit Problem (Runs simulated AI classification, CV validation, dedup check, priority scoring, routing recommendations)
  const submitProblem = (newProb: Partial<Problem>): Problem => {
    const ticketId = `JSICP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const category: any = newProb.category || "Water Resources & Sanitation";
    
    // Simulate AI pipeline
    const prob: Problem = {
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
      subCategory: newProb.subCategory || "Community Scale Intervention",
      categoryConfidence: 0.94,
      priorityScore: Math.round((75 + Math.random() * 23) * 10) / 10,
      status: "pending_nodal_review",
      district: newProb.district || currentUser.district || "Ranchi",
      block: newProb.block || "Sadar Block",
      village: newProb.village || "Main Village",
      latitude: newProb.latitude || 23.3441,
      longitude: newProb.longitude || 85.3096,
      isDuplicateOf: null,
      citizenSupportCount: 1,
      sdgTags: [
        category.includes("Water") ? "SDG 6: Clean Water" : category.includes("Agri") ? "SDG 2: Zero Hunger" : "SDG 11: Sustainable Cities",
        "SDG 9: Innovation & Infrastructure"
      ],
      media: newProb.media || [
        {
          id: `med-${Date.now()}`,
          problemId: `prob-${Date.now()}`,
          mediaType: "image",
          storageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80",
          cvValidationLabel: "Verified Civic Infrastructure Anomaly (93% confidence)",
          cvValidationConfidence: 0.93
        }
      ],
      aiExplanation: {
        nlpKeywords: ["infrastructure", "community", "remediation", "Jharkhand", newProb.district || "Ranchi"],
        cvSceneTags: ["infrastructure defect", "public utility", "anomaly"],
        duplicateCheckResult: "Zero duplicates detected within 3km geo-radius.",
        priorityBreakdown: {
          severityWeight: 35.0,
          affectedPopulationEstimate: 25.0,
          locationVulnerabilityIndex: 18.0,
          sdgImpactScore: 14.0
        },
        suggestedUniversities: [
          {
            universityId: "univ-bit-mesra",
            universityName: "BIT Mesra, Ranchi",
            score: 0.94,
            rank: 1,
            reason: `Top ranked HEI for ${category} with active research lab in ${newProb.district || "Ranchi"}`
          },
          {
            universityId: "univ-iit-dhanbad",
            universityName: "IIT (ISM) Dhanbad",
            score: 0.87,
            rank: 2,
            reason: "High technological capability & prototyping laboratory"
          },
          {
            universityId: "univ-nit-jamshedpur",
            universityName: "NIT Jamshedpur",
            score: 0.81,
            rank: 3,
            reason: "Civil & multidisciplinary engineering center"
          }
        ]
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProblems((prev) => [prob, ...prev]);

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

  const upvoteProblem = (problemId: string) => {
    setProblems((prev) =>
      prev.map((p) => {
        if (p.id === problemId) {
          return { ...p, citizenSupportCount: p.citizenSupportCount + 1 };
        }
        return p;
      })
    );
  };

  const updateProblemStatus = (
    problemId: string,
    newStatus: ProblemStatus,
    assignedUnivId?: string,
    assignedFacultyId?: string
  ) => {
    setProblems((prev) =>
      prev.map((p) => {
        if (p.id === problemId) {
          const univ = assignedUnivId ? universities.find((u) => u.id === assignedUnivId) : null;
          return {
            ...p,
            status: newStatus,
            assignedUniversityId: assignedUnivId || p.assignedUniversityId,
            assignedUniversityName: univ ? univ.name : p.assignedUniversityName,
            assignedFacultyId: assignedFacultyId || p.assignedFacultyId,
            updatedAt: new Date().toISOString()
          };
        }
        return p;
      })
    );

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

  const rateProblem = (problemId: string, rating: number, comment: string) => {
    setProblems((prev) =>
      prev.map((p) => {
        if (p.id === problemId) {
          return { ...p, feedbackRating: rating, feedbackComment: comment, status: "closed" };
        }
        return p;
      })
    );
  };

  // 2. Universities & Team Building
  const createTeam = (newTeamData: Omit<Team, "id" | "createdAt">): Team => {
    const team: Team = {
      ...newTeamData,
      id: `team-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setTeams((prev) => [team, ...prev]);

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

  const addTeamMember = (teamId: string, member: Omit<TeamMember, "id" | "teamId">) => {
    const newMember: TeamMember = {
      ...member,
      id: `mem-${Date.now()}`,
      teamId
    };
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, members: [...t.members, newMember] } : t))
    );
  };

  // 3. Proposals
  const createProposal = (proposalData: Omit<Proposal, "id" | "submittedAt">): Proposal => {
    const prop: Proposal = {
      ...proposalData,
      id: `prop-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: "submitted",
      startupIncubationEligible: proposalData.estimatedBudget > 300000 || proposalData.needsIndustrySupport
    };

    setProposals((prev) => [prop, ...prev]);

    // Automatically create 5-stage milestones
    const newMilestones: Milestone[] = [
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

    updateProblemStatus(prop.problemId, "in_progress");

    return prop;
  };

  const updateProposalStatus = (proposalId: string, status: Proposal["status"]) => {
    setProposals((prev) =>
      prev.map((p) => {
        if (p.id === proposalId) {
          return { ...p, status, approvedAt: status === "approved" ? new Date().toISOString() : p.approvedAt };
        }
        return p;
      })
    );
  };

  // 4. Industry Agreements
  const createAgreement = (agreementData: Omit<Agreement, "id" | "signedAt" | "blockchainTxHash">): Agreement => {
    const hash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
    const agreement: Agreement = {
      ...agreementData,
      id: `agr-${Date.now()}`,
      signedAt: new Date().toISOString(),
      blockchainTxHash: hash,
      status: "active"
    };

    setAgreements((prev) => [agreement, ...prev]);

    // Update proposal to funded with partner details
    setProposals((prev) =>
      prev.map((p) => {
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
      })
    );

    // Progress corresponding problem into active execution phase (industry_matched / in_progress)
    const targetProp = proposals.find((p) => p.id === agreementData.proposalId);
    if (targetProp && targetProp.problemId) {
      updateProblemStatus(targetProp.problemId, "in_progress");
    }

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
  const updateMilestoneStatus = (milestoneId: string, status: MilestoneStatus) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === milestoneId) {
          return {
            ...m,
            status,
            completedAt: status === "approved" ? new Date().toISOString() : m.completedAt
          };
        }
        return m;
      })
    );
  };

  const approveMilestoneFaculty = (milestoneId: string, approverName: string) => {
    setMilestones((prev) =>
      prev.map((m) => {
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
      })
    );
  };

  const approveMilestoneGovt = (milestoneId: string, approverName: string) => {
    setMilestones((prev) =>
      prev.map((m) => {
        if (m.id === milestoneId) {
          const bothApproved = m.facultyApproved;
          const updatedStatus = bothApproved ? "approved" : "submitted";

          if (bothApproved) {
            addBlockchainBlock({
              eventType: "MILESTONE_APPROVED",
              entityId: milestoneId,
              details: `Dual Sign-off completed by Faculty & Govt Officer ${approverName} for ${m.displayName}. Tranche release authorized.`,
              verifiedBy: "Dual Sign-off Smart Oracle"
            });
          }

          return {
            ...m,
            govtApproved: true,
            govtApprovedBy: approverName,
            status: updatedStatus,
            completedAt: bothApproved ? new Date().toISOString() : m.completedAt
          };
        }
        return m;
      })
    );
  };

  const uploadMilestoneDocument = (milestoneId: string, docData: Omit<DocumentVaultItem, "id" | "uploadedAt">) => {
    const newDoc: DocumentVaultItem = {
      ...docData,
      id: `doc-${Date.now()}`,
      milestoneId,
      uploadedAt: new Date().toISOString()
    };

    setMilestones((prev) =>
      prev.map((m) => (m.id === milestoneId ? { ...m, documents: [...m.documents, newDoc] } : m))
    );
  };

  // 6. Kanban Tasks
  const updateTaskStatus = (taskId: string, newStatus: KanbanTask["status"]) => {
    setKanbanTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const createTask = (taskData: Omit<KanbanTask, "id">) => {
    const newTask: KanbanTask = {
      ...taskData,
      id: `task-${Date.now()}`
    };
    setKanbanTasks((prev) => [newTask, ...prev]);
  };

  // 7. Notifications
  const markNotificationAsRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, status: "read" } : n))
    );
  };

  const triggerNotification = (notifData: Omit<NotificationItem, "id" | "sentAt">) => {
    const notif: NotificationItem = {
      ...notifData,
      id: `notif-${Date.now()}`,
      sentAt: new Date().toISOString()
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // 8. Blockchain Ledger
  const addBlockchainBlock = (
    blockData: Omit<BlockchainLedgerBlock, "blockNumber" | "timestamp" | "previousHash" | "currentHash">
  ) => {
    setBlockchainLedger((prev) => {
      const lastBlock = prev[prev.length - 1];
      const prevHash = lastBlock ? lastBlock.currentHash : "0x0000000000000000000000000000000000000000000000000000000000000000";
      const newHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
      const block: BlockchainLedgerBlock = {
        ...blockData,
        blockNumber: prev.length + 1,
        timestamp: new Date().toISOString(),
        previousHash: prevHash,
        currentHash: newHash
      };
      return [...prev, block];
    });
  };

  // 9. Offline Sync
  const syncOfflineQueue = () => {
    if (offlineQueue.length === 0) return;
    offlineQueue.forEach((item) => {
      submitProblem(item);
    });
    setOfflineQueue([]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers: MOCK_USERS,
        switchUser,
        switchRole,
        problems,
        submitProblem,
        upvoteProblem,
        updateProblemStatus,
        rateProblem,
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
        setChatbotOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
