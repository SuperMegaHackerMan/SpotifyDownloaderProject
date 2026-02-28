"use client";

import { useState } from "react";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SpotifyTrack } from "@/lib/types";
import { useLikedSongsAll } from "./utils/use-liked-songs-all";
import TrackListHeader from "./track-list-header";
import TrackRows from "./track-rows";

const PAGE_SIZE = 30;

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
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(tracks.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageTracks = tracks.slice(pageStart, pageStart + PAGE_SIZE);

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
          {pageTracks.length > 0 && (
            <TrackRows
              tracks={pageTracks}
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

          {tracks.length > PAGE_SIZE && (
            <div className="mt-4 flex items-center justify-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {safePage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages && !hasMore}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
