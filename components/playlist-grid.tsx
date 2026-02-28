"use client";

import { useSpotifyPlaylists } from "@/hooks/use-spotify";
import type { SpotifyPlaylist } from "@/lib/types";
import { Loader2, ListMusic } from "lucide-react";

interface PlaylistGridProps {
  onSelectPlaylist: (id: string, name: string) => void;
}

export function PlaylistGrid({ onSelectPlaylist }: PlaylistGridProps) {
  const { data, isLoading, error } = useSpotifyPlaylists();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Failed to load playlists</p>
      </div>
    );
  }

  const playlists: SpotifyPlaylist[] = data?.items || [];

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">
        Your Playlists
        <span className="ml-2 text-sm font-normal text-muted-foreground">
          ({playlists.length})
        </span>
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4">
        {playlists.map((playlist) => (
          <button
            key={playlist.id}
            onClick={() => onSelectPlaylist(playlist.id, playlist.name)}
            className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-primary/50 hover:bg-secondary"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-secondary">
              {playlist.images?.[0]?.url ? (
                <img
                  src={playlist.images[0].url}
                  alt={playlist.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ListMusic className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-card-foreground">{playlist.name}</p>
              <p className="text-xs text-muted-foreground">
                {playlist.tracks.total} track{playlist.tracks.total !== 1 ? "s" : ""}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
