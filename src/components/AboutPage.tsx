const KEYWORDS_TIER1 = {
  "Women & Feminism": [
    "feminist", "feminism", "women's rights", "gender pay gap", "equal pay",
    "pay equity", "wage gap", "pay disparity", "reproductive rights", "abortion",
    "pro-choice", "planned parenthood", "maternal health", "maternal mortality",
    "gynecolog", "obstetric", "sexism", "misogyny", "patriarchy", "period poverty",
    "menstrual", "menstruation", "women's health", "domestic violence",
    "gender violence", "gender-based violence", "sexual harassment", "sexual assault",
    "rape", "metoo", "me too", "#metoo", "femicide", "honour killing", "honor killing",
    "female genital mutilation", "fgm", "child marriage", "forced marriage",
    "women in leadership", "women in sport", "women in politics", "glass ceiling",
    "motherhood penalty", "parental leave", "maternity leave", "surrogacy",
    "reproductive justice", "bodily autonomy", "sex trafficking", "human trafficking",
    "body image", "eating disorder", "diet culture", "birth control", "contraception",
    "ivf", "fertility", "breastfeeding", "postpartum", "prenatal", "postnatal",
    "intersectional feminism", "ecofeminism", "women's march", "women's movement",
  ],
  "LGBTQIA+": [
    "lgbtq", "lgbtqia", "lesbian", "bisexual", "transgender", "nonbinary",
    "non-binary", "intersex", "asexual", "pansexual", "aromantic", "agender",
    "genderfluid", "pride parade", "same-sex", "gay marriage", "gay rights",
    "trans rights", "queer rights", "marriage equality", "homophobia", "transphobia",
    "biphobia", "queerphobia", "conversion therapy", "reparative therapy",
    "gender affirming", "gender affirming care", "puberty blocker", "gender identity",
    "gender expression", "gender dysphoria", "pronouns", "deadnaming", "misgendering",
    "two-spirit", "hijra", "third gender", "drag queen", "drag king",
    "section 28", "don't say gay", "bathroom bill", "lgbtq youth", "queer community",
  ],
  "Immigration & Asylum": [
    "asylum seeker", "undocumented", "unauthorized", "deportation", "deported",
    "border wall", "naturalization", "stateless", "detention center", "ice raid",
    "displacement", "displaced persons", "daca", "dreamers", "sanctuary",
    "resettlement", "xenophobia", "nativism", "anti-immigrant", "smuggling",
  ],
  "Human Rights": [
    "human rights", "civil rights", "civil liberties", "minority rights",
    "indigenous rights", "indigenous peoples", "racial justice", "racism",
    "anti-racism", "systemic racism", "genocide", "ethnic cleansing", "war crimes",
    "crimes against humanity", "apartheid", "reparations", "political prisoner",
    "prisoner of conscience", "disability rights", "ableism", "un human rights",
    "press freedom", "humanitarian crisis", "humanitarian aid",
  ],
};

const KEYWORDS_TIER2 = [
  "equality", "equity", "injustice", "protest", "activist", "activism",
  "advocacy", "discrimination", "prejudice", "bigotry", "oppression",
  "persecution", "humanitarian", "accountability", "health", "healthcare",
  "medical", "sport", "athlete", "olympic", "economy", "economic", "financial",
  "election", "parliament", "congress", "government", "policy", "violence",
  "assault", "abuse", "crime", "poverty", "welfare", "housing", "education",
  "school", "university", "culture", "film", "music", "art", "workplace",
  "employment", "career", "business",
];

const IDENTITY_CONTEXT = [
  "women", "woman", "girl", "girls", "female", "feminist", "feminism", "gender",
  "queer", "gay", "lesbian", "bisexual", "transgender", "trans", "lgbtq", "lgbt",
  "pride", "refugee", "asylum", "immigrant", "migrant", "indigenous", "aboriginal",
  "marginalised", "marginalized", "racial", "racism", "disability", "disabled",
  "minority",
];

const SOURCES = {
  "General news (keyword-filtered)": [
    "BBC News", "BBC News World", "The Guardian", "Reuters", "Reuters World",
    "Al Jazeera", "NPR News", "The Independent", "HuffPost", "New York Times 🔒",
    "Associated Press", "CNN World", "Washington Post 🔒", "Financial Times 🔒",
    "CBC News World", "ABC News", "SBS News World", "Le Monde", "IPS News Agency",
    "The Conversation", "Global Voices", "Fair Observer",
  ],
  "Women & Feminist publications (all articles included)": [
    "The Guardian Women", "Ms. Magazine", "Feministing", "Jezebel",
    "Refinery29 Feminism", "The Funambulist",
  ],
  "LGBTQIA+ publications (all articles included)": [
    "Gay Times", "PinkNews", "Out Magazine", "LGBTQ Nation", "Advocate",
    "Autostraddle", "Them", "Queerty", "Xtra Magazine",
  ],
  "Progressive & investigative (keyword-filtered)": [
    "AlterNet", "Democracy Now", "FSRN", "Jewish Voice for Peace",
    "Le Monde Diplomatique", "The Progressive", "Reveal News",
    "Accuracy in Media", "Media Matters",
  ],
};

const TOPICS_LIST = [
  { emoji: "🩺", label: "Reproductive Rights", note: "" },
  { emoji: "💰", label: "Gender Pay Gap", note: "" },
  { emoji: "🏳️‍🌈", label: "LGBTQIA+", note: "" },
  { emoji: "🌍", label: "Immigration", note: "" },
  { emoji: "⚖️", label: "Human Rights", note: "" },
  { emoji: "🛡️", label: "Violence & Safety", note: "" },
  { emoji: "🏥", label: "Health & Medicine", note: "2+ signals required" },
  { emoji: "📜", label: "Law & Policy", note: "2+ signals required" },
  { emoji: "🏛️", label: "Politics & Government", note: "2+ signals required" },
  { emoji: "🎭", label: "Culture & Media", note: "2+ signals required" },
  { emoji: "⚽", label: "Sports", note: "2+ signals required" },
  { emoji: "💼", label: "Workplace & Economics", note: "2+ signals required" },
];

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground border-b border-border pb-2 mb-4 mt-10 font-sans">
    {children}
  </h2>
);

const AboutPage = () => {
  return (
    <main className="max-w-[700px] mx-auto px-4 py-8 font-sans">

      {/* Intro */}
      <p className="text-[0.95rem] text-foreground leading-relaxed">
        <strong>shared ground</strong> is an independent news reader aggregating
        feminist, women's, and LGBTQIA+ news from around the world. Articles are
        scraped from RSS feeds every 12 hours. Only publicly accessible articles
        are included — sources marked 🔒 are paywalled and can be filtered out
        using the <em>Free only</em> toggle. Articles older than 6 months are
        automatically removed to keep the database lean.
      </p>

      {/* Sources */}
      <SectionHeading>Sources — 46 publications</SectionHeading>
      {Object.entries(SOURCES).map(([category, names]) => (
        <div key={category} className="mb-5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-medium">
            {category}
          </p>
          <p className="text-[0.9rem] text-foreground leading-relaxed">
            {names.join(" · ")}
          </p>
        </div>
      ))}

      {/* How articles are selected */}
      <SectionHeading>How articles are selected</SectionHeading>
      <p className="text-[0.9rem] text-muted-foreground leading-relaxed mb-4">
        Specialist publications (Women &amp; Feminist, LGBTQIA+) include all their
        articles. For all other sources, a two-tier keyword system decides what gets in:
      </p>

      <div className="mb-6 space-y-4">
        <div className="border border-border rounded-sm p-4 bg-secondary/40">
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
            Tier 1 — always included
          </p>
          <p className="text-[0.85rem] text-muted-foreground leading-relaxed">
            Articles containing any of these specific terms are always included,
            regardless of context.
          </p>
        </div>
        <div className="border border-border rounded-sm p-4 bg-secondary/40">
          <p className="text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
            Tier 2 — included only with identity context
          </p>
          <p className="text-[0.85rem] text-muted-foreground leading-relaxed">
            Broader terms like <em>health</em>, <em>sport</em>, <em>economy</em>,
            or <em>election</em> only trigger inclusion when an identity keyword
            is also present — e.g. <em>women</em>, <em>transgender</em>,{" "}
            <em>refugee</em>, <em>indigenous</em>, <em>lgbtq</em>. This prevents
            general sports or finance articles from appearing unless they relate
            to a marginalised group.
          </p>
        </div>
      </div>

      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 mt-6">
        Tier 1 keywords by category
      </p>
      {Object.entries(KEYWORDS_TIER1).map(([category, words]) => (
        <div key={category} className="mb-5">
          <p className="text-xs font-medium text-muted-foreground mb-1">{category}</p>
          <p className="text-[0.8rem] text-muted-foreground leading-relaxed">
            {words.join(", ")}
          </p>
        </div>
      ))}

      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 mt-6">
        Tier 2 keywords (require identity context)
      </p>
      <p className="text-[0.8rem] text-muted-foreground leading-relaxed mb-4">
        {KEYWORDS_TIER2.join(", ")}
      </p>

      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2 mt-4">
        Identity context keywords
      </p>
      <p className="text-[0.8rem] text-muted-foreground leading-relaxed">
        {IDENTITY_CONTEXT.join(", ")}
      </p>

      {/* Topics */}
      <SectionHeading>Topics</SectionHeading>
      <p className="text-[0.9rem] text-muted-foreground leading-relaxed mb-4">
        Articles are automatically tagged with topics based on keyword matching.
        Specific topics trigger on a single keyword match. Broad topics (marked
        below) require at least 2 matching signals to avoid miscategorisation —
        for example, an article about a medical professional involved in a scandal
        will not be tagged Health &amp; Medicine unless the article is substantively
        about health.
      </p>
      <div className="flex flex-wrap gap-2">
        {TOPICS_LIST.map((t) => (
          <span
            key={t.label}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium border border-border bg-secondary text-foreground rounded-sm"
          >
            {t.emoji} {t.label}
            {t.note && (
              <span className="text-muted-foreground font-normal">· {t.note}</span>
            )}
          </span>
        ))}
      </div>

      {/* Footer note */}
      <p className="mt-12 text-xs text-muted-foreground border-t border-border pt-4">
        shared ground · Scrapes every 12 hours · Articles kept for 6 months · Built for independent readers
      </p>
    </main>
  );
};

export default AboutPage;
