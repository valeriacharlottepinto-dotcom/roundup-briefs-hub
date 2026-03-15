import { type Translations } from "@/lib/translations";

interface SiteFooterProps {
  onNewsletterClick: () => void;
  t: Translations;
}

const SiteFooter = ({ onNewsletterClick, t }: SiteFooterProps) => (
  <footer className="max-w-[1100px] mx-auto px-4 py-8 mt-12 border-t border-border">
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
      <p>shared ground · Scrapes daily · Built for independent readers</p>
      <button
        onClick={onNewsletterClick}
        className="hover:text-foreground transition-colors underline underline-offset-2"
      >
        {t.getNewsletter}
      </button>
    </div>
  </footer>
);

export default SiteFooter;
