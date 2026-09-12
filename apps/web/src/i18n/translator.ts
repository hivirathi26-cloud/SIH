import { TRANSLATIONS, SupportedLanguage } from "./translations";

/**
 * Checks if a string is primarily authored in Devanagari/Hindi script.
 * As per requirement: Text written in Hindi irrespective of the language selected must stay in Hindi.
 */
export const isOriginalHindiText = (text: string): boolean => {
  const devanagariRegex = /[\u0900-\u097F]/;
  // If it contains Hindi and does NOT contain English letters, it is pure Hindi
  const hasDevanagari = devanagariRegex.test(text);
  const hasLatin = /[a-zA-Z]/.test(text);
  return hasDevanagari && !hasLatin;
};

// Case-insensitive lookup map built once for high performance
const lowerCaseMap = new Map<string, string>();
Object.keys(TRANSLATIONS).forEach((key) => {
  lowerCaseMap.set(key.toLowerCase().trim(), key);
});

// Pre-sort keys by descending length for greedy substring replacement
const sortedKeys = Object.keys(TRANSLATIONS).sort((a, b) => b.length - a.length);

/**
 * Translates a given text to the target language.
 * Follows the rule that text originally written in Hindi remains untouched.
 */
export const translate = (text: string, lang: SupportedLanguage): string => {
  if (!text || typeof text !== "string") return text;
  if (lang === "en") return text;

  const trimmed = text.trim();
  if (!trimmed) return text;

  // Rule exception: If text is purely written in Hindi, it must stay in Hindi
  if (isOriginalHindiText(trimmed)) {
    return text;
  }

  // 1. Direct exact lookup
  if (TRANSLATIONS[trimmed] && TRANSLATIONS[trimmed][lang]) {
    const translated = TRANSLATIONS[trimmed][lang];
    // Preserve leading/trailing whitespace
    const leadingWhitespace = text.match(/^\s*/)?.[0] || "";
    const trailingWhitespace = text.match(/\s*$/)?.[0] || "";
    return `${leadingWhitespace}${translated}${trailingWhitespace}`;
  }

  // 2. Case-insensitive lookup
  const canonKey = lowerCaseMap.get(trimmed.toLowerCase());
  if (canonKey && TRANSLATIONS[canonKey] && TRANSLATIONS[canonKey][lang]) {
    const translated = TRANSLATIONS[canonKey][lang];
    const leadingWhitespace = text.match(/^\s*/)?.[0] || "";
    const trailingWhitespace = text.match(/\s*$/)?.[0] || "";
    return `${leadingWhitespace}${translated}${trailingWhitespace}`;
  }

  // 3. Fallback: Check if common embedded terms can be replaced
  // E.g. "Status: Approved", "District: Ranchi"
  let result = text;
  let replaced = false;

  for (const key of sortedKeys) {
    if (key.length > 2 && result.includes(key)) {
      const transObj = TRANSLATIONS[key];
      if (transObj && transObj[lang]) {
        result = result.split(key).join(transObj[lang]);
        replaced = true;
      }
    }
  }

  if (replaced) {
    return result;
  }

  return text;
};
