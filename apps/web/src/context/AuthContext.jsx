import React, { createContext, useContext, useState } from "react";
const AuthContext = createContext(undefined);
export const getPortalPath = (role) => {
    if (!role)
        return "/login";
    if (typeof role === "string") {
        if (role.startsWith("student"))
            return "/portal/student";
        if (role.startsWith("hei_"))
            return "/portal/hei-nodal";
        if (role.startsWith("faculty"))
            return "/portal/faculty";
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
export const DEMO_STAKEHOLDERS = {
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
    // IIT (ISM) Dhanbad Ecosystem
    hei_iit_dhanbad: {
        id: "user-nodal-iit",
        fullName: "Prof. S. K. Roy",
        phone: "+91 94311 22334",
        email: "nodal.rnd@iitism.ac.in",
        role: "hei_nodal",
        roleTitle: "Nodal Officer (IIT ISM Dhanbad)",
        organizationName: "Indian Institute of Technology (ISM) Dhanbad",
        department: "Centre of Mining Innovation & Tech",
        district: "Dhanbad",
        aadhaarVerified: true,
        reputationPoints: 1600,
        badges: ["Mining Tech Nodal", "Geo Specialist"],
        createdAt: "2025-10-01T08:00:00Z"
    },
    faculty_iit: {
        id: "faculty-iit-arvind",
        fullName: "Prof. Arvind Mukhopadhyay",
        phone: "+91 94311 33445",
        email: "arvind.mining@iitism.ac.in",
        role: "faculty",
        roleTitle: "Professor of Mining Machinery & Robotics",
        organizationName: "Indian Institute of Technology (ISM) Dhanbad",
        department: "Dept of Mining Engineering & Robotics",
        district: "Dhanbad",
        aadhaarVerified: true,
        reputationPoints: 1120,
        badges: ["Mining Automation Expert", "Geo-Robotics Pioneer"],
        createdAt: "2025-11-01T10:00:00Z"
    },
    student_iit_rohan: {
        id: "student-iit-rohan",
        fullName: "Rohan Deshmukh (Team Lead)",
        phone: "+91 91234 44556",
        email: "rohan.mining@iitism.ac.in",
        role: "student",
        roleTitle: "Student Lead (Team KhananSuraksha - Geo-Robotics)",
        organizationName: "Indian Institute of Technology (ISM) Dhanbad",
        department: "Mining Machinery & Robotics (3rd Year)",
        district: "Dhanbad",
        aadhaarVerified: true,
        reputationPoints: 560,
        badges: ["UAV Pilot", "Thermal Mapping Lead"],
        createdAt: "2026-01-05T10:00:00Z"
    },
    student_iit_ananya: {
        id: "student-iit-ananya",
        fullName: "Ananya Sengupta (Student)",
        phone: "+91 91234 77889",
        email: "ananya.geo@iitism.ac.in",
        role: "student",
        roleTitle: "Rock Mechanics & Thermal AI Engineer",
        organizationName: "Indian Institute of Technology (ISM) Dhanbad",
        department: "Applied Geophysics & AI (4th Year)",
        district: "Dhanbad",
        aadhaarVerified: true,
        reputationPoints: 490,
        badges: ["Thermal AI", "Seismic Modeler"],
        createdAt: "2026-01-06T10:00:00Z"
    },
    student_iit_vikas: {
        id: "student-iit-vikas",
        fullName: "Vikas Mahto (Student)",
        phone: "+91 91234 99001",
        email: "vikas.mining@iitism.ac.in",
        role: "student",
        roleTitle: "LoRaWAN Underground Mesh Networks",
        organizationName: "Indian Institute of Technology (ISM) Dhanbad",
        department: "Computer Science & Mining Systems (3rd Year)",
        district: "Dhanbad",
        aadhaarVerified: true,
        reputationPoints: 470,
        badges: ["LoRa Mesh", "Dhanbad Local Innovator"],
        createdAt: "2026-01-07T10:00:00Z"
    },
    // AIIMS Deoghar MedTech Ecosystem
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
    faculty_aiims: {
        id: "faculty-aiims-rajesh",
        fullName: "Dr. Rajesh Soren",
        phone: "+91 94301 66778",
        email: "rajesh.soren@aiimsdeoghar.edu.in",
        role: "faculty",
        roleTitle: "Associate Professor & MedTech Lab Director",
        organizationName: "AIIMS Deoghar",
        department: "Centre for Community Medicine & MedTech Devices",
        district: "Deoghar",
        aadhaarVerified: true,
        reputationPoints: 1080,
        badges: ["Public Health Innovator", "Cold-Chain Specialist"],
        createdAt: "2025-10-15T10:00:00Z"
    },
    student_aiims_deepak: {
        id: "student-aiims-deepak",
        fullName: "Dr. Deepak Soren (Lead)",
        phone: "+91 93341 55667",
        email: "deepak.soren@aiimsdeoghar.edu.in",
        role: "student",
        roleTitle: "Senior Resident & MedTech Prototyper",
        organizationName: "AIIMS Deoghar",
        department: "Centre for Community Medicine & MedTech Devices",
        district: "Deoghar",
        aadhaarVerified: true,
        reputationPoints: 580,
        badges: ["MedTech Lead", "Clinical Prototyper"],
        createdAt: "2026-01-08T10:00:00Z"
    },
    student_aiims_kavita: {
        id: "student-aiims-kavita",
        fullName: "Kavita Tirkey (Student)",
        phone: "+91 93341 77889",
        email: "kavita.biomed@aiimsdeoghar.edu.in",
        role: "student",
        roleTitle: "Biomedical Instrumentation & Cold-Chain Telemetry",
        organizationName: "AIIMS Deoghar",
        department: "Biomedical Engineering & Tele-Health",
        district: "Deoghar",
        aadhaarVerified: true,
        reputationPoints: 510,
        badges: ["Cold-Chain IoT", "Sensors Specialist"],
        createdAt: "2026-01-09T10:00:00Z"
    },
    // Birsa Agricultural University (BAU) Ecosystem
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
    faculty_bau: {
        id: "faculty-bau-sunita",
        fullName: "Dr. Sunita Murmu",
        phone: "+91 94311 77889",
        email: "sunita.murmu@bauranchi.org",
        role: "faculty",
        roleTitle: "Associate Professor of Agronomy & Farm Tech",
        organizationName: "Birsa Agricultural University (BAU Kanke)",
        department: "Dept of Agronomy & Farm Mechanization",
        district: "Ranchi",
        aadhaarVerified: true,
        reputationPoints: 1040,
        badges: ["Tribal Agriculture Expert", "Bio-Processing Lead"],
        createdAt: "2025-10-20T10:00:00Z"
    },
    student_bau_birsa: {
        id: "student-bau-birsa",
        fullName: "Birsa Oraon (Team Lead)",
        phone: "+91 94701 22334",
        email: "birsa.agri@bauranchi.org",
        role: "student",
        roleTitle: "Student Lead (Team KrishiVikas - Agri-IoT)",
        organizationName: "Birsa Agricultural University (BAU Kanke)",
        department: "Agricultural Engineering & Soil Sensors (3rd Year)",
        district: "Ranchi",
        aadhaarVerified: true,
        reputationPoints: 530,
        badges: ["Agri-IoT Lead", "Soil Health Coder"],
        createdAt: "2026-01-10T10:00:00Z"
    },
    student_bau_pooja: {
        id: "student-bau-pooja",
        fullName: "Pooja Kumari (Student)",
        phone: "+91 94701 55667",
        email: "pooja.biotech@bauranchi.org",
        role: "student",
        roleTitle: "Post-Harvest Bio-Processing & Tribal Value Chains",
        organizationName: "Birsa Agricultural University (BAU Kanke)",
        department: "Centre for Bio-Inoculants & Post-Harvest Tech (4th Year)",
        district: "Ranchi",
        aadhaarVerified: true,
        reputationPoints: 480,
        badges: ["Bio-Processor", "Lac Specialist"],
        createdAt: "2026-01-11T10:00:00Z"
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
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        const saved = localStorage.getItem("jsicp_active_user");
        return saved ? JSON.parse(saved) : DEMO_STAKEHOLDERS.citizen;
    });
    const isAuthenticated = currentUser !== null;
    const currentRole = currentUser ? currentUser.role : null;
    const loginAsRole = (role) => {
        const user = DEMO_STAKEHOLDERS[role] || DEMO_STAKEHOLDERS.citizen;
        setCurrentUser(user);
        localStorage.setItem("jsicp_active_user", JSON.stringify(user));
    };
    const loginWithCredentials = (username, pass) => {
        // Standard mock verification
        const found = Object.values(DEMO_STAKEHOLDERS).find((u) => u.email.toLowerCase() === username.toLowerCase() || u.phone.includes(username));
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
    return (<AuthContext.Provider value={{
            currentUser,
            currentRole,
            isAuthenticated,
            loginAsRole,
            loginWithCredentials,
            logout,
            getPortalPath,
            demoUsers: DEMO_STAKEHOLDERS
        }}>
      {children}
    </AuthContext.Provider>);
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
