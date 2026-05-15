import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE, type Article, type Stats } from "@/lib/api";

// ── Cache config ──────────────────────────────────────────────────────────────
const MEM_TTL_MS = 2 * 60 * 60 * 1000;   // 2 h in-memory (no re-fetch within session)
const LS_TTL_MS  = 24 * 60 * 60 * 1000;  // 24 h localStorage (stale-while-revalidate)
const LS_PREFIX  = "sg_cache_v2_";

interface ArticleCache {
  articles: Article[];
  fetchedAt: number;
}

// In-memory cache — cleared on full page reload
const articleCache: Record<string, ArticleCache> = {};

function readLS(key: string): ArticleCache | null {
  try {
    const raw = localStorage.getItem(LS_PREFIX + key);
    if (!raw) return null;
    const parsed: ArticleCache = JSON.parse(raw);
    if (Date.now() - parsed.fetchedAt > LS_TTL_MS) return null; // expired
    return parsed;
  } catch { return null; }
}

function writeLS(key: string, cache: ArticleCache) {
  try { localStorage.setItem(LS_PREFIX + key, JSON.stringify(cache)); } catch { /* quota */ }
}

// ── Retry helper ──────────────────────────────────────────────────────────────
// Render free tier spins down after inactivity — retries handle cold starts.
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function fetchWithRetry(
  url: string,
  maxAttempts = 4,
  baseDelayMs = 4000
): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
      if (res.ok) return res;
      // Non-ok response (e.g. Render 404 during cold start) — treat as retryable
      lastError = new Error(`HTTP ${res.status}`);
    } catch (err) {
      lastError = err;
    }
    if (attempt < maxAttempts) {
      // Exponential backoff: 4s, 8s, 16s
      await sleep(baseDelayMs * Math.pow(2, attempt - 1));
    }
  }
  throw lastError;
}

/**
 * Fetch articles (optionally filtered by country) + global stats.
 * Results are cached for 2 hours so the hero article doesn't change on
 * every navigation / component remount.
 */
export function useFeedArticles(country?: string) {
  const cacheKey = country ?? "__all__";

  // Initialise from in-memory cache → localStorage → empty
  const [articles, setArticles] = useState<Article[]>(() => {
    if (articleCache[cacheKey]) return articleCache[cacheKey].articles;
    const ls = readLS(cacheKey);
    if (ls) { articleCache[cacheKey] = ls; return ls.articles; }
    return [];
  });
  const [stats, setStats] = useState<Stats | null>(null);
  // Show loading screen only when we have absolutely no cached data
  const [loading, setLoading] = useState(() => {
    if (articleCache[cacheKey]) return false;
    return !readLS(cacheKey);
  });
  const [waking, setWaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cached = articleCache[cacheKey];
    const now = Date.now();

    // In-memory cache still fresh — nothing to do
    if (cached && now - cached.fetchedAt < MEM_TTL_MS) {
      setLoading(false);
      return;
    }

    // Stale-while-revalidate: if we already have data, fetch silently in background
    const hasCachedData = !!(cached?.articles.length);
    let cancelled = false;

    async function load() {
      if (!hasCachedData) {
        setLoading(true);
        setWaking(false);
      }
      setError(null);

      const wakingTimer = hasCachedData ? null : setTimeout(() => {
        if (!cancelled) setWaking(true);
      }, 3000);

      try {
        const countryParam = country ? `&country=${encodeURIComponent(country)}` : "";
        const limit = country ? 100 : 200;

        const articlesRes = await fetchWithRetry(
          `${API_BASE}/api/articles?limit=${limit}${countryParam}`
        );
        const articlesData: Article[] = await articlesRes.json();
        const raw = Array.isArray(articlesData) ? articlesData : [];
        const data = raw.map((a) => ({
          ...a,
          title: a.title
            ?.replace(/\s*\[premium\+?\]\s*/gi, "")
            .replace(/\s*\[abo\+?\]\s*/gi, "")
            .replace(/\s*\[\+\]\s*/gi, "")
            .replace(/\s*\[paywall\]\s*/gi, "")
            .trim() ?? a.title,
        }));

        if (!cancelled) {
          const cache: ArticleCache = { articles: data, fetchedAt: Date.now() };
          articleCache[cacheKey] = cache;
          writeLS(cacheKey, cache);
          setArticles(data);
        }

        fetch(`${API_BASE}/api/stats`)
          .then((r) => r.ok ? r.json() : null)
          .then((statsData) => { if (!cancelled && statsData) setStats(statsData); })
          .catch(() => {});
      } catch {
        if (!cancelled && !hasCachedData)
          setError("Server nicht erreichbar. Bitte Seite neu laden.");
      } finally {
        if (wakingTimer) clearTimeout(wakingTimer);
        if (!cancelled) { setLoading(false); setWaking(false); }
      }
    }

    load();
    return () => { cancelled = true; };
  }, [cacheKey, country]);

  return { articles, stats, loading, waking, error };
}

/**
 * Fetch curated podcasts from the backend.
 */
export function usePodcasts() {
  const [podcasts, setPodcasts] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWithRetry(`${API_BASE}/api/podcasts`)
      .then((r) => r.json())
      .then((data) => setPodcasts(Array.isArray(data) ? data : []))
      .catch(() => setPodcasts([]))
      .finally(() => setLoading(false));
  }, []);

  return { podcasts, loading };
}

/**
 * Fetch up to 10 articles for a specific country on demand.
 * Caches the last fetched country to avoid duplicate requests.
 */
export function useCountryArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchedRef = useRef<string | null>(null);

  const fetchForCountry = useCallback(async (country: string) => {
    if (fetchedRef.current === country) return; // already loaded
    fetchedRef.current = country;
    setArticles([]);
    setLoading(true);

    try {
      const res = await fetchWithRetry(
        `${API_BASE}/api/articles?limit=10&country=${encodeURIComponent(country)}`,
        3, // fewer retries for on-demand map clicks
        3000
      );
      const data = await res.json();
      setArticles(Array.isArray(data) ? data : []);
    } catch {
      setArticles([]); // caller falls back gracefully
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    fetchedRef.current = null;
    setArticles([]);
  }, []);

  return { articles, loading, fetchForCountry, reset };
}
