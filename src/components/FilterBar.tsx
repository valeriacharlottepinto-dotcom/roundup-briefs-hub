import { useCallback, useEffect, useRef, useState } from "react";
import { type Filters } from "@/hooks/useArticles";
import { type Locale } from "@/lib/constants";
import { type Translations } from "@/lib/translations";
import { Search, X, ChevronDown, Check } from "lucide-react";

interface FilterBarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  localeSources: string[];
  articleCount: number;
  totalCount: number;
  isFiltered: boolean;
  clearFilters: () => void;
  locale: Locale;
  t: Translations;
}

const FilterBar = ({
  filters,
  setFilters,
  localeSources,
  articleCount,
  totalCount,
  isFiltered,
  clearFilters,
  t,
}: FilterBarProps) => {
  const [searchInput, setSearchInput] = useState(filters.search);
  const [sourceOpen, setSourceOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const sourceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilters((f) => ({ ...f, search: searchInput }));
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput, setFilters]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sourceRef.current && !sourceRef.current.contains(e.target as Node)) {
        setSourceOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
      ? t.allSources
      : filters.selectedSources.length === 1
      ? filters.selectedSources[0]
      : `${filters.selectedSources.length} ${t.sources}`;

  const countLabel = isFiltered
    ? `${articleCount} / ${totalCount} ${t.articles}`
    : `${totalCount} ${t.articles}`;

  return (
    <div className="sticky top-0 z-30 bg-card border-b border-border">
      <div className="max-w-[1100px] mx-auto px-4 py-3 space-y-2">

        {/* ROW A — Today + date range */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={selectToday}
            className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors whitespace-nowrap select-none ${
              filters.timeRange === "today"
                ? "bg-foreground text-background"
                : "bg-secondary text-secondary-foreground hover:bg-border"
            }`}
          >
            {t.quickToday}
          </button>
          <span className="hidden sm:inline text-muted-foreground text-xs mx-1">📅</span>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="text-xs px-2 py-1.5 rounded-sm border border-border bg-card text-foreground w-full sm:w-auto"
            aria-label="From date"
          />
          <span className="text-xs text-muted-foreground">{t.dateTo}</span>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="text-xs px-2 py-1.5 rounded-sm border border-border bg-card text-foreground w-full sm:w-auto"
            aria-label="To date"
          />
          {(filters.dateFrom || filters.dateTo) && (
            <button
              onClick={clearDates}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* ROW B — Search + Sources + Clear + Count */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2">

          <div className="relative flex-1 min-w-0 sm:min-w-[180px] sm:max-w-[320px]">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-sm border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div ref={sourceRef} className="relative">
            <button
              onClick={() => setSourceOpen((o) => !o)}
              className="flex items-center gap-1.5 text-xs px-2 py-1.5 rounded-sm border border-border bg-card text-foreground whitespace-nowrap w-full sm:w-auto justify-between"
            >
              <span
                className={
                  filters.selectedSources.length > 0
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }
              >
                {sourceLabel}
              </span>
              <ChevronDown
                size={12}
                className={`transition-transform ${sourceOpen ? "rotate-180" : ""}`}
              />
            </button>

            {sourceOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 max-h-72 overflow-y-auto bg-card border border-border rounded-sm shadow-lg z-50">
                {filters.selectedSources.length > 0 && (
                  <button
                    onClick={clearSources}
                    className="w-full text-left px-3 py-2 text-xs text-primary hover:bg-secondary border-b border-border font-medium"
                  >
                    {t.clearSelection} ({filters.selectedSources.length})
                  </button>
                )}
                {localeSources.map((s) => {
                  const checked = filters.selectedSources.includes(s);
                  return (
                    <label
                      key={s}
                      onClick={() => toggleSource(s)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-secondary cursor-pointer select-none"
                    >
                      <span
                        className={`flex-shrink-0 w-3.5 h-3.5 border rounded-none flex items-center justify-center transition-colors ${
                          checked
                            ? "bg-foreground border-foreground"
                            : "border-border bg-background"
                        }`}
                      >
                        {checked && <Check size={9} className="text-background" />}
                      </span>
                      <span
                        className={
                          checked ? "text-foreground font-medium" : "text-muted-foreground"
                        }
                      >
                        {s}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 sm:ml-auto">
            {isFiltered && (
              <button
                onClick={() => {
                  clearFilters();
                  setSearchInput("");
                }}
                className="text-xs text-primary hover:underline font-medium whitespace-nowrap"
              >
                {t.clearAll}
              </button>
            )}
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {countLabel}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FilterBar;
