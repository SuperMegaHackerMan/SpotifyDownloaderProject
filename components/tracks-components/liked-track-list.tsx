"use client";

import { Loader2 } from "lucide-react";
import type { SpotifyTrack } from "@/lib/types";
import { useLikedSongsAll } from "./utils/use-liked-songs-all";
import TrackListHeader from "./track-list-header";
import TrackRows from "./track-rows";

interface LikedTrackListProps {
  playlistName: string;
  onBack?: () => void;
  onAddToQueue: (track: SpotifyTrack) => void;
  queuedTrackIds: Set<string>;
}

export function LikedTrackList({
  playlistName,
  onBack,
  onAddToQueue,
  queuedTrackIds,
}: LikedTrackListProps) {
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
