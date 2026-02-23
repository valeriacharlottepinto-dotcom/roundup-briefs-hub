import { useState } from "react";
import Masthead from "@/components/Masthead";
import FilterBar from "@/components/FilterBar";
import ArticleGrid from "@/components/ArticleGrid";
import SiteFooter from "@/components/SiteFooter";
import AboutPage from "@/components/AboutPage";
import ScrollButtons from "@/components/ScrollButton";
import { useArticles } from "@/hooks/useArticles";

const Index = () => {
  const [showAbout, setShowAbout] = useState(false);
  const {
    articles,
    stats,
    loading,
    error,
    filters,
    setFilters,
    sources,
    isFiltered,
    clearFilters,
  } = useArticles();

  return (
    <div className="min-h-screen bg-background">
      <Masthead
        stats={stats}
        showAbout={showAbout}
        onAboutToggle={() => setShowAbout((v) => !v)}
      />

      {showAbout ? (
        <AboutPage />
      ) : (
        <>
          <FilterBar
            filters={filters}
            setFilters={setFilters}
            sources={sources}
            articleCount={articles.length}
            isFiltered={isFiltered}
            clearFilters={clearFilters}
          />
          <div className="pt-4 pb-8">
            <ArticleGrid
              articles={articles}
              loading={loading}
              error={error}
              isFiltered={isFiltered}
              clearFilters={clearFilters}
            />
          </div>
        </>
      )}

      <SiteFooter />
      <ScrollButtons />
    </div>
  );
};

export default Index;
