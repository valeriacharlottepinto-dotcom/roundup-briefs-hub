import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Bookmark } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSavedArticles } from "@/hooks/useSavedArticles";
import { formatDate } from "@/lib/api";

const Saved = () => {
  const { user, requireAuth } = useAuth();
  const { savedArticles, isLoading, unsaveArticle } = useSavedArticles();

  // ── Not signed in: sign-in prompt ──────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container max-w-[1400px] mx-auto px-6 py-8">
          <h2 className="headline-xl mb-2">Gespeicherte Artikel</h2>
          <p className="body-lg text-muted-foreground mb-8">
            Deine persönliche Leseliste.
          </p>

          <div className="flex items-center justify-center py-20">
            <div className="text-center border border-border rounded-sm p-10 bg-card max-w-md">
              <Bookmark size={40} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-headline text-xl font-bold mb-2">
                Melde dich an, um Artikel zu speichern
              </h3>
              <p className="body-sm text-muted-foreground mb-6">
                Wenn du angemeldet bist, kannst du Artikel speichern und später
                lesen — synchronisiert über alle deine Geräte.
              </p>
              <button
                onClick={() => requireAuth(() => {})}
                className="px-6 py-2.5 border border-foreground text-[12px] font-semibold uppercase tracking-widest text-foreground hover:bg-foreground hover:text-background transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container max-w-[1400px] mx-auto px-6 py-8">
          <h2 className="headline-xl mb-2">Gespeicherte Artikel</h2>
          <p className="body-lg text-muted-foreground mb-8">
            Deine persönliche Leseliste.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-sm" />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Empty ──────────────────────────────────────────────────────────────────
  if (savedArticles.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container max-w-[1400px] mx-auto px-6 py-8">
          <h2 className="headline-xl mb-2">Gespeicherte Artikel</h2>
          <p className="body-lg text-muted-foreground mb-8">
            Deine persönliche Leseliste.
          </p>
          <div className="flex items-center justify-center py-20">
            <div className="text-center border border-border rounded-sm p-10 bg-card max-w-md">
              <Bookmark size={40} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-headline text-xl font-bold mb-2">
                Noch keine Artikel gespeichert
              </h3>
              <p className="body-sm text-muted-foreground">
                Klick auf das Lesezeichen-Symbol bei einem Artikel, um ihn hier
                zu speichern.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── List ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-[1400px] mx-auto px-6 py-8">
        <h2 className="headline-xl mb-2">Gespeicherte Artikel</h2>
        <p className="body-lg text-muted-foreground mb-8">
          {savedArticles.length}{" "}
          {savedArticles.length === 1 ? "Artikel" : "Artikel"} in deiner
          Leseliste.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedArticles.map((article) => (
            <article
              key={article.id}
              className="border border-border rounded-sm p-5 bg-card flex flex-col group"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {article.source_name}
                  {article.is_paywalled && (
                    <span className="ml-1.5 inline-block bg-foreground/75 text-background text-[9px] font-semibold px-1.5 py-0.5 rounded-sm">
                      €
                    </span>
                  )}
                </span>
                <button
                  onClick={() => unsaveArticle(article.article_url)}
                  className="text-foreground hover:text-muted-foreground transition-colors flex-shrink-0"
                  aria-label="Entfernen"
                >
                  <Bookmark size={16} fill="currentColor" />
                </button>
              </div>

              <a
                href={article.article_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block flex-1"
              >
                <h3 className="font-headline text-lg font-bold leading-snug group-hover:text-accent-blue transition-colors line-clamp-3 mb-2">
                  {article.title}
                </h3>
                {article.summary_snapshot && (
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                    {article.summary_snapshot}
                  </p>
                )}
              </a>

              <div className="text-[11px] text-muted-foreground uppercase tracking-wide mt-auto">
                Gespeichert {formatDate(article.saved_at)}
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Saved;
