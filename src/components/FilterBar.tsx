import { useCallback, useEffect, useRef, useState } from "react";
import { TOPICS, TIME_RANGES } from "@/lib/constants";
import { type Filters } from "@/hooks/useArticles";
import { Search, X } from "lucide-react";

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
  sources,
  articleCount,
  isFiltered,
  clearFilters,
}: FilterBarProps) => {
  const [searchInput, setSearchInput] = useState(filters.search);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilters((f) => ({ ...f, search: searchInput }));
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [searchInput, setFilters]);

  const toggleTopic = useCallback(
    (label: string) => {
      setFilters((f) => {
        if (label === "All Topics") return { ...f, selectedTopics: [] };
        const current = f.selectedTopics;
        const next = current.includes(label)
          ? current.filter((t) => t !== label)
          : [...current, label];
        return { ...f, selectedTopics: next };
      });
    },
    [setFilters]
  );

  const selectTime = useCallback(
    (value: string) => {
      setFilters((f) => ({
        ...f,
        timeRange: f.timeRange === value ? null : value,
        dateFrom: "",
        dateTo: "",
      }));
    },
    [setFilters]
  );

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

  const setSource = useCallback(
    (v: string) => setFilters((f) => ({ ...f, source: v })),
    [setFilters]
  );

  return (
    <div className="sticky top-0 z-30 bg-card border-b border-border">
      <div className="max-w-[1100px] mx-auto px-4 py-3 space-y-3">
        {/* ROW A — Topics */}
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
                  ${
                    active
                      ? "bg-chip-active text-chip-active-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-border"
                  }
                `}
              >
                {t.emoji} {t.label}
              </button>
            );
          })}
        </div>

        {/* ROW B — Time */}
        <div className="flex flex-wrap items-center gap-2">
          {TIME_RANGES.map((t) => (
            <button
              key={t.value}
              onClick={() => selectTime(t.value)}
              className={`
                px-3 py-1.5 rounded-sm text-xs font-medium transition-colors whitespace-nowrap select-none
                ${
                  filters.timeRange === t.value
                    ? "bg-chip-active text-chip-active-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-border"
                }
              `}
            >
              {t.label}
            </button>
          ))}
          <span className="hidden sm:inline text-muted-foreground text-xs mx-1">📅</span>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="text-xs px-2 py-1.5 rounded-md border border-border bg-card text-foreground"
            aria-label="Date from"
          />
          <span className="text-xs text-muted-foreground">to</span>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="text-xs px-2 py-1.5 rounded-md border border-border bg-card text-foreground"
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

        {/* ROW C — Search, Source, Clear, Count */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[180px] max-w-[320px]">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search headlines…"
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-md border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <select
            value={filters.source}
            onChange={(e) => setSource(e.target.value)}
            className="text-xs px-2 py-1.5 rounded-md border border-border bg-card text-foreground"
          >
            <option value="">All Sources</option>
            {sources.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {isFiltered && (
            <button
              onClick={() => {
                clearFilters();
                setSearchInput("");
              }}
              className="text-xs text-primary hover:underline font-medium"
            >
              Clear all filters
            </button>
          )}
          <span className="ml-auto text-xs text-muted-foreground whitespace-nowrap">
            {articleCount} article{articleCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
