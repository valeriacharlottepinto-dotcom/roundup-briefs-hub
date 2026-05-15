import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeaturedArticle from "@/components/FeaturedArticle";
import ArticleCardSmall from "@/components/ArticleCardSmall";
import ArticleTile from "@/components/ArticleTile";
import PodcastCard from "@/components/PodcastCard";
import TopicFilterBar from "@/components/TopicFilterBar";
import { useFeedArticles, usePodcasts } from "@/hooks/useArticles";
import {
  getArticleCategory,
  getCategoryColor,
  formatDate,
  isPaywalled,
} from "@/lib/api";


const ALL_TOPICS = ["Alle", "Politik", "Kultur", "Wirtschaft", "Sport"];

// ─── Branded loading screen (replaces scattered skeletons) ───────────────────
const LoadingScreen = ({ waking }: { waking: boolean }) => (
  <div className="flex flex-col items-center justify-center min-h-[65vh] gap-8">
    {/* Pulsing logo mark */}
    <div className="relative flex items-center justify-center w-20 h-20">
      <div className="absolute inset-0 rounded-full border border-foreground/8 animate-ping [animation-duration:2s]" />
      <div className="absolute inset-2 rounded-full border border-foreground/12 animate-ping [animation-duration:2s] [animation-delay:0.3s]" />
      <span className="relative font-headline text-3xl font-black tracking-tight select-none">SG</span>
    </div>

    {/* Bouncing dots */}
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-foreground/25 animate-bounce"
          style={{ animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </div>

    {/* Status text */}
    <div className="text-center space-y-2 px-6">
      <p className="text-sm font-medium tracking-wide text-foreground/60 uppercase">
        Artikel werden geladen
      </p>
      {waking && (
        <p className="text-xs text-muted-foreground max-w-[280px] leading-relaxed">
          Der Server startet nach längerer Inaktivität —{" "}
          <span className="text-foreground/50">das dauert ca. 30 Sekunden.</span>
        </p>
      )}
    </div>
  </div>
);

const TILES_PER_PAGE = 9; // 3 × 3

const Index = () => {
  const [activeTopic, setActiveTopic] = useState("Alle");
  const [visibleTileCount, setVisibleTileCount] = useState(TILES_PER_PAGE);
  const { articles, loading, waking } = useFeedArticles();
  const { podcasts } = usePodcasts();

  // Filter articles by active topic; reset tile count on topic change
  const filtered = useMemo(() => {
    setVisibleTileCount(TILES_PER_PAGE);
    if (activeTopic === "Alle") return articles;
    return articles.filter((a) => getArticleCategory(a) === activeTopic);
  }, [articles, activeTopic]);

  // ── Daily hero pin (only for "Alle" tab) ─────────────────────────────────
  const featured = useMemo(() => {
    if (!filtered.length) return null;
    if (activeTopic === "Alle") {
      const today = new Date().toDateString();
      try {
        const saved = localStorage.getItem("sg_daily_hero");
        if (saved) {
          const { date, id } = JSON.parse(saved);
          if (date === today) {
            const pinned = filtered.find((a) => a.id === id);
            if (pinned) return pinned;
          }
        }
      } catch { /* ignore */ }
      const hero = filtered[0];
      try { localStorage.setItem("sg_daily_hero", JSON.stringify({ date: today, id: hero.id })); } catch { /* ignore */ }
      return hero;
    }
    return filtered[0];
  }, [filtered, activeTopic]);

  // Slice into layout sections (exclude featured from lists)
  const featuredId    = featured?.id;
  const rest          = filtered.filter((a) => a.id !== featuredId);

  // ── "Alle" sidebar: max 1 article per source for diversity ───────────────
  const leftArticles = (() => {
    const seen = new Set<string>();
    const picks: typeof rest = [];
    // First pass: one article per unique source
    for (const a of rest) {
      if (picks.length >= 5) break;
      if (!seen.has(a.source)) { seen.add(a.source); picks.push(a); }
    }
    // Second pass: fill remaining slots (max 2 per source)
    if (picks.length < 5) {
      const sourceCounts: Record<string, number> = {};
      for (const p of picks) sourceCounts[p.source] = (sourceCounts[p.source] ?? 0) + 1;
      for (const a of rest) {
        if (picks.length >= 5) break;
        if (picks.includes(a)) continue;
        if ((sourceCounts[a.source] ?? 0) < 2) {
          sourceCounts[a.source] = (sourceCounts[a.source] ?? 0) + 1;
          picks.push(a);
        }
      }
    }
    return picks;
  })();

  // ── Category page (non-"Alle"): WIRED-style top section ──────────────────
  const sideTwo   = rest[0] ?? null;
  const sideThree = rest[1] ?? null;

  // Tile grid: exclude only the articles already rendered in the top section
  const shownIds = new Set<number>([
    ...(featured ? [featured.id] : []),
    ...leftArticles.map((a) => a.id),
    ...(sideTwo && activeTopic !== "Alle" ? [sideTwo.id] : []),
    ...(sideThree && activeTopic !== "Alle" ? [sideThree.id] : []),
  ]);
  const tileArticles  = filtered.filter((a) => !shownIds.has(a.id));
  const visibleTiles  = tileArticles.slice(0, visibleTileCount);
  const hasMore       = tileArticles.length > visibleTileCount;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container max-w-[1400px] mx-auto px-6 pt-2 pb-8">
        {/* Topic filter bar */}
        <TopicFilterBar
          topics={ALL_TOPICS}
          active={activeTopic}
          onSelect={setActiveTopic}
        />

        {/* ── Loading state — replaces the entire grid ────────────────────── */}
        {loading ? (
          <LoadingScreen waking={waking} />
        ) : (
        <>

        {activeTopic === "Alle" ? (
          /* ═══════════════════════════════════════════════════════════════
             "ALLE" TAB — 3-column editorial layout (sidebar / hero / podcasts)
             ═══════════════════════════════════════════════════════════════ */
          <div className="grid grid-cols-12 gap-8">

            {/* ── LEFT COLUMN ─────────────────────────────────────────────── */}
            <div className="col-span-3">
              <div className="editorial-divider mb-3" />
              <h3 className="font-headline text-lg font-bold mb-2 uppercase tracking-wide">
                Aktuell
              </h3>
              <div className="space-y-0">
                {leftArticles.length > 0
                  ? leftArticles.map((article) => (
                      <ArticleCardSmall
                        key={article.id}
                        thumbnail={article.image_url}
                        category={getArticleCategory(article)}
                        categoryColor={getCategoryColor(getArticleCategory(article))}
                        headline={article.title}
                        source={article.source}
                        date={formatDate(article.published_at || article.scraped_at)}
                        href={article.link}
                        variant="sidebar"
                        paywalled={isPaywalled(article.source)}
                      />
                    ))
                  : (
                      <p className="text-sm text-muted-foreground py-4">
                        Keine Artikel für dieses Thema.
                      </p>
                    )}
              </div>
            </div>

            {/* ── CENTER COLUMN ───────────────────────────────────────────── */}
            <div className="col-span-6 border-l border-r border-border px-8">
              {featured ? (
                <a href={featured.link} target="_blank" rel="noopener noreferrer" className="block">
                  <FeaturedArticle
                    image={featured.image_url}
                    category={getArticleCategory(featured)}
                    headline={featured.title}
                    summary={featured.summary || "Read the full article for more details."}
                    source={featured.source}
                    date={formatDate(featured.published_at || featured.scraped_at)}
                    readTime="5 min read"
                    paywalled={isPaywalled(featured.source)}
                  />
                </a>
              ) : (
                <p className="text-muted-foreground text-sm py-16 text-center">
                  Keine Artikel für diesen Filter gefunden.
                </p>
              )}
            </div>

            {/* ── RIGHT COLUMN — Podcasts ──────────────────────────────────── */}
            <div className="col-span-3">
              <div className="editorial-divider mb-3" />
              <h3 className="font-headline text-lg font-bold mb-4 uppercase tracking-wide">
                Podcasts
              </h3>
              <div className="space-y-5">
                {podcasts.length > 0
                  ? podcasts.map((p) => (
                      <PodcastCard
                        key={p.feed_url}
                        cover={p.cover_url}
                        title={p.title}
                        description={p.description}
                        latest_ep={p.latest_ep}
                        duration={p.duration}
                        href={p.website_url}
                      />
                    ))
                  : [1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-[104px] bg-muted animate-pulse rounded-sm" />
                    ))}
              </div>
            </div>

          </div>
        ) : (
          /* ═══════════════════════════════════════════════════════════════
             CATEGORY TABS (Politik / Kultur / Wirtschaft / Sport)
             WIRED-style: large hero left + 2 stacked articles right
             ═══════════════════════════════════════════════════════════════ */
          featured ? (
            <div className="grid grid-cols-12 gap-8">

              {/* ── HERO (left, 8 cols) ──────────────────────────────────── */}
              <div className="col-span-8">
                <a href={featured.link} target="_blank" rel="noopener noreferrer" className="block group">
                  <div className="relative w-full aspect-[16/9] overflow-hidden rounded-sm bg-muted mb-4">
                    {isPaywalled(featured.source) && (
                      <div className="absolute top-3 right-3 z-10 bg-foreground/75 text-background text-[10px] font-semibold px-1.5 py-0.5 rounded-sm backdrop-blur-sm select-none">€</div>
                    )}
                    {featured.image_url ? (
                      <img
                        src={featured.image_url}
                        alt={featured.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[hsl(25,60%,88%)] via-[hsl(0,0%,93%)] to-[hsl(217,40%,88%)] flex items-center justify-center">
                        <span className="select-none text-[hsl(0,0%,58%)] text-sm font-medium tracking-widest">Image loading…</span>
                      </div>
                    )}
                  </div>
                  <span className={`category-tag ${getCategoryColor(getArticleCategory(featured)) === "orange" ? "category-tag--orange" : getCategoryColor(getArticleCategory(featured)) === "magenta" ? "category-tag--magenta" : ""}`}>
                    {getArticleCategory(featured)}
                  </span>
                  <h2 className="font-headline text-3xl font-black leading-tight mt-2 group-hover:text-accent-blue transition-colors">
                    {featured.title}
                  </h2>
                  {featured.summary && (
                    <p className="text-muted-foreground mt-3 text-[15px] leading-relaxed line-clamp-2">
                      {featured.summary}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 mt-3 text-[11px] text-muted-foreground uppercase tracking-wide">
                    <span>{featured.source}</span>
                    <span>·</span>
                    <span>{formatDate(featured.published_at || featured.scraped_at)}</span>
                  </div>
                </a>
              </div>

              {/* ── RIGHT STACK (2 articles, 4 cols) ────────────────────── */}
              <div className="col-span-4 flex flex-col gap-6">
                {[sideTwo, sideThree].map((article) =>
                  article ? (
                    <a key={article.id} href={article.link} target="_blank" rel="noopener noreferrer" className="block group">
                      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-sm bg-muted mb-3">
                        {isPaywalled(article.source) && (
                          <div className="absolute top-2 right-2 z-10 bg-foreground/75 text-background text-[9px] font-semibold px-1.5 py-0.5 rounded-sm backdrop-blur-sm select-none leading-none">€</div>
                        )}
                        {article.image_url ? (
                          <img
                            src={article.image_url}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[hsl(25,60%,88%)] via-[hsl(0,0%,93%)] to-[hsl(217,40%,88%)] flex items-center justify-center">
                            <span className="select-none text-[hsl(0,0%,58%)] text-[11px] font-medium tracking-widest">Image loading…</span>
                          </div>
                        )}
                      </div>
                      <span className={`category-tag text-[10px] ${getCategoryColor(getArticleCategory(article)) === "orange" ? "category-tag--orange" : getCategoryColor(getArticleCategory(article)) === "magenta" ? "category-tag--magenta" : ""}`}>
                        {getArticleCategory(article)}
                      </span>
                      <h4 className="font-headline text-[15px] font-bold leading-snug mt-1.5 group-hover:text-accent-blue transition-colors line-clamp-3">
                        {article.title}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-2 text-[11px] text-muted-foreground uppercase tracking-wide">
                        <span>{article.source}</span>
                        <span>·</span>
                        <span>{formatDate(article.published_at || article.scraped_at)}</span>
                      </div>
                    </a>
                  ) : null
                )}
              </div>

            </div>
          ) : (
            <p className="text-muted-foreground text-sm py-16 text-center">
              Keine Artikel für diesen Filter gefunden.
            </p>
          )
        )}

        {/* ── FULL-WIDTH TILE GRID — spans all 3 columns ─────────────────── */}
        {tileArticles.length > 0 && (
          <div className="mt-8">
            <div className="border-t border-border mb-6" />
            <div className="grid grid-cols-3 gap-6">
              {visibleTiles.map((article) => (
                <ArticleTile
                  key={article.id}
                  image={article.image_url}
                  category={getArticleCategory(article)}
                  categoryColor={getCategoryColor(getArticleCategory(article))}
                  headline={article.title}
                  source={article.source}
                  date={formatDate(article.published_at || article.scraped_at)}
                  href={article.link}
                  paywalled={isPaywalled(article.source)}
                  article={article}
                />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setVisibleTileCount((c) => c + TILES_PER_PAGE)}
                  className="px-8 py-2.5 border border-border text-[12px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
                >
                  Mehr laden
                </button>
              </div>
            )}
          </div>
        )}

        </> )} {/* end loading ternary */}

      </main>

      <Footer />
    </div>
  );
};

export default Index;
