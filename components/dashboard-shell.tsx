"use client";

import { useState, useCallback } from "react";
import type { SpotifyUser, SpotifyTrack } from "@/lib/types";
import { DashboardHeader } from "@/components/dashboard-header";
import { PlaylistGrid } from "@/components/playlist-grid";
import { TrackList } from "@/components/track-list";
import { DownloadQueue } from "@/components/download-queue";
import { SearchPanel } from "@/components/search-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListMusic, Heart, Search } from "lucide-react";

interface DashboardShellProps {
  user: SpotifyUser;
}

export function DashboardShell({ user }: DashboardShellProps) {
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [selectedPlaylistName, setSelectedPlaylistName] = useState<string>("");
  const [downloadQueue, setDownloadQueue] = useState<SpotifyTrack[]>([]);
  const [activeTab, setActiveTab] = useState("playlists");

  const addToQueue = useCallback((track: SpotifyTrack) => {
    setDownloadQueue((prev) => {
      if (prev.some((t) => t.id === track.id)) return prev;
      return [...prev, track];
    });
  }, []);

  const removeFromQueue = useCallback((trackId: string) => {
    setDownloadQueue((prev) => prev.filter((t) => t.id !== trackId));
  }, []);

  const clearQueue = useCallback(() => {
    setDownloadQueue([]);
  }, []);

  const handleSelectPlaylist = useCallback((id: string, name: string) => {
    setSelectedPlaylistId(id);
    setSelectedPlaylistName(name);
  }, []);

  const handleBackToPlaylists = useCallback(() => {
    setSelectedPlaylistId(null);
    setSelectedPlaylistName("");
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader user={user} queueCount={downloadQueue.length} />

      <div className="flex flex-1 flex-col gap-6 p-4 md:flex-row md:p-6">
        <main className="flex-1 min-w-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 bg-secondary">
              <TabsTrigger value="playlists" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <ListMusic className="h-4 w-4" />
                <span className="hidden sm:inline">Playlists</span>
              </TabsTrigger>
              <TabsTrigger value="liked" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Liked Songs</span>
              </TabsTrigger>
              <TabsTrigger value="search" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="playlists">
              {selectedPlaylistId ? (
                <TrackList
                  playlistId={selectedPlaylistId}
                  playlistName={selectedPlaylistName}
                  onBack={handleBackToPlaylists}
                  onAddToQueue={addToQueue}
                  queuedTrackIds={new Set(downloadQueue.map((t) => t.id))}
                />
              ) : (
                <PlaylistGrid onSelectPlaylist={handleSelectPlaylist} />
              )}
            </TabsContent>

            <TabsContent value="liked">
              <TrackList
                playlistId="liked"
                playlistName="Liked Songs"
                onAddToQueue={addToQueue}
                queuedTrackIds={new Set(downloadQueue.map((t) => t.id))}
              />
            </TabsContent>

            <TabsContent value="search">
              <SearchPanel
                onAddToQueue={addToQueue}
                queuedTrackIds={new Set(downloadQueue.map((t) => t.id))}
              />
            </TabsContent>
          </Tabs>
        </main>

        <aside className="w-full shrink-0 md:w-80 lg:w-96">
          <DownloadQueue
            tracks={downloadQueue}
            onRemove={removeFromQueue}
            onClear={clearQueue}
          />
        </aside>
      </div>
    </div>
  );
}
