import { SupportedLanguage } from "./translations";
import { translate, isOriginalHindiText } from "./translator";

declare global {
  interface Node {
    __origText?: string;
  }
  interface Element {
    __origPlaceholder?: string;
    __origTitle?: string;
    __origAriaLabel?: string;
  }
}

let activeObserver: MutationObserver | null = null;
let isTranslating = false;

function translateNode(node: Node, lang: SupportedLanguage) {
  if (node.nodeType === Node.TEXT_NODE) {
    // Skip script, style, and code tags
    const parentTag = node.parentElement?.tagName?.toLowerCase();
    if (parentTag === "script" || parentTag === "style" || parentTag === "code" || parentTag === "pre") {
      return;
    }

    // Skip elements explicitly marked as non-translatable (such as language switchers)
    if (node.parentElement?.closest("[translate='no'], [data-no-translate='true'], .notranslate, .no-translate")) {
      return;
    }

    const currentVal = node.nodeValue || "";
    if (!currentVal.trim()) return;

    // Cache original English source text on first read
    if (node.__origText === undefined) {
      node.__origText = currentVal;
    }

    const original = node.__origText;

    // If text was originally written in Hindi, do not touch it
    if (isOriginalHindiText(original)) {
      return;
    }

    if (lang === "en") {
      if (node.nodeValue !== original) {
        node.nodeValue = original;
      }
    } else {
      const translated = translate(original, lang);
      if (translated !== node.nodeValue) {
        node.nodeValue = translated;
      }
    }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement;

    // Skip elements explicitly marked as non-translatable
    if (el.closest?.("[translate='no'], [data-no-translate='true'], .notranslate, .no-translate")) {
      return;
    }

    // Translate placeholder
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      if (el.placeholder) {
        if (el.__origPlaceholder === undefined) {
          el.__origPlaceholder = el.placeholder;
        }
        const orig = el.__origPlaceholder;
        if (!isOriginalHindiText(orig)) {
          el.placeholder = lang === "en" ? orig : translate(orig, lang);
        }
      }
    }

    // Translate title
    if (el.title) {
      if (el.__origTitle === undefined) {
        el.__origTitle = el.title;
      }
      const orig = el.__origTitle;
      if (!isOriginalHindiText(orig)) {
        el.title = lang === "en" ? orig : translate(orig, lang);
      }
    }

    // Translate aria-label
    const ariaLabel = el.getAttribute("aria-label");
    if (ariaLabel) {
      if (el.__origAriaLabel === undefined) {
        el.__origAriaLabel = ariaLabel;
      }
      const orig = el.__origAriaLabel;
      if (!isOriginalHindiText(orig)) {
        el.setAttribute("aria-label", lang === "en" ? orig : translate(orig, lang));
      }
    }

    // Traverse child nodes
    const children = Array.from(el.childNodes);
    for (const child of children) {
      translateNode(child, lang);
    }
  }
}

/**
 * Initializes or updates the real-time DOM translation observer.
 * Whenever currentLanguage changes, the entire portal's DOM is translated,
 * and any new DOM nodes (modals, tabs, routes) are dynamically translated as they mount.
 */
export const setupI18nObserver = (lang: SupportedLanguage): (() => void) => {
  if (typeof document === "undefined") {
    return () => {};
  }

  // Update HTML lang attribute
  const langCodeMap: Record<SupportedLanguage, string> = {
    en: "en",
    hi: "hi",
    nagpuri: "nag",
    santali: "sat"
  };
  document.documentElement.setAttribute("lang", langCodeMap[lang] || "en");

  if (activeObserver) {
    activeObserver.disconnect();
    activeObserver = null;
  }

  const root = document.getElementById("root") || document.body;

  const runTranslationPass = () => {
    if (isTranslating) return;
    isTranslating = true;
    try {
      translateNode(root, lang);
    } finally {
      isTranslating = false;
    }
  };

  // Immediate full-tree translation
  runTranslationPass();

  // Watch for dynamic route transitions, dialogs, tab switches, and async content
  activeObserver = new MutationObserver((mutations) => {
    if (isTranslating) return;

    let shouldTranslate = false;
    for (const mutation of mutations) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        shouldTranslate = true;
        break;
      }
    }

    if (shouldTranslate) {
      runTranslationPass();
    }
  });

  activeObserver.observe(root, {
    childList: true,
    subtree: true
  });

  return () => {
    if (activeObserver) {
      activeObserver.disconnect();
      activeObserver = null;
    }
  };
};
