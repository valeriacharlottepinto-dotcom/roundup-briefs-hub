import { useState, useEffect, useMemo, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { type Article, type Stats } from "@/lib/constants";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Filters {
  selectedTopics: string[];
  selectedSources: string[];
  timeRange: string | null;
  dateFrom: string;
  dateTo: string;
  search: string;
  freeOnly: boolean;
}

const defaultFilters: Filters = {
  selectedTopics: [],
  selectedSources: [],
  timeRange: null,
  dateFrom: "",
  dateTo: "",
  search: "",
  freeOnly: false,
};

// ─── Locale resolution ────────────────────────────────────────────────────────
// Accepts either a locale ("de" | "en") directly or a country name.
// DACH countries → German feed; everything else → English.

const DACH_COUNTRIES = new Set(["Germany", "Austria", "Switzerland"]);

function resolveLocale(localeOrCountry?: string): "de" | "en" {
  if (!localeOrCountry) return "de";
  if (localeOrCountry === "de") return "de";
  if (localeOrCountry === "en") return "en";
  return DACH_COUNTRIES.has(localeOrCountry) ? "de" : "en";
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useArticles(localeOrCountry?: string) {
  const locale = resolveLocale(localeOrCountry);

  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  // ── Initial fetch ────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);
      setAllArticles([]);

      try {
        const { data, error: fetchError } = await supabase
          .from("articles")
          .select("*")
          .eq("locale", locale)
          .order("published_at", { ascending: false, nullsFirst: false })
          .order("scraped_at", { ascending: false })
          .limit(150);

        if (cancelled) return;
        if (fetchError) throw fetchError;

        setAllArticles((data as Article[]) ?? []);
      } catch {
        if (!cancelled) {
          setError("Couldn't load articles — please refresh the page.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [locale]);

  // ── Derived: stats ───────────────────────────────────────────────────────
  const stats = useMemo<Stats | null>(() => {
    if (!allArticles.length) return null;
    return {
      total: allArticles.length,
      lgbtqia_plus: allArticles.filter((a) =>
        (a.tags || "").includes("lgbtqia+")
      ).length,
      women: allArticles.filter((a) => (a.tags || "").includes("women"))
        .length,
      last_scraped: allArticles[0]?.scraped_at ?? "",
    };
  }, [allArticles]);

  // ── Derived: unique sources list ─────────────────────────────────────────
  const sources = useMemo(() => {
    const s = new Set(allArticles.map((a) => a.source).filter(Boolean));
    return Array.from(s).sort();
  }, [allArticles]);

  // ── Derived: is any filter active? ───────────────────────────────────────
  const isFiltered = useMemo(
    () =>
      filters.selectedTopics.length > 0 ||
      filters.selectedSources.length > 0 ||
      filters.timeRange !== null ||
      filters.dateFrom !== "" ||
      filters.dateTo !== "" ||
      filters.search !== "" ||
      filters.freeOnly,
    [filters]
  );

  // ── Derived: filtered article list ───────────────────────────────────────
  const articles = useMemo(() => {
    return allArticles.filter((article) => {
      // Topic filter
      if (filters.selectedTopics.length > 0) {
        const articleTopics = (article.topics || "")
          .split(",")
          .map((t) => t.trim());
        if (!filters.selectedTopics.some((t) => articleTopics.includes(t))) {
          return false;
        }
      }

      // Source filter
      if (filters.selectedSources.length > 0) {
        if (!filters.selectedSources.includes(article.source)) return false;
      }

      // Free-only filter (hide paywalled articles)
      if (filters.freeOnly && article.is_paywalled === true) {
        return false;
      }

      // Time range filter
      const articleDate = new Date(article.published_at || article.scraped_at);
      if (filters.timeRange === "today") {
        const now = new Date();
        const startOfToday = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        if (articleDate < startOfToday) return false;
      }

      // Date-from filter
      if (filters.dateFrom && articleDate < new Date(filters.dateFrom)) {
        return false;
      }

      // Date-to filter
      if (filters.dateTo) {
        const to = new Date(filters.dateTo);
        to.setDate(to.getDate() + 1);
        if (articleDate >= to) return false;
      }

      // Full-text search
      if (filters.search) {
        const q = filters.search.toLowerCase();
        const inTitle = (article.title || "").toLowerCase().includes(q);
        const inSummary = (article.summary || "").toLowerCase().includes(q);
        if (!inTitle && !inSummary) return false;
      }

      return true;
    });
  }, [allArticles, filters]);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return {
    articles,
    allArticles,
    stats,
    loading,
    error,
    filters,
    setFilters,
    sources,
    isFiltered,
    clearFilters,
  };
}
