# shared ground — Taxonomy Redesign
**Systems-Based Tagging Model**
*Design document · February 2026*

---

## Overall Assessment

The direction is correct and overdue. The current issue-bucket model (Reproductive Rights, LGBTQIA+, Sports, etc.) treats symptoms rather than systems, which makes it hard for readers to see structural patterns — an article about a Brazilian pension cut and one about unpaid care work in Ghana are both about the same system of economic extraction, but the current model files them separately or drops them entirely. The move to a systems-of-power taxonomy with separate identity tags is a meaningful editorial upgrade.

The strongest addition is **Anti-Rights & Backlash Movements** — no other news aggregator I'm aware of names this explicitly. It makes the product's editorial stance legible and honest, which is a feature, not a liability.

Two things to watch: the **Law, Policy & Governance** category still risks being a catch-all (see Section 1 refinements), and the **Anti-Rights** category needs a tight definition to avoid inflating with ordinary partisan politics. Both are solvable.

---

## 1. Final Recommended Taxonomy

### Primary System Categories

| # | Category | Emoji | Core lens |
|---|----------|-------|-----------|
| 1 | Bodily Autonomy & Reproductive Justice | 🧬 | Control over one's body, reproduction, medical decisions |
| 2 | State Power, Law & Governance | 🏛️ | How legal and political systems distribute or deny rights |
| 3 | Economic & Labour Justice | 💰 | Who earns, owns, inherits, cares — and who doesn't |
| 4 | Violence, Safety & Criminal Justice | 🛡️ | State and non-state violence; policing; impunity |
| 5 | Migration, Borders & Citizenship | 🌍 | Movement, belonging, statelessness, detention |
| 6 | Climate & Environmental Justice | 🌱 | Who bears environmental costs; land, water, displacement |
| 7 | Technology & Digital Power | 💻 | Surveillance, censorship, algorithmic harm, data extraction |
| 8 | Anti-Rights & Backlash Movements | 🔥 | Organised efforts to roll back rights or suppress minorities |
| 9 | Culture, Media & Narrative Power | 🎭 | Who controls stories; representation; censorship; education |

**Change from proposed:** Category 2 renamed from "Law, Policy & Governance" to "State Power, Law & Governance." Adding "State Power" makes the structural lens explicit and distinguishes it from generic political news.

**One addition to consider:** A 10th category — **Education & Knowledge Access** (📚) — for book bans, academic freedom crackdowns, and school curriculum battles. These are currently scattered across Culture and Governance but share a distinct structural logic. Keep it optional for v2.

### Secondary Identity Tags (affected groups, not topics)

These describe *who an article is about*, not *what system it implicates*. Applied separately from system tags.

- **Women / Girls**
- **LGBTQIA+**
- **Indigenous peoples**
- **Migrants & refugees**
- **People with disabilities**
- **Racialised minorities**
- **Religious minorities**
- **Children & youth**
- **Incarcerated people**
- **Sex workers**

**Rule:** Identity tags should not be used as the primary inclusion filter. An article about labour rights for garment workers in Bangladesh gets included because of the *system* (Economic & Labour Justice), and tagged with the identity group as additional metadata — not the other way around.

---

## 2. Inclusion + Tagging Logic Model

### The Problem with the Current Model

The current approach essentially asks: *does this article mention women, LGBTQIA+ people, or related identity terms?* This has two failure modes:

- **False negatives:** A story about forced displacement due to dam construction in Kenya doesn't say "women" or "LGBTQIA+" but disproportionately harms both groups and belongs in the feed.
- **False positives:** A celebrity profile that mentions someone's gender gets swept in.

### New Inclusion Gate Model

An article passes if it clears **at least one of three gates**:

---

**Gate A — Direct rights signal**
Article contains an explicit identity keyword *and* describes a rights-affecting context (legal decision, policy change, documented harm, organised resistance, structural data).

> ✅ "Pakistan criminalises same-sex relations" → passes (LGBTQIA+ + legal harm)
> ❌ "Beyoncé discusses her womanhood in new interview" → fails (identity mention, no rights context)

---

**Gate B — Structural system signal**
Article describes a structural issue in one of the 9 system categories without requiring an explicit identity mention. The system itself implies rights relevance.

> ✅ "EU proposes AI Act exemptions for national security" → passes (Technology & Digital Power — structural)
> ✅ "Argentina ends universal healthcare subsidies" → passes (Bodily Autonomy — structural policy)
> ❌ "EU interest rates remain flat" → fails (no system relevance)

---

**Gate C — Institutional / accountability signal**
Article directly involves a rights institution, treaty body, accountability mechanism, or named rights movement.

> ✅ "UN Special Rapporteur on Violence against Women releases report" → passes
> ✅ "Amnesty International documents extrajudicial killings in Sudan" → passes

---

### Signal Weighting

**Strong signals** (1 sufficient for inclusion):
- Explicit criminalisation or legalisation affecting a protected group
- Documented physical violence against a named minority group
- Supreme court / constitutional ruling on bodily autonomy, citizenship, equality
- Treaty ratification or withdrawal
- Named rights organisation as subject (Amnesty, Human Rights Watch, local equivalents)
- Reproductive rights: abortion, contraception, FGM, forced sterilisation

**Medium signals** (2 required, or 1 + structural context):
- Labour law change without explicit gender/race framing
- Climate displacement or land dispossession without named group
- Surveillance or facial recognition expansion
- Electoral results with described minority-affecting implications
- Curriculum or media censorship

**Weak signals** (3 required, or confirmed by editorial rule):
- General poverty / inequality data
- Health statistics without rights context
- Electoral polling without minority-impact framing

---

### Tagging Logic

Once an article is included, tagging follows this order:

1. **Assign 1–2 primary system tags** based on the strongest structural signal present.
2. **Assign 1–3 identity tags** based on explicitly mentioned affected groups *or* strong structural inference (e.g. "care workers" → Women inferred; "undocumented migrants" → Migrants & Refugees).
3. **Apply Anti-Rights tag** only when the article describes organised opposition to rights (not just conservative policy). See Anti-Rights definition below.

**Anti-Rights definition (strict):**
Must describe at least one of: organised political movement or party explicitly targeting minority rights; legislative campaign to remove existing rights protections; coordinated harassment or disinformation campaign against a minority group; or named "parents rights," "religious freedom," or similar framing used as a rights-rollback vehicle.

*Does not include:* general conservative governance; budget cuts without explicit minority targeting; ordinary partisan disagreement.

---

## 3. Stress Test Scenarios

Ten realistic articles from varied geographies, tested against the new model.

---

**Article 1 — India**
*"Supreme Court upholds marital rape exemption, citing institution of marriage"*

- **Include?** ✅ Yes — Gate A (bodily autonomy + legal decision) + Gate C (Supreme Court ruling)
- **System tags:** 🧬 Bodily Autonomy & Reproductive Justice, 🏛️ State Power & Governance
- **Identity tags:** Women
- **Note:** Strong signal. No ambiguity.

---

**Article 2 — Germany**
*"AfD becomes largest party in Thuringia on platform targeting migrants and gender ideology"*

- **Include?** ✅ Yes — Gate B (organised anti-rights movement) + Gate A (migration)
- **System tags:** 🔥 Anti-Rights & Backlash, 🌍 Migration & Citizenship
- **Identity tags:** Migrants, LGBTQIA+, Religious minorities
- **Note:** "Gender ideology" framing is a textbook Anti-Rights signal. Passes the strict definition.

---

**Article 3 — Kenya**
*"FGM rates decline in Maasai communities as girls lead resistance campaigns"*

- **Include?** ✅ Yes — Gate A (bodily autonomy) + Gate C (rights movement named)
- **System tags:** 🧬 Bodily Autonomy & Reproductive Justice
- **Identity tags:** Women, Indigenous peoples
- **Note:** Positive development story — inclusion model must not only capture harm but also resistance and progress. Works correctly here.

---

**Article 4 — Brazil**
*"Yanomami land demarcation overturned as mining companies move in"*

- **Include?** ✅ Yes — Gate B (climate/land + indigenous) + Gate A (if indigenous rights mentioned)
- **System tags:** 🌱 Climate & Environmental Justice, 🏛️ State Power & Governance
- **Identity tags:** Indigenous peoples
- **Note:** This is exactly the type of article the current model would miss (no identity keyword in headline). New model catches it via structural signal.

---

**Article 5 — Pakistan**
*"Government blocks TikTok citing 'immoral and indecent content'"*

- **Include?** ✅ Conditional — Gate B (technology censorship) — but only if reporting implies targeting of LGBTQIA+ or women's content specifically
- **System tags:** 💻 Technology & Digital Power, 🎭 Culture & Narrative Power
- **Identity tags:** LGBTQIA+ (if implied by "immoral content" framing), Women
- **Note:** Generic platform bans are borderline. The inclusion logic should require evidence that minority content is the target, not just general content moderation. This is a good edge case for editorial guidelines.

---

**Article 6 — France**
*"Pension reform will force women to work two extra years before retirement, analysis finds"*

- **Include?** ✅ Yes — Gate B (economic policy with structural gender analysis) + medium signal confirmed
- **System tags:** 💰 Economic & Labour Justice, 🏛️ State Power & Governance
- **Identity tags:** Women
- **Note:** The key is "analysis finds" — structural framing with gender impact data, not just generic policy reporting. This distinction is important for the keyword model.

---

**Article 7 — South Africa**
*"Police fire rubber bullets at Johannesburg Pride march; three hospitalised"*

- **Include?** ✅ Yes — Gate A (violence + LGBTQIA+ + state actor)
- **System tags:** 🛡️ Violence & Criminal Justice, 🔥 Anti-Rights & Backlash
- **Identity tags:** LGBTQIA+
- **Note:** State violence against a named minority during organised rights event. Strong signal. Anti-Rights applies because it's state-sanctioned suppression.

---

**Article 8 — Nigeria**
*"Journalist arrested for reporting on gay couple; faces 14 years under Same-Sex Prohibition Act"*

- **Include?** ✅ Yes — Gates A + B + C
- **System tags:** 🎭 Culture & Narrative Power, 🛡️ Violence & Criminal Justice
- **Identity tags:** LGBTQIA+
- **Note:** Multiple system dimensions: press freedom + criminalisation + legal accountability. Correctly gets two system tags.

---

**Article 9 — Australia**
*"Indigenous Voice to Parliament referendum fails; 60% vote No"*

- **Include?** ✅ Yes — Gate B (governance mechanism for Indigenous rights) + Gate C (rights institution)
- **System tags:** 🏛️ State Power & Governance, 🔥 Anti-Rights & Backlash
- **Identity tags:** Indigenous peoples
- **Note:** Anti-Rights is appropriate here because the "No" campaign explicitly organised around opposition to Indigenous representation, not merely a governance disagreement. This is the grey zone that editorial guidelines need to address.

---

**Article 10 — Bangladesh**
*"Garment factories cut maternity leave to six weeks after industry lobbying"*

- **Include?** ✅ Yes — Gate B (labour rights + structural gender impact)
- **System tags:** 💰 Economic & Labour Justice
- **Identity tags:** Women
- **Note:** No explicit "women's rights" or feminist framing in the headline, but the structural inference is unambiguous. This is precisely the type of global south labour story the current model under-captures. New model gets it right.

---

**Model Assessment after stress test:** 9/10 clean passes. Article 5 (Pakistan TikTok) is the genuine edge case — needs an editorial decision on whether tech censorship requires explicit minority-targeting evidence. Recommend: include if the source framing implies minority content is targeted, exclude if it's general platform regulation.

---

## 4. Refined Keyword Structure

### 🧬 Bodily Autonomy & Reproductive Justice

**Strong triggers** (1 sufficient):
abortion, reproductive rights, FGM, female genital mutilation, forced sterilisation, maternal mortality, contraception access, obstetric violence, surrogacy rights, intersex, bodily integrity, menstrual health, period poverty

**Contextual/medium triggers** (2+ required):
healthcare access + gender, birth + criminalised, pregnancy + workplace, IVF + policy, miscarriage + law

**Structural inference**:
"unborn" + legislation → abortion policy; "maternal" + "rural" + "mortality" → reproductive healthcare gap

**Flag as US-centric and expand globally:**
"Roe v. Wade" references → ensure equivalents are captured (e.g. Poland's abortion ban, Mexico's decriminalisation, Ireland's referendum)

---

### 🏛️ State Power, Law & Governance

**Strong triggers** (1 sufficient):
criminalised, decriminalised, constitutional court, supreme court + rights, legislation + minority, anti-discrimination law, hate crime law, equality act, civil rights, legal protection, landmark ruling, treaty + rights

**Contextual/medium triggers**:
parliamentary + vote + minority, policy + impact + women/LGBTQIA+/indigenous, electoral + platform + rights

**Structural inference**:
"signed into law" + rights-adjacent bill → include; "committee approved" alone → exclude

**Flag as US-centric:**
"first amendment," "14th amendment," "SCOTUS" → must not be sole triggers; ensure non-US constitutional equivalents are captured

---

### 💰 Economic & Labour Justice

**Strong triggers**:
gender pay gap, care economy, unpaid care work, labour rights, union + women/LGBTQIA+, domestic workers, garment workers + conditions, maternity leave, parental leave + policy, pension + gender, economic inequality + gender/race

**Contextual/medium triggers**:
wage theft, gig economy + protection, minimum wage + impact, debt + women/developing, land rights + women

**Structural inference**:
"care workers" → Women (inferred); "domestic workers" → Migrants + Women; "informal economy" + gender → Economic Justice

**Flag as US-centric:**
"glass ceiling" framing is Western corporate; also capture subsistence farming, informal markets, remittance dependence

---

### 🛡️ Violence, Safety & Criminal Justice

**Strong triggers**:
femicide, domestic violence, sexual violence, rape, honour killing, trafficking, police brutality + minority, extrajudicial killing, forced disappearance, torture + detention, hate crime

**Contextual/medium triggers**:
violence + LGBTQIA+/women/indigenous, assault + protest, detention + conditions, incarceration + race/gender

**Structural inference**:
High femicide rates + country → structural violence story; "impunity" + named group → include

**Flag as US-centric:**
"mass incarceration" is US-specific — also capture prison conditions globally, death penalty, juvenile justice internationally

---

### 🌍 Migration, Borders & Citizenship

**Strong triggers**:
asylum, refugee, stateless, deportation, detention centre, border violence, migration policy, undocumented + rights, citizenship + revoked, Rohingya, ethnic cleansing

**Contextual/medium triggers**:
displaced + women/children, unaccompanied minor, immigration + law + change, xenophobia + policy

**Structural inference**:
Climate displacement → both 🌱 and 🌍; "returns" + forced → violence + migration

**Flag as US-centric:**
"border wall," "Title 42," "DACA" → also capture EU's Frontex, Australia's offshore detention, Gulf kafala system

---

### 🌱 Climate & Environmental Justice

**Strong triggers**:
climate displacement, land dispossession, environmental racism, indigenous land rights, water rights, forced relocation + dam/mine, deforestation + indigenous, climate refugees

**Contextual/medium triggers**:
pollution + community, environmental health + race/poverty, "sacrifice zone", just transition

**Structural inference**:
"dam construction" + "indigenous community" → land rights + climate; "drought" + "smallholder farmers" → climate justice (even without "justice" keyword)

**Note:** This is the most likely under-covered category in English-language RSS feeds. Consider adding non-Anglophone sources specifically for this beat (e.g. Mongabay, IPS News Agency already in feed, expand to regional press).

---

### 💻 Technology & Digital Power

**Strong triggers**:
facial recognition + minority/protest, algorithmic discrimination, surveillance + minority, content moderation + LGBTQIA+/women, internet shutdown + protest, digital rights, spyware + journalist/activist, deepfake + women

**Contextual/medium triggers**:
AI + bias, platform + ban + minority content, biometric + border, data collection + vulnerable group

**Structural inference**:
"internet shutdown" during election or protest → include; generic "social media policy" → exclude unless minority targeting implied

**Flag as US-centric:**
"Section 230" is US-specific. Also capture EU's DSA, China's Great Firewall impacts on diaspora, surveillance in authoritarian contexts

---

### 🔥 Anti-Rights & Backlash Movements

**Strong triggers**:
"gender ideology", "traditional values" + legislation, "protecting children" + anti-LGBTQIA+, book ban, conversion therapy, bathroom bill, "religious freedom" + discrimination, "parents rights" + curriculum, anti-trans legislation, "don't say gay"

**Contextual/medium triggers**:
far-right + minority rights, populist + women/LGBTQIA+, conservative coalition + rollback, Alliance Defending Freedom, Heritage Foundation, Agenda Europe (named orgs)

**Structural inference**:
Named anti-rights organisation in article → flag for Anti-Rights regardless of framing; "family values" + specific policy → include

**Crucial boundary:** General conservative governance is NOT Anti-Rights unless it explicitly targets minority rights removal. Tax policy ≠ Anti-Rights. Anti-trans school policy = Anti-Rights.

**Flag as US-centric:**
"culture war" framing — ensure equivalent movements in Hungary (Fidesz), Russia (traditional values law), Uganda (Anti-Homosexuality Act), Brazil (Bolsonarismo) are captured with equivalent triggers

---

### 🎭 Culture, Media & Narrative Power

**Strong triggers**:
press freedom + minority, journalist + arrested + rights, book ban, curriculum + gender/race removal, representation + media, propaganda + minority, censorship + LGBTQIA+/women, film ban + rights

**Contextual/medium triggers**:
media + diversity, arts funding + cuts + minority, language rights, indigenous media, storytelling + rights

**Structural inference**:
"pulled from shelves" + content involving minority → Culture + possibly Anti-Rights; "state broadcaster" + editorial censorship → State Power + Culture

---

## 5. UX Filter Structure

### Homepage Layout

The grouped view already built (topic sections in order) maps naturally to the new taxonomy. Suggested section order for homepage:

1. 🔥 Anti-Rights & Backlash (most urgent, most distinctive to the product)
2. 🧬 Bodily Autonomy & Reproductive Justice
3. 🛡️ Violence & Criminal Justice
4. 🏛️ State Power & Governance
5. 💰 Economic & Labour Justice
6. 🌍 Migration & Citizenship
7. 🌱 Climate & Environmental Justice
8. 💻 Technology & Digital Power
9. 🎭 Culture & Narrative Power

Rationale: lead with what's most urgent and most specific to the product's identity. Anti-Rights first makes the editorial mission immediately legible.

### Filter Panel Structure

**Tier 1 — System filter (primary, visible by default):**
Horizontal chip row or vertical sidebar, one selectable at a time (or multi-select with clear visual state). These are the 9 system categories.

**Tier 2 — Identity filter ("Stories affecting..." toggle group):**
Collapsed by default, expandable. Multi-select. Labelled clearly as "affected groups" not "topics."

**Tier 3 — Region filter:**
Simple dropdown: Global / Europe / Americas / Africa / Asia-Pacific / Middle East & North Africa
Not a primary filter — secondary refinement only.

**Tier 4 — Time, source, paywall:**
Already built. Keep as-is.

### Preventing Filter Overload

- Never show all filter tiers simultaneously by default.
- Default state: system chips only (most intuitive for new users).
- "Refine" button reveals identity + region filters.
- Clear all resets to grouped homepage (no orphaned filter states).
- Mobile: collapse to a single filter sheet, not layered dropdowns.

### Visual Distinction: System vs Identity Tags

**System tags** (on article cards): coloured badge, medium weight, category colour from TOPIC_COLORS (already built). These should be clickable → activates system filter.

**Identity tags**: smaller, lighter, outlined (not filled), grey or neutral palette. Positioned below system tag. These are metadata, not navigation. Could be non-clickable in v1 or activate identity filter in v2.

Example card meta row:
```
[🧬 Bodily Autonomy]  [Women] [Indigenous]
The Guardian · 3 hours ago
```

---

## 6. Monitoring & Trend Layer

### What to Track

**Per-category article counts** (rolling 7-day, 30-day, 90-day windows):
- Enables: "🔥 Anti-Rights stories up 34% this month"
- Implementation: count articles per system tag per time window, store as daily snapshots

**Country-level concentration**:
- Which countries appear most in each category
- Enables: regional rights dashboard, country comparison
- Implementation: extract country from existing `country` field, aggregate by category

**Source balance score**:
- % of articles from Global South sources vs Anglophone press
- Implementation: tag each source with region/language metadata, compute ratio per feed cycle

**Identity tag coverage gaps**:
- Which identity groups are most/least covered in the current scrape cycle
- Flags editorial blind spots (e.g., disability consistently under-covered)

**Backlash index**:
- Ratio of Anti-Rights articles to total rights articles over time
- Interpretable as a proxy for global rights climate — with appropriate caveats

### Metrics Worth Surfacing to Readers

Keep it light — one or two visible stats, not a dashboard. Suggested:

- "X stories tracked this week across Y countries" (already have this)
- "Most covered this week: [category with highest volume]" — surfaced in Masthead
- Monthly rights briefing: a curated summary of top trends by category (editorial layer, not automated)

### Spike Detection (internal/editorial use)

Alert when a category's 7-day count exceeds its 90-day average by >50%:
- Triggers editorial review, not automatic push to readers
- Useful for knowing when to prioritise a category in homepage ordering

### Source Diversity Logic

Current feed is heavily US/UK (Guardian, NYT, BBC). To monitor genuinely global rights developments, the scraper needs:
- At minimum one source per region per primary category
- Consider adding: Agência Pública (Brazil), The Elephant (Kenya), Scroll.in (India), Mada Masr (Egypt, English edition), New Naratif (Southeast Asia)
- Source diversity score: aim for <40% of articles from any single country's press

---

## 7. Risks & Mitigation

### Editorial risks

**Risk: Anti-Rights category becomes partisan framing**
Mitigation: Define Anti-Rights with a strict structural test (organised campaign to remove existing rights protections). Document the definition publicly in the About page. Apply the same standard regardless of geography or ideology — including progressive anti-trans positions in some feminist movements.

**Risk: Climate category floods feed with general environmental news**
Mitigation: Gate B requires a rights/justice framing, not just climate content. "Sea levels rise" ≠ include. "Pacific islanders face statelessness as territory submerges" = include.

**Risk: Technology category captures general tech news**
Mitigation: Require evidence of minority group impact or surveillance/censorship of rights actors. A story about Apple's earnings doesn't pass. A story about Pegasus spyware targeting a journalist does.

### Technical risks

**Risk: Multi-tag articles inflate category counts**
Mitigation: For trend tracking, count an article once in its *primary* system tag (the first/strongest signal), not in all tags it holds.

**Risk: Existing articles have wrong tags after taxonomy switch**
Mitigation: Add a `taxonomy_version` field to the articles table. Run `recategorize_all_articles()` with new keyword sets after deploying. Old articles get re-tagged; version field allows rollback if needed.

**Risk: Identity tags inferred incorrectly**
Mitigation: In v1, only apply identity tags based on explicit mentions in title/summary. Structural inference (e.g. "garment workers" → Women) is powerful but should be opt-in and audited before enabling in production.

### Scope risk

**Risk: This redesign is large enough to break existing scraper logic**
Mitigation: Implement in phases.
- Phase 1: Update TOPICS in frontend (constants.ts, translations.ts) — no scraper changes, just rename categories
- Phase 2: Update keyword sets in scraper.py `categorise_article()` — deploy, monitor for 2 weeks
- Phase 3: Add identity tags as separate DB column — schema migration + scraper update
- Phase 4: Monitoring/trend layer — separate from article ingestion

---

## Implementation Sequence (Recommended)

| Phase | Scope | Effort | Risk |
|-------|-------|--------|------|
| 1 | Rename 9 categories in frontend + translations | 1–2 hours | Very low |
| 2 | Rewrite keyword sets in scraper.py | Half day | Low — existing schema |
| 3 | Add identity tags column + scraper logic | Full day | Medium — schema migration |
| 4 | Source diversity expansion | Ongoing | Low |
| 5 | Trend/monitoring layer | 2–3 days | Medium |

Phase 1 is a rename that you can ship today. Phase 2 is the real editorial work — keyword design — and benefits most from the stress testing above.

---

*This document covers taxonomy, inclusion logic, stress testing, keyword structure, UX design, monitoring, and risk mitigation for the shared ground systems-based redesign.*
