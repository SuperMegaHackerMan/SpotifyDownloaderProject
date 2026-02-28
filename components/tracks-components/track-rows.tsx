import type { SpotifyTrack } from "@/lib/types";
import { TrackRow } from "@/components/track-row";

function TrackRows({
  tracks,
  queuedTrackIds,
  onAddToQueue,
}: {
  tracks: SpotifyTrack[];
  queuedTrackIds: Set<string>;
  onAddToQueue: (track: SpotifyTrack) => void;
}) {
  return (
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
  );
}

export default TrackRows;