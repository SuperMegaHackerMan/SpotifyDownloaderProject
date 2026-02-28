"use client";

import { usePlaylistTracks, useLikedSongs } from "@/hooks/use-spotify";
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

export function TrackList({
  playlistId,
  playlistName,
  onBack,
  onAddToQueue,
  queuedTrackIds,
}: TrackListProps) {
  const isLiked = playlistId === "liked";
  const playlistData = usePlaylistTracks(isLiked ? null : playlistId);
  const likedData = useLikedSongs();
  const isLoading = isLiked ? likedData.isLoading : playlistData.isLoading;
  const error = isLiked ? likedData.error : playlistData.error;

  const items: PlaylistTrackItem[] =
    (playlistData.data?.items ?? likedData.data?.items) || [];
  const tracks = items
    .map((item) => isLiked ?  item.track :item.item)
    .filter(
      (track): track is SpotifyTrack => track !== undefined && track !== null && track.id !== null,
    );

  return (
    <div>
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
          {!isLoading && !error && (
            <p className="text-sm text-muted-foreground">
              {tracks.length} track{tracks.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-20 flex-col">
          <p className="text-muted-foreground">Failed to load tracks</p>
          <p className="text-muted-foreground">{error?.message}</p>
        </div>
      ) : tracks.length === 0 ? (
        <p className="py-10 text-center text-muted-foreground">
          No tracks found
        </p>
      ) : (
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
      )}
    </div>
  );
}
