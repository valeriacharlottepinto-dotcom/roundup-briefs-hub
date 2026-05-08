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
}

const defaultFilters: Filters = {
  selectedTopics: [],
  selectedSources: [],
  timeRange: null,
  dateFrom: "",
  dateTo: "",
  search: "",
};

// ─── Country → Locale mapping ─────────────────────────────────────────────────
// DACH countries map to the German feed; everything else to English.

const DACH_COUNTRIES = new Set(["Germany", "Austria", "Switzerland"]);

function countryToLocale(country?: string): "de" | "en" {
  if (!country) return "de";
  return DACH_COUNTRIES.has(country) ? "de" : "en";
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * useArticles — fetches articles from the Supabase `articles` table.
 *
 * Accepts Alex's `country?` routing parameter, maps it to Valeria's locale
 * (DACH → "de", all others → "en"), and queries Supabase directly.
 *
 * Returns Alex's full interface so FeedPage and FilterBar need no changes.
 */
export function useArticles(country?: string) {
  const locale = countryToLocale(country);

  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [olderLoaded, setOlderLoaded] = useState(false);

  // ── Initial fetch ────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);
      setOlderLoaded(false);
      setAllArticles([]);

      try {
        const { data, error: fetchError } = await supabase
          .from("articles")
          .select("*")
          .eq("locale", locale)
          .order("published_at", { ascending: false, nullsFirst: false })
          .order("scraped_at", { ascending: false })
          .limit(120);

        if (cancelled) return;

        if (fetchError) throw fetchError;

        setAllArticles((data as Article[]) ?? []);
      } catch {
        if (!cancelled) {
          setError(
            "Artikel konnten nicht geladen werden — bitte lade die Seite neu."
          );
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

  // ── Load older articles (up to 3 months back) ────────────────────────────
  const loadOlderArticles = useCallback(async () => {
    if (olderLoaded || loadingOlder) return;
    setLoadingOlder(true);
    try {
      const threeWeeksAgo = new Date(
        Date.now() - 21 * 24 * 60 * 60 * 1000
      ).toISOString();
      const threeMonthsAgo = new Date(
        Date.now() - 90 * 24 * 60 * 60 * 1000
      ).toISOString();

      const { data } = await supabase
        .from("articles")
        .select("*")
        .eq("locale", locale)
        .gte("published_at", threeMonthsAgo)
        .lt("published_at", threeWeeksAgo)
        .order("published_at", { ascending: false })
        .limit(200);

      setAllArticles((prev) => [...prev, ...((data as Article[]) ?? [])]);
      setOlderLoaded(true);
    } catch {
      // silently ignore — user can retry
    } finally {
      setLoadingOlder(false);
    }
  }, [locale, olderLoaded, loadingOlder]);

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
      filters.search !== "",
    [filters]
  );

  // ── Derived: filtered article list ───────────────────────────────────────
  const filteredArticles = useMemo(() => {
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

  const clearFilters = useCallback(() => setFilters(defaultFilters), []);

  return {
    articles: filteredArticles,
    allArticles,
    stats,
    loading,
    error,
    filters,
    setFilters,
    sources,
    isFiltered,
    clearFilters,
    loadOlderArticles,
    loadingOlder,
    olderLoaded,
    hasOlderAvailable: !olderLoaded,
  };
}
