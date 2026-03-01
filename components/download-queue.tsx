"use client";

import { useState } from "react";
import type { SpotifyTrack } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Download,
  Trash2,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Music,
} from "lucide-react";

interface DownloadQueueProps {
  tracks: SpotifyTrack[];
  onRemove: (trackId: string) => void;
  onClear: () => void;
}

type DownloadStatus = "idle" | "downloading" | "done" | "error";

interface TrackDownloadState {
  [trackId: string]: DownloadStatus;
}

export function DownloadQueue({
  tracks,
  onRemove,
  onClear,
}: DownloadQueueProps) {
  const [downloadStates, setDownloadStates] = useState<TrackDownloadState>({});
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  const downloadTrack = async (track: SpotifyTrack) => {
    setDownloadStates((prev) => ({ ...prev, [track.id]: "downloading" }));

    try {
      const response = await fetch("/api/full-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          //       previewUrl: track.preview_url,
          trackName: track.name,
          artistName: track.artists.map((a) => a.name).join(", "),
        }),
      });

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const artistNames = track.artists.map((a) => a.name).join(", ");
      const filename = `${artistNames} - ${track.name}.mp3`
        .replace(/[\\/:*?"<>|]/g, "")
        .trim();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadStates((prev) => ({ ...prev, [track.id]: "done" }));
    } catch {
      setDownloadStates((prev) => ({ ...prev, [track.id]: "error" }));
    }
  };

  const downloadAll = async () => {
    setIsDownloadingAll(true);
    for (const track of tracks) {
      if (downloadStates[track.id] === "done") continue;
      await downloadTrack(track);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    setIsDownloadingAll(false);
  };

  const statusIcon = (status: DownloadStatus | undefined) => {
    switch (status) {
      case "downloading":
        return <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />;
      case "done":
        return <CheckCircle2 className="h-3.5 w-3.5 text-primary" />;
      case "error":
        return <AlertCircle className="h-3.5 w-3.5 text-destructive" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Download className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-card-foreground">
            Download Queue
          </h3>
          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-medium text-primary">
            {tracks.length}
          </span>
        </div>
        {tracks.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-7 text-xs text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="mr-1 h-3 w-3" />
            Clear
          </Button>
        )}
      </div>

      {tracks.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-12">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
            <Music className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Queue is empty</p>
          <p className="text-xs text-muted-foreground/70">
            Click + on tracks to add them here
          </p>
        </div>
      ) : (
        <>
          <ScrollArea className="flex-1 max-h-[60vh]">
            <div className="flex flex-col gap-0.5 p-2">
              {tracks.map((track) => {
                const albumImage =
                  track.album.images?.[track.album.images.length - 1]?.url;
                return (
                  <div
                    key={track.id}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-secondary"
                  >
                    <div className="h-8 w-8 shrink-0 overflow-hidden rounded bg-secondary">
                      {albumImage ? (
                        <img
                          src={albumImage}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Music className="h-3 w-3 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-card-foreground">
                        {track.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {track.artists.map((a) => a.name).join(", ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {statusIcon(downloadStates[track.id])}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemove(track.id)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove from queue</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          <div className="border-t border-border p-3">
            <Button
              onClick={downloadAll}
              disabled={isDownloadingAll}
              className="w-full gap-2"
              size="sm"
            >
              {isDownloadingAll ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download All ({tracks.length})
                </>
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
