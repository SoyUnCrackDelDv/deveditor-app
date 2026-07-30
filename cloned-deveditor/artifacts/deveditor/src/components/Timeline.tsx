import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Maximize2, MonitorPlay, Music, Type, Eye, EyeOff, Lock, Unlock, Volume2, VolumeX } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Timeline() {
  const { currentTime, duration, zoomLevel, setZoomLevel, isPlaying } = useEditorStore();
  const timelineRef = useRef<HTMLDivElement>(null);
  
  // Convert time to pixels based on zoom level
  const pixelsPerSecond = zoomLevel; 
  const playheadX = currentTime * pixelsPerSecond;
  
  // Generate time markers
  const markers = [];
  for (let i = 0; i <= duration; i += 30) {
    const m = Math.floor(i / 60).toString().padStart(2, '0');
    const s = (i % 60).toString().padStart(2, '0');
    markers.push({ time: i, label: `00:${m}:${s}` });
  }

  return (
    <div className="h-full flex flex-col bg-card border-t border-border overflow-hidden" data-testid="timeline">
      {/* Timeline Header (Tools & Zoom) */}
      <div className="h-10 border-b border-border flex items-center justify-between px-4 shrink-0 bg-background/50">
        <div className="flex items-center gap-2">
          {/* Tools mock */}
          <div className="text-xs text-muted-foreground font-medium px-2 py-1 bg-secondary rounded cursor-pointer hover:text-foreground">
            Pointer (V)
          </div>
          <div className="text-xs text-muted-foreground font-medium px-2 py-1 rounded cursor-pointer hover:text-foreground hover:bg-secondary">
            Blade (C)
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => setZoomLevel(Math.max(10, zoomLevel - 10))}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <div className="w-24 h-1 bg-secondary rounded-full overflow-hidden relative">
            <div className="absolute top-0 left-0 bottom-0 bg-primary/50" style={{ width: `${(zoomLevel / 200) * 100}%` }} />
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-border mx-1" />
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Track Headers (Left Column) */}
        <div className="w-48 shrink-0 border-r border-border bg-card flex flex-col z-10 shadow-[2px_0_10px_rgba(0,0,0,0.2)]">
          {/* Time Ruler corner space */}
          <div className="h-8 border-b border-border bg-background/80 shrink-0" />
          
          <div className="flex-1 overflow-y-auto overflow-x-hidden pt-2 pb-8 flex flex-col gap-1 hide-scrollbar">
            <TrackHeader icon={Type} name="V2 (Subtítulos)" color="text-amber-500" />
            <TrackHeader icon={MonitorPlay} name="V1 (Video Principal)" color="text-blue-500" isMain />
            <TrackHeader icon={Music} name="A1 (Música)" color="text-emerald-500" isAudio />
            <TrackHeader icon={Music} name="A2 (SFX)" color="text-emerald-500" isAudio />
          </div>
        </div>

        {/* Timeline Tracks Area */}
        <div className="flex-1 overflow-auto relative bg-[#121214]" ref={timelineRef}>
          <div className="min-w-full" style={{ width: Math.max(800, duration * pixelsPerSecond + 200) }}>
            
            {/* Time Ruler */}
            <div className="h-8 border-b border-border bg-background/80 sticky top-0 z-20 flex items-end">
              {markers.map(marker => (
                <div 
                  key={marker.time} 
                  className="absolute bottom-0 flex flex-col items-center"
                  style={{ left: marker.time * pixelsPerSecond }}
                >
                  <span className="text-[10px] text-muted-foreground mb-1 -ml-6 whitespace-nowrap">{marker.label}</span>
                  <div className="w-px h-2 bg-border" />
                </div>
              ))}
              {/* Minor ticks */}
              {Array.from({ length: Math.floor(duration / 10) }).map((_, i) => (
                <div 
                  key={`minor-${i}`} 
                  className="absolute bottom-0 w-px h-1 bg-border/50"
                  style={{ left: i * 10 * pixelsPerSecond }}
                />
              ))}
            </div>

            {/* Tracks Container */}
            <div className="relative pt-2 pb-8 flex flex-col gap-1 z-0">
              
              {/* Grid Lines (Background) */}
              <div className="absolute inset-0 pointer-events-none opacity-20">
                {markers.map(marker => (
                  <div 
                    key={`grid-${marker.time}`} 
                    className="absolute top-0 bottom-0 w-px bg-border"
                    style={{ left: marker.time * pixelsPerSecond }}
                  />
                ))}
              </div>

              {/* Subtitles Track */}
              <div className="h-16 relative w-full mb-2 bg-black/20 rounded-sm border border-transparent hover:border-white/5 transition-colors group">
                <SubtitleClip start={10} dur={4} text="Hola, bienvenidos" color="bg-amber-600/80 border-amber-500" pps={pixelsPerSecond} />
                <SubtitleClip start={15} dur={6} text="Hoy vamos a aprender..." color="bg-amber-600/80 border-amber-500" pps={pixelsPerSecond} />
                <SubtitleClip start={22} dur={3} text="Paso número uno" color="bg-amber-600/80 border-amber-500" pps={pixelsPerSecond} />
                <SubtitleClip start={30} dur={8} text="Mira cómo funciona esto" color="bg-amber-600/80 border-amber-500" pps={pixelsPerSecond} />
              </div>

              {/* Video Track */}
              <div className="h-20 relative w-full mb-2 bg-black/20 rounded-sm border border-transparent hover:border-white/5 transition-colors">
                <VideoClip start={0} dur={45} name="IMG_8492.MOV" color="bg-blue-600/30 border-blue-500" pps={pixelsPerSecond} />
                <VideoClip start={45} dur={30} name="B-Roll_City.mp4" color="bg-indigo-600/30 border-indigo-500" pps={pixelsPerSecond} />
                <VideoClip start={75} dur={40} name="IMG_8493.MOV" color="bg-blue-600/30 border-blue-500" pps={pixelsPerSecond} />
              </div>

              {/* Audio Track 1 */}
              <div className="h-16 relative w-full mb-2 bg-black/20 rounded-sm border border-transparent hover:border-white/5 transition-colors">
                <AudioClip start={0} dur={120} name="lofi-study-beat.mp3" color="bg-emerald-600/30 border-emerald-500" pps={pixelsPerSecond} />
              </div>

              {/* Audio Track 2 (SFX) */}
              <div className="h-16 relative w-full bg-black/20 rounded-sm border border-transparent hover:border-white/5 transition-colors">
                <AudioClip start={10} dur={2} name="whoosh.wav" color="bg-emerald-700/40 border-emerald-600" pps={pixelsPerSecond} />
                <AudioClip start={44} dur={3} name="impact.wav" color="bg-emerald-700/40 border-emerald-600" pps={pixelsPerSecond} />
                <AudioClip start={74} dur={2} name="whoosh.wav" color="bg-emerald-700/40 border-emerald-600" pps={pixelsPerSecond} />
              </div>

            </div>

            {/* Playhead Line */}
            <motion.div 
              className="absolute top-0 bottom-0 w-px bg-primary z-30 pointer-events-none"
              animate={{ x: playheadX }}
              transition={{ type: "tween", ease: "linear", duration: isPlaying ? 0.1 : 0 }}
            >
              <div className="w-3 h-4 bg-primary absolute -top-1 -left-1.5 rounded-sm flex items-center justify-center shadow-[0_0_10px_rgba(124,58,237,0.5)]">
                <div className="w-0.5 h-2 bg-white/50 rounded-full" />
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}

function TrackHeader({ icon: Icon, name, color, isMain, isAudio }: any) {
  const [locked, setLocked] = useState(false);
  const [hidden, setHidden] = useState(false);

  return (
    <div className={cn(
      "h-16 flex items-center justify-between px-3 group hover:bg-secondary/50 transition-colors border-y border-transparent hover:border-border/30",
      isMain ? "h-20" : ""
    )}>
      <div className="flex items-center gap-2 overflow-hidden">
        <Icon className={cn("w-4 h-4 shrink-0", color)} />
        <span className="text-xs font-medium text-foreground truncate select-none">{name}</span>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => setHidden(!hidden)} className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground">
          {isAudio ? (hidden ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />) : (hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />)}
        </button>
        <button onClick={() => setLocked(!locked)} className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground">
          {locked ? <Lock className="w-3.5 h-3.5 text-primary" /> : <Unlock className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}

function SubtitleClip({ start, dur, text, color, pps }: any) {
  return (
    <div 
      className={cn("absolute h-10 top-3 rounded-md border-l-4 overflow-hidden flex flex-col justify-center px-2 cursor-pointer hover:brightness-110 shadow-sm", color)}
      style={{ left: start * pps, width: dur * pps }}
    >
      <span className="text-[10px] font-semibold text-white truncate drop-shadow-md">{text}</span>
    </div>
  );
}

function VideoClip({ start, dur, name, color, pps }: any) {
  return (
    <div 
      className={cn("absolute h-16 top-2 rounded-md border-y border-l-4 overflow-hidden flex flex-col justify-between px-2 py-1 cursor-pointer hover:brightness-125 transition-all shadow-sm group", color)}
      style={{ left: start * pps, width: dur * pps }}
    >
      <span className="text-[10px] font-medium text-white/90 truncate">{name}</span>
      {/* Mock frames */}
      <div className="w-full h-8 flex gap-1 opacity-60 mix-blend-overlay">
        {Array.from({ length: Math.max(1, Math.floor((dur * pps) / 40)) }).map((_, i) => (
          <div key={i} className="h-full w-10 bg-white/20 rounded-sm shrink-0" />
        ))}
      </div>
    </div>
  );
}

function AudioClip({ start, dur, name, color, pps }: any) {
  return (
    <div 
      className={cn("absolute h-12 top-2 rounded-md border-y border-l-4 overflow-hidden flex flex-col justify-center px-2 cursor-pointer hover:brightness-125 transition-all shadow-sm", color)}
      style={{ left: start * pps, width: dur * pps }}
    >
      <span className="text-[10px] font-medium text-white/90 truncate mb-1">{name}</span>
      {/* Mock Waveform */}
      <div className="w-full h-4 flex items-center gap-[2px] opacity-70">
        {Array.from({ length: Math.max(1, Math.floor((dur * pps) / 4)) }).map((_, i) => (
          <div 
            key={i} 
            className="w-0.5 bg-current rounded-full" 
            style={{ 
              height: `${20 + Math.random() * 80}%`,
              color: 'currentColor'
            }} 
          />
        ))}
      </div>
    </div>
  );
}
