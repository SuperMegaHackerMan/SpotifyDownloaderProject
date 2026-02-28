"use client";

import { useState, useRef } from "react";
import type { SpotifyTrack } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus, Check, Play, Pause, Music } from "lucide-react";

interface TrackRowProps {
  track: SpotifyTrack;
  index: number;
  isQueued: boolean;
  onAddToQueue: (track: SpotifyTrack) => void;
}

function formatDuration(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function TrackRow({
  track,
  index,
  isQueued,
  onAddToQueue,
}: TrackRowProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  console.log("Track:", track);

  const togglePreview = () => {
    if (!track.preview_url) return;

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(track.preview_url);
      audio.volume = 0.5;
      audio.play();
      audio.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
      };
      audioRef.current = audio;
      setIsPlaying(true);
    }
  };

  const artistNames = track.artists.map((a) => a.name).join(", ");
  const albumImage = track.album.images?.[track.album.images.length - 1]?.url;

  return (
    <div className="group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-secondary">
      <span className="w-6 text-right text-xs text-muted-foreground tabular-nums">
        {index}
      </span>

      <button
        onClick={togglePreview}
        disabled={!track.preview_url}
        className="relative h-10 w-10 shrink-0 overflow-hidden rounded bg-secondary"
        aria-label={isPlaying ? "Pause preview" : "Play preview"}
      >
        {albumImage ? (
          <img src={albumImage} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Music className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
        {track.preview_url && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 transition-opacity group-hover:opacity-100">
            {isPlaying ? (
              <Pause className="h-4 w-4 text-foreground" />
            ) : (
              <Play className="h-4 w-4 text-foreground" />
            )}
          </div>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {track.name}
        </p>
        <p className="truncate text-xs text-muted-foreground">{artistNames}</p>
      </div>

      <span className="hidden text-xs text-muted-foreground tabular-nums sm:block">
        {formatDuration(track.duration_ms)}
      </span>

      <Button
        variant={isQueued ? "secondary" : "ghost"}
        size="sm"
        onClick={() => !isQueued && onAddToQueue(track)}
        // disabled={isQueued || !track.preview_url}
        className={
          isQueued
            ? "text-primary"
            : !track.preview_url
              ? "text-muted-foreground/40"
              : "text-muted-foreground hover:text-primary"
        }
        title={
          !track.preview_url
            ? "No preview available"
            : isQueued
              ? "Already in queue"
              : "Add to download queue"
        }
      >
        {isQueued ? (
          <Check className="h-4 w-4" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
