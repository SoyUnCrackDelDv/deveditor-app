import { memo } from 'react';
import { Track as TrackType } from '@/types/timeline';
import { Clip } from './Clip';
import { cn } from '@/lib/utils';

interface TrackProps {
  track: TrackType;
  pixelsPerSecond: number;
  trackIndex: number;
  totalWidth: number;
  onContextMenu: (e: React.MouseEvent, clipId: string | null) => void;
}

export const Track = memo(function Track({ track, pixelsPerSecond, trackIndex, totalWidth, onContextMenu }: TrackProps) {
  if (track.hidden) return null;

  return (
    <div
      className={cn(
        "relative w-full border-b border-border/20 transition-colors group",
        track.locked ? "bg-card/30" : "bg-card/10 hover:bg-card/20"
      )}
      style={{ height: track.height, minWidth: totalWidth }}
      data-track-id={track.id}
      onContextMenu={(e) => onContextMenu(e, null)}
      data-testid={`track-area-${track.id}`}
    >
      {track.clips.map(clip => (
        <Clip
          key={clip.id}
          clip={clip}
          track={track}
          pixelsPerSecond={pixelsPerSecond}
          trackIndex={trackIndex}
          onContextMenu={onContextMenu}
        />
      ))}
    </div>
  );
});
