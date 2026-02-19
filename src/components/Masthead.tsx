import { type Stats } from "@/lib/constants";
import { format } from "date-fns";
import ThemeToggle from "./ThemeToggle";

interface MastheadProps {
  stats: Stats | null;
  showAbout: boolean;
  onAboutToggle: () => void;
}

const Masthead = ({ stats, showAbout, onAboutToggle }: MastheadProps) => {
  const lastScraped = stats?.last_scraped
    ? format(new Date(stats.last_scraped), "d MMM yyyy, HH:mm")
    : null;

  return (
    <header className="max-w-[1100px] mx-auto px-4 pt-8 pb-4">
      {/* Relative container so title can be absolutely centred */}
      <div className="relative flex items-start sm:items-center justify-between min-h-[4.5rem]">

        {/* Title — absolutely centred regardless of right-side width */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
          <h1 className="font-serif-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            shared ground
          </h1>
          <p className="mt-1 text-sm text-muted-foreground font-sans">
            Browse your news on your terms.
          </p>
        </div>

        {/* Right controls — in normal flow, pushed to the right */}
        <div className="ml-auto flex flex-col items-end gap-2 relative z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={onAboutToggle}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors font-sans"
            >
              {showAbout ? "← Back" : "About"}
            </button>
            <ThemeToggle />
          </div>
          {!showAbout && stats && (
            <div className="text-right text-xs text-muted-foreground uppercase tracking-wider font-sans leading-relaxed">
              <div>{stats.total.toLocaleString()} articles</div>
              {lastScraped && <div>Updated {lastScraped}</div>}
            </div>
          )}
        </div>
      </div>

      <hr className="mt-4 border-border" />
    </header>
  );
};

export default Masthead;
