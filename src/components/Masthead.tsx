import { type Stats } from "@/lib/constants";
import { format } from "date-fns";

interface MastheadProps {
  stats: Stats | null;
}

const Masthead = ({ stats }: MastheadProps) => {
  const lastScraped = stats?.last_scraped
    ? format(new Date(stats.last_scraped), "d MMM yyyy, HH:mm")
    : null;

  return (
    <header className="max-w-[1100px] mx-auto px-4 pt-8 pb-4">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h1 className="font-serif-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Roundup Briefs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground font-sans">
            Browse your news on your terms.
          </p>
        </div>
        {stats && (
          <div className="text-right text-xs text-muted-foreground uppercase tracking-wider font-sans leading-relaxed">
            <div>{stats.total.toLocaleString()} articles</div>
            {lastScraped && <div>Updated {lastScraped}</div>}
          </div>
        )}
      </div>
      <hr className="mt-4 border-border" />
    </header>
  );
};

export default Masthead;
