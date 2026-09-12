// JSICP REST API Client (SIH 2026)
const API_BASE = (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, "") : "") + "/api";


async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  };

  if (config.body && typeof config.body === "object" && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const res = await fetch(url, config);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return { success: false, error: errorData.message || `HTTP ${res.status}` };
    }
    return await res.json();
  } catch (err) {
    // Graceful fallback when backend is offline or connecting
    return { success: false, error: err.message, offline: true };
  }
}

export const api = {
  auth: {
    getUsers: () => request("/auth/users"),
    getUser: (id) => request(`/auth/users/${id}`),
    login: (credentials) => request("/auth/login", { method: "POST", body: credentials }),
    register: (userData) => request("/auth/register", { method: "POST", body: userData })
  },
  problems: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/problems${query ? `?${query}` : ""}`);
    },
    getById: (id) => request(`/problems/${id}`),
    create: (data) => request("/problems", { method: "POST", body: data }),
    updateStatus: (id, data) => request(`/problems/${id}/status`, { method: "PATCH", body: data }),
    upvote: (id) => request(`/problems/${id}/upvote`, { method: "POST" }),
    rate: (id, ratingData) => request(`/problems/${id}/rate`, { method: "POST", body: ratingData })
  },
  universities: {
    getAll: () => request("/universities"),
    getById: (id) => request(`/universities/${id}`)
  },
  teams: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/teams${query ? `?${query}` : ""}`);
    },
    create: (data) => request("/teams", { method: "POST", body: data }),
    addMember: (teamId, memberData) => request(`/teams/${teamId}/members`, { method: "POST", body: memberData })
  },
  proposals: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/proposals${query ? `?${query}` : ""}`);
    },
    getById: (id) => request(`/proposals/${id}`),
    create: (data) => request("/proposals", { method: "POST", body: data }),
    updateStatus: (id, data) => request(`/proposals/${id}/status`, { method: "PATCH", body: data })
  },
  agreements: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/agreements${query ? `?${query}` : ""}`);
    },
    create: (data) => request("/agreements", { method: "POST", body: data })
  },
  milestones: {
    getAll: (proposalId) => request(`/milestones${proposalId ? `?proposalId=${proposalId}` : ""}`),
    getById: (id) => request(`/milestones/${id}`),
    updateStatus: (id, status) => request(`/milestones/${id}/status`, { method: "PATCH", body: { status } }),
    facultyApprove: (id, approverName) => request(`/milestones/${id}/faculty-approve`, { method: "POST", body: { approverName } }),
    govtApprove: (id, approverName) => request(`/milestones/${id}/govt-approve`, { method: "POST", body: { approverName } }),
    uploadDocument: (id, docData) => request(`/milestones/${id}/documents`, { method: "POST", body: docData })
  },
  deliverables: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/deliverables${query ? `?${query}` : ""}`);
    },
    create: (data) => request("/deliverables", { method: "POST", body: data }),
    submit: (id, data) => request(`/deliverables/${id}/submit`, { method: "POST", body: data }),
    review: (id, data) => request(`/deliverables/${id}/review`, { method: "POST", body: data })
  },
  kanban: {
    getAll: (teamId) => request(`/kanban${teamId ? `?teamId=${teamId}` : ""}`),
    create: (data) => request("/kanban", { method: "POST", body: data }),
    update: (id, data) => request(`/kanban/${id}`, { method: "PATCH", body: data })
  },
  notifications: {
    getAll: (userId) => request(`/notifications${userId ? `?userId=${userId}` : ""}`),
    create: (data) => request("/notifications", { method: "POST", body: data }),
    markRead: (id) => request(`/notifications/${id}/read`, { method: "PATCH" })
  },
  blockchain: {
    getLedger: () => request("/blockchain"),
    addBlock: (data) => request("/blockchain/block", { method: "POST", body: data })
  },
  analytics: {
    getSummary: () => request("/analytics/summary"),
    getDistricts: () => request("/analytics/districts"),
    getLeaderboard: () => request("/analytics/leaderboard")
  },
  ai: {
    getStatus: () => request("/ai/status"),
    transcribe: (audioBase64, mimeType, languageCode, dialect) => request("/ai/transcribe", { method: "POST", body: { audioBase64, mimeType, languageCode, dialect } }),
    processComplaint: (data) => request("/ai/process-complaint", { method: "POST", body: data }),
    preprocess: (text) => request("/ai/preprocess", { method: "POST", body: { text } }),
    classify: (text) => request("/ai/classify", { method: "POST", body: { text } }),
    validateMedia: (mediaUrl, claimedCategory) => request("/ai/validate-media", { method: "POST", body: { mediaUrl, claimed_category: claimedCategory } }),
    dedupCheck: (text, latitude, longitude) => request("/ai/dedup-check", { method: "POST", body: { text, latitude, longitude } }),
    priorityScore: (data) => request("/ai/priority-score", { method: "POST", body: data }),
    routeRecommend: (data) => request("/ai/route-recommend", { method: "POST", body: data }),
    chat: (message, sessionId, userRole, history = []) => request("/ai/chat", { method: "POST", body: { message, sessionId, userRole, history } })
  }
};
