import { type Article } from "@/lib/constants";
import ArticleCard from "./ArticleCard";

interface ArticleGridProps {
  articles: Article[];
  loading: boolean;
  error: string | null;
  isFiltered: boolean;
  clearFilters: () => void;
}

const SkeletonTile = () => (
  <div className="bg-card border border-border rounded-sm overflow-hidden animate-pulse">
    <div className="h-[3px] bg-secondary" />
    <div className="p-5 space-y-3">
      <div className="flex justify-between">
        <div className="h-4 w-16 rounded-sm bg-secondary" />
        <div className="h-4 w-20 rounded-sm bg-secondary" />
      </div>
      <div className="h-6 w-3/4 rounded-sm bg-secondary" />
      <div className="h-5 w-full rounded-sm bg-secondary" />
      <div className="h-4 w-5/6 rounded-sm bg-secondary" />
      <div className="flex gap-1.5">
        <div className="h-4 w-16 rounded-sm bg-secondary" />
        <div className="h-4 w-20 rounded-sm bg-secondary" />
      </div>
      <div className="h-3 w-24 rounded-sm bg-secondary" />
    </div>
  </div>
);

const ArticleGrid = ({
  articles,
  loading,
  error,
  isFiltered,
  clearFilters,
}: ArticleGridProps) => {
  if (loading) {
    return (
      <div className="max-w-[1100px] mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonTile key={i} />
        ))}
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
        <ArticleCard key={article.id} article={article} />
      ))}
    </main>
  );
};

export default ArticleGrid;
