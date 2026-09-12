export type SupportedLanguage = "en" | "hi" | "nagpuri" | "santali";

export interface TranslationMap {
  [key: string]: {
    hi: string;
    nagpuri: string;
    santali: string;
  };
}

/**
 * Comprehensive dictionary for JSICP Portal
 * Maps English source phrases to Hindi, Nagpuri (Sadri), and Santali (Ol Chiki / Devanagari).
 * Note: Pre-existing Hindi text in components (e.g. "झारखंड सरकार", "झारखंड सामाजिक नवाचार सहयोग पोर्टल")
 * is preserved verbatim in all languages as requested.
 */
export const TRANSLATIONS: TranslationMap = {
  // --- Header & Navigation ---
  "Sign In": {
    hi: "लॉग इन करें",
    nagpuri: "खाता खोलू",
    santali: "ᱵᱚᱞᱚᱱ (Sign In)"
  },
  "Sign In / Portal Login": {
    hi: "लॉग इन / पोर्टल प्रवेश",
    nagpuri: "लागिन / चौपाल प्रवेश",
    santali: "ᱵᱚᱞᱚᱱ / ᱯᱳᱨᱴᱟᱞ ᱞᱟᱜᱤᱱ"
  },
  "Portal Login": {
    hi: "पोर्टल लॉगिन",
    nagpuri: "चौपाल लागिन",
    santali: "ᱯᱳᱨᱴᱟᱞ ᱵᱚᱞᱚᱱ"
  },
  "Civic Track": {
    hi: "समस्या ट्रैक",
    nagpuri: "समस्या जांचू",
    santali: "ᱯᱟᱸᱡᱟ (Track)"
  },
  "Track Problem": {
    hi: "समस्या ट्रैक करें",
    nagpuri: "समस्या जांचू / स्थिति देखा",
    santali: "ᱮᱴᱠᱮᱴᱚᱬᱮ ᱯᱟᱸᱡᱟ"
  },
  "Track Complaint / Ticket Status": {
    hi: "शिकायत / टिकट की स्थिति देखें",
    nagpuri: "शिकायत / टिकट कर स्थिति जांचू",
    santali: "ᱮᱴᱠᱮᱴᱚᱬᱮ ᱨᱮᱱᱟᱜ ᱦᱟᱞᱚᱛ ᱯᱟᱸᱡᱟ"
  },
  "Home": {
    hi: "मुखपृष्ठ",
    nagpuri: "मुख्य पन्ना",
    santali: "ᱢᱩᱬᱩᱛ (Home)"
  },
  "Font Size:": {
    hi: "अक्षर आकार:",
    nagpuri: "अक्षर कर नाप:",
    santali: "ᱚᱞ ᱢᱟᱯ (Font):"
  },
  "Font:": {
    hi: "फॉन्ट:",
    nagpuri: "अक्षर:",
    santali: "ᱚᱞ:"
  },
  "Decrease font size": {
    hi: "अक्षर आकार घटाएं",
    nagpuri: "अक्षर छोट करू",
    santali: "ᱚᱞ ᱦᱩᱰᱤᱧ"
  },
  "Normal font size": {
    hi: "सामान्य अक्षर आकार",
    nagpuri: "साधारण नाप",
    santali: "ᱥᱟᱫᱷᱟᱨᱚᱱ ᱢᱟᱯ"
  },
  "Increase font size": {
    hi: "अक्षर आकार बढ़ाएं",
    nagpuri: "अक्षर बड़ करू",
    santali: "ᱚᱞ ᱢᱟᱨᱟᱝ"
  },
  "Live Notifications": {
    hi: "लाइव सूचनाएं",
    nagpuri: "ताजा खबर मन",
    santali: "ᱱᱤᱛᱚᱜᱟᱜ ᱵᱟᱰᱟᱭ (Live)"
  },
  "Notifications": {
    hi: "सूचनाएं",
    nagpuri: "सूचना मन",
    santali: "ᱵᱟᱰᱟᱭ ᱡᱚᱝ"
  },
  "Mark all as read": {
    hi: "सभी को पढ़ा हुआ चिह्नित करें",
    nagpuri: "सभे के पढ़ल मानू",
    santali: "ᱡᱚᱛᱚ ᱯᱟᱲᱦᱟᱣ ᱮᱱᱟ"
  },
  "No unread notifications": {
    hi: "कोई नई सूचना नहीं है",
    nagpuri: "कोनो नवा सूचना नखे",
    santali: "ᱪᱮᱫ ᱱᱟᱣᱟ ᱵᱟᱰᱟᱭ ᱵᱟᱹᱱᱩᱜ-ᱟ"
  },
  "Switch Role": {
    hi: "भूमिका बदलें",
    nagpuri: "काम बदलू",
    santali: "ᱮᱱᱮᱢ ᱵᱚᱫᱚᱞ"
  },
  "Switch Role (Demo)": {
    hi: "भूमिका बदलें (डेमो)",
    nagpuri: "काम बदलू (डेमो)",
    santali: "ᱮᱱᱮᱢ ᱵᱚᱫᱚᱞ (ᱰᱮᱢᱳ)"
  },
  "Logout": {
    hi: "लॉग आउट",
    nagpuri: "बाहर निकलू",
    santali: "ᱚᱰᱚᱠ (Logout)"
  },
  "Online (Live Cloud Sync)": {
    hi: "ऑनलाइन (लाइव क्लाउड सिंक)",
    nagpuri: "ऑनलाइन (तुरंत सिंक)",
    santali: "ᱚᱱᱞᱟᱭᱤᱱ (Online Sync)"
  },
  "Offline Mode": {
    hi: "ऑफ़लाइन मोड",
    nagpuri: "ऑफलाइन तरीका",
    santali: "ᱚᱯᱷᱞᱟᱭᱤᱱ (Offline)"
  },

  // --- Stakeholder Portals & Roles ---
  "Citizen Portal": {
    hi: "नागरिक पोर्टल",
    nagpuri: "नागरिक चौपाल",
    santali: "ᱦᱚᱲ ᱠᱚᱣᱟᱜ ᱯᱳᱨᱴᱟᱞ"
  },
  "Citizen & PRI Portal": {
    hi: "नागरिक एवं पंचायती राज पोर्टल",
    nagpuri: "नागरिक अउर पंचायत चौपाल",
    santali: "ᱦᱚᱲ ᱟᱨ ᱯᱚᱧᱪᱟᱭᱮᱛ ᱯᱳᱨᱴᱟᱞ"
  },
  "HEI Nodal": {
    hi: "उच्च शिक्षण संस्थान नोडल",
    nagpuri: "विश्वविद्यालय नोडल केंद्र",
    santali: "ᱵᱤᱨᱫᱟᱹᱜᱟᱲ ᱱᱳᱰᱟᱞ"
  },
  "HEI Nodal Workspace": {
    hi: "उच्च शिक्षण संस्थान कार्यक्षेत्र",
    nagpuri: "विश्वविद्यालय नोडल कार्यक्षेत्र",
    santali: "ᱵᱤᱨᱫᱟᱹᱜᱟᱲ ᱠᱟᱹᱢᱤ ᱴᱷᱟᱶ"
  },
  "University Nodal Desk": {
    hi: "विश्वविद्यालय नोडल डेस्क",
    nagpuri: "विश्वविद्यालय नोडल चौपाल",
    santali: "ᱵᱤᱨᱫᱟᱹᱜᱟᱲ ᱱᱳᱰᱟᱞ ᱰᱮᱥᱠ"
  },
  "Faculty Mentor": {
    hi: "संकाय संरक्षक (फैकल्टी)",
    nagpuri: "गुरुजी / फैकल्टी चौपाल",
    santali: "ᱢᱟᱪᱮᱛ ᱯᱳᱨᱴᱟᱞ (Faculty)"
  },
  "Faculty Mentor Portal": {
    hi: "संकाय संरक्षक पोर्टल",
    nagpuri: "फैकल्टी मार्गदर्शक चौपाल",
    santali: "ᱢᱟᱪᱮᱛ ᱫᱤᱥᱟᱹ-ᱩᱫᱩᱜ ᱯᱳᱨᱴᱟᱞ"
  },
  "Student Workspace": {
    hi: "छात्र कार्यक्षेत्र",
    nagpuri: "विद्यार्थी कार्यक्षेत्र",
    santali: "ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱟᱹᱢᱤ ᱴᱷᱟᱶ"
  },
  "Industry / CSR": {
    hi: "उद्योग / सीएसआर",
    nagpuri: "उद्योग / सीएसआर चौपाल",
    santali: "ᱠᱟᱹᱨᱜᱟᱲ / ᱥᱤ.ᱮᱥ.ᱟᱨ"
  },
  "Industry & CSR Hub": {
    hi: "उद्योग एवं सीएसआर केंद्र",
    nagpuri: "उद्योग अउर सीएसआर केंद्र",
    santali: "ᱠᱟᱹᱨᱜᱟᱲ ᱟᱨ CSR ᱛᱟᱞᱢᱟ"
  },
  "Industry Portal": {
    hi: "उद्योग पोर्टल",
    nagpuri: "उद्योग चौपाल",
    santali: "ᱠᱟᱹᱨᱜᱟᱲ ᱯᱳᱨᱴᱟᱞ"
  },
  "Govt Admin": {
    hi: "सरकारी प्रशासन",
    nagpuri: "सरकारी देखरेख अउर हिसाब",
    santali: "ᱥᱚᱨᱠᱟᱨ ᱥᱟᱥᱚᱱ"
  },
  "Govt Admin & Analytics": {
    hi: "सरकारी प्रशासन एवं विश्लेषण",
    nagpuri: "सरकारी देखरेख अउर हिसाब-किताब",
    santali: "ᱥᱚᱨᱠᱟᱨ ᱥᱟᱥᱚᱱ ᱟᱨ ᱞᱮᱠᱷᱟ"
  },
  "State Admin & DM": {
    hi: "राज्य प्रशासन एवं ज़िलाधिकारी",
    nagpuri: "राज्य प्रशासन अउर डीसी",
    santali: "ᱯᱚᱱᱚᱛ ᱥᱟᱥᱚᱱ ᱟᱨ DM"
  },
  "Dedicated Stakeholder Workspaces (RBAC)": {
    hi: "विशिष्ट हितधारक कार्यक्षेत्र (भूमिका आधारित)",
    nagpuri: "सभे कामदार मन ले अलग चौपाल",
    santali: "ᱡᱚᱛᱚ ᱠᱟᱹᱢᱤᱭᱟᱹ ᱞᱟᱹᱜᱤᱫ ᱠᱟᱹᱢᱤ ᱴᱷᱟᱶ"
  },
  "Open Portal": {
    hi: "पोर्टल खोलें",
    nagpuri: "चौपाल खोलू",
    santali: "ᱯᱳᱨᱴᱟᱞ ᱡᱷᱤᱡᱽ"
  },
  "Enter Stakeholder Portal (Parichay SSO)": {
    hi: "हितधारक पोर्टल में प्रवेश करें (परिचय एसएसओ)",
    nagpuri: "पोर्टल में घुसू (परिचय एसएसओ)",
    santali: "ᱯᱳᱨᱴᱟᱞ ᱨᱮ ᱵᱚᱞᱚᱱ (Parichay SSO)"
  },
  "Parichay State Single Sign-On (SSO)": {
    hi: "परिचय राज्य एकल साइन-ऑन (एसएसओ)",
    nagpuri: "परिचय राज्य सिंगल साइन-ऑन (SSO)",
    santali: "ᱯᱚᱨᱤᱪᱚᱭ ᱯᱚᱱᱚᱛ SSO"
  },

  // --- Navigation Tabs & Breadcrumbs ---
  "Overview & Status": {
    hi: "अवलोकन एवं स्थिति",
    nagpuri: "हाल-चाल अउर जानकारी",
    santali: "ᱢᱩᱴᱷᱟᱹᱱ ᱟᱨ ᱦᱟᱞᱚᱛ"
  },
  "Overview": {
    hi: "अवलोकन",
    nagpuri: "सब जानकारी",
    santali: "ᱢᱩᱴᱷᱟᱹᱱ (Overview)"
  },
  "File New Challenge": {
    hi: "नई चुनौती / समस्या दर्ज करें",
    nagpuri: "नवा समस्या दर्ज करू",
    santali: "ᱱᱟᱣᱟ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱚᱞ"
  },
  "Submit Challenge": {
    hi: "चुनौती दर्ज करें",
    nagpuri: "समस्या बतावा / दर्ज करू",
    santali: "ᱮᱴᱠᱮᱴᱚᱬᱮ ᱥᱟᱵᱢᱤᱴ"
  },
  "My Tracked Issues": {
    hi: "मेरी ट्रैक की गई समस्याएं",
    nagpuri: "हमार दर्ज समस्या मन",
    santali: "ᱤᱧᱟᱜ ᱯᱟᱸᱡᱟ ᱮᱴᱠᱮᱴᱚᱬᱮ"
  },
  "My Challenges": {
    hi: "मेरी चुनौतियां",
    nagpuri: "हमार समस्या मन",
    santali: "ᱤᱧᱟᱜ ᱮᱴᱠᱮᱴᱚᱬᱮ"
  },
  "District Issues & Support": {
    hi: "ज़िला स्तरीय समस्याएं एवं समर्थन",
    nagpuri: "जिला कर समस्या अउर मदद",
    santali: "ᱡᱤᱞᱟᱹ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱟᱨ ᱜᱚᱲᱚ"
  },
  "Civic Points & Badges": {
    hi: "नागरिक अंक एवं बैज",
    nagpuri: "नागरिक अंक अउर मेडल",
    santali: "ᱥᱤᱵᱷᱤᱠ ᱯᱚᱭᱮᱱᱴ ᱟᱨ ᱵᱮᱡᱽ"
  },
  "Civic Leaderboard": {
    hi: "नागरिक लीडरबोर्ड",
    nagpuri: "नागरिक आगे-पाछे सूची",
    santali: "ᱥᱤᱵᱷᱤᱠ ᱞᱤᱰᱟᱨᱵᱳᱨᱰ"
  },
  "AI Problem Routing": {
    hi: "एआई समस्या आवंटन",
    nagpuri: "AI समस्या बांटल",
    santali: "AI ᱮᱴᱠᱮᱴᱚᱬᱮ ᱦᱟᱹᱴᱤᱧ"
  },
  "Faculty & R&D Teams": {
    hi: "संकाय एवं अनुसंधान दल",
    nagpuri: "फैकल्टी अउर रिसर्च टीम",
    santali: "ᱢᱟᱪᱮᱛ ᱟᱨ R&D ᱴᱤᱢ"
  },
  "Proposals & MoUs": {
    hi: "प्रस्ताव एवं समझौता ज्ञापन",
    nagpuri: "प्रस्ताव अउर समझौता मन",
    santali: "ᱯᱨᱚᱯᱳᱡᱟᱞ ᱟᱨ MoU"
  },
  "Active Student Cohorts": {
    hi: "सक्रिय छात्र दल",
    nagpuri: "लागेल विद्यार्थी दल",
    santali: "ᱠᱟᱹᱢᱤᱭᱟᱹ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱫᱚᱞ"
  },
  "Equipment & Lab Directory": {
    hi: "उपकरण एवं प्रयोगशाला निर्देशिका",
    nagpuri: "सामान अउर लैब जानकारी",
    santali: "ᱞᱮᱵᱽ ᱟᱨ ᱥᱟᱢᱟᱱ ᱛᱟᱹᱞᱠᱟᱹ"
  },
  "Mentored Projects": {
    hi: "संरक्षित परियोजनाएं",
    nagpuri: "देखरेख करल प्रोजेक्ट मन",
    santali: "ᱫᱤᱥᱟᱹ ᱩᱫᱩᱜ ᱯᱨᱚᱡᱮᱠᱴ"
  },
  "Team Kanban Workspace": {
    hi: "दल कानबान कार्यक्षेत्र",
    nagpuri: "टीम कानबान कार्यक्षेत्र",
    santali: "ᱴᱤᱢ ᱠᱟᱱᱵᱟᱱ ᱠᱟᱹᱢᱤ ᱴᱷᱟᱶ"
  },
  "Student Deliverables Vault": {
    hi: "छात्र परियोजना वॉल्ट",
    nagpuri: "विद्यार्थी काम कर भंडार",
    santali: "ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱟᱹᱢᱤ ᱵᱷᱟᱹᱱᱰᱟᱹᱨ"
  },
  "Milestone Dual Sign-Off": {
    hi: "चरणबद्ध दोहरा हस्ताक्षर सत्यापन",
    nagpuri: "पड़ाव जांच अउर सही",
    santali: "ᱢᱟᱭᱤᱞᱥᱴᱳᱱ ᱵᱟᱨ ᱥᱩᱦᱤ"
  },
  "IP & Patent Vault": {
    hi: "बौद्धिक संपदा एवं पेटेंट वॉल्ट",
    nagpuri: "पेटेंट अउर अधिकार भंडार",
    santali: "IP ᱟᱨ ᱯᱮᱴᱮᱱᱴ ᱵᱷᱟᱹᱱᱰᱟᱹᱨ"
  },
  "Assigned Tasks": {
    hi: "आवंटित कार्य",
    nagpuri: "देवल काम मन",
    santali: "ᱮᱢ ᱟᱠᱟᱱ ᱠᱟᱹᱢᱤ"
  },
  "Deliverables Upload": {
    hi: "कार्य रिपोर्ट अपलोड",
    nagpuri: "काम अपलोड करू",
    santali: "ᱠᱟᱹᱢᱤ ᱨᱤᱯᱳᱨᱴ ᱟᱯᱞᱳᱰ"
  },
  "Field Telemetry & IoT": {
    hi: "क्षेत्र टेलीमेट्री एवं आईओटी",
    nagpuri: "जमीन टेलीमेट्री अउर IoT",
    santali: "ᱯᱷᱤᱞᱰ ᱴᱮᱞᱤᱢᱮᱴᱨᱤ ᱟᱨ IoT"
  },
  "Blockchain Certificates": {
    hi: "ब्लॉकचेन प्रमाणपत्र",
    nagpuri: "पक्का ब्लॉकचेन सर्टिफिकेट",
    santali: "ᱵᱞᱚᱠᱪᱮᱱ ᱥᱟᱠᱷᱤ ᱥᱟᱠᱟᱢ"
  },
  "Academic NEP Credits": {
    hi: "एनईपी 2020 शैक्षणिक क्रेडिट",
    nagpuri: "NEP पढ़ाई कर अंक/क्रेडिट",
    santali: "NEP 2020 ᱯᱟᱲᱦᱟᱣ ᱠᱨᱮᱰᱤᱴ"
  },
  "CSR Project Marketplace": {
    hi: "सीएसआर परियोजना बाज़ार",
    nagpuri: "CSR योजना बथान",
    santali: "CSR ᱯᱨᱚᱡᱮᱠᱴ ᱵᱟᱡᱟᱨ"
  },
  "Industry Marketplace": {
    hi: "उद्योग बाज़ार",
    nagpuri: "उद्योग बजार",
    santali: "ᱠᱟᱹᱨᱜᱟᱲ ᱵᱟᱡᱟᱨ"
  },
  "Bilateral MoUs & Escrow": {
    hi: "द्विपक्षीय एमओयू एवं एस्क्रो",
    nagpuri: "एमओयू अउर पैसा संरक्षण",
    santali: "MoU ᱟᱨ ᱴᱟᱠᱟ ᱵᱮᱵᱚᱥᱛᱷᱟ"
  },
  "Direct Student Hiring": {
    hi: "सीधी छात्र भर्ती",
    nagpuri: "सीधा छात्र मन कर नौकरी",
    santali: "ᱥᱚᱡᱷᱮ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱵᱟᱦᱟᱞ"
  },
  "Impact Dashboard & Tax": {
    hi: "प्रभाव डैशबोर्ड एवं कर छूट",
    nagpuri: "फायदा डैशबोर्ड अउर टैक्स छूट",
    santali: "ᱚᱨᱥᱚᱝ ᱰᱮᱥᱵᱳᱨᱰ ᱟᱨ ᱴᱮᱠᱥ"
  },
  "State Heatmap & Triage": {
    hi: "राज्य हीटमैप एवं वर्गीकरण",
    nagpuri: "राज्य नक्शा अउर जांच",
    santali: "ᱯᱚᱱᱚᱛ ᱢᱮᱯ ᱟᱨ ᱵᱟᱪᱷᱟᱣ"
  },
  "Innovation Pipeline Gate": {
    hi: "नवाचार पाइपलाइन गेट",
    nagpuri: "नवाचार रास्ता द्वार",
    santali: "ᱱᱟᱣᱟ ᱩᱭᱦᱟᱹᱨ ᱦᱚᱨ"
  },
  "Fund Sanctions & PFMS": {
    hi: "धन स्वीकृति एवं पीएफएमएस",
    nagpuri: "पैसा मंजूरी अउर PFMS",
    santali: "ᱴᱟᱠᱟ ᱢᱟᱹᱧᱡᱩᱨ ᱟᱨ PFMS"
  },
  "Audited Smart Contracts": {
    hi: "सत्यापित स्मार्ट अनुबंध",
    nagpuri: "जांचल स्मार्ट अनुबंध मन",
    santali: "ᱥᱟᱹᱵᱤᱛ ᱟᱠᱟᱱ ᱥᱢᱟᱨᱴ ᱠᱚᱱᱴᱨᱟᱠᱴ"
  },
  "State Innovation Policy": {
    hi: "राज्य नवाचार नीति 2026",
    nagpuri: "राज्य नवाचार नियम 2026",
    santali: "ᱯᱚᱱᱚᱛ ᱱᱟᱣᱟ ᱩᱭᱦᱟᱹᱨ ᱟᱹᱨᱤ"
  },

  // --- Common UI Labels & Actions ---
  "District": {
    hi: "ज़िला",
    nagpuri: "जिला",
    santali: "ᱡᱤᱞᱟᱹ (District)"
  },
  "Location": {
    hi: "स्थान",
    nagpuri: "जगह",
    santali: "ᱴᱷᱟᱶ (Location)"
  },
  "Allocated HEI": {
    hi: "आवंटित संस्थान",
    nagpuri: "जिम्मा देवल संस्थान",
    santali: "ᱮᱢ ᱟᱠᱟᱱ ᱵᱤᱨᱫᱟᱹᱜᱟᱲ"
  },
  "Assigned Mentor": {
    hi: "नियुक्त मार्गदर्शक",
    nagpuri: "जिम्मा देवल गुरुजी",
    santali: "ᱫᱤᱥᱟᱹ-ᱩᱫᱩᱜᱤᱡ"
  },
  "Status": {
    hi: "स्थिति",
    nagpuri: "दशा / हाल",
    santali: "ᱦᱟᱞᱚᱛ (Status)"
  },
  "Actions": {
    hi: "कार्रवाई",
    nagpuri: "काम / कारबाई",
    santali: "ᱠᱟᱹᱢᱤᱦᱚᱨᱟ"
  },
  "Search": {
    hi: "खोजें",
    nagpuri: "खोजू",
    santali: "ᱥᱮᱸᱫᱽᱨᱟ (Search)"
  },
  "Filter": {
    hi: "फ़िल्टर",
    nagpuri: "छांटू",
    santali: "ᱵᱟᱪᱷᱟᱣ"
  },
  "Filter by District": {
    hi: "ज़िले के अनुसार फ़िल्टर करें",
    nagpuri: "जिला अनुसार छांटू",
    santali: "ᱡᱤᱞᱟᱹ ᱞᱮᱠᱟᱛᱮ ᱵᱟᱪᱷᱟᱣ"
  },
  "All 24 Districts": {
    hi: "सभी 24 ज़िले",
    nagpuri: "सब 24 जिला मन",
    santali: "ᱡᱚᱛᱚ ᱒᱔ ᱡᱤᱞᱟᱹ"
  },
  "Search by keyword or challenge title...": {
    hi: "कीवर्ड या शीर्षक द्वारा खोजें...",
    nagpuri: "नाम या कीवर्ड से खोजू...",
    santali: "ᱧᱩᱛᱩᱢ ᱛᱮ ᱥᱮᱸᱫᱽᱨᱟᱭ ᱢᱮ..."
  },
  "Submit": {
    hi: "जमा करें",
    nagpuri: "जमा करू",
    santali: "ᱥᱟᱵᱢᱤᱴ (Submit)"
  },
  "Cancel": {
    hi: "रद्द करें",
    nagpuri: "काट देऊ",
    santali: "ᱵᱟᱹᱛᱤᱞ (Cancel)"
  },
  "Reset": {
    hi: "रीसेट करें",
    nagpuri: "शुरू से करू",
    santali: "ᱫᱚᱦᱲᱟ (Reset)"
  },
  "Clear": {
    hi: "साफ़ करें",
    nagpuri: "साफ करू",
    santali: "ᱯᱷᱟᱨᱪᱟ"
  },
  "Save": {
    hi: "सहेजें",
    nagpuri: "बचाई राखू",
    santali: "ᱥᱟᱸᱪᱟᱣ"
  },
  "Edit": {
    hi: "संपादित करें",
    nagpuri: "सुधारू",
    santali: "ᱵᱚᱫᱚᱞ"
  },
  "Delete": {
    hi: "हटाएं",
    nagpuri: "हटावा",
    santali: "ᱜᱮᱫ ᱜᱤᱰᱤ"
  },
  "View Details": {
    hi: "विवरण देखें",
    nagpuri: "पूरा हाल देखा",
    santali: "ᱯᱩᱨᱟᱹ ᱧᱮᱞ"
  },
  "Download": {
    hi: "डाउनलोड",
    nagpuri: "डाउनलोड करू",
    santali: "ᱰᱟᱣᱩᱱᱞᱳᱰ"
  },
  "Download PDF": {
    hi: "पीडीएफ डाउनलोड करें",
    nagpuri: "PDF डाउनलोड करू",
    santali: "PDF ᱰᱟᱣᱩᱱᱞᱳᱰ"
  },
  "Verify": {
    hi: "सत्यापित करें",
    nagpuri: "जांच करू",
    santali: "ᱯᱩᱥᱴᱟᱹᱣ"
  },
  "Verified": {
    hi: "सत्यापित",
    nagpuri: "जांचल पक्का",
    santali: "ᱯᱩᱥᱴᱟᱹᱣ ᱮᱱᱟ"
  },
  "Approved": {
    hi: "स्वीकृत",
    nagpuri: "मंजूर करल",
    santali: "ᱢᱟᱹᱧᱡᱩᱨ ᱮᱱᱟ"
  },
  "Pending": {
    hi: "लंबित",
    nagpuri: "बाकी आहे",
    santali: "ᱛᱟᱺᱜᱤ ᱨᱮ"
  },
  "Rejected": {
    hi: "अस्वीकृत",
    nagpuri: "ना-मंजूर",
    santali: "ᱵᱟᱝ ᱢᱟᱹᱧᱡᱩᱨ"
  },
  "Under Review": {
    hi: "समीक्षाधीन",
    nagpuri: "जांच में आहे",
    santali: "ᱵᱤᱪᱟᱹᱨ ᱨᱮ"
  },
  "In Progress": {
    hi: "प्रगति पर",
    nagpuri: "काम चालू आहे",
    santali: "ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟ"
  },
  "Completed": {
    hi: "पूर्ण",
    nagpuri: "पूरा होल",
    santali: "ᱯᱩᱨᱟᱹᱣ ᱮᱱᱟ"
  },
  "Deployed": {
    hi: "धरातल पर लागू (तैनात)",
    nagpuri: "जमीन पर लागू",
    santali: "ᱴᱷᱟᱶ ᱨᱮ ᱞᱟᱜᱟᱣ ᱮᱱᱟ"
  },
  "Priority": {
    hi: "प्राथमिकता",
    nagpuri: "जरूरी दरजा",
    santali: "ᱢᱟᱲᱟᱝ ᱠᱟᱹᱢᱤ"
  },
  "High": {
    hi: "उच्च",
    nagpuri: "भारी जरूरी",
    santali: "ᱟᱹᱰᱤ ᱡᱟᱹᱨᱩᱲ"
  },
  "Medium": {
    hi: "मध्यम",
    nagpuri: "माझिला",
    santali: "ᱛᱟᱞᱟᱢᱟᱞᱟ"
  },
  "Low": {
    hi: "निम्न",
    nagpuri: "हल्का",
    santali: "ᱠᱚᱢ"
  },
  "Date": {
    hi: "दिनांक",
    nagpuri: "तारीख",
    santali: "ᱢᱟᱹᱦᱤᱛ (Date)"
  },
  "Category": {
    hi: "श्रेणी",
    nagpuri: "किसिम / वर्ग",
    santali: "ᱛᱷᱚᱠ (Category)"
  },
  "Title": {
    hi: "शीर्षक",
    nagpuri: "नाम / विषय",
    santali: "ᱧᱩᱛᱩᱢ (Title)"
  },
  "Description": {
    hi: "विवरण",
    nagpuri: "पूरा हाल / बात",
    santali: "ᱵᱤᱵᱚᱨᱚᱬ"
  },
  "Close": {
    hi: "बंद करें",
    nagpuri: "बंद करू",
    santali: "ᱵᱚᱸᱫᱽ"
  },
  "Back": {
    hi: "वापस",
    nagpuri: "पाछे जावा",
    santali: "ᱨᱩᱣᱟᱹᱲ"
  },
  "Next": {
    hi: "आगे",
    nagpuri: "आगू बढ़ा",
    santali: "ᱞᱟᱦᱟ"
  },
  "eKYC Verified": {
    hi: "ई-केवाईसी सत्यापित",
    nagpuri: "आधार जांचल पक्का",
    santali: "eKYC ᱯᱩᱥᱴᱟᱹᱣ ᱮᱱᱟ"
  },

  // --- Landing Page Specific ---
  "NEP 2020 & Jharkhand State Innovation Policy 2026 Mandate": {
    hi: "एनईपी 2020 एवं झारखंड राज्य नवाचार नीति 2026 अधिदेश",
    nagpuri: "NEP 2020 अउर झारखंड राज्य नवाचार नियम 2026 आदेश",
    santali: "NEP ᱒᱐᱒᱐ ᱟᱨ ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱱᱟᱣᱟ ᱩᱭᱦᱟᱹᱨ ᱟᱹᱨᱤ ᱒᱐᱒᱖"
  },
  "A unified three-sided governmental platform bridging": {
    hi: "एक एकीकृत त्रि-पक्षीय सरकारी मंच जो जोड़ता है",
    nagpuri: "एगो सरकारी चौपाल जे जोड़ेला",
    santali: "ᱢᱤᱫᱴᱟᱹᱝ ᱥᱚᱨᱠᱟᱨᱤ ᱢᱮᱞᱟᱝᱠᱤ ᱡᱟᱦᱟᱸᱭ ᱡᱚᱲᱟᱣᱟᱭ"
  },
  "Real-Time State Indicators": {
    hi: "राज्य के वास्तविक समय के संकेतक",
    nagpuri: "राज्य कर ताजा जानकारी",
    santali: "ᱯᱚᱱᱚᱛ ᱨᱮᱱᱟᱜ ᱱᱤᱛᱚᱜᱟᱜ ᱞᱮᱠᱷᱟ"
  },
  "Civic Challenges": {
    hi: "नागरिक चुनौतियां",
    nagpuri: "नागरिक मनक समस्या",
    santali: "ᱦᱚᱲ ᱠᱚᱣᱟᱜ ᱮᱴᱠᱮᱴᱚᱬᱮ"
  },
  "Partner HEIs": {
    hi: "भागीदार उच्च शिक्षण संस्थान",
    nagpuri: "जुड़ल विश्वविद्यालय मन",
    santali: "ᱜᱟᱛᱮ ᱵᱤᱨᱫᱟᱹᱜᱟᱲ"
  },
  "CSR Committed": {
    hi: "सीएसआर प्रतिबद्ध राशि",
    nagpuri: "CSR कर जुटल पैसा",
    santali: "CSR ᱮᱢ ᱟᱠᱟᱱ ᱴᱟᱠᱟ"
  },
  "Districts Covered": {
    hi: "शामिल ज़िले",
    nagpuri: "शामिल जिला मन",
    santali: "ᱥᱮᱞᱮᱫ ᱡᱤᱞᱟᱹ"
  },
  "Searchable Public Directory of Challenges": {
    hi: "चुनौतियों की सार्वजनिक खोज योग्य निर्देशिका",
    nagpuri: "सब समस्या मनक खोजल सूची",
    santali: "ᱥᱮᱸᱫᱽᱨᱟ ᱞᱟᱹᱜᱤᱫ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱛᱟᱹᱞᱠᱟᱹ"
  },
  "100% Cryptographically verified on state milestone audit ledger.": {
    hi: "राज्य मील का पत्थर ऑडिट बहीखाते पर 100% क्रिप्टोग्राफ़िक रूप से सत्यापित।",
    nagpuri: "राज्य कर पक्का रजिस्टर में 100% जांचल।",
    santali: "ᱯᱚᱱᱚᱛ ᱚᱰᱤᱴ ᱨᱮ ᱑᱐᱐% ᱯᱩᱥᱴᱟᱹᱣ ᱟᱠᱟᱱᱟ᱾"
  },

  // --- Public Tracker ---
  "Public Problem & Milestone Tracker": {
    hi: "सार्वजनिक समस्या एवं चरणबद्ध प्रगति ट्रैकर",
    nagpuri: "जनता कर समस्या अउर काम कर जांच",
    santali: "ᱦᱚᱲ ᱠᱚᱣᱟᱜ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱯᱟᱸᱡᱟ ᱦᱚᱨ"
  },
  "Track status of any citizen challenge or university innovation across Jharkhand": {
    hi: "झारखंड भर में किसी भी नागरिक चुनौती या विश्वविद्यालय नवाचार की स्थिति देखें",
    nagpuri: "झारखंड भर कर कोनो नागरिक समस्या या कॉलेज प्रोजेक्ट कर हाल जांचू",
    santali: "ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱨᱮᱱᱟᱜ ᱡᱟᱦᱟᱸᱱᱟᱜ ᱮᱴᱠᱮᱴᱚᱬᱮ ᱨᱮᱱᱟᱜ ᱦᱟᱞᱚᱛ ᱯᱟᱸᱡᱟᱭ ᱢᱮ"
  },
  "Enter Ticket / Challenge ID (e.g. JSICP-2026-0041)": {
    hi: "टिकट / चुनौती आईडी दर्ज करें (जैसे JSICP-2026-0041)",
    nagpuri: "टिकट नंबर लिखू (जैसे JSICP-2026-0041)",
    santali: "ᱴᱤᱠᱤᱴ ᱱᱚᱢᱵᱚᱨ ᱚᱞ ᱢᱮ (e.g. JSICP-2026-0041)"
  },
  "Search Ticket": {
    hi: "टिकट खोजें",
    nagpuri: "टिकट खोजू",
    santali: "ᱴᱤᱠᱤᱴ ᱥᱮᱸᱫᱽᱨᱟ"
  },
  "Progress Status": {
    hi: "प्रगति स्थिति",
    nagpuri: "काम कर हाल",
    santali: "ᱠᱟᱹᱢᱤ ᱞᱟᱦᱟ ᱦᱟᱞᱚᱛ"
  },

  // --- 5-Stage Project Lifecycle ---
  "5-Stage Project Lifecycle & Audit Trail": {
    hi: "5-चरणीय परियोजना जीवनचक्र एवं ऑडिट ट्रेल",
    nagpuri: "5 पड़ाव योजना चक्र अउर जांच खाता",
    santali: "᱕ ᱛᱷᱚᱠ ᱯᱨᱚᱡᱮᱠᱴ ᱦᱟᱞᱚᱛ ᱟᱨ ᱚᱰᱤᱴ"
  },
  "Select Active Innovation Project:": {
    hi: "सक्रिय नवाचार परियोजना चुनें:",
    nagpuri: "चालू नवाचार योजना छांटू:",
    santali: "ᱠᱟᱹᱢᱤ ᱪᱟᱞᱟᱜ ᱠᱟᱱ ᱯᱨᱚᱡᱮᱠᱴ ᱵᱟᱪᱷᱟᱣ:"
  },

  // --- Footer ---
  "Participating Institutions": {
    hi: "सहभागी संस्थान",
    nagpuri: "शामिल कॉलेज अउर यूनिवर्सिटी",
    santali: "ᱥᱮᱞᱮᱫ ᱵᱤᱨᱫᱟᱹᱜᱟᱲ ᱠᱚ"
  },
  "Mandates & Compliance": {
    hi: "अधिदेश एवं अनुपालन",
    nagpuri: "सरकारी नियम अउर कानून",
    santali: "ᱟᱹᱨᱤ ᱟᱨ ᱢᱟᱱᱟᱣ"
  },
  "Helpdesk & Nodal Contact": {
    hi: "सहायता केंद्र एवं नोडल संपर्क",
    nagpuri: "मदद केंद्र अउर संपर्क",
    santali: "ᱜᱚᱲᱚ ᱰᱮᱥᱠ ᱟᱨ ᱡᱚᱯᱚᱲᱟᱣ"
  },
  "All rights reserved. Designed for Smart India Hackathon (SIH 2026).": {
    hi: "सर्वाधिकार सुरक्षित। स्मार्ट इंडिया हैकाथॉन (SIH 2026) के लिए विकसित।",
    nagpuri: "सब अधिकार सुरक्षित। स्मार्ट इंडिया हैकाथॉन (SIH 2026) ले बनावल।",
    santali: "ᱡᱚᱛᱚ ᱟᱹᱭᱫᱟᱹᱨᱤ ᱫᱚᱦᱚ ᱮᱱᱟ᱾ Smart India Hackathon (SIH 2026) ᱞᱟᱹᱜᱤᱫ ᱵᱮᱱᱟᱣ ᱟᱠᱟᱱᱟ᱾"
  },

  // --- Categories & Challenges ---
  "Water Resources & Sanitation": {
    hi: "जल संसाधन एवं स्वच्छता",
    nagpuri: "पानी संसाधन अउर सफाई",
    santali: "ᱫᱟᱜ ᱟᱨ ᱥᱟᱯᱷᱟ"
  },
  "Agriculture & Post-Harvest": {
    hi: "कृषि एवं फसल कटाई उपरांत",
    nagpuri: "खेती-बारी अउर फसल",
    santali: "ᱪᱟᱥ-ᱵᱟᱥ ᱟᱨ ᱟᱨᱡᱟᱣ"
  },
  "Mining Safety & Coal Fire Hazard": {
    hi: "खनन सुरक्षा एवं कोयला आग जोखिम",
    nagpuri: "खदान सुरक्षा अउर कोयला आगी खतरा",
    santali: "ᱠᱷᱟᱫᱟᱱ ᱨᱩᱠᱷᱤᱭᱟᱹ ᱟᱨ ᱠᱚᱭᱞᱟ ᱥᱮᱸᱜᱮᱞ"
  },
  "Rural Energy & Solar IoT": {
    hi: "ग्रामीण ऊर्जा एवं सौर आईओटी",
    nagpuri: "गाँव कर बिजली अउर सौर ऊर्जा",
    santali: "ᱟᱹᱛᱩ ᱵᱤᱡᱽᱞᱤ ᱟᱨ ᱥᱤᱸᱜᱤ ᱪᱟᱸᱫᱚ ᱫᱟᱲᱮ"
  },
  "Healthcare & Tele-Medicine": {
    hi: "स्वास्थ्य सेवा एवं टेली-मेडिसिन",
    nagpuri: "दवाई-इलाज अउर टेली-मेडिसिन",
    santali: "ᱦᱚᱲᱢᱚ ᱥᱟᱶᱟᱨ ᱟᱨ ᱨᱟᱱ-ᱢᱩᱨᱜᱟᱹᱱ"
  },
  "Roads & Infrastructure": {
    hi: "सड़कें एवं बुनियादी ढांचा",
    nagpuri: "सड़क अउर बुनियादी ढांचा",
    santali: "ᱦᱚᱨ ᱰᱟᱦᱟᱨ ᱟᱨ ᱵᱮᱱᱟᱣ"
  },

  // --- Form Elements & Modals ---
  "Problem Title": {
    hi: "समस्या का शीर्षक",
    nagpuri: "समस्या कर नाम",
    santali: "ᱮᱴᱠᱮᱴᱚᱬᱮ ᱧᱩᱛᱩᱢ"
  },
  "Detailed Description": {
    hi: "विस्तृत विवरण",
    nagpuri: "पूरा हाल-चाल",
    santali: "ᱵᱤᱥᱛᱟᱹᱨ ᱛᱮ ᱚᱞ"
  },
  "Gram Panchayat / Ward": {
    hi: "ग्राम पंचायत / वार्ड",
    nagpuri: "ग्राम पंचायत / वार्ड",
    santali: "ᱟᱹᱛᱩ ᱯᱚᱧᱪᱟᱭᱮᱛ / ᱣᱟᱨᱰ"
  },
  "Village / Locality": {
    hi: "गाँव / मोहल्ला",
    nagpuri: "गाँव / टोला",
    santali: "ᱟᱹᱛᱩ / ᱴᱚᱞᱟ"
  },
  "Detect GPS Coordinates": {
    hi: "जीपीएस निर्देशांक प्राप्त करें",
    nagpuri: "GPS जगह नापूं",
    santali: "GPS ᱴᱷᱟᱶ ᱧᱟᱢ"
  },
  "Record Voice Description": {
    hi: "आवाज में विवरण रिकॉर्ड करें",
    nagpuri: "आवाज से बोल के दर्ज करू",
    santali: "ᱨᱚᱲ ᱛᱮ ᱨᱮᱠᱳᱨᱰ ᱢᱮ"
  },
  "Auto-Transcribe & Translate": {
    hi: "स्वतः प्रतिलेखन एवं अनुवाद",
    nagpuri: "अपने-आप लिखाव अउर अनुवाद",
    santali: "ᱟᱡ ᱛᱮ ᱚᱞ ᱟᱨ ᱛᱚᱨᱡᱚᱢᱟ"
  },
  "Submit Challenge to State Portal": {
    hi: "राज्य पोर्टल पर चुनौती दर्ज करें",
    nagpuri: "राज्य चौपाल में चुनौती जमा करू",
    santali: "ᱯᱚᱱᱚᱛ ᱯᱳᱨᱴᱟᱞ ᱨᱮ ᱥᱟᱵᱢᱤᱴ"
  },
  "Voice Recording in Progress": {
    hi: "आवाज रिकॉर्डिंग जारी है...",
    nagpuri: "आवाज रिकॉर्ड होवत आहे...",
    santali: "ᱨᱚᱲ ᱨᱮᱠᱳᱨᱰᱤᱝ ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟ..."
  },
  "Speak clearly into your microphone in Hindi, Nagpuri, Santali or English.": {
    hi: "अपने माइक्रोफ़ोन में हिन्दी, नागपुरी, संताली या अंग्रेज़ी में स्पष्ट बोलें।",
    nagpuri: "अपन माइक में नागपुरी, हिन्दी, संताली या अंग्रेजी में साफ बोलू।",
    santali: "ᱢᱟᱭᱤᱠ ᱨᱮ ᱥᱟᱱᱛᱟᱲᱤ, ᱦᱤᱱᱫᱤ, ᱱᱟᱜᱽᱯᱩᱨᱤ ᱥᱮ ᱤᱝᱞᱤᱥ ᱛᱮ ᱥᱟᱯᱷᱟ ᱨᱚᱲ ᱢᱮ᱾"
  },
  "Stop & Transcribe": {
    hi: "रोकें और प्रतिलेखित करें",
    nagpuri: "रोकू अउर लिखावा",
    santali: "ᱛᱷᱟᱢ ᱟᱨ ᱚᱞ"
  },
  "Rate Resolution Quality": {
    hi: "समाधान की गुणवत्ता का मूल्यांकन करें",
    nagpuri: "समाधान के नंबर / रेटिंग देऊ",
    santali: "ᱥᱚᱞᱦᱮ ᱨᱮᱱᱟᱜ ᱢᱟᱹᱱ ᱮᱢ"
  },
  "Submit Citizen Rating": {
    hi: "नागरिक रेटिंग जमा करें",
    nagpuri: "नागरिक रेटिंग जमा करू",
    santali: "ᱨᱮᱴᱤᱝ ᱥᱟᱵᱢᱤᱴ ᱢᱮ"
  },

  // --- Auth / Login ---
  "Select Authenticated Role to Enter Demo Workspace:": {
    hi: "डेमो कार्यक्षेत्र में प्रवेश के लिए प्रमाणित भूमिका चुनें:",
    nagpuri: "चौपाल में घुसेक ले अपन पद / भूमिका छांटू:",
    santali: "ᱠᱟᱹᱢᱤ ᱴᱷᱟᱶ ᱨᱮ ᱵᱚᱞᱚᱱ ᱞᱟᱹᱜᱤᱫ ᱮᱱᱮᱢ ᱵᱟᱪᱷᱟᱣ ᱢᱮ:"
  },
  "Parichay SSO Gateway (NIC-Verified)": {
    hi: "परिचय एसएसओ गेटवे (एनआईसी द्वारा सत्यापित)",
    nagpuri: "परिचय SSO गेटवे (NIC जांचल)",
    santali: "Parichay SSO ᱫᱩᱣᱟᱹᱨ (NIC ᱯᱩᱥᱴᱟᱹᱣ)"
  },
  "Citizen / PRI Representative": {
    hi: "नागरिक / पंचायती राज प्रतिनिधि",
    nagpuri: "नागरिक / पंचायत प्रतिनिधि",
    santali: "ᱦᱚᱲ / ᱯᱚᱧᱪᱟᱭᱮᱛ ᱨᱟᱹᱥᱤᱭᱟᱹ"
  },
  "University Nodal Officer": {
    hi: "विश्वविद्यालय नोडल अधिकारी",
    nagpuri: "विश्वविद्यालय नोडल अफसर",
    santali: "ᱵᱤᱨᱫᱟᱹᱜᱟᱲ ᱱᱳᱰᱟᱞ ᱚᱯᱷᱤᱥᱟᱨ"
  },
  "Faculty R&D Mentor": {
    hi: "संकाय अनुसंधान संरक्षक",
    nagpuri: "फैकल्टी रिसर्च गुरुजी",
    santali: "ᱢᱟᱪᱮᱛ R&D ᱫᱤᱥᱟᱹ-ᱩᱫᱩᱜᱤᱡ"
  },
  "Student Engineering Cohort": {
    hi: "छात्र इंजीनियरिंग दल",
    nagpuri: "इंजीनियरिंग विद्यार्थी दल",
    santali: "ᱤᱧᱡᱤᱱᱤᱭᱟᱹᱨᱤᱝ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱫᱚᱞ"
  },
  "Corporate CSR Director": {
    hi: "कॉर्पोरेट सीएसआर निदेशक",
    nagpuri: "कंपनी CSR निदेशक",
    santali: "ᱠᱚᱨᱯᱳᱨᱮᱴ CSR ᱰᱟᱭᱨᱮᱠᱴᱚᱨ"
  },
  "State Admin / District Magistrate": {
    hi: "राज्य प्रशासक / ज़िलाधिकारी",
    nagpuri: "राज्य प्रशासक / डीसी साहेब",
    santali: "ᱯᱚᱱᱚᱛ ᱥᱟᱥᱚᱱᱤᱭᱟᱹ / DM"
  },

  // --- AI Chatbot ---
  "Ask a question or enter Ticket ID...": {
    hi: "प्रश्न पूछें या टिकट आईडी दर्ज करें...",
    nagpuri: "सवाल पूछू या टिकट नंबर लिखू...",
    santali: "ᱠᱩᱠᱞᱤ ᱠᱩᱞᱤ ᱢᱮ ᱥᱮ ᱴᱤᱠᱤᱴ ID ᱚᱞ ᱢᱮ..."
  },
  "AI Sahayak": {
    hi: "एआई सहायक",
    nagpuri: "AI संगी / सहायक",
    santali: "AI ᱜᱚᱲᱚᱭᱤᱡ"
  },
  "Track #0841": {
    hi: "ट्रैक #0841",
    nagpuri: "जांचू #0841",
    santali: "ᱯᱟᱸᱡᱟ #0841"
  },
  "How to submit?": {
    hi: "दर्ज कैसे करें?",
    nagpuri: "कइसन जमा करल जाय?",
    santali: "ᱪᱮᱫ ᱞᱮᱠᱟ ᱥᱟᱵᱢᱤᱴᱟ?"
  },
   "CSR Funding": {
    hi: "सीएसआर अनुदान",
    nagpuri: "CSR पैसा / अनुदान",
    santali: "CSR ᱜᱚᱲᱚ ᱴᱟᱠᱟ"
  },
  // --- Jharkhand At A Glance & Leadership Section ---
  "JHARKHAND AT A GLANCE": {
    hi: "झारखंड एक नज़र में (JHARKHAND AT A GLANCE)",
    nagpuri: "झारखंड एक नजर में",
    santali: "ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱢᱤᱫ ᱱᱚᱡᱚᱨ ᱨᱮ"
  },
  "About Jharkhand": {
    hi: "झारखंड के बारे में",
    nagpuri: "झारखंड कर बारे में",
    santali: "ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱵᱟᱵᱚᱛ"
  },
  "State": {
    hi: "राज्य",
    nagpuri: "राइज",
    santali: "ᱯᱚᱱᱚᱛ (State)"
  },
  "Governor": {
    hi: "राज्यपाल (Governor)",
    nagpuri: "राज्यपाल",
    santali: "ᱨᱟᱡᱽᱭᱚᱯᱟᱞ (Governor)"
  },
  "Chief Minister": {
    hi: "मुख्यमंत्री (Chief Minister)",
    nagpuri: "मुख्यमंत्री",
    santali: "ᱥᱤᱨᱟᱹ ᱢᱚᱱᱛᱨᱤ (CM)"
  },
  "Chief Secretary": {
    hi: "मुख्य सचिव (Chief Secretary)",
    nagpuri: "मुख्य सचिव",
    santali: "ᱢᱩᱬᱩᱛ ᱥᱚᱪᱤᱵᱽ"
  },
  "Shri Santosh Kumar Gangwar": {
    hi: "श्री संतोष कुमार गंगवार",
    nagpuri: "श्री संतोष कुमार गंगवार",
    santali: "ᱥᱨᱤ ᱥᱚᱱᱛᱳᱥ ᱠᱩᱢᱟᱨ ᱜᱚᱝᱜᱽᱣᱟᱨ"
  },
  "Shri Hemant Soren": {
    hi: "श्री हेमन्त सोरेन",
    nagpuri: "श्री हेमन्त सोरेन",
    santali: "ᱥᱨᱤ ᱦᱮᱢᱚᱱᱛ ᱥᱚᱨᱮᱱ"
  },
  "Shri Avinash Kumar": {
    hi: "श्री अविनाश कुमार",
    nagpuri: "श्री अविनाश कुमार",
    santali: "ᱥᱨᱤ ᱟᱵᱷᱤᱱᱟᱥ ᱠᱩᱢᱟᱨ"
  },
  "Area : 79,714 km²": {
    hi: "क्षेत्रफल : 79,714 वर्ग किमी",
    nagpuri: "क्षेत्रफल : 79,714 वर्ग किमी",
    santali: "ᱡᱟᱭᱜᱟ : 79,714 km²"
  },
  "Capital City : Ranchi": {
    hi: "राजधानी : राँची",
    nagpuri: "राजधानी : राँची",
    santali: "ᱨᱟᱡᱽᱜᱟᱲ : ᱨᱟᱺᱪᱤ"
  },
  "District : 24": {
    hi: "ज़िले : 24",
    nagpuri: "जिला मन : 24",
    santali: "ᱡᱤᱞᱟᱹ : 24"
  },
  "Population : 3.3 Crores": {
    hi: "जनसंख्या : 3.3 करोड़",
    nagpuri: "आबादी : 3.3 करोड़",
    santali: "ᱦᱚᱲ ᱮᱞ : 3.3 ᱠᱳᱨᱳᱰ"
  },
  "Download Official Photo": {
    hi: "आधिकारिक फोटो डाउनलोड करें",
    nagpuri: "सरकारी फोटो डाउनलोड करू",
    santali: "ᱚᱯᱷᱤᱥᱤᱭᱟᱞ ᱯᱷᱳᱴᱳ ᱰᱟᱣᱩᱱᱞᱳᱰ"
  },
  "Profile": {
    hi: "प्रोफ़ाइल",
    nagpuri: "परिचय / प्रोफाइल",
    santali: "ᱩᱯᱨᱩᱢ (Profile)"
  },
  "Official Portal": {
    hi: "आधिकारिक पोर्टल",
    nagpuri: "सरकारी पोर्टल",
    santali: "ᱥᱚᱨᱠᱟᱨᱤ ᱯᱳᱨᱴᱟᱞ"
  },
  "Official website of the State": {
    hi: "राज्य का आधिकारिक वेब पोर्टल",
    nagpuri: "राइज कर सरकारी वेब पोर्टल",
    santali: "ᱯᱚᱱᱚᱛ ᱨᱮᱱᱟᱜ ᱥᱚᱨᱠᱟᱨᱤ ᱣᱮᱵᱽᱥᱟᱭᱤᱴ"
  },
  "Citizen & PRI Innovation Portal": {
    hi: "नागरिक एवं पंचायती राज नवाचार पोर्टल",
    nagpuri: "नागरिक अउर पंचायत नवाचार चौपाल",
    santali: "ᱱᱟᱜᱟᱨᱤᱠ ᱟᱨ ᱯᱚᱧᱪᱟᱭᱮᱛ ᱤᱱᱳᱵᱷᱮᱥᱚᱱ ᱯᱳᱨᱴᱟᱞ"
  },
  "Government of Jharkhand": {
    hi: "झारखण्ड सरकार",
    nagpuri: "झारखण्ड सरकार",
    santali: "ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱥᱚᱨᱠᱟᱨ"
  },
  "Department of Higher & Technical Education": {
    hi: "उच्च एवं तकनीकी शिक्षा विभाग",
    nagpuri: "उच्च अउर तकनीकी शिक्षा विभाग",
    santali: "ᱪᱮᱛᱟᱱ ᱟᱨ ᱴᱮᱠᱱᱤᱠᱟᱞ ᱥᱮᱪᱮᱫ ᱵᱤᱵᱷᱟᱜᱽ"
  },
  "Dept. of Higher & Technical Education": {
    hi: "उच्च एवं तकनीकी शिक्षा विभाग",
    nagpuri: "उच्च अउर तकनीकी शिक्षा विभाग",
    santali: "ᱪᱮᱛᱟᱱ ᱟᱨ ᱴᱮᱠᱱᱤᱠᱟᱞ ᱥᱮᱪᱮᱫ ᱵᱤᱵᱷᱟᱜᱽ"
  },
  "Hon'ble Governor of Jharkhand": {
    hi: "माननीय राज्यपाल, झारखण्ड",
    nagpuri: "माननीय राज्यपाल, झारखण्ड",
    santali: "ᱢᱟᱹᱱᱟᱱ ᱨᱟᱡᱽᱭᱚᱯᱟᱞ, ᱡᱷᱟᱨᱠᱷᱚᱸᱰ"
  },
  "Hon'ble Chief Minister of Jharkhand": {
    hi: "माननीय मुख्यमंत्री, झारखण्ड",
    nagpuri: "माननीय मुख्यमंत्री, झारखण्ड",
    santali: "ᱢᱟᱹᱱᱟᱱ ᱥᱤᱨᱟᱹ ᱢᱚᱱᱛᱨᱤ, ᱡᱷᱟᱨᱠᱷᱚᱸᱰ"
  },
  "Chief Secretary, Government of Jharkhand": {
    hi: "मुख्य सचिव, झारखण्ड सरकार",
    nagpuri: "मुख्य सचिव, झारखण्ड सरकार",
    santali: "ᱢᱩᱬᱩᱛ ᱥᱚᱪᱤᱵᱽ, ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱥᱚᱨᱠᱟᱨ"
  },
  "Hon'ble Governor": {
    hi: "माननीय राज्यपाल",
    nagpuri: "माननीय राज्यपाल",
    santali: "ᱢᱟᱹᱱᱟᱱ ᱨᱟᱡᱽᱭᱚᱯᱟᱞ"
  },
  "Hon'ble Chief Minister": {
    hi: "माननीय मुख्यमंत्री",
    nagpuri: "माननीय मुख्यमंत्री",
    santali: "ᱢᱟᱹᱱᱟᱱ ᱥᱤᱨᱟᱹ ᱢᱚᱱᱛᱨᱤ"
  },
  "Area": {
    hi: "क्षेत्रफल",
    nagpuri: "क्षेत्रफल",
    santali: "ᱡᱟᱭᱜᱟ"
  },
  "Capital": {
    hi: "राजधानी",
    nagpuri: "राजधानी",
    santali: "ᱨᱟᱡᱽᱜᱟᱲ"
  },
  "Districts": {
    hi: "ज़िले",
    nagpuri: "जिला मन",
    santali: "ᱡᱤᱞᱟᱹ ᱠᱚ"
  },
  "Population": {
    hi: "जनसंख्या",
    nagpuri: "आबादी",
    santali: "ᱦᱚᱲ ᱮᱞ"
  },
  "Census 2011": {
    hi: "जनगणना 2011",
    nagpuri: "जनगणना 2011",
    santali: "ᱦᱚᱲ ᱞᱮᱠᱷᱟ 2011"
  },
  "Ranchi": {
    hi: "राँची",
    nagpuri: "राँची",
    santali: "ᱨᱟᱺᱪᱤ"
  },
  "79,714 sq km": {
    hi: "79,714 वर्ग किमी",
    nagpuri: "79,714 वर्ग किमी",
    santali: "79,714 sq km"
  },
  "3.3 Crores": {
    hi: "3.3 करोड़",
    nagpuri: "3.3 करोड़",
    santali: "3.3 ᱠᱳᱨᱳᱰ"
  },
  "Jharkhand is an eastern Indian state. It is famous for its waterfalls, the elegant Jain temples of Parasnath Hill, and the elephants and tigers of Betla National Park.": {
    hi: "झारखण्ड पूर्वी भारत का एक राज्य है। यह अपने जलप्रपातों, पारसनाथ पहाड़ी के सुरुचिपूर्ण जैन मंदिरों और बेतला राष्ट्रीय उद्यान के हाथियों और बाघों के लिए प्रसिद्ध है।",
    nagpuri: "झारखण्ड पूरब भारत कर एगो राइज हेके। ई आपन जलप्रपात, पारसनाथ पहाड़ कर जैन मंदिर अउर बेतला पार्क कर बाघ-हाथी मन ले मशहूर हेके।",
    santali: "ᱡᱷᱟᱨᱠᱷᱚᱸᱰ ᱫᱚ ᱥᱟᱢᱟᱝ ᱵᱷᱟᱨᱚᱛ ᱨᱮᱱᱟᱜ ᱢᱤᱫ ᱯᱚᱱᱚᱛ ᱠᱟᱱᱟ᱾ ᱱᱚᱣᱟ ᱫᱚ ᱡᱷᱟᱨᱱᱟ, ᱯᱟᱨᱚᱥᱱᱟᱛᱷ ᱵᱩᱨᱩ ᱨᱮᱱᱟᱜ ᱡᱚᱭᱱᱚ ᱢᱩᱸᱫᱽᱨᱤ ᱟᱨ ᱵᱮᱛᱞᱟ ᱡᱟᱹᱛᱤᱭᱟᱹᱨᱤ ᱵᱟᱜᱟᱱ ᱨᱮᱱᱟᱜ ᱛᱟᱹᱨᱩᱵ ᱟᱨ ᱦᱟᱹᱛᱤ ᱞᱟᱹᱜᱤᱫ ᱧᱩᱛᱩᱢᱟᱱ ᱠᱟᱱᱟ᱾"
  },
  "Sign In / Parichay SSO": {
    hi: "लॉग इन / परिचय एसएसओ",
    nagpuri: "लागिन / परिचय SSO",
    santali: "ᱞᱟᱜᱤᱱ / ᱯᱚᱨᱤᱪᱚᱭ SSO"
  },
  "Track Complaint": {
    hi: "शिकायत ट्रैक करें",
    nagpuri: "शिकायत जांचू",
    santali: "ᱮᱴᱠᱮᱴᱚᱬᱮ ᱯᱟᱸᱡᱟ"
  }
};
