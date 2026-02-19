import { type Article } from "@/lib/constants";
import ArticleCard from "./ArticleCard";
import { useOgImages } from "@/hooks/useOgImages";
import { useMemo } from "react";

interface ArticleGridProps {
  articles: Article[];
  loading: boolean;
  error: string | null;
  isFiltered: boolean;
  clearFilters: () => void;
}

const SkeletonCard = () => (
  <div className="bg-card border border-border rounded-sm overflow-hidden animate-pulse">
    <div className="h-[3px] bg-secondary" />
    <div className="aspect-[4/3] bg-secondary" />
    <div className="p-4 space-y-3">
      <div className="flex justify-between">
        <div className="h-4 w-16 rounded-sm bg-secondary" />
        <div className="h-4 w-20 rounded-sm bg-secondary" />
      </div>
      <div className="h-5 w-3/4 rounded-sm bg-secondary" />
      <div className="h-4 w-full rounded-sm bg-secondary" />
      <div className="h-3 w-24 rounded-sm bg-secondary" />
    </div>
  </div>
);

const ArticleGrid = ({ articles, loading, error, isFiltered, clearFilters }: ArticleGridProps) => {
  const links = useMemo(() => articles.map((a) => a.link), [articles]);
  const ogImages = useOgImages(links);

  if (loading) {
    return (
      <div className="max-w-[1100px] mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1100px] mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="max-w-[1100px] mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">No articles match your filters.</p>
        {isFiltered && (
          <button
            onClick={clearFilters}
            className="mt-2 text-sm text-primary hover:underline font-medium"
          >
            Clear filters
          </button>
        )}
      </div>
    );
  }

  return (
    <main className="max-w-[1100px] mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {articles.map((article) => (
        <ArticleCard
          key={article.id}
          article={article}
          imageUrl={ogImages[article.link]}
        />
      ))}
    </main>
  );
};

export default ArticleGrid;
