"use client";

import type { SpotifyTrack } from "@/lib/types";
import { LikedTrackList } from "./tracks-components/liked-track-list";
import { PlaylistTrackList } from "./tracks-components/playlist-track-list";

interface TrackListProps {
  playlistId: string;
  playlistName: string;
  onBack?: () => void;
  onAddToQueue: (track: SpotifyTrack) => void;
  queuedTrackIds: Set<string>;
}

export function TrackList(props: TrackListProps) {
  if (props.playlistId === "liked") {
    const { playlistId: _, ...rest } = props;
    return <LikedTrackList {...rest} />;
  }
  return <PlaylistTrackList {...props} />;
}
