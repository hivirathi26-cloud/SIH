import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "../types";
import { MOCK_USERS } from "../data/mockData";

export interface AuthContextType {
  currentUser: User | null;
  currentRole: UserRole | null;
  isAuthenticated: boolean;
  loginAsRole: (role: UserRole | string) => void;
  loginWithCredentials: (username: string, pass: string) => boolean;
  logout: () => void;
  getPortalPath: (role?: UserRole | string) => string;
  demoUsers: Record<string, User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const getPortalPath = (role?: UserRole | string): string => {
  if (!role) return "/login";
  if (typeof role === "string") {
    if (role.startsWith("student")) return "/portal/student";
    if (role.startsWith("hei_")) return "/portal/hei-nodal";
  }
  switch (role) {
    case "citizen":
    case "pri":
      return "/portal/citizen";
    case "hei_nodal":
      return "/portal/hei-nodal";
    case "faculty":
      return "/portal/faculty";
    case "student":
      return "/portal/student";
    case "industry":
      return "/portal/industry";
    case "govt_admin":
      return "/portal/admin";
    default:
      return "/login";
  }
};

export const DEMO_STAKEHOLDERS: Record<string, User> = {
  citizen: {
    id: "citizen-sunita",
    fullName: "Smt. Sunita Devi",
    phone: "+91 98351 24901",
    email: "sunita.devi.ranchi@gmail.com",
    role: "citizen",
    roleTitle: "Citizen & SHG Leader, Angara",
    district: "Ranchi",
    aadhaarVerified: true,
    reputationPoints: 420,
    badges: ["Jal-Mitra Level 3", "Active Problem Reporter"],
    createdAt: "2026-01-15T09:30:00Z"
  },
  pri: {
    id: "pri-mukhia-khunti",
    fullName: "Shri Birsa Munda (Mukhia)",
    phone: "+91 94311 88204",
    email: "mukhia.torpa@jharkhand.gov.in",
    role: "pri",
    roleTitle: "Gram Panchayat Mukhia, Torpa Block",
    organizationName: "Torpa Gram Panchayat",
    district: "Khunti",
    aadhaarVerified: true,
    reputationPoints: 680,
    badges: ["Panchayat Innovator", "Tribal Hero"],
    createdAt: "2026-01-10T10:00:00Z"
  },
  hei_nodal: {
    id: "user-nodal-bit",
    fullName: "Dr. Rajesh Verma",
    phone: "+91 94301 55621",
    email: "nodal.innovation@bitmesra.ac.in",
    role: "hei_nodal",
    roleTitle: "University Nodal Officer (HEI Desk)",
    organizationName: "Birla Institute of Technology, Mesra",
    department: "Directorate of Innovation & Incubation",
    district: "Ranchi",
    aadhaarVerified: true,
    reputationPoints: 1250,
    badges: ["Academic Routing Maestro", "NEP 2020 Champion"],
    createdAt: "2025-11-20T08:00:00Z"
  },
  faculty: {
    id: "faculty-ananya",
    fullName: "Prof. Ananya Sen",
    phone: "+91 98355 77123",
    email: "ananya.sen@bitmesra.ac.in",
    role: "faculty",
    roleTitle: "Associate Professor & Research Mentor",
    organizationName: "Birla Institute of Technology, Mesra",
    department: "Dept of Water & Environmental Engineering",
    district: "Ranchi",
    aadhaarVerified: true,
    reputationPoints: 980,
    badges: ["Mentorship Star", "Field Trial Expert"],
    createdAt: "2025-12-01T11:00:00Z"
  },
  student: {
    id: "student-rahul",
    fullName: "Rahul Kumar (Team Lead)",
    phone: "+91 91234 56789",
    email: "rahul.btech@bitmesra.ac.in",
    role: "student",
    roleTitle: "Student Lead (Team JalRakshak - Hardware & IoT)",
    organizationName: "Birla Institute of Technology, Mesra",
    department: "Electronics & IoT Engineering (3rd Year)",
    district: "Ranchi",
    aadhaarVerified: true,
    reputationPoints: 540,
    badges: ["Team Lead", "Hardware Pro"],
    createdAt: "2026-01-05T14:30:00Z"
  },
  student_priya: {
    id: "student-priya",
    fullName: "Priya Sharma (Student)",
    phone: "+91 98234 11223",
    email: "priya.cs@bitmesra.ac.in",
    role: "student",
    roleTitle: "Software & Cloud Telemetry Engineer",
    organizationName: "Birla Institute of Technology, Mesra",
    department: "Computer Science & Engg (3rd Year)",
    district: "Ranchi",
    aadhaarVerified: true,
    reputationPoints: 480,
    badges: ["Cloud Specialist", "MQTT Coder"],
    createdAt: "2026-01-06T10:00:00Z"
  },
  student_sneha: {
    id: "student-sneha",
    fullName: "Sneha Soren (Student)",
    phone: "+91 94701 44556",
    email: "sneha.chem@bitmesra.ac.in",
    role: "student",
    roleTitle: "Chemical & NABL Lab Testing Lead",
    organizationName: "Birla Institute of Technology, Mesra",
    department: "Chemical & Environmental Engg (3rd Year)",
    district: "Ranchi",
    aadhaarVerified: true,
    reputationPoints: 510,
    badges: ["NABL Tester", "Water Chemist"],
    createdAt: "2026-01-07T11:00:00Z"
  },
  student_amit: {
    id: "student-amit",
    fullName: "Amit Verma (Student)",
    phone: "+91 93341 88990",
    email: "amit.mech@bitmesra.ac.in",
    role: "student",
    roleTitle: "Mechanical CAD & Fabrication Engineer",
    organizationName: "Birla Institute of Technology, Mesra",
    department: "Mechanical Engineering (3rd Year)",
    district: "Ranchi",
    aadhaarVerified: true,
    reputationPoints: 460,
    badges: ["CAD Designer", "CNC Fabricator"],
    createdAt: "2026-01-08T12:00:00Z"
  },
  hei_iit_dhanbad: {
    id: "user-nodal-iit",
    fullName: "Prof. S. K. Roy",
    phone: "+91 94311 22334",
    email: "nodal.rnd@iitism.ac.in",
    role: "hei_nodal",
    roleTitle: "Nodal Officer (IIT ISM Dhanbad)",
    organizationName: "IIT (ISM) Dhanbad",
    department: "Centre of Mining Innovation & Tech",
    district: "Dhanbad",
    aadhaarVerified: true,
    reputationPoints: 1600,
    badges: ["Mining Tech Nodal", "Geo Specialist"],
    createdAt: "2025-10-01T08:00:00Z"
  },
  hei_aiims_deoghar: {
    id: "user-nodal-aiims",
    fullName: "Dr. A. K. Mishra",
    phone: "+91 94301 88776",
    email: "nodal.medtech@aiimsdeoghar.edu.in",
    role: "hei_nodal",
    roleTitle: "Nodal Officer (AIIMS Deoghar / MedTech)",
    organizationName: "AIIMS Deoghar",
    department: "Centre for Community Medicine & MedTech",
    district: "Deoghar",
    aadhaarVerified: true,
    reputationPoints: 1450,
    badges: ["MedTech Nodal", "Public Health Director"],
    createdAt: "2025-09-15T08:00:00Z"
  },
  hei_bau_ranchi: {
    id: "user-nodal-bau",
    fullName: "Dr. Manoj Tiwary",
    phone: "+91 94311 55443",
    email: "nodal.agri@bauranchi.org",
    role: "hei_nodal",
    roleTitle: "Nodal Officer (Birsa Agricultural University)",
    organizationName: "Birsa Agricultural University (BAU Kanke)",
    department: "Directorate of Extension & Farm Innovation",
    district: "Ranchi",
    aadhaarVerified: true,
    reputationPoints: 1380,
    badges: ["AgriTech Lead", "Tribal Livelihoods"],
    createdAt: "2025-09-20T08:00:00Z"
  },
  industry: {
    id: "industry-tatasteel",
    fullName: "Mr. Alok Sanyal",
    phone: "+91 97714 33201",
    email: "alok.sanyal@tatasteel.com",
    role: "industry",
    roleTitle: "Head of CSR & Innovation Partnerships",
    organizationName: "Tata Steel CSR Foundation",
    district: "East Singhbhum",
    aadhaarVerified: true,
    reputationPoints: 1850,
    badges: ["CSR Impact Investor", "Jharkhand Industry Anchor"],
    createdAt: "2025-10-15T09:00:00Z"
  },
  govt_admin: {
    id: "state-admin-dhed",
    fullName: "Dr. Shailesh Kumar, IAS",
    phone: "+91 94311 00001",
    email: "secy.hed@jharkhand.gov.in",
    role: "govt_admin",
    roleTitle: "State Nodal Officer & Secretary",
    organizationName: "Dept of Higher & Technical Education, Govt of Jharkhand",
    department: "Higher & Technical Education Directorate",
    district: "Ranchi",
    aadhaarVerified: true,
    reputationPoints: 2400,
    badges: ["State Policy Director", "Smart Governance Lead"],
    createdAt: "2025-08-01T10:00:00Z"
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("jsicp_active_user");
    return saved ? JSON.parse(saved) : DEMO_STAKEHOLDERS.citizen;
  });

  const isAuthenticated = currentUser !== null;
  const currentRole = currentUser ? currentUser.role : null;

  const loginAsRole = (role: UserRole | string) => {
    const user = DEMO_STAKEHOLDERS[role] || DEMO_STAKEHOLDERS.citizen;
    setCurrentUser(user);
    localStorage.setItem("jsicp_active_user", JSON.stringify(user));
  };

  const loginWithCredentials = (username: string, pass: string): boolean => {
    // Standard mock verification
    const found = Object.values(DEMO_STAKEHOLDERS).find(
      (u) => u.email.toLowerCase() === username.toLowerCase() || u.phone.includes(username)
    );
    if (found) {
      setCurrentUser(found);
      localStorage.setItem("jsicp_active_user", JSON.stringify(found));
      return true;
    }
    // Default fallback to citizen
    const fallback = DEMO_STAKEHOLDERS.citizen;
    setCurrentUser(fallback);
    localStorage.setItem("jsicp_active_user", JSON.stringify(fallback));
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("jsicp_active_user");
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        isAuthenticated,
        loginAsRole,
        loginWithCredentials,
        logout,
        getPortalPath,
        demoUsers: DEMO_STAKEHOLDERS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
