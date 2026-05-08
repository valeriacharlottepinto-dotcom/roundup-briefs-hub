import { type Translations } from "@/lib/translations";

interface SiteFooterProps {
  onNewsletterClick: () => void;
  onContactClick: () => void;
  t: Translations;
}

const SiteFooter = ({ onNewsletterClick, onContactClick, t }: SiteFooterProps) => (
  <footer className="max-w-[1100px] mx-auto px-4 py-10 mt-12 border-t border-border">
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="font-serif-display text-base font-bold text-foreground tracking-tight select-none">
        shared ground
      </p>

      <div className="flex items-center gap-5">
        <button
          onClick={onNewsletterClick}
          className="text-[0.7rem] font-sans uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
        >
          Newsletter
        </button>
        <button
          onClick={onContactClick}
          className="text-[0.7rem] font-sans uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
        >
          {t.contactUs}
        </button>
      </div>

      <p className="text-xs text-muted-foreground font-sans">
        von Valeria Pinto &amp; Alexandra Brandl
      </p>
    </div>
  </footer>
);

export default SiteFooter;
