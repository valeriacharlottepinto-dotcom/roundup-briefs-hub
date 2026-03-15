import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface SubscribeParams {
  email: string;
  topicSlugs: string[];
  localePreference: "en" | "de" | "both";
}

export function useNewsletterSubscription() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribe = async ({ email, topicSlugs, localePreference }: SubscribeParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: err } = await supabase
        .from("newsletter_subscribers")
        .upsert(
          {
            email,
            topic_slugs: topicSlugs,
            locale_preference: localePreference,
            is_active: true,
          },
          { onConflict: "email" }
        );
      if (err) throw err;
      setIsSuccess(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsSuccess(false);
    setError(null);
  };

  return { subscribe, isLoading, isSuccess, error, reset };
}
