import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./useAuth";

export interface UserTopicPrefs {
  user_id: string;
  topic_slugs: string[];
  locale_preference: "en" | "de" | "both";
  onboarding_done: boolean;
}

const QUERY_KEY = ["user_topic_preferences"];

export function useFollowedTopics() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<UserTopicPrefs | null>({
    queryKey: QUERY_KEY,
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from("user_topic_preferences")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data ?? null;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });

  const followedSlugs: string[] = data?.topic_slugs ?? [];
  const localePreference: "en" | "de" | "both" = data?.locale_preference ?? "both";
  const onboardingDone: boolean = data?.onboarding_done ?? false;

  const saveMutation = useMutation({
    mutationFn: async ({
      slugs,
      locale,
      done = true,
    }: {
      slugs: string[];
      locale: "en" | "de" | "both";
      done?: boolean;
    }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("user_topic_preferences").upsert(
        {
          user_id: user.id,
          topic_slugs: slugs,
          locale_preference: locale,
          onboarding_done: done,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const isFollowing = (slug: string) => followedSlugs.includes(slug);

  const followTopic = (slug: string) => {
    if (!isFollowing(slug)) {
      saveMutation.mutate({ slugs: [...followedSlugs, slug], locale: localePreference });
    }
  };

  const unfollowTopic = (slug: string) => {
    saveMutation.mutate({
      slugs: followedSlugs.filter((s) => s !== slug),
      locale: localePreference,
    });
  };

  const savePreferences = (slugs: string[], locale: "en" | "de" | "both") => {
    saveMutation.mutate({ slugs, locale, done: true });
  };

  return {
    followedSlugs,
    localePreference,
    onboardingDone,
    isFollowing,
    followTopic,
    unfollowTopic,
    savePreferences,
    isLoading,
    isSaving: saveMutation.isPending,
    hasPrefs: data !== null,
  };
}
