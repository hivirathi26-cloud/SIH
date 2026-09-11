const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const REQUEST_TIMEOUT_MS = 15_000;
const MAX_ATTEMPTS = 3;
const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);

const SYSTEM_INSTRUCTIONS = `You are Jharkhand Sahayak, the helpful AI assistant for the Jharkhand Societal Innovation Collaboration Portal (JSICP). Help citizens, students, faculty, universities, government staff, and industry partners use the portal. Reply concisely in the user's language when possible. Do not invent ticket status, university assignments, policy decisions, or government contact details. If information is not available, say so and direct the user to the appropriate JSICP portal workflow. You cannot take actions or approve submissions.`;

function buildPrompt(message, history = [], userRole = "citizen") {
  const recentHistory = Array.isArray(history)
    ? history.slice(-8).map((item) => {
        const role = item?.sender === "bot" || item?.role === "model" ? "Assistant" : "User";
        return `${role}: ${String(item?.text || item?.message || "").slice(0, 800)}`;
      }).filter(Boolean)
    : [];

  return [
    SYSTEM_INSTRUCTIONS,
    `Current user role: ${String(userRole || "citizen").slice(0, 50)}.`,
    recentHistory.length ? `Recent conversation:\n${recentHistory.join("\n")}` : "",
    `User's current message: ${message}`
  ].filter(Boolean).join("\n\n");
}

/**
 * Returns null when Gemini is intentionally not configured.  This lets the
 * route retain the existing offline portal-help fallback during development.
 */
export async function generateGeminiChatReply({ message, history, userRole }) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL?.trim() || "gemini-3.6-flash";
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(
        `${GEMINI_API_BASE}/${encodeURIComponent(model)}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": apiKey
          },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ parts: [{ text: buildPrompt(message, history, userRole) }] }],
            // 350 tokens can truncate a normal multi-paragraph assistance reply
            // mid-sentence.  The UI remains concise through the system prompt,
            // while this limit leaves enough room to complete the answer.
            generationConfig: { temperature: 0.3, maxOutputTokens: 800 }
          })
        }
      );

      if (!response.ok) {
        const error = new Error(`Gemini API returned HTTP ${response.status}`);
        error.status = response.status;
        error.retryable = RETRYABLE_STATUS_CODES.has(response.status);
        throw error;
      }

      const payload = await response.json();
      const reply = payload?.candidates?.[0]?.content?.parts
        ?.map((part) => part?.text || "")
        .join("")
        .trim();

      if (!reply) throw new Error("Gemini returned no text response");
      return reply;
    } catch (error) {
      const mayRetry = error.retryable || error.name === "AbortError" || !error.status;
      if (!mayRetry || attempt === MAX_ATTEMPTS) throw error;

      // Brief exponential backoff for provider congestion; do not log request
      // objects or headers, which could expose implementation details.
      await new Promise((resolve) => setTimeout(resolve, 500 * (2 ** (attempt - 1))));
    } finally {
      clearTimeout(timeout);
    }
  }
}
