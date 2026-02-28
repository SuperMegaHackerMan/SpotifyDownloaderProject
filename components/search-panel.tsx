"use client";

import { useState } from "react";
import { useSpotifySearch } from "@/hooks/use-spotify";
import type { SpotifyTrack } from "@/lib/types";
import { TrackRow } from "@/components/track-row";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

interface SearchPanelProps {
  onAddToQueue: (track: SpotifyTrack) => void;
  queuedTrackIds: Set<string>;
}

export function SearchPanel({ onAddToQueue, queuedTrackIds }: SearchPanelProps) {
  const [query, setQuery] = useState("");
  const { data, isLoading } = useSpotifySearch(query);

  const tracks: SpotifyTrack[] = data?.tracks?.items || [];

  return (
    <div>
      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold">Search Spotify</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for songs, artists, albums..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-secondary pl-10 border-border placeholder:text-muted-foreground"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>
      </div>

      {query.length < 2 ? (
        <p className="py-10 text-center text-muted-foreground">
          Type at least 2 characters to search
        </p>
      ) : tracks.length === 0 && !isLoading ? (
        <p className="py-10 text-center text-muted-foreground">
          No results found
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
