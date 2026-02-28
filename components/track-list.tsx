"use client";

import { useEffect, useState } from "react";
import { usePlaylistTracks } from "@/hooks/use-spotify";
import type { SpotifyTrack, PlaylistTrackItem } from "@/lib/types";
import { TrackRow } from "@/components/track-row";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

interface TrackListProps {
  playlistId: string;
  playlistName: string;
  onBack?: () => void;
  onAddToQueue: (track: SpotifyTrack) => void;
  queuedTrackIds: Set<string>;
}

// ── Fetches every page of liked songs and streams them in as they arrive ──────
function useLikedSongsAll() {
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

// ── Shared header (back button + title) ───────────────────────────────────────
function TrackListHeader({
  playlistName,
  onBack,
  subtitle,
}: {
  playlistName: string;
  onBack?: () => void;
  subtitle?: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      {onBack && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}
      <div>
        <h2 className="text-lg font-semibold">{playlistName}</h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

function TrackRows({
  tracks,
  queuedTrackIds,
  onAddToQueue,
}: {
  tracks: SpotifyTrack[];
  queuedTrackIds: Set<string>;
  onAddToQueue: (track: SpotifyTrack) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      {tracks.map((track, index) => (
        <TrackRow
          key={track.id}
          track={track}
          index={index + 1}
          isQueued={queuedTrackIds.has(track.id)}
          onAddToQueue={onAddToQueue}
        />
      ))}
    </div>
  );
}

// ── Liked Songs view (all pages) ──────────────────────────────────────────────
function LikedTrackList({
  playlistName,
  onBack,
  onAddToQueue,
  queuedTrackIds,
}: Omit<TrackListProps, "playlistId">) {
  const { tracks, isLoading, error, progress } = useLikedSongsAll();
  const hasMore = progress.total > 0 && progress.loaded < progress.total;
  const subtitle = error
    ? undefined
    : progress.total > 0
      ? hasMore
        ? `Loading… ${progress.loaded} / ${progress.total} tracks`
        : `${tracks.length} track${tracks.length !== 1 ? "s" : ""}`
      : undefined;

  return (
    <div>
      <TrackListHeader
        playlistName={playlistName}
        onBack={onBack}
        subtitle={subtitle}
      />

      {error ? (
        <div className="flex flex-col items-center justify-center gap-2 py-20">
          <p className="text-muted-foreground">Failed to load tracks</p>
          <p className="max-w-sm text-center text-xs text-destructive/70">
            {error.message}
          </p>
        </div>
      ) : (
        <>
          {tracks.length > 0 && (
            <TrackRows
              tracks={tracks}
              queuedTrackIds={queuedTrackIds}
              onAddToQueue={onAddToQueue}
            />
          )}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          )}
          {!isLoading && tracks.length === 0 && (
            <p className="py-10 text-center text-muted-foreground">
              No liked songs found
            </p>
          )}
        </>
      )}
    </div>
  );
}

// ── Regular playlist view (first 50) ─────────────────────────────────────────
function PlaylistTrackList({
  playlistId,
  playlistName,
  onBack,
  onAddToQueue,
  queuedTrackIds,
}: TrackListProps) {
  const { data, isLoading, error } = usePlaylistTracks(playlistId);
  const items: PlaylistTrackItem[] = data?.items ?? [];
  const tracks = items
    .map((i) => i.item ?? i.track)
    .filter((t): t is SpotifyTrack => t != null && t.id != null);

  const subtitle =
    !isLoading && !error
      ? `${tracks.length} track${tracks.length !== 1 ? "s" : ""}`
      : undefined;

  return (
    <div>
      <TrackListHeader
        playlistName={playlistName}
        onBack={onBack}
        subtitle={subtitle}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-2 py-20">
          <p className="text-muted-foreground">Failed to load tracks</p>
          <p className="max-w-sm text-center text-xs text-destructive/70">
            {error?.message}
          </p>
        </div>
      ) : tracks.length === 0 ? (
        <p className="py-10 text-center text-muted-foreground">
          No tracks found
        </p>
      ) : (
        <TrackRows
          tracks={tracks}
          queuedTrackIds={queuedTrackIds}
          onAddToQueue={onAddToQueue}
        />
      )}
    </div>
  );
}

// ── Public export ─────────────────────────────────────────────────────────────
export function TrackList(props: TrackListProps) {
  if (props.playlistId === "liked") {
    const { playlistId: _, ...rest } = props;
    return <LikedTrackList {...rest} />;
  }
  return <PlaylistTrackList {...props} />;
}
