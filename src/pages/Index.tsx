import RainbowStripe from "@/components/RainbowStripe";
import Masthead from "@/components/Masthead";
import FilterBar from "@/components/FilterBar";
import ArticleGrid from "@/components/ArticleGrid";
import SiteFooter from "@/components/SiteFooter";
import { useArticles } from "@/hooks/useArticles";

const Index = () => {
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
      <RainbowStripe />
      <Masthead stats={stats} />
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
      <SiteFooter />
    </div>
  );
};

export default Index;
