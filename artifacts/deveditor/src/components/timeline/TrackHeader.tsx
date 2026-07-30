import { MonitorPlay, Music, Type, Eye, EyeOff, Lock, Unlock, Volume2, VolumeX } from 'lucide-react';
import { Track } from '@/types/timeline';
import { useEditorStore } from '@/store/editorStore';
import { cn } from '@/lib/utils';

interface TrackHeaderProps {
  track: Track;
}

export function TrackHeader({ track }: TrackHeaderProps) {
  const { toggleTrackHidden, toggleTrackLocked, toggleTrackMuted } = useEditorStore();

  const isVideo = track.type === 'video';
  const isAudio = track.type === 'audio';
  const isSubtitle = track.type === 'subtitle';

  const Icon = isVideo ? MonitorPlay : isAudio ? Music : Type;
  const colorClass = isVideo ? 'text-blue-500' : isAudio ? 'text-emerald-500' : 'text-amber-500';

  return (
    <div
      className="flex items-center justify-between px-3 group bg-card hover:bg-secondary/40 transition-colors border-b border-border/50 shrink-0"
      style={{ height: track.height }}
      data-testid={`track-header-${track.id}`}
    >
      <div className="flex items-center gap-2 overflow-hidden w-24">
        <Icon className={cn("w-4 h-4 shrink-0", colorClass)} />
        <span className="text-xs font-medium text-foreground truncate select-none" title={track.name}>
          {track.name}
        </span>
      </div>
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => toggleTrackHidden(track.id)}
          className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
          title={track.hidden ? "Show" : "Hide"}
        >
          {track.hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
        {isAudio && (
          <button
            onClick={() => toggleTrackMuted(track.id)}
            className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
            title={track.muted ? "Unmute" : "Mute"}
          >
            {track.muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        )}
        <button
          onClick={() => toggleTrackLocked(track.id)}
          className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
          title={track.locked ? "Unlock" : "Lock"}
        >
          {track.locked ? <Lock className="w-3.5 h-3.5 text-primary" /> : <Unlock className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}
