import { Bookmark } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSavedArticles } from "@/hooks/useSavedArticles";
import { type Article as ApiArticle } from "@/lib/api";
import { type Article as ConstantsArticle } from "@/lib/constants";
import { cn } from "@/lib/utils";

// Accept either the api.ts or constants.ts Article shape — useSavedArticles
// only needs id, title, link, source, published_at, topics, tags (+ optional
// locale and is_paywalled). The Vercel pages use api.ts; legacy code uses
// constants.ts.
type BookmarkableArticle = ApiArticle | ConstantsArticle;

interface BookmarkButtonProps {
  article: BookmarkableArticle;
  className?: string;
}

export default function BookmarkButton({
  article,
  className,
}: BookmarkButtonProps) {
  const { requireAuth } = useAuth();
  const { isSaved, saveArticle, unsaveArticle } = useSavedArticles();

  const saved = isSaved(article.link);

  const handleClick = (e: React.MouseEvent) => {
    // Stop the parent <a> from navigating when the bookmark is clicked
    e.preventDefault();
    e.stopPropagation();

    requireAuth(() => {
      if (isSaved(article.link)) {
        unsaveArticle(article.link);
      } else {
        // useSavedArticles' buildSnapshot tolerates missing locale/is_paywalled
        // (defaults to "en" / false), so casting is safe at runtime.
        saveArticle(article as ConstantsArticle);
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      aria-label={saved ? "Remove from saved" : "Save article"}
      title={saved ? "Remove from saved" : "Save article"}
      className={cn(
        "flex-shrink-0 p-1.5 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        saved
          ? "text-primary"
          : "text-muted-foreground/40 hover:text-muted-foreground",
        className
      )}
    >
      <Bookmark
        className="w-4 h-4"
        fill={saved ? "currentColor" : "none"}
        strokeWidth={1.5}
      />
    </button>
  );
}
