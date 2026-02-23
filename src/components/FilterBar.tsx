import { useCallback, useEffect, useRef, useState } from "react";
import { TOPICS } from "@/lib/constants";
import { type Filters } from "@/hooks/useArticles";
import { Search, X, ChevronDown, Check } from "lucide-react";

// All sources — sorted alphabetically
const ALL_SOURCES = [
  "ABC News", "Accuracy in Media", "Advocate", "Al Jazeera", "AlterNet",
  "Associated Press", "Autostraddle", "BBC News", "BBC News World",
  "CBC News World", "CNN World", "Democracy Now", "Fair Observer",
  "Feministing", "Financial Times", "FSRN", "Gay Times", "Global Voices",
  "HuffPost", "IPS News Agency", "Jezebel", "Jewish Voice for Peace",
  "Le Monde", "Le Monde Diplomatique", "LGBTQ Nation", "Media Matters",
  "Ms. Magazine", "New York Times", "NPR News", "Out Magazine", "PinkNews",
  "Queerty", "Refinery29 Feminism", "Reveal News", "Reuters", "Reuters World",
  "SBS News World", "The Conversation", "The Funambulist", "The Guardian",
  "The Guardian Women", "The Independent", "The Progressive", "Them",
  "Washington Post", "Xtra Magazine",
];

interface FilterBarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  sources: string[];
  articleCount: number;
  isFiltered: boolean;
  clearFilters: () => void;
}

const FilterBar = ({
  filters,
  setFilters,
  articleCount,
  isFiltered,
  clearFilters,
}: FilterBarProps) => {
  const [searchInput, setSearchInput] = useState(filters.search);
  const [sourceOpen, setSourceOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const sourceRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilters((f) => ({ ...f, search: searchInput }));
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput, setFilters]);

  // Close source dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sourceRef.current && !sourceRef.current.contains(e.target as Node)) {
        setSourceOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggleTopic = useCallback(
    (label: string) => {
      setFilters((f) => {
        if (label === "All Topics") return { ...f, selectedTopics: [] };
        const next = f.selectedTopics.includes(label)
          ? f.selectedTopics.filter((t) => t !== label)
          : [...f.selectedTopics, label];
        return { ...f, selectedTopics: next };
      });
    },
    [setFilters]
  );

  const toggleSource = useCallback(
    (s: string) => {
      setFilters((f) => {
        const next = f.selectedSources.includes(s)
          ? f.selectedSources.filter((x) => x !== s)
          : [...f.selectedSources, s];
        return { ...f, selectedSources: next };
      });
    },
    [setFilters]
  );

  const clearSources = useCallback(
    () => setFilters((f) => ({ ...f, selectedSources: [] })),
    [setFilters]
  );

  const toggleFreeOnly = useCallback(() => {
    setFilters((f) => ({ ...f, freeOnly: !f.freeOnly }));
  }, [setFilters]);

  const selectToday = useCallback(() => {
    setFilters((f) => ({
      ...f,
      timeRange: f.timeRange === "today" ? null : "today",
      dateFrom: "",
      dateTo: "",
    }));
  }, [setFilters]);

  const setDateFrom = useCallback(
    (v: string) => setFilters((f) => ({ ...f, dateFrom: v, timeRange: null })),
    [setFilters]
  );
  const setDateTo = useCallback(
    (v: string) => setFilters((f) => ({ ...f, dateTo: v, timeRange: null })),
    [setFilters]
  );
  const clearDates = useCallback(
    () => setFilters((f) => ({ ...f, dateFrom: "", dateTo: "" })),
    [setFilters]
  );

  const sourceLabel =
    filters.selectedSources.length === 0
      ? "All Sources"
      : filters.selectedSources.length === 1
      ? filters.selectedSources[0]
      : `${filters.selectedSources.length} sources`;

  return (
    <div className="sticky top-0 z-30 bg-card border-b border-border">
      <div className="max-w-[1100px] mx-auto px-4 py-3 space-y-3">

        {/* ROW A — Topics (horizontally scrollable) */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {TOPICS.map((t) => {
            const isAll = t.label === "All Topics";
            const active = isAll
              ? filters.selectedTopics.length === 0
              : filters.selectedTopics.includes(t.label);
            return (
              <button
                key={t.label}
                onClick={() => toggleTopic(t.label)}
                className={`
                  flex-shrink-0 px-3 py-1.5 rounded-sm text-xs font-medium transition-colors
                  whitespace-nowrap select-none
                  ${active
                    ? "bg-chip-active text-chip-active-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-border"}
                `}
              >
                {t.emoji} {t.label}
              </button>
            );
          })}
        </div>

        {/* ROW B — Today + Custom Date Range */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={selectToday}
            className={`
              px-3 py-1.5 rounded-sm text-xs font-medium transition-colors whitespace-nowrap select-none
              ${filters.timeRange === "today"
                ? "bg-chip-active text-chip-active-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-border"}
            `}
          >
            Today
          </button>
          <span className="hidden sm:inline text-muted-foreground text-xs mx-1">📅</span>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="text-xs px-2 py-1.5 rounded-sm border border-border bg-card text-foreground w-full sm:w-auto"
            aria-label="Date from"
          />
          <span className="text-xs text-muted-foreground">to</span>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="text-xs px-2 py-1.5 rounded-sm border border-border bg-card text-foreground w-full sm:w-auto"
            aria-label="Date to"
          />
          {(filters.dateFrom || filters.dateTo) && (
            <button
              onClick={clearDates}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear dates"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* ROW C — Search + Multi-Source dropdown + Clear + Count */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2">

          {/* Search */}
          <div className="relative flex-1 min-w-0 sm:min-w-[180px] sm:max-w-[320px]">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search headlines…"
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-sm border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Multi-select source dropdown */}
          <div ref={sourceRef} className="relative">
            <button
              onClick={() => setSourceOpen((o) => !o)}
              className="flex items-center gap-1.5 text-xs px-2 py-1.5 rounded-sm border border-border bg-card text-foreground whitespace-nowrap w-full sm:w-auto justify-between"
            >
              <span className={filters.selectedSources.length > 0 ? "text-foreground font-medium" : "text-muted-foreground"}>
                {sourceLabel}
              </span>
              <ChevronDown size={12} className={`transition-transform ${sourceOpen ? "rotate-180" : ""}`} />
            </button>

            {sourceOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 max-h-72 overflow-y-auto bg-card border border-border rounded-sm shadow-lg z-50">
                {/* Clear selection row */}
                {filters.selectedSources.length > 0 && (
                  <button
                    onClick={clearSources}
                    className="w-full text-left px-3 py-2 text-xs text-primary hover:bg-secondary border-b border-border font-medium"
                  >
                    Clear selection ({filters.selectedSources.length})
                  </button>
                )}
                {ALL_SOURCES.map((s) => {
                  const checked = filters.selectedSources.includes(s);
                  return (
                    <label
                      key={s}
                      onClick={() => toggleSource(s)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-secondary cursor-pointer select-none"
                    >
                      <span className={`flex-shrink-0 w-3.5 h-3.5 border rounded-none flex items-center justify-center transition-colors ${checked ? "bg-chip-active border-chip-active" : "border-border bg-background"}`}>
                        {checked && <Check size={9} className="text-chip-active-foreground" />}
                      </span>
                      <span className={checked ? "text-foreground font-medium" : "text-muted-foreground"}>
                        {s}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          {/* Free only toggle — sits right next to the source dropdown */}
          <button
            onClick={toggleFreeOnly}
            className={`
              flex-shrink-0 px-3 py-1.5 rounded-sm text-xs font-medium transition-colors whitespace-nowrap select-none
              ${filters.freeOnly
                ? "bg-chip-active text-chip-active-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-border"}
            `}
            title="Hide articles from paywalled sources (NYT, FT, Washington Post)"
          >
            🔓 Free only
          </button>

          {/* Clear all + count */}
          <div className="flex items-center gap-2 sm:ml-auto">
            {isFiltered && (
              <button
                onClick={() => {
                  clearFilters();
                  setSearchInput("");
                }}
                className="text-xs text-primary hover:underline font-medium whitespace-nowrap"
              >
                Clear all
              </button>
            )}
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {articleCount} article{articleCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
