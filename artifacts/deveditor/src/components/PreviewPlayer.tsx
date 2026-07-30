import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

export function PreviewPlayer() {
  const { isPlaying, togglePlaying, currentTime, duration } = useEditorStore();

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `00:${m}:${s}`;
  };

  const progress = (currentTime / duration) * 100;

  return (
    <div className="flex-1 flex flex-col bg-background min-h-0 relative z-0">
      {/* Video Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Mock Video Frame */}
        <div 
          className="aspect-video w-full max-w-4xl bg-black rounded-lg shadow-2xl overflow-hidden relative group"
          data-testid="video-canvas"
        >
          {/* Abstract visual as video placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-black to-purple-950 opacity-80" />
          
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent opacity-50 mix-blend-screen" />
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/20 rounded-full blur-[80px]" />
          
          {/* Mock Video Element like text or subject */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 blur-[2px] opacity-70 animate-pulse" />
            <div className="mt-8 text-2xl font-bold tracking-widest text-white/90 uppercase drop-shadow-lg">Cinematic Sequence 01</div>
          </div>
          
          {/* Rule of thirds grid lines (visible on hover) */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none">
            <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/50" />
            <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/50" />
            <div className="absolute top-1/3 left-0 right-0 h-px bg-white/50" />
            <div className="absolute top-2/3 left-0 right-0 h-px bg-white/50" />
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="h-14 shrink-0 bg-card border-t border-border flex flex-col px-4 justify-center gap-1" data-testid="player-controls">
        {/* Scrubber */}
        <div className="h-1 w-full bg-muted rounded-full relative group cursor-pointer overflow-hidden" data-testid="scrubber">
          <div 
            className="absolute top-0 left-0 bottom-0 bg-primary group-hover:bg-accent-glow transition-colors"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-3 w-48 text-xs font-mono text-muted-foreground" data-testid="time-display">
            <span className="text-foreground">{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" data-testid="btn-skip-back">
              <SkipBack className="w-4 h-4 fill-current" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon" 
              className="h-10 w-10 rounded-full bg-secondary hover:bg-secondary/80 text-foreground"
              onClick={togglePlaying}
              data-testid="btn-play-pause"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" data-testid="btn-skip-forward">
              <SkipForward className="w-4 h-4 fill-current" />
            </Button>
          </div>

          <div className="flex items-center gap-3 w-48 justify-end">
            <Volume2 className="w-4 h-4 text-muted-foreground" />
            <div className="w-20 hidden sm:block">
              <Slider defaultValue={[80]} max={100} step={1} className="w-full" data-testid="slider-volume" />
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground ml-2" data-testid="btn-fullscreen">
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
