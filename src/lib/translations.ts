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
  // Newsletter + profile
  newsletter: string;
  getNewsletter: string;
  subscribeSuccess: string;
  chooseTopics: string;
  chooseLanguage: string;
  profile: string;
  followedTopics: string;
  noFollowedTopics: string;
  editPreferences: string;
  signOut: string;
  languageEnOnly: string;
  languageDeOnly: string;
  languageBoth: string;
  subscribeButton: string;
  skipForNow: string;
  savePreferences: string;
  newsletterIntro: string;
  onboardingTitle: string;
  onboardingIntro: string;
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
      "All Topics":                              "All Topics",
      "Anti-Rights & Backlash Movements":        "Anti-Rights & Backlash",
      "Bodily Autonomy & Reproductive Justice":  "Bodily Autonomy & Reproductive Justice",
      "Violence, Safety & Criminal Justice":     "Violence, Safety & Justice",
      "State Power, Law & Governance":           "State Power, Law & Governance",
      "Economic & Labour Justice":               "Economic & Labour Justice",
      "Migration, Borders & Citizenship":        "Migration, Borders & Citizenship",
      "Climate & Environmental Justice":         "Climate & Environmental Justice",
      "Technology & Digital Power":              "Technology & Digital Power",
      "Culture, Media & Narrative Power":        "Culture, Media & Narrative",
    },
    newsletter: "Newsletter",
    getNewsletter: "Get the newsletter",
    subscribeSuccess: "You're in! We'll send you the weekly digest.",
    chooseTopics: "Choose topics",
    chooseLanguage: "Choose language",
    profile: "Profile",
    followedTopics: "Followed topics",
    noFollowedTopics: "No topics followed yet.",
    editPreferences: "Edit preferences",
    signOut: "Sign out",
    languageEnOnly: "English articles only",
    languageDeOnly: "German articles only",
    languageBoth: "Both languages",
    subscribeButton: "Subscribe",
    skipForNow: "Skip for now",
    savePreferences: "Save preferences",
    newsletterIntro: "Get a weekly digest of the stories that matter. No account needed.",
    onboardingTitle: "What topics do you follow?",
    onboardingIntro: "Personalise your experience by choosing the topics you care about.",
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
      "All Topics":                              "Alle Themen",
      "Anti-Rights & Backlash Movements":        "Anti-Rechte & Backlash",
      "Bodily Autonomy & Reproductive Justice":  "Körperliche Autonomie & Reproduktive Rechte",
      "Violence, Safety & Criminal Justice":     "Gewalt, Sicherheit & Strafjustiz",
      "State Power, Law & Governance":           "Staatsmacht, Recht & Regierung",
      "Economic & Labour Justice":               "Wirtschafts- & Arbeitsgerechtigkeit",
      "Migration, Borders & Citizenship":        "Migration, Grenzen & Staatsbürgerschaft",
      "Climate & Environmental Justice":         "Klima- & Umweltgerechtigkeit",
      "Technology & Digital Power":              "Technologie & Digitale Macht",
      "Culture, Media & Narrative Power":        "Kultur, Medien & Narrative Macht",
    },
    newsletter: "Newsletter",
    getNewsletter: "Newsletter abonnieren",
    subscribeSuccess: "Du bist dabei! Wir schicken dir den wöchentlichen Überblick.",
    chooseTopics: "Themen wählen",
    chooseLanguage: "Sprache wählen",
    profile: "Profil",
    followedTopics: "Gefolgtte Themen",
    noFollowedTopics: "Noch keine Themen gefolgt.",
    editPreferences: "Einstellungen bearbeiten",
    signOut: "Abmelden",
    languageEnOnly: "Nur englische Artikel",
    languageDeOnly: "Nur deutsche Artikel",
    languageBoth: "Beide Sprachen",
    subscribeButton: "Abonnieren",
    skipForNow: "Jetzt überspringen",
    savePreferences: "Einstellungen speichern",
    newsletterIntro: "Erhalte wöchentlich die wichtigsten Geschichten. Kein Konto nötig.",
    onboardingTitle: "Welche Themen interessieren dich?",
    onboardingIntro: "Personalisiere dein Erlebnis, indem du die Themen auswählst, die dir wichtig sind.",
  },
};
