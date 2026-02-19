const KEYWORDS = {
  "Women & Feminism": [
    "women", "woman", "girl", "girls", "female", "feminine", "feminism", "feminist",
    "gender equality", "gender gap", "gender pay gap", "equal pay", "pay equity",
    "wage gap", "pay disparity", "reproductive rights", "abortion", "pro-choice",
    "planned parenthood", "maternity", "maternal", "maternal health", "maternal mortality",
    "women's rights", "sexism", "misogyny", "patriarchy", "period poverty", "menstrual",
    "menstruation", "women's health", "gynecolog", "obstetric", "domestic violence",
    "gender violence", "gender-based violence", "sexual harassment", "sexual assault",
    "rape", "metoo", "me too", "#metoo", "femicide", "honour killing", "honor killing",
    "female genital mutilation", "fgm", "child marriage", "forced marriage",
    "women in leadership", "women in sport", "women in politics", "glass ceiling",
    "motherhood penalty", "parental leave", "maternity leave", "surrogacy",
    "reproductive justice", "bodily autonomy", "trafficking", "sex trafficking",
    "exploitation", "body image", "eating disorder", "diet culture", "birth control",
    "contraception", "ivf", "fertility", "breastfeeding", "postpartum", "prenatal",
    "postnatal", "intersectional feminism", "fourth wave feminism", "ecofeminism",
    "women's march", "women's movement",
  ],
  "LGBTQIA+": [
    "lgbt", "lgbtq", "lgbtqia", "queer", "gay", "lesbian", "bisexual", "transgender",
    "trans", "nonbinary", "non-binary", "intersex", "asexual", "pansexual", "aromantic",
    "agender", "genderfluid", "pride", "pride parade", "coming out", "closeted", "outing",
    "same-sex", "gay marriage", "gay rights", "trans rights", "queer rights",
    "marriage equality", "rainbow", "homophobia", "transphobia", "biphobia",
    "queerphobia", "conversion therapy", "reparative therapy", "gender affirming",
    "gender affirming care", "puberty blocker", "gender identity", "gender expression",
    "gender dysphoria", "pronouns", "deadnaming", "misgendering", "two-spirit", "hijra",
    "third gender", "drag", "drag queen", "drag king", "drag race", "section 28",
    "don't say gay", "bathroom bill", "lgbtq youth", "queer community", "queer family",
  ],
  "Immigration & Asylum": [
    "immigration", "immigrant", "refugee", "asylum", "asylum seeker", "migrant",
    "migration", "undocumented", "unauthorized", "deportation", "deported", "border",
    "border wall", "visa", "citizenship", "naturalization", "stateless", "detention",
    "detention center", "ice raid", "displacement", "displaced persons", "diaspora",
    "daca", "dreamers", "sanctuary", "resettlement", "xenophobia", "nativism",
    "anti-immigrant", "human trafficking", "smuggling",
  ],
  "Human Rights": [
    "human rights", "civil rights", "civil liberties", "discrimination", "prejudice",
    "bigotry", "equality", "equity", "justice", "injustice", "oppression",
    "persecution", "marginalised", "marginalized", "minority rights", "indigenous rights",
    "indigenous peoples", "racial justice", "racism", "anti-racism", "systemic racism",
    "protest", "activist", "activism", "advocacy", "censorship", "free speech",
    "press freedom", "political prisoner", "prisoner of conscience", "genocide",
    "ethnic cleansing", "war crimes", "crimes against humanity", "apartheid",
    "reparations", "accountability", "humanitarian", "humanitarian crisis",
    "humanitarian aid", "amnesty", "disability rights", "ableism",
  ],
};

const SOURCES = {
  "General news (keyword-filtered)": [
    "BBC News", "BBC News World", "The Guardian", "Reuters", "Reuters World",
    "Al Jazeera", "NPR News", "The Independent", "HuffPost", "New York Times",
    "Associated Press", "CNN World", "Washington Post", "Financial Times",
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
};

const TOPICS_LIST = [
  { emoji: "🩺", label: "Reproductive Rights" },
  { emoji: "💰", label: "Gender Pay Gap" },
  { emoji: "🏳️‍🌈", label: "LGBTQIA+" },
  { emoji: "🌍", label: "Immigration" },
  { emoji: "⚖️", label: "Human Rights" },
  { emoji: "🏥", label: "Health & Medicine" },
  { emoji: "📜", label: "Law & Policy" },
  { emoji: "🏛️", label: "Politics & Government" },
  { emoji: "🎭", label: "Culture & Media" },
  { emoji: "⚽", label: "Sports" },
  { emoji: "🛡️", label: "Violence & Safety" },
  { emoji: "💼", label: "Workplace & Economics" },
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
        scraped from RSS feeds every 12 hours (CET). Only publicly accessible
        articles are included — paywalled or restricted content may not appear even
        if it matches a topic.
      </p>

      {/* Sources */}
      <SectionHeading>Our Sources — 37 publications</SectionHeading>
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
      <p className="text-[0.9rem] text-muted-foreground leading-relaxed mb-6">
        For general news sources, articles are only included if they contain at
        least one of the following keywords in the headline or summary.
        Specialist publications (Women &amp; Feminist, LGBTQIA+) include all articles.
      </p>
      {Object.entries(KEYWORDS).map(([category, words]) => (
        <div key={category} className="mb-6">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
            {category}
          </p>
          <p className="text-[0.8rem] text-muted-foreground leading-relaxed">
            {words.join(", ")}
          </p>
        </div>
      ))}

      {/* Topics */}
      <SectionHeading>Topics</SectionHeading>
      <p className="text-[0.9rem] text-muted-foreground leading-relaxed mb-4">
        Articles are automatically tagged with topics based on keyword matching.
      </p>
      <div className="flex flex-wrap gap-2">
        {TOPICS_LIST.map((t) => (
          <span
            key={t.label}
            className="inline-block px-3 py-1 text-xs font-medium border border-border bg-secondary text-foreground rounded-sm"
          >
            {t.emoji} {t.label}
          </span>
        ))}
      </div>

      {/* Footer note */}
      <p className="mt-12 text-xs text-muted-foreground border-t border-border pt-4">
        shared ground · Scrapes every 12 hours · Built for independent readers
      </p>
    </main>
  );
};

export default AboutPage;
