import { useRef, useEffect, useState, useCallback } from 'react';
import { MousePointer2, Scissors, Magnet } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { ZoomControls } from './ZoomControls';
import { TimeRuler } from './TimeRuler';
import { Playhead } from './Playhead';
import { SnapGuide } from './SnapGuide';
import { SelectionBox } from './SelectionBox';
import { TrackHeader } from './TrackHeader';
import { Track } from './Track';
import { TimelineGrid } from './TimelineGrid';
import { ContextMenu } from './ContextMenu';
import { getClipEdges } from '@/utils/timeline';

export function TimelineEditor() {
  useKeyboardShortcuts();

  const {
    tracks, zoomLevel, setZoomLevel, isPlaying, duration,
    snapEnabled, clearSelection, selectClips
  } = useEditorStore();

  const headersRef = useRef<HTMLDivElement>(null);
  const trackAreaRef = useRef<HTMLDivElement>(null);
  const trackContentRef = useRef<HTMLDivElement>(null);

  const pixelsPerSecond = zoomLevel;
  const totalWidth = Math.max(1200, duration * pixelsPerSecond + 400);

  const [selection, setSelection] = useState<{ startX: number, startY: number, endX: number, endY: number, visible: boolean }>({
    startX: 0, startY: 0, endX: 0, endY: 0, visible: false
  });

  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, clipId: string | null, visible: boolean }>({
    x: 0, y: 0, clipId: null, visible: false
  });

  // Playback simulation
  useEffect(() => {
    if (!isPlaying) return;
    let lastTime = performance.now();
    let rafId: number;

    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      
      const current = useEditorStore.getState().currentTime;
      const next = current + dt;
      
      if (next >= duration) {
        useEditorStore.getState().setCurrentTime(duration);
        useEditorStore.getState().togglePlaying();
      } else {
        useEditorStore.getState().setCurrentTime(next);
        rafId = requestAnimationFrame(loop);
      }
    };
    
    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [isPlaying, duration]);

  // Sync scrolling between track area and headers
  const handleScroll = () => {
    if (headersRef.current && trackAreaRef.current) {
      headersRef.current.scrollTop = trackAreaRef.current.scrollTop;
    }
  };

  // Zoom via Ctrl+Wheel
  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 10 : -10;
      const newZoom = Math.max(20, Math.min(400, zoomLevel + delta));
      setZoomLevel(newZoom);
    }
  }, [zoomLevel, setZoomLevel]);

  useEffect(() => {
    const trackArea = trackAreaRef.current;
    if (trackArea) {
      trackArea.addEventListener('wheel', handleWheel, { passive: false });
      return () => trackArea.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  // Context Menu
  const handleContextMenu = useCallback((e: React.MouseEvent, clipId: string | null) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, clipId, visible: true });
  }, []);

  // Selection Box
  const getRelativePos = (e: React.PointerEvent) => {
    if (!trackContentRef.current) return { x: 0, y: 0 };
    const rect = trackContentRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('[data-testid^="clip-"]')) return;
    
    const pos = getRelativePos(e);
    setSelection({
      startX: pos.x,
      startY: pos.y,
      endX: pos.x,
      endY: pos.y,
      visible: true
    });
    clearSelection();
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!selection.visible) return;
    const pos = getRelativePos(e);
    setSelection(s => ({ ...s, endX: pos.x, endY: pos.y }));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!selection.visible) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    
    // Calculate selected clips
    const left = Math.min(selection.startX, selection.endX);
    const right = Math.max(selection.startX, selection.endX);
    const top = Math.min(selection.startY, selection.endY);
    const bottom = Math.max(selection.startY, selection.endY);

    if (right - left > 5 && bottom - top > 5 && trackContentRef.current) {
      const selectedIds: string[] = [];
      let currentY = 0;
      
      for (const track of tracks) {
        if (track.hidden) continue;
        const trackTop = currentY;
        const trackBottom = currentY + track.height;
        
        if (trackBottom >= top && trackTop <= bottom) {
          for (const clip of track.clips) {
            const clipLeft = clip.startTime * pixelsPerSecond;
            const clipRight = clipLeft + clip.duration * pixelsPerSecond;
            if (clipRight >= left && clipLeft <= right) {
              selectedIds.push(clip.id);
            }
          }
        }
        currentY += track.height;
      }
      if (selectedIds.length > 0) {
        selectClips(selectedIds);
      }
    }
    
    setSelection(s => ({ ...s, visible: false }));
  };

  return (
    <div className="h-full flex flex-col bg-card border-t border-border overflow-hidden select-none" data-testid="timeline-editor">
      {/* Header Toolbar */}
      <div className="h-10 border-b border-border flex items-center justify-between px-4 shrink-0 bg-background/50 z-20">
        <div className="flex items-center gap-1">
          <div className="p-1.5 bg-primary/20 text-primary rounded cursor-pointer mr-2">
            <MousePointer2 className="w-4 h-4" />
          </div>
          <div className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded cursor-pointer">
            <Scissors className="w-4 h-4" />
          </div>
          <div className="w-px h-4 bg-border mx-2" />
          {snapEnabled && <div className="flex items-center gap-1 text-[10px] font-medium text-primary"><Magnet className="w-3 h-3" /> SNAP</div>}
        </div>
        <ZoomControls />
      </div>

      <div className="flex-1 flex min-h-0 relative">
        {/* Left Column - Track Headers */}
        <div className="w-[200px] shrink-0 border-r border-border bg-card flex flex-col z-30 shadow-[2px_0_10px_rgba(0,0,0,0.4)]">
          <div className="h-7 border-b border-border bg-[#0d0d0f]/90 shrink-0" />
          <div className="flex-1 overflow-hidden" ref={headersRef}>
            <div className="flex flex-col">
              {tracks.map(track => !track.hidden && <TrackHeader key={track.id} track={track} />)}
            </div>
          </div>
        </div>

        {/* Right Column - Track Area */}
        <div 
          className="flex-1 overflow-auto bg-[#0d0d0f] relative outline-none custom-scrollbar" 
          ref={trackAreaRef}
          onScroll={handleScroll}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onContextMenu={(e) => handleContextMenu(e, null)}
          tabIndex={0}
        >
          <div 
            className="relative min-h-full" 
            style={{ width: totalWidth }}
            ref={trackContentRef}
          >
            <TimeRuler pixelsPerSecond={pixelsPerSecond} scrollLeft={0} duration={duration} width={totalWidth} />
            <TimelineGrid pixelsPerSecond={pixelsPerSecond} duration={duration} width={totalWidth} />
            
            <div className="flex flex-col relative z-10 pt-1">
              {tracks.map((track, i) => (
                <Track 
                  key={track.id} 
                  track={track} 
                  pixelsPerSecond={pixelsPerSecond} 
                  trackIndex={i} 
                  totalWidth={totalWidth} 
                  onContextMenu={handleContextMenu}
                />
              ))}
            </div>

            <Playhead pixelsPerSecond={pixelsPerSecond} duration={duration} />
            <SnapGuide x={null} visible={false} />
            <SelectionBox {...selection} />
          </div>
        </div>
      </div>

      <ContextMenu {...contextMenu} onClose={() => setContextMenu(s => ({ ...s, visible: false }))} />
    </div>
  );
}
