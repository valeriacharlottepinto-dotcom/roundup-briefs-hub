import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { API_BASE, type Article, type Stats, type Locale } from "@/lib/constants";

export type PaywallFilter = "all" | "free" | "paywalled";

export interface Filters {
  selectedTopics: string[];
  selectedSources: string[];   // multi-select — empty means "all"
  timeRange: string | null;
  dateFrom: string;
  dateTo: string;
  search: string;
  paywallFilter: PaywallFilter; // replaces freeOnly
}

export const defaultFilters: Filters = {
  selectedTopics: [],
  selectedSources: [],
  timeRange: null,
  dateFrom: "",
  dateTo: "",
  search: "",
  paywallFilter: "all",
};

export const PAGE_SIZE = 30;
export const GROUPED_LIMIT = 120; // larger fetch for the grouped homepage view

export function useArticles(locale: Locale) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFiltersState] = useState<Filters>(defaultFilters);
  const [page, setPageState] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Track prev locale to reset page on locale switch
  const prevLocaleRef = useRef(locale);

  useEffect(() => {
    if (prevLocaleRef.current !== locale) {
      prevLocaleRef.current = locale;
      setPageState(1);
      setFiltersState(defaultFilters);
    }
  }, [locale]);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // Determine if any real filters are active (same logic as isFiltered below)
        const anyFilter =
          filters.selectedTopics.length > 0 ||
          filters.selectedSources.length > 0 ||
          filters.timeRange !== null ||
          filters.dateFrom !== "" ||
          filters.dateTo !== "" ||
          filters.search !== "" ||
          filters.paywallFilter !== "all";

        const effectiveLimit = anyFilter ? PAGE_SIZE : GROUPED_LIMIT;
        const effectiveOffset = anyFilter ? (page - 1) * PAGE_SIZE : 0;

        const params = new URLSearchParams();
        params.set("locale", locale);
        params.set("limit", String(effectiveLimit));
        params.set("offset", String(effectiveOffset));

        if (filters.selectedTopics.length > 0) {
          params.set("topics", filters.selectedTopics.join(","));
        }
        if (filters.selectedSources.length > 0) {
          params.set("sources", filters.selectedSources.join(","));
        }
        if (filters.search) params.set("search", filters.search);
        if (filters.timeRange) params.set("time", filters.timeRange);
        if (filters.dateFrom) params.set("date_from", filters.dateFrom);
        if (filters.dateTo) params.set("date_to", filters.dateTo);
        if (filters.paywallFilter !== "all") {
          params.set("paywall", filters.paywallFilter);
        }

        const [articlesRes, statsRes] = await Promise.all([
          fetch(`${API_BASE}/api/articles?${params}`),
          fetch(`${API_BASE}/api/stats?locale=${locale}`),
        ]);
        if (!articlesRes.ok || !statsRes.ok) throw new Error("Failed to fetch");
        const articlesData = await articlesRes.json();
        const statsData = await statsRes.json();

        if (cancelled) return;

        // Support both new paginated format { articles: [...], total: N }
        // and old flat array format for backward compatibility during deploy.
        if (articlesData && typeof articlesData === "object" && "articles" in articlesData) {
          setArticles(Array.isArray(articlesData.articles) ? articlesData.articles : []);
          setTotalCount(typeof articlesData.total === "number" ? articlesData.total : 0);
        } else {
          const arr = Array.isArray(articlesData) ? articlesData : [];
          setArticles(arr);
          setTotalCount(arr.length);
        }
        setStats(statsData);
      } catch {
        if (!cancelled) {
          setError("Couldn't load articles. The server may be waking up — try refreshing.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [locale, filters, page]);

  // Wrap setFilters so any filter change resets to page 1
  const setFilters = useCallback(
    (updater: React.SetStateAction<Filters>) => {
      setFiltersState(updater);
      setPageState(1);
    },
    []
  );

  const setPage = useCallback((p: number) => {
    setPageState(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const isFiltered = useMemo(() => {
    return (
      filters.selectedTopics.length > 0 ||
      filters.selectedSources.length > 0 ||
      filters.timeRange !== null ||
      filters.dateFrom !== "" ||
      filters.dateTo !== "" ||
      filters.search !== "" ||
      filters.paywallFilter !== "all"
    );
  }, [filters]);

  // Grouped view stays active for date-only filtering — dates are a temporal
  // scope, not a content focus. Only topic/source/search/paywall switches to flat.
  const isGrouped = useMemo(() => {
    return (
      filters.selectedTopics.length === 0 &&
      filters.selectedSources.length === 0 &&
      filters.search === "" &&
      filters.paywallFilter === "all"
    );
  }, [filters]);

  const clearFilters = useCallback(() => {
    setFiltersState(defaultFilters);
    setPageState(1);
  }, []);

  return {
    articles,
    stats,
    loading,
    error,
    filters,
    setFilters,
    isFiltered,
    isGrouped,
    clearFilters,
    page,
    setPage,
    totalPages,
    totalCount,
  };
}
