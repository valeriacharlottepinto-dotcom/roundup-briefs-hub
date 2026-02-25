import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";
import { type Article, TOPIC_SLUGS } from "@/lib/constants";
import { toast } from "sonner";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Map a full topic label back to its stable slug */
function labelToSlug(label: string): string {
  for (const [slug, translations] of Object.entries(TOPIC_SLUGS)) {
    if (
      translations.en === label ||
      translations.de === label
    ) {
      return slug;
    }
  }
  // Fallback: generate a slug from the label
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
}

/** Build the Supabase row from an Article object (snapshot at save time) */
function buildSnapshot(article: Article) {
  const topicSlugs = (article.topics || "")
    .split(",")
    .map((t) => labelToSlug(t.trim()))
    .filter(Boolean);

  const identityTags = (article.tags || "")
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t && t !== "general");

  const sourceSlug = article.source
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

  return {
    article_id: article.id ?? null,
    article_url: article.link,
    title: article.title,
    source_slug: sourceSlug,
    source_name: article.source,
    published_at: article.published_at || null,
    locale: article.locale || "en",
    is_paywalled: article.is_paywalled ?? false,
    topic_slugs: topicSlugs,
    identity_tags: identityTags,
    summary_snapshot: article.summary
      ? article.summary.slice(0, 500)
      : null,
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SavedArticle {
  id: string;
  article_url: string;
  title: string;
  source_name: string;
  source_slug: string;
  published_at: string | null;
  locale: string;
  is_paywalled: boolean;
  topic_slugs: string[];
  identity_tags: string[];
  summary_snapshot: string | null;
  saved_at: string;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

const QUERY_KEY = ["saved_articles"];

export function useSavedArticles() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch all saves for the current user
  const { data: savedArticles = [], isLoading } = useQuery<SavedArticle[]>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("saved_articles")
        .select("*")
        .order("saved_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
    staleTime: 1000 * 60, // 1 minute
  });

  const savedUrls = new Set(savedArticles.map((a) => a.article_url));

  const isSaved = (url: string) => savedUrls.has(url);

  // Save an article
  const saveMutation = useMutation({
    mutationFn: async (article: Article) => {
      if (!user) throw new Error("Not authenticated");
      const snapshot = buildSnapshot(article);
      const { data, error } = await supabase
        .from("saved_articles")
        .upsert(
          { user_id: user.id, ...snapshot },
          { onConflict: "user_id,article_url" }
        )
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Saved ✓");
    },
    onError: () => {
      toast.error("Couldn't save — please try again");
    },
  });

  // Unsave an article
  const unsaveMutation = useMutation({
    mutationFn: async (articleUrl: string) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("saved_articles")
        .delete()
        .eq("user_id", user.id)
        .eq("article_url", articleUrl);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: () => {
      toast.error("Couldn't remove — please try again");
    },
  });

  return {
    savedArticles,
    isLoading,
    isSaved,
    saveArticle: (article: Article) => saveMutation.mutate(article),
    unsaveArticle: (url: string) => unsaveMutation.mutate(url),
  };
}
