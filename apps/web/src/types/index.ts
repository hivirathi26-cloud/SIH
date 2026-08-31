export type UserRole =
  | "citizen"
  | "community_group"
  | "pri" // Panchayati Raj Institution
  | "ulb" // Urban Local Body
  | "govt_officer"
  | "university_nodal"
  | "faculty"
  | "student"
  | "startup"
  | "msme"
  | "csr"
  | "research_lab"
  | "state_admin"
  | "district_officer";

export interface User {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  organizationName?: string;
  district: string;
  aadhaarVerified: boolean;
  avatarUrl?: string;
  reputationPoints: number;
  badges: string[];
  createdAt: string;
}

export type ProblemStatus =
  | "submitted"
  | "under_ai_review"
  | "pending_nodal_review"
  | "rejected"
  | "routed"
  | "accepted_by_hei"
  | "team_formed"
  | "in_progress"
  | "industry_matched"
  | "field_pilot"
  | "deployed"
  | "closed";

export type ProblemCategory =
  | "Water Resources & Sanitation"
  | "Agriculture & Allied Technologies"
  | "Healthcare & MedTech"
  | "Rural Infrastructure & Transport"
  | "Education & Smart Learning"
  | "Environment & Mining Remediation"
  | "Renewable Energy & Off-Grid Power"
  | "Forest & Tribal Livelihoods";

export interface ProblemMedia {
  id: string;
  problemId: string;
  mediaType: "image" | "video" | "document" | "audio";
  storageUrl: string;
  previewUrl?: string;
  cvValidationLabel?: string;
  cvValidationConfidence?: number;
}

export interface Problem {
  id: string;
  ticketNumber: string;
  submittedBy: string;
  submitterName: string;
  submitterRole: UserRole;
  title: string;
  description: string;
  descriptionOriginalLang?: string;
  detectedLanguage: string;
  category: ProblemCategory;
  subCategory: string;
  categoryConfidence: number;
  priorityScore: number; // 0 - 100
  status: ProblemStatus;
  district: string;
  block?: string;
  village?: string;
  latitude: number;
  longitude: number;
  isDuplicateOf?: string | null;
  duplicateSimilarity?: number;
  citizenSupportCount: number;
  sdgTags: string[];
  media: ProblemMedia[];
  assignedUniversityId?: string;
  assignedUniversityName?: string;
  assignedFacultyId?: string;
  assignedFacultyName?: string;
  activeProposalId?: string;
  aiExplanation?: {
    nlpKeywords: string[];
    cvSceneTags: string[];
    duplicateCheckResult: string;
    priorityBreakdown: {
      severityWeight: number;
      affectedPopulationEstimate: number;
      locationVulnerabilityIndex: number;
      sdgImpactScore: number;
    };
    suggestedUniversities: {
      universityId: string;
      universityName: string;
      score: number;
      rank: number;
      reason: string;
    }[];
  };
  feedbackRating?: number;
  feedbackComment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  district: string;
  expertiseDomains: ProblemCategory[];
  nodalOfficerId: string;
  nodalOfficerName: string;
  activeProjectsCount: number;
  completedProjectsCount: number;
  patentsCount: number;
  startupsIncubated: number;
  nirfRank?: number;
  logoBadge?: string;
}

export interface TeamMember {
  id: string;
  teamId: string;
  studentId: string;
  studentName: string;
  discipline: string;
  yearOfStudy: string;
  role: "Team Lead" | "Hardware Lead" | "Software Lead" | "Field Researcher" | "Design Specialist";
  email: string;
  avatarUrl?: string;
}

export interface Team {
  id: string;
  problemId: string;
  problemTitle: string;
  universityId: string;
  universityName: string;
  facultyMentorId: string;
  facultyMentorName: string;
  facultyDepartment: string;
  members: TeamMember[];
  createdAt: string;
}

export type ProposalStatus = "draft" | "submitted" | "under_review" | "approved" | "funded" | "rejected";

export interface Proposal {
  id: string;
  teamId: string;
  problemId: string;
  problemTitle: string;
  problemCategory: ProblemCategory;
  district: string;
  universityName: string;
  facultyMentorName: string;
  title: string;
  summary: string;
  technicalApproach: string;
  expectedOutcome: string;
  estimatedBudget: number; // INR
  durationMonths: number;
  needsIndustrySupport: boolean;
  supportTypeNeeded?: ("funding" | "mentorship" | "prototyping" | "tech_transfer")[];
  status: ProposalStatus;
  submittedAt?: string;
  approvedAt?: string;
  industryPartnerId?: string;
  industryPartnerName?: string;
  startupIncubationEligible?: boolean;
}

export type AgreementType = "funding" | "mentorship" | "prototyping" | "tech_transfer" | "csr_grant";

export interface Agreement {
  id: string;
  proposalId: string;
  proposalTitle: string;
  universityName: string;
  industryPartnerId: string;
  industryPartnerName: string;
  industryType: "startup" | "msme" | "csr" | "research_lab" | "large_industry";
  agreementType: AgreementType;
  amount: number;
  terms: string;
  signedAt: string;
  documentUrl?: string;
  blockchainTxHash: string;
  status: "active" | "completed" | "terminated";
}

export type MilestoneName =
  | "research_design"
  | "prototype_build"
  | "testing_validation"
  | "pilot_deployment"
  | "full_implementation";

export type MilestoneStatus = "pending" | "in_progress" | "submitted" | "approved" | "rejected";

export interface DocumentVaultItem {
  id: string;
  milestoneId: string;
  title: string;
  docType: "report" | "test_data" | "approval" | "ip_filing" | "cad_model" | "drone_telemetry";
  storageUrl: string;
  fileSize: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: string;
}

export interface Milestone {
  id: string;
  proposalId: string;
  index: number;
  name: MilestoneName;
  displayName: string;
  description: string;
  status: MilestoneStatus;
  dueDate: string;
  completedAt?: string;
  facultyApproved: boolean;
  facultyApprovedBy?: string;
  govtApproved: boolean;
  govtApprovedBy?: string;
  documents: DocumentVaultItem[];
  blockchainTxHash?: string;
  feedbackNotes?: string;
}

export interface KanbanTask {
  id: string;
  teamId: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedName: string;
  status: "backlog" | "in_progress" | "review" | "completed";
  priority: "low" | "medium" | "high";
  milestoneName: MilestoneName;
  dueDate: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  channel: "sms" | "whatsapp" | "email" | "push";
  eventType: string;
  title: string;
  message: string;
  sentAt: string;
  status: "queued" | "sent" | "delivered" | "read";
  linkUrl?: string;
}

export interface BlockchainLedgerBlock {
  blockNumber: number;
  timestamp: string;
  eventType: "PROBLEM_SUBMISSION" | "NODAL_APPROVAL" | "MOU_SIGNED" | "MILESTONE_APPROVED" | "FUND_DISBURSED" | "PATENT_FILED";
  entityId: string;
  details: string;
  previousHash: string;
  currentHash: string;
  verifiedBy: string;
}

export interface DistrictGeoData {
  id: string;
  name: string;
  hindiName: string;
  headquarters: string;
  division: string;
  latitude: number;
  longitude: number;
  totalProblems: number;
  resolvedProblems: number;
  activeProjects: number;
  vulnerabilityIndex: number;
  topCategory: ProblemCategory;
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  role: string;
  district: string;
  points: number;
  problemsSubmitted: number;
  solutionsImplemented: number;
  badges: string[];
}
