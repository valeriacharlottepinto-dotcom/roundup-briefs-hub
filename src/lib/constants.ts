export type Locale = "en" | "de";

export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "https://roundup-briefs.onrender.com";

export interface Article {
  id: number;
  title: string;
  link: string;
  summary: string;
  source: string;
  country: string;
  category: string;
  tags: string;
  topics: string;
  scraped_at: string;
  published_at?: string;
  is_paywalled?: boolean;
  locale?: string;
}

export interface Stats {
  total: number;
  lgbtqia_plus: number;
  women: number;
  last_scraped: string;
}

export const TOPICS = [
  { label: "All Topics",                              emoji: "✨" },
  { label: "Anti-Rights & Backlash Movements",        emoji: "🔥" },
  { label: "Bodily Autonomy & Reproductive Justice",  emoji: "🧬" },
  { label: "Violence, Safety & Criminal Justice",     emoji: "🛡️" },
  { label: "State Power, Law & Governance",           emoji: "🏛️" },
  { label: "Economic & Labour Justice",               emoji: "💰" },
  { label: "Migration, Borders & Citizenship",        emoji: "🌍" },
  { label: "Climate & Environmental Justice",         emoji: "🌱" },
  { label: "Technology & Digital Power",              emoji: "💻" },
  { label: "Culture, Media & Narrative Power",        emoji: "🎭" },
] as const;

export const TIME_RANGES = [
  { label: "Today", value: "today" },
] as const;

export const TOPIC_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Anti-Rights & Backlash Movements":       { bg: "#FBE9E7", text: "#BF360C", border: "#FFAB91" },
  "Bodily Autonomy & Reproductive Justice": { bg: "#FFE5EF", text: "#C8003C", border: "#F0ADC8" },
  "Violence, Safety & Criminal Justice":    { bg: "#FFEBEE", text: "#C62828", border: "#EF9A9A" },
  "State Power, Law & Governance":          { bg: "#E3F2FD", text: "#0D47A1", border: "#90CAF9" },
  "Economic & Labour Justice":              { bg: "#FFF3E0", text: "#E65100", border: "#FFCC80" },
  "Migration, Borders & Citizenship":       { bg: "#E0F7FA", text: "#006064", border: "#80DEEA" },
  "Climate & Environmental Justice":        { bg: "#E8F5E9", text: "#1B5E20", border: "#A5D6A7" },
  "Technology & Digital Power":             { bg: "#EDE7F6", text: "#4A148C", border: "#B39DDB" },
  "Culture, Media & Narrative Power":       { bg: "#FFF8E1", text: "#F57F17", border: "#FFD54F" },
};

export const LGBTQIA_SOURCES = new Set([
  "Gay Times", "PinkNews", "Out Magazine", "LGBTQ Nation", "Advocate",
  "Autostraddle", "Them", "Queerty", "Xtra Magazine",
]);

export const FEMINIST_SOURCES = new Set([
  "Ms. Magazine", "Feministing", "Jezebel", "Refinery29 Feminism",
  "The Guardian Women", "The Funambulist",
]);

export function getSourceBorderColor(source: string): string {
  if (LGBTQIA_SOURCES.has(source)) return "#4A1FA8";
  if (FEMINIST_SOURCES.has(source)) return "#D4006A";
  return "#C8C4BA";
}

// ── Source registries per locale ─────────────────────────────────────────────

export const EN_SOURCES: string[] = [
  "ABC News", "Accuracy in Media", "Advocate", "Al Jazeera", "AlterNet",
  "Associated Press", "Autostraddle", "BBC News", "BBC News World",
  "CBC News World", "CNN World", "Democracy Now", "Fair Observer",
  "Feministing", "Financial Times", "FSRN", "Gay Times", "Global Voices",
  "HuffPost", "IPS News Agency", "Jezebel", "Jewish Voice for Peace",
  "Le Monde", "Le Monde Diplomatique", "LGBTQ Nation", "Media Matters",
  "Ms. Magazine", "New York Times", "NPR News", "Out Magazine", "PinkNews",
  "Queerty", "Refinery29 Feminism", "Reveal News", "Reuters", "Reuters World",
  "SBS News World", "The Conversation", "The Funambulist", "The Guardian",
  "The Guardian Women", "The Independent", "The Progressive", "Them",
  "Washington Post", "Xtra Magazine",
];

// German sources — keyword-filtered unless marked specialist
export const DE_SOURCES: string[] = [
  // General / quality news (keyword-filtered)
  "tagesschau.de", "Der Spiegel", "Die Zeit", "Süddeutsche Zeitung",
  "taz", "Deutsche Welle Deutsch", "Deutschlandfunk",
  // Investigative / progressive (all articles included)
  "CORRECTIV", "netzpolitik.org",
  // DACH expansion (keyword-filtered)
  "Der Standard", "ORF.at",
  // LGBTQIA+ specialist (all articles included)
  "queer.de",
  // Feminist specialist (all articles included)
  "Missy Magazine",
];

export const SOURCES_BY_LOCALE: Record<Locale, string[]> = {
  en: EN_SOURCES,
  de: DE_SOURCES,
};

// ── Topic slug ↔ label map ───────────────────────────────────────────────────
// Slugs are the stable DB identifiers. Labels are locale-specific display text.
export const TOPIC_SLUGS: Record<string, { en: string; de: string; emoji: string }> = {
  backlash:         { en: "Anti-Rights & Backlash Movements",       de: "Anti-Rechte & Backlash-Bewegungen",         emoji: "🔥" },
  bodily_autonomy:  { en: "Bodily Autonomy & Reproductive Justice", de: "Körperliche Selbstbestimmung",               emoji: "🧬" },
  violence:         { en: "Violence, Safety & Criminal Justice",    de: "Gewalt, Sicherheit & Strafrecht",            emoji: "🛡️" },
  state_power:      { en: "State Power, Law & Governance",          de: "Staatsmacht, Recht & Politik",               emoji: "🏛️" },
  economic_justice: { en: "Economic & Labour Justice",              de: "Wirtschafts- & Arbeitsgerechtigkeit",        emoji: "💰" },
  migration:        { en: "Migration, Borders & Citizenship",       de: "Migration, Grenzen & Staatsbürgerschaft",    emoji: "🌍" },
  climate:          { en: "Climate & Environmental Justice",        de: "Klima- & Umweltgerechtigkeit",               emoji: "🌱" },
  technology:       { en: "Technology & Digital Power",             de: "Technologie & digitale Macht",               emoji: "💻" },
  culture:          { en: "Culture, Media & Narrative Power",       de: "Kultur, Medien & Narrative Macht",           emoji: "🎭" },
};
