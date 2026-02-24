import { type Stats, type Locale } from "@/lib/constants";
import { type Translations } from "@/lib/translations";
import { format } from "date-fns";
import ThemeToggle from "./ThemeToggle";
import { useNavigate } from "react-router-dom";

interface MastheadProps {
  stats: Stats | null;
  showAbout: boolean;
  onAboutToggle: () => void;
  locale: Locale;
  t: Translations;
}

const Masthead = ({ stats, showAbout, onAboutToggle, locale, t }: MastheadProps) => {
  const navigate = useNavigate();
  const lastScraped = stats?.last_scraped
    ? format(new Date(stats.last_scraped), "d MMM yyyy, HH:mm")
    : null;

  return (
    <header className="max-w-[1100px] mx-auto px-4 pt-6 pb-4">

      {/* Mobile: stacked column with centred title.
          Desktop (sm+): relative row — title absolutely centred, controls on right */}
      <div className="flex flex-col items-center gap-3 sm:relative sm:flex sm:flex-row sm:items-center sm:justify-between sm:min-h-[4.5rem] sm:gap-0">

        {/* Title — centred on both mobile and desktop */}
        <div className="text-center sm:absolute sm:inset-0 sm:flex sm:flex-col sm:items-center sm:justify-center pointer-events-none select-none">
          <h1 className="font-serif-display text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            shared ground
          </h1>
          <p className="mt-1 text-sm text-muted-foreground font-sans">
            {t.tagline}
          </p>
        </div>

        {/* Controls — row on mobile, column on desktop (right-aligned) */}
        <div className="flex items-center gap-3 sm:ml-auto sm:flex-col sm:items-end sm:gap-2 relative z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={onAboutToggle}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors font-sans"
            >
              {showAbout ? t.back : t.about}
            </button>

            {/* Locale toggle */}
            <div className="flex items-center gap-1 text-xs font-sans">
              <button
                onClick={() => navigate("/en")}
                className={`transition-colors ${
                  locale === "en"
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Switch to English"
              >
                EN
              </button>
              <span className="text-muted-foreground select-none">/</span>
              <button
                onClick={() => navigate("/de")}
                className={`transition-colors ${
                  locale === "de"
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Zu Deutsch wechseln"
              >
                DE
              </button>
            </div>

            <ThemeToggle />
          </div>
          {!showAbout && stats && (
            <div className="hidden sm:block text-right text-xs text-muted-foreground uppercase tracking-wider font-sans leading-relaxed">
              <div>{stats.total.toLocaleString()} {t.articles}</div>
              {lastScraped && <div>{t.updatedAt} {lastScraped}</div>}
            </div>
          )}
        </div>
      </div>

      <hr className="mt-4 border-border" />
    </header>
  );
};

export default Masthead;
