import { useState } from "react";
import Masthead from "@/components/Masthead";
import CategoryTabs from "@/components/CategoryTabs";
import ArticleCard from "@/components/ArticleCard";
import ArticleGrid from "@/components/ArticleGrid";
import PodcastSidebar from "@/components/PodcastSidebar";
import SiteFooter from "@/components/SiteFooter";
import ScrollButton from "@/components/ScrollButton";
import { useArticles } from "@/hooks/useArticles";

interface FeedPageProps {
  country: string;
  countryName: string;
  isMainFeed?: boolean;
}

const FeedPage = ({ country, countryName, isMainFeed = false }: FeedPageProps) => {
  const [activeCategory, setActiveCategory] = useState("ALLE");

  const {
    articles,
    loading,
    error,
    isFiltered,
    clearFilters,
    loadOlderArticles,
    loadingOlder,
    hasOlderAvailable,
  } = useArticles(country);

  const filteredArticles =
    activeCategory === "ALLE"
      ? articles
      : articles.filter(
          (a) =>
            (a.category || "").toUpperCase() === activeCategory ||
            (a.topics || "").toUpperCase().includes(activeCategory)
        );

  const leftArticles = filteredArticles.slice(0, 6);
  const heroArticle = filteredArticles[0];
  const gridArticles = filteredArticles.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <Masthead />
      <CategoryTabs activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      <div className="max-w-[1200px] mx-auto px-6 py-6">
        {loading ? (
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-3 space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-16 h-16 bg-secondary rounded-sm flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-2 bg-secondary rounded w-1/3" />
                    <div className="h-3 bg-secondary rounded" />
                    <div className="h-3 bg-secondary rounded w-4/5" />
                  </div>
                </div>
              ))}
            </div>
            <div className="col-span-6">
              <div className="bg-secondary rounded-sm h-96 animate-pulse" />
            </div>
            <div className="col-span-3 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-16 h-16 bg-secondary rounded-sm flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-2 bg-secondary rounded w-1/3" />
                    <div className="h-3 bg-secondary rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-6">

            {/* Left: article list */}
            <div className="col-span-12 md:col-span-3 border-r border-border pr-6">
              <h2 className="text-[0.6rem] font-bold font-sans tracking-[0.15em] uppercase text-foreground border-b border-border pb-2 mb-4">
                Aktuell
              </h2>
              <div className="space-y-5 divide-y divide-border">
                {leftArticles.map((article) => (
                  <div key={article.id} className="pt-5 first:pt-0">
                    <ArticleCard article={article} variant="list" />
                  </div>
                ))}
                {leftArticles.length === 0 && (
                  <p className="text-xs text-muted-foreground">Keine Artikel verfügbar.</p>
                )}
              </div>
            </div>

            {/* Center: hero + grid */}
            <div className="col-span-12 md:col-span-6">
              {heroArticle ? (
                <>
                  <ArticleCard article={heroArticle} variant="hero" />
                  {gridArticles.length > 0 && (
                    <div className="mt-6">
                      <ArticleGrid
                        articles={gridArticles}
                        loading={false}
                        error={error}
                        isFiltered={isFiltered}
                        clearFilters={clearFilters}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="py-16 text-center">
                  <p className="text-sm text-muted-foreground">
                    {error ?? "Keine Artikel für diese Kategorie."}
                  </p>
                  {isFiltered && (
                    <button onClick={clearFilters} className="text-xs text-primary hover:underline mt-2">
                      Filter zurücksetzen
                    </button>
                  )}
                </div>
              )}

              {!loading && hasOlderAvailable && (
                <div className="py-6 text-center">
                  <button
                    onClick={loadOlderArticles}
                    disabled={loadingOlder}
                    className="text-xs text-muted-foreground hover:text-foreground border border-border px-4 py-2 rounded-sm transition-colors disabled:opacity-50"
                  >
                    {loadingOlder ? "Wird geladen…" : "Ältere Artikel laden"}
                  </button>
                </div>
              )}
            </div>

            {/* Right: podcasts */}
            <div className="col-span-12 md:col-span-3 border-l border-border pl-6">
              <PodcastSidebar />
            </div>

          </div>
        )}
      </div>

      <SiteFooter />
      <ScrollButton />
    </div>
  );
};

export default FeedPage;
