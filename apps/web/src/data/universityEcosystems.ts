export interface EcosystemStudent {
  id: string;
  fullName: string;
  roleKey: string;
  role: string;
  discipline: string;
  yearOfStudy: string;
  email: string;
}

export interface UniversityEcosystem {
  id: string;
  name: string;
  shortName: string;
  district: string;
  domainName: string;
  domainIcon: string;
  nodal: {
    id: string;
    fullName: string;
    roleKey: string;
    email: string;
    title: string;
  };
  faculty: {
    id: string;
    fullName: string;
    roleKey: string;
    email: string;
    dept: string;
    title: string;
    specialization: string;
  };
  students: EcosystemStudent[];
  defaultProblemId: string;
  defaultTeamId: string;
  defaultProposalId: string;
}

export const UNIVERSITY_ECOSYSTEMS: Record<string, UniversityEcosystem> = {
  "univ-bit-mesra": {
    id: "univ-bit-mesra",
    name: "Birla Institute of Technology, Mesra",
    shortName: "BIT Mesra, Ranchi",
    district: "Ranchi",
    domainName: "Water Resources & Environmental Engg",
    domainIcon: "💧",
    nodal: {
      id: "user-nodal-bit",
      fullName: "Dr. Rajesh Verma",
      roleKey: "hei_nodal",
      email: "nodal.innovation@bitmesra.ac.in",
      title: "University Nodal Officer (HEI Desk)"
    },
    faculty: {
      id: "faculty-ananya",
      fullName: "Prof. Ananya Sen",
      roleKey: "faculty",
      email: "ananya.sen@bitmesra.ac.in",
      dept: "Dept of Water & Environmental Engineering",
      title: "Associate Professor & Research Mentor",
      specialization: "Nano-adsorptive water purification & IoT water quality telemetry"
    },
    students: [
      {
        id: "student-rahul",
        fullName: "Rahul Kumar",
        roleKey: "student",
        role: "Team Lead",
        discipline: "Electronics & IoT Engineering",
        yearOfStudy: "3rd Year B.Tech",
        email: "rahul.iot@bitmesra.ac.in"
      },
      {
        id: "student-priya",
        fullName: "Priya Sharma",
        roleKey: "student_priya",
        role: "Hardware Lead",
        discipline: "Chemical & Membrane Tech",
        yearOfStudy: "4th Year B.Tech",
        email: "priya.chem@bitmesra.ac.in"
      },
      {
        id: "student-sneha",
        fullName: "Sneha Soren",
        roleKey: "student_sneha",
        role: "Field Researcher",
        discipline: "Rural Development & Social Work",
        yearOfStudy: "2nd Year M.Tech",
        email: "sneha.rural@bitmesra.ac.in"
      },
      {
        id: "student-amit",
        fullName: "Amit Verma",
        roleKey: "student_amit",
        role: "Software Lead",
        discipline: "Mechanical Engineering",
        yearOfStudy: "3rd Year B.Tech",
        email: "amit.mech@bitmesra.ac.in"
      }
    ],
    defaultProblemId: "prob-001",
    defaultTeamId: "team-001",
    defaultProposalId: "prop-001"
  },
  "univ-iit-dhanbad": {
    id: "univ-iit-dhanbad",
    name: "Indian Institute of Technology (ISM) Dhanbad",
    shortName: "IIT (ISM) Dhanbad",
    district: "Dhanbad",
    domainName: "Mining Remediation & Geo-Robotics",
    domainIcon: "⛏️",
    nodal: {
      id: "user-nodal-iit",
      fullName: "Prof. S. K. Roy",
      roleKey: "hei_iit_dhanbad",
      email: "nodal.rnd@iitism.ac.in",
      title: "Nodal Officer (IIT ISM Dhanbad)"
    },
    faculty: {
      id: "faculty-iit-arvind",
      fullName: "Prof. Arvind Mukhopadhyay",
      roleKey: "faculty_iit",
      email: "arvind.mining@iitism.ac.in",
      dept: "Dept of Mining Engineering & Robotics",
      title: "Professor of Mining Machinery & Robotics",
      specialization: "Autonomous Mining Drones, Geo-thermal Capping & Underground LoRa Mesh"
    },
    students: [
      {
        id: "student-iit-rohan",
        fullName: "Rohan Deshmukh",
        roleKey: "student_iit_rohan",
        role: "Team Lead",
        discipline: "Mining Machinery & Robotics",
        yearOfStudy: "3rd Year B.Tech",
        email: "rohan.mining@iitism.ac.in"
      },
      {
        id: "student-iit-ananya",
        fullName: "Ananya Sengupta",
        roleKey: "student_iit_ananya",
        role: "Hardware Lead",
        discipline: "Applied Geophysics & AI",
        yearOfStudy: "4th Year B.Tech",
        email: "ananya.geo@iitism.ac.in"
      },
      {
        id: "student-iit-vikas",
        fullName: "Vikas Mahto",
        roleKey: "student_iit_vikas",
        role: "Software Lead",
        discipline: "Computer Science & Mining Systems",
        yearOfStudy: "3rd Year B.Tech",
        email: "vikas.mining@iitism.ac.in"
      }
    ],
    defaultProblemId: "prob-003",
    defaultTeamId: "team-002",
    defaultProposalId: "prop-003"
  },
  "univ-aiims-deoghar": {
    id: "univ-aiims-deoghar",
    name: "All India Institute of Medical Sciences, Deoghar",
    shortName: "AIIMS Deoghar",
    district: "Deoghar",
    domainName: "Healthcare & MedTech Telemetry",
    domainIcon: "🏥",
    nodal: {
      id: "user-nodal-aiims",
      fullName: "Dr. A. K. Mishra",
      roleKey: "hei_aiims_deoghar",
      email: "nodal.rnd@aiimsdeoghar.edu.in",
      title: "Nodal Officer (AIIMS Deoghar)"
    },
    faculty: {
      id: "faculty-aiims-rajesh",
      fullName: "Dr. Rajesh Soren",
      roleKey: "faculty_aiims",
      email: "rajesh.soren@aiimsdeoghar.edu.in",
      dept: "Centre for Community Medicine & MedTech Devices",
      title: "Associate Professor & MedTech Lab Director",
      specialization: "Cold-Chain Logistics, Vaccine Telemetry & Rural Public Health Devices"
    },
    students: [
      {
        id: "student-aiims-deepak",
        fullName: "Dr. Deepak Soren",
        roleKey: "student_aiims_deepak",
        role: "Team Lead",
        discipline: "Centre for Community Medicine & MedTech Devices",
        yearOfStudy: "Senior Resident",
        email: "deepak.soren@aiimsdeoghar.edu.in"
      },
      {
        id: "student-aiims-kavita",
        fullName: "Kavita Tirkey",
        roleKey: "student_aiims_kavita",
        role: "Hardware Lead",
        discipline: "Biomedical Engineering & Tele-Health",
        yearOfStudy: "3rd Year B.Tech",
        email: "kavita.biomed@aiimsdeoghar.edu.in"
      }
    ],
    defaultProblemId: "prob-004",
    defaultTeamId: "team-004",
    defaultProposalId: "prop-004"
  },
  "univ-bau-kanke": {
    id: "univ-bau-kanke",
    name: "Birsa Agricultural University, Kanke",
    shortName: "BAU Ranchi",
    district: "Ranchi",
    domainName: "Agriculture & Tribal Bio-Processing",
    domainIcon: "🌾",
    nodal: {
      id: "user-nodal-bau",
      fullName: "Dr. Manoj Tiwary",
      roleKey: "hei_bau_ranchi",
      email: "nodal.rnd@bauranchi.org",
      title: "Nodal Officer (BAU Ranchi)"
    },
    faculty: {
      id: "faculty-bau-sunita",
      fullName: "Dr. Sunita Murmu",
      roleKey: "faculty_bau",
      email: "sunita.murmu@bauranchi.org",
      dept: "Dept of Agronomy & Farm Mechanization",
      title: "Associate Professor of Agronomy & Farm Tech",
      specialization: "Tribal Agri-Mechanization, Solar Post-Harvest Processing & Soil IoT"
    },
    students: [
      {
        id: "student-bau-birsa",
        fullName: "Birsa Oraon",
        roleKey: "student_bau_birsa",
        role: "Team Lead",
        discipline: "Agricultural Engineering & Soil Sensors",
        yearOfStudy: "3rd Year B.Tech",
        email: "birsa.agri@bauranchi.org"
      },
      {
        id: "student-bau-pooja",
        fullName: "Pooja Kumari",
        roleKey: "student_bau_pooja",
        role: "Field Researcher",
        discipline: "Centre for Bio-Inoculants & Post-Harvest Tech",
        yearOfStudy: "4th Year B.Tech",
        email: "pooja.biotech@bauranchi.org"
      }
    ],
    defaultProblemId: "prob-002",
    defaultTeamId: "team-003",
    defaultProposalId: "prop-002"
  }
};

export const getEcosystemByUserId = (
  userId?: string,
  orgName?: string,
  univId?: string
): UniversityEcosystem => {
  if (univId && UNIVERSITY_ECOSYSTEMS[univId]) {
    return UNIVERSITY_ECOSYSTEMS[univId];
  }

  const text = (String(userId || "") + " " + String(orgName || "")).toLowerCase();

  if (text.includes("iit") || text.includes("dhanbad") || text.includes("mining") || text.includes("arvind") || text.includes("rohan") || text.includes("deshmukh")) {
    return UNIVERSITY_ECOSYSTEMS["univ-iit-dhanbad"];
  }
  if (text.includes("aiims") || text.includes("deoghar") || text.includes("medtech") || text.includes("deepak") || text.includes("kavita") || (text.includes("soren") && text.includes("rajesh"))) {
    return UNIVERSITY_ECOSYSTEMS["univ-aiims-deoghar"];
  }
  if (text.includes("bau") || text.includes("birsa agricultural") || text.includes("kanke") || text.includes("murmu") || text.includes("pooja") || (text.includes("oraon") && text.includes("birsa"))) {
    return UNIVERSITY_ECOSYSTEMS["univ-bau-kanke"];
  }

  return UNIVERSITY_ECOSYSTEMS["univ-bit-mesra"];
};
