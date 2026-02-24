export type Locale = "en" | "de";

export interface Translations {
  tagline: string;
  about: string;
  back: string;
  allTopics: string;
  today: string;
  dateTo: string;
  searchPlaceholder: string;
  allSources: string;
  sources: string;
  clearSelection: string;
  paywallAll: string;
  paywallFree: string;
  paywallOnly: string;
  clearAll: string;
  articles: string;
  article: string;
  noArticles: string;
  clearFilters: string;
  readFullArticle: string;
  updatedAt: string;
  paywallBadge: string;
  prevPage: string;
  nextPage: string;
  pageOf: string;
  serverWaking: string;
  seeAll: string;
  topics: Record<string, string>;
}

export const TRANSLATIONS: Record<Locale, Translations> = {
  en: {
    tagline: "browse your news on your terms.",
    about: "about",
    back: "← back",
    allTopics: "All Topics",
    today: "Today",
    dateTo: "to",
    searchPlaceholder: "Search headlines…",
    allSources: "All Sources",
    sources: "sources",
    clearSelection: "Clear selection",
    paywallAll: "All",
    paywallFree: "🔓 Free",
    paywallOnly: "🔒 Paywalled",
    clearAll: "Clear all",
    articles: "articles",
    article: "article",
    noArticles: "No articles match your filters.",
    clearFilters: "Clear filters",
    readFullArticle: "Read full article →",
    updatedAt: "Updated",
    paywallBadge: "🔒",
    prevPage: "← Previous",
    nextPage: "Next →",
    pageOf: "of",
    serverWaking: "Couldn't load articles. The server may be waking up — try refreshing.",
    seeAll: "See all",
    topics: {
      "All Topics":            "All Topics",
      "Reproductive Rights":   "Reproductive Rights",
      "Gender Pay Gap":        "Gender Pay Gap",
      "LGBTQIA+":              "LGBTQIA+",
      "Immigration":           "Immigration",
      "Human Rights":          "Human Rights",
      "Health & Medicine":     "Health & Medicine",
      "Law & Policy":          "Law & Policy",
      "Politics & Government": "Politics & Government",
      "Culture & Media":       "Culture & Media",
      "Sports":                "Sports",
      "Violence & Safety":     "Violence & Safety",
      "Workplace & Economics": "Workplace & Economics",
    },
  },
  de: {
    tagline: "deine nachrichten, deine bedingungen.",
    about: "über uns",
    back: "← zurück",
    allTopics: "Alle Themen",
    today: "Heute",
    dateTo: "bis",
    searchPlaceholder: "Schlagzeilen suchen…",
    allSources: "Alle Quellen",
    sources: "Quellen",
    clearSelection: "Auswahl löschen",
    paywallAll: "Alle",
    paywallFree: "🔓 Kostenlos",
    paywallOnly: "🔒 Paywall",
    clearAll: "Alles löschen",
    articles: "Artikel",
    article: "Artikel",
    noArticles: "Keine Artikel entsprechen deinen Filtern.",
    clearFilters: "Filter löschen",
    readFullArticle: "Vollständigen Artikel lesen →",
    updatedAt: "Aktualisiert",
    paywallBadge: "🔒",
    prevPage: "← Zurück",
    nextPage: "Weiter →",
    pageOf: "von",
    serverWaking: "Artikel konnten nicht geladen werden. Der Server startet möglicherweise — bitte neu laden.",
    seeAll: "Alle anzeigen",
    topics: {
      "All Topics":            "Alle Themen",
      "Reproductive Rights":   "Reproduktive Rechte",
      "Gender Pay Gap":        "Gender Pay Gap",
      "LGBTQIA+":              "LGBTQIA+",
      "Immigration":           "Migration",
      "Human Rights":          "Menschenrechte",
      "Health & Medicine":     "Gesundheit & Medizin",
      "Law & Policy":          "Recht & Justiz",
      "Politics & Government": "Politik & Regierung",
      "Culture & Media":       "Kultur & Medien",
      "Sports":                "Sport",
      "Violence & Safety":     "Gewalt & Sicherheit",
      "Workplace & Economics": "Arbeit & Wirtschaft",
    },
  },
};
