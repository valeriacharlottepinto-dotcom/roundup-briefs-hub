import { useState } from "react";
import Masthead from "@/components/Masthead";
import FilterBar from "@/components/FilterBar";
import ArticleGrid from "@/components/ArticleGrid";
import SiteFooter from "@/components/SiteFooter";
import AboutPage from "@/components/AboutPage";
import ImprintPage from "@/components/ImprintPage";
import ScrollButtons from "@/components/ScrollButton";
import { useArticles } from "@/hooks/useArticles";
import { SOURCES_BY_LOCALE, type Locale } from "@/lib/constants";
import { TRANSLATIONS } from "@/lib/translations";

interface IndexProps {
  locale: Locale;
}

const Index = ({ locale }: IndexProps) => {
  const t = TRANSLATIONS[locale];
  const [showAbout, setShowAbout] = useState(false);
  const [showImprint, setShowImprint] = useState(false);

  const {
    articles,
    stats,
    loading,
    error,
    filters,
    setFilters,
    isFiltered,
    clearFilters,
    page,
    setPage,
    totalPages,
    totalCount,
  } = useArticles(locale);

  const handleAboutToggle = () => {
    setShowAbout((v) => !v);
    setShowImprint(false);
  };

  const handleImprintOpen = () => {
    setShowImprint(true);
    setShowAbout(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleImprintClose = () => {
    setShowImprint(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Masthead
        stats={stats}
        showAbout={showAbout}
        onAboutToggle={handleAboutToggle}
        locale={locale}
        t={t}
      />

      {showImprint ? (
        <ImprintPage onClose={handleImprintClose} />
      ) : showAbout ? (
        <AboutPage />
      ) : (
        <>
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            localeSources={SOURCES_BY_LOCALE[locale]}
            articleCount={articles.length}
            totalCount={totalCount}
            isFiltered={isFiltered}
            clearFilters={clearFilters}
            locale={locale}
            t={t}
          />
          <div className="pt-4 pb-8">
            <ArticleGrid
              articles={articles}
              loading={loading}
              error={error}
              isFiltered={isFiltered}
              clearFilters={clearFilters}
              page={page}
              totalPages={totalPages}
              setPage={setPage}
              t={t}
            />
          </div>
        </>
      )}

      <SiteFooter />

      {/* Impressum link — fixed at very bottom */}
      <div className="w-full text-center py-3 border-t border-border bg-background">
        <button
          onClick={handleImprintOpen}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
        >
          Impressum / Imprint
        </button>
      </div>

      <ScrollButtons />
    </div>
  );
};

export default Index;
