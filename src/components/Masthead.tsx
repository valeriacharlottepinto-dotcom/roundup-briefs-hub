import { format } from "date-fns";
import { Link, NavLink } from "react-router-dom";
import { Search, Bookmark } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { label: "HOME", to: "/de" },
  { label: "GLOBAL MAP", to: "/map" },
  { label: "PODCASTS", to: "/podcasts" },
  { label: "NEWSLETTER", to: "/newsletter" },
  { label: "ABOUT", to: "/ueber-uns" },
  { label: "SAVED", to: "/de/saved" },
];

const Masthead = () => {
  const { user, requireAuth } = useAuth();
  const today = format(new Date(), "EEEE, MMMM d, yyyy");

  return (
    <header>
      {/* Top bar: date + icons */}
      <div className="max-w-[1200px] mx-auto px-6 pt-3 flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-sans tracking-wide">{today}</span>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button aria-label="Suche" className="text-foreground/60 hover:text-foreground transition-colors">
            <Search className="w-4 h-4" />
          </button>
          <button aria-label="Gespeichert" className="text-foreground/60 hover:text-foreground transition-colors">
            <Bookmark className="w-4 h-4" />
          </button>
          <button
            onClick={() => requireAuth(() => {})}
            className="text-xs font-semibold font-sans text-foreground/70 hover:text-foreground transition-colors"
          >
            {user ? "Profil" : "Sign In"}
          </button>
        </div>
      </div>

      {/* Title block */}
      <div className="max-w-[1200px] mx-auto px-6 py-6 text-center border-y border-border mt-3">
        <Link to="/de" className="inline-block">
          <h1 className="font-serif-display text-6xl sm:text-8xl font-bold tracking-tight text-foreground hover:opacity-80 transition-opacity leading-none">
            Shared Ground
          </h1>
        </Link>
        <p className="mt-2 text-[0.6rem] font-sans tracking-[0.3em] uppercase text-muted-foreground">
          Global Feminist News &amp; Analysis
        </p>
      </div>

      {/* Horizontal nav */}
      <nav className="border-b border-border">
        <div className="max-w-[1200px] mx-auto px-6">
          <ul className="flex items-center justify-center gap-8 py-2.5">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/de"}
                  className={({ isActive }) =>
                    `text-[0.6rem] font-semibold font-sans tracking-[0.15em] pb-2 border-b-2 transition-colors ${
                      isActive
                        ? "border-foreground text-foreground"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Masthead;
