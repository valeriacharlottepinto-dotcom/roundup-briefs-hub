import { type Article } from "@/lib/constants";
import { type Translations } from "@/lib/translations";
import ArticleCard from "./ArticleCard";

interface ArticleGridProps {
  articles: Article[];
  loading: boolean;
  error: string | null;
  isFiltered: boolean;
  clearFilters: () => void;
  page: number;
  totalPages: number;
  setPage: (page: number) => void;
  t: Translations;
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
  page,
  totalPages,
  setPage,
  t,
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
        <p className="text-muted-foreground">{t.serverWaking}</p>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="max-w-[1100px] mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">{t.noArticles}</p>
        {isFiltered && (
          <button
            onClick={clearFilters}
            className="mt-2 text-sm text-primary hover:underline font-medium"
          >
            {t.clearFilters}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4">
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </main>

      {/* Pagination controls — only shown when there's more than one page */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            className="text-xs px-3 py-1.5 rounded-sm border border-border bg-card text-foreground
              hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {t.prevPage}
          </button>

          <span className="text-xs text-muted-foreground select-none">
            {page} {t.pageOf} {totalPages}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
            className="text-xs px-3 py-1.5 rounded-sm border border-border bg-card text-foreground
              hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {t.nextPage}
          </button>
        </div>
      )}
    </div>
  );
};

export default ArticleGrid;
