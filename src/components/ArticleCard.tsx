import { format } from "date-fns";
import { type Article, getSourceBorderColor } from "@/lib/constants";

interface ArticleCardProps {
  article: Article;
  imageUrl?: string;
}

const ArticleCard = ({ article, imageUrl }: ArticleCardProps) => {
  const stripColor = getSourceBorderColor(article.source);
  const topics = (article.topics || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const dateStr = article.scraped_at
    ? format(new Date(article.scraped_at), "d MMM yyyy")
    : "";

  return (
    <article className="bg-card border border-border flex flex-col transition-colors hover:bg-surface-hover group rounded-sm overflow-hidden">
      {/* Top accent strip */}
      <div className="h-[3px] w-full" style={{ backgroundColor: stripColor }} />

      {/* Preview image */}
      <div className="aspect-[4/3] bg-secondary overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              No preview
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Meta row */}
        <div className="flex items-center justify-between mb-2">
          <span className="inline-block px-2 py-0.5 rounded-sm text-[0.68rem] font-semibold uppercase tracking-wider bg-secondary text-muted-foreground">
            {article.source}
          </span>
          <span className="text-[0.7rem] text-muted-foreground whitespace-nowrap">
            {dateStr}
          </span>
        </div>

        {/* Headline */}
        <h2 className="font-serif-display text-[1.1rem] font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1.5">
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {article.title}
          </a>
        </h2>

        {/* Summary */}
        {article.summary && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-3">
            {article.summary}
          </p>
        )}

        {/* Topic tags — rectangular, subtle */}
        {topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3 mt-auto">
            {topics.map((topic) => (
              <span
                key={topic}
                className="inline-block px-2 py-0.5 text-[0.65rem] font-medium border border-border bg-background text-foreground rounded-none"
              >
                {topic}
              </span>
            ))}
          </div>
        )}

        {/* Read more */}
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:underline mt-auto"
        >
          Read full article →
        </a>
      </div>
    </article>
  );
};

export default ArticleCard;
