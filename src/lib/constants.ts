export const API_BASE = "https://roundup-briefs.onrender.com";
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
}
export interface Stats {
  total: number;
  lgbtqia_plus: number;
  women: number;
  last_scraped: string;
}
export const TOPICS = [
  { label: "All Topics", emoji: "✨" },
  { label: "Reproductive Rights", emoji: "🩺" },
  { label: "Gender Pay Gap", emoji: "💰" },
  { label: "LGBTQIA+", emoji: "🏳️‍🌈" },
  { label: "Immigration", emoji: "🌍" },
  { label: "Human Rights", emoji: "⚖️" },
  { label: "Health & Medicine", emoji: "🏥" },
  { label: "Law & Policy", emoji: "📜" },
  { label: "Politics & Government", emoji: "🏛️" },
  { label: "Culture & Media", emoji: "🎭" },
  { label: "Sports", emoji: "⚽" },
  { label: "Violence & Safety", emoji: "🛡️" },
  { label: "Workplace & Economics", emoji: "💼" },
] as const;
export const TIME_RANGES = [
  { label: "Today", value: "today" },
] as const;
export const TOPIC_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Reproductive Rights": { bg: "#FFE5EF", text: "#C8003C", border: "#F0ADC8" },
  "Gender Pay Gap":      { bg: "#FFF3E0", text: "#E65100", border: "#FFCC80" },
  "LGBTQIA+":            { bg: "#EDE7F6", text: "#4A1FA8", border: "#B39DDB" },
  "Immigration":         { bg: "#E0F7FA", text: "#006064", border: "#80DEEA" },
  "Human Rights":        { bg: "#FFEBEE", text: "#B71C1C", border: "#EF9A9A" },
  "Health & Medicine":   { bg: "#E8F5E9", text: "#1B5E20", border: "#A5D6A7" },
  "Law & Policy":        { bg: "#F3E5F5", text: "#4A148C", border: "#CE93D8" },
  "Politics & Government": { bg: "#E3F2FD", text: "#0D47A1", border: "#90CAF9" },
  "Culture & Media":     { bg: "#FFF8E1", text: "#E65100", border: "#FFD54F" },
  "Sports":              { bg: "#E8F5E9", text: "#2E7D32", border: "#81C784" },
  "Violence & Safety":   { bg: "#FFEBEE", text: "#C62828", border: "#EF9A9A" },
  "Workplace & Economics": { bg: "#ECEFF1", text: "#37474F", border: "#B0BEC5" },
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
