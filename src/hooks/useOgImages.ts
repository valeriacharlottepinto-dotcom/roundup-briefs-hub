import { useState, useEffect, useCallback, useRef } from "react";

const JINA_PREFIX = "https://r.jina.ai/";
const CACHE_KEY = "roundup_og_images";
const MAX_CONCURRENT = 4;

function loadCache(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveCache(cache: Record<string, string>) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // storage full — ignore
  }
}

export function useOgImages(links: string[]) {
  const [images, setImages] = useState<Record<string, string>>(loadCache);
  const queueRef = useRef<string[]>([]);
  const activeRef = useRef(0);
  const mountedRef = useRef(true);

  const processQueue = useCallback(() => {
    while (activeRef.current < MAX_CONCURRENT && queueRef.current.length > 0) {
      const link = queueRef.current.shift()!;
      activeRef.current++;

      (async () => {
        let imageUrl: string | null = null;
        try {
          const res = await fetch(`${JINA_PREFIX}${link}`, {
            headers: { Accept: "text/html" },
            signal: AbortSignal.timeout(8000),
          });
          const text = await res.text();
          const ogMatch = text.match(
            /meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
          );
          if (ogMatch) {
            imageUrl = ogMatch[1];
          } else {
            const twMatch = text.match(
              /meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i
            );
            if (twMatch) imageUrl = twMatch[1];
          }
        } catch {
          // Failed to fetch — no image
        }

        activeRef.current--;

        if (mountedRef.current && imageUrl) {
          setImages((prev) => {
            const next = { ...prev, [link]: imageUrl! };
            saveCache(next);
            return next;
          });
        }

        processQueue();
      })();
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    const cached = loadCache();
    const toFetch = links.filter((l) => l && !cached[l]);
    queueRef.current = toFetch;
    if (Object.keys(cached).length > 0) {
      setImages((prev) => ({ ...prev, ...cached }));
    }
    processQueue();
    return () => {
      mountedRef.current = false;
    };
  }, [links, processQueue]);

  return images;
}
