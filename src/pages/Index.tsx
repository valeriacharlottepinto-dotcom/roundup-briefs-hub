import { useState, useEffect } from "react";
import Masthead from "@/components/Masthead";
import FilterBar from "@/components/FilterBar";
import ArticleGrid from "@/components/ArticleGrid";
import SiteFooter from "@/components/SiteFooter";
import ContactModal from "@/components/ContactModal";
import AboutPage from "@/components/AboutPage";
import ImprintPage from "@/components/ImprintPage";
import ScrollButtons from "@/components/ScrollButton";
import NewsletterModal from "@/components/NewsletterModal";
import { useArticles } from "@/hooks/useArticles";
import { type Locale } from "@/lib/constants";
import { TRANSLATIONS } from "@/lib/translations";
import { useAuth } from "@/hooks/useAuth";

interface IndexProps {
  locale: Locale;
}

const Index = ({ locale }: IndexProps) => {
  const t = TRANSLATIONS[locale];
  const { setLocale } = useAuth();
  const [showAbout, setShowAbout] = useState(false);
  const [showImprint, setShowImprint] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  // Keep AuthContext locale in sync so OnboardingModal uses the right language
  useEffect(() => {
    setLocale(locale);
  }, [locale, setLocale]);

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
  } = useArticles(locale);

  const handleAboutToggle = () => {
    setShowAbout((v) => !v);
    setShowImprint(false);
  };

  const handleImprintOpen = () => {
    setShowImprint(true);
    setShowAbout(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Masthead
        stats={stats}
        showAbout={showAbout}
        onAboutToggle={handleAboutToggle}
        locale={locale}
        onNewsletterClick={() => setNewsletterOpen(true)}
      />

      {showImprint ? (
        <ImprintPage onClose={() => setShowImprint(false)} />
      ) : showAbout ? (
        <AboutPage />
      ) : (
        <>
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
        </>
      )}

      <SiteFooter
        onNewsletterClick={() => setNewsletterOpen(true)}
        onContactClick={() => setContactOpen(true)}
        t={t}
      />

      {/* Impressum */}
      <div className="w-full text-center py-3 border-t border-border bg-background">
        <button
          onClick={handleImprintOpen}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2"
        >
          Impressum / Imprint
        </button>
      </div>

      <ScrollButtons />

      <NewsletterModal
        open={newsletterOpen}
        onClose={() => setNewsletterOpen(false)}
        locale={locale}
      />

      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        t={t}
      />
    </div>
  );
};

export default Index;
