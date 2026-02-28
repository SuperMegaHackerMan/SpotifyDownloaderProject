"use client";

import { Loader2 } from "lucide-react";
import { usePlaylistTracks } from "@/hooks/use-spotify";
import type { SpotifyTrack, PlaylistTrackItem } from "@/lib/types";
import TrackListHeader from "./track-list-header";
import TrackRows from "./track-rows";

interface PlaylistTrackListProps {
  playlistId: string;
  playlistName: string;
  onBack?: () => void;
  onAddToQueue: (track: SpotifyTrack) => void;
  queuedTrackIds: Set<string>;
}

export function PlaylistTrackList({
  playlistId,
  playlistName,
  onBack,
  onAddToQueue,
  queuedTrackIds,
}: PlaylistTrackListProps) {
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
