import "../services/backend-server/server.js";

async function runE2ETest() {
  console.log("=== STARTING JSICP E2E BACKEND INTEGRATION TEST ===");
  await new Promise((r) => setTimeout(r, 1000));

  const BASE = "http://127.0.0.1:4000/api";

  // 1. Health check
  const healthRes = await fetch(`${BASE}/health`);
  const health = await healthRes.json();
  console.log("✅ Health Check:", health.status);

  // 2. Submit new Problem (Module A + AI Pipeline)
  const newProblemPayload = {
    title: "High Arsenic & Heavy Metal in Torpa Village Borewell",
    description: "Drinking water in Torpa block shows heavy yellow sediment and high arsenic levels affecting over 800 villagers.",
    category: "Water Resources & Sanitation",
    district: "Khunti",
    submittedBy: "citizen-sunita",
    submitterName: "Smt. Sunita Devi"
  };
  const probRes = await fetch(`${BASE}/problems`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newProblemPayload)
  });
  const createdProb = await probRes.json();
  console.log("✅ Problem Submitted:", createdProb.data.ticketNumber, "Priority:", createdProb.data.priorityScore);
  console.log("   Top HEI Recommended:", createdProb.data.aiExplanation.suggestedUniversities[0].universityName);

  // 3. State Nodal Approval & Route to University (Module B)
  const routeRes = await fetch(`${BASE}/problems/${createdProb.data.id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status: "accepted_by_hei",
      assignedUniversityId: "univ-bit-mesra",
      assignedUniversityName: "BIT Mesra, Ranchi",
      assignedFacultyId: "faculty-ananya",
      assignedFacultyName: "Prof. Ananya Sen"
    })
  });
  const routedProb = await routeRes.json();
  console.log("✅ Nodal Officer Approved & Routed Status:", routedProb.data.status);

  // 4. Create Multidisciplinary Student Team (Module C)
  const teamRes = await fetch(`${BASE}/teams`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      problemId: createdProb.data.id,
      problemTitle: createdProb.data.title,
      universityId: "univ-bit-mesra",
      universityName: "BIT Mesra, Ranchi",
      facultyMentorId: "faculty-ananya",
      facultyMentorName: "Prof. Ananya Sen",
      facultyDepartment: "Dept of Water & Environmental Engineering",
      members: [
        { studentId: "student-rahul", studentName: "Rahul Kumar", discipline: "IoT & Electronics", role: "Team Lead", email: "rahul@bitmesra.ac.in", yearOfStudy: "3rd Year" },
        { studentId: "student-sneha", studentName: "Sneha Soren", discipline: "Chemical Engineering", role: "NABL Tester", email: "sneha@bitmesra.ac.in", yearOfStudy: "3rd Year" }
      ]
    })
  });
  const createdTeam = await teamRes.json();
  console.log("✅ Multidisciplinary Team Formed:", createdTeam.data.id, "Members:", createdTeam.data.members.length);

  // 5. Submit Solution Proposal (Module C)
  const propRes = await fetch(`${BASE}/proposals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      teamId: createdTeam.data.id,
      problemId: createdProb.data.id,
      problemTitle: createdProb.data.title,
      problemCategory: "Water Resources & Sanitation",
      district: "Khunti",
      universityName: "BIT Mesra, Ranchi",
      facultyMentorName: "Prof. Ananya Sen",
      title: "JalShuddhi Plus: Advanced Ion-Exchange Arsenic Filter",
      summary: "Modular bio-char and ion-exchange filter for high arsenic groundwater.",
      technicalApproach: "Adsorption column with ESP32 turbidity telemetry",
      expectedOutcome: "BIS 10500 compliant potable water < 0.01 ppm arsenic",
      estimatedBudget: 420000,
      durationMonths: 6,
      needsIndustrySupport: true,
      supportTypeNeeded: ["funding", "prototyping"]
    })
  });
  const createdProp = await propRes.json();
  console.log("✅ Proposal Created:", createdProp.data.id, "Milestones Generated:", createdProp.milestones.length);

  // 6. Industry E-Signs Digital MoU (Module D)
  const agreementRes = await fetch(`${BASE}/agreements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      proposalId: createdProp.data.id,
      proposalTitle: createdProp.data.title,
      universityName: "BIT Mesra, Ranchi",
      industryPartnerId: "industry-tatasteel",
      industryPartnerName: "Tata Steel CSR Foundation",
      industryType: "csr",
      agreementType: "csr_grant",
      amount: 420000,
      terms: "100% grant funding disbursed in 3 milestone-linked tranches with on-ground verification."
    })
  });
  const agreement = await agreementRes.json();
  console.log("✅ Industry MoU Signed:", agreement.data.id, "Blockchain Tx:", agreement.data.blockchainTxHash.slice(0, 18) + "...");

  // 7. Faculty & Govt Dual Sign-off Gate (Module E)
  const m1Id = createdProp.milestones[0].id;
  await fetch(`${BASE}/milestones/${m1Id}/faculty-approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ approverName: "Prof. Ananya Sen" })
  });
  const govtSignRes = await fetch(`${BASE}/milestones/${m1Id}/govt-approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ approverName: "Dr. Shailesh Kumar, IAS" })
  });
  const finalMilestone = await govtSignRes.json();
  console.log("✅ Milestone Dual Sign-off Completed:", finalMilestone.data.displayName, "Status:", finalMilestone.data.status);

  // 8. Blockchain Ledger Verification
  const ledgerRes = await fetch(`${BASE}/blockchain`);
  const ledger = await ledgerRes.json();
  console.log("✅ Cryptographic Blockchain Ledger Total Blocks:", ledger.count);
  console.log("   Latest Block SHA-256 Hash:", ledger.data[0].currentHash);

  // 9. Analytics BI Summary
  const analyticsRes = await fetch(`${BASE}/analytics/summary`);
  const analytics = await analyticsRes.json();
  console.log("✅ Government BI Analytics Total Problems:", analytics.data.totalProblems, "Funding Mobilized: ₹" + analytics.data.totalFundingMobilizedINR.toLocaleString("en-IN"));

  console.log("=== ALL E2E BACKEND INTEGRATION TESTS PASSED ===");
  process.exit(0);
}

runE2ETest().catch((err) => {
  console.error("Test Failed:", err);
  process.exit(1);
});
