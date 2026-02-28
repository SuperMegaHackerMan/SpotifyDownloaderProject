import { useEffect, useState } from "react";
import type { SpotifyTrack, PlaylistTrackItem } from "@/lib/types";

export function useLikedSongsAll() {
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState({ loaded: 0, total: 0 });

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      const limit = 50;
      let offset = 0;
      const all: SpotifyTrack[] = [];

      try {
        while (!cancelled) {
          const res = await fetch(
            `/api/spotify?action=liked&limit=${limit}&offset=${offset}`,
          );
          if (res.status === 401) throw new Error("UNAUTHORIZED");
          if (!res.ok) throw new Error(await res.text());
          if (cancelled) return;

          const data = await res.json();
          const page = (data.items as PlaylistTrackItem[] | undefined) ?? [];
          const newTracks = page
            .map((i) => i.track)
            .filter((t): t is SpotifyTrack => t != null && t.id != null);

          all.push(...newTracks);
          setTracks([...all]);
          setProgress({ loaded: all.length, total: data.total ?? 0 });

          if (!data.next || newTracks.length === 0) break;
          offset += limit;
        }
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err : new Error("Failed to load"));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, []);

  return { tracks, isLoading, error, progress };
}
