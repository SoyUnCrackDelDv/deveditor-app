import { useState, useRef, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import { Clip as ClipType, Track } from '@/types/timeline';
import { useEditorStore } from '@/store/editorStore';
import { ResizeHandle } from './ResizeHandle';
import { formatTime, snapToGrid, getClipEdges } from '@/utils/timeline';
import { cn } from '@/lib/utils';

interface ClipProps {
  clip: ClipType;
  track: Track;
  pixelsPerSecond: number;
  trackIndex: number;
  onContextMenu: (e: React.MouseEvent, clipId: string) => void;
}

export const Clip = memo(function Clip({ clip, track, pixelsPerSecond, onContextMenu }: ClipProps) {
  const { 
    selectedClipIds, selectClip, moveClip, resizeClip, saveHistory, 
    snapEnabled, tracks
  } = useEditorStore();

  const isSelected = selectedClipIds.includes(clip.id);
  const [isHovered, setIsHovered] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number, y: number } | null>(null);
  const [resizeOffset, setResizeOffset] = useState<{ startX: number, width: number } | null>(null);

  const dragRef = useRef<{ 
    startX: number; 
    startY: number; 
    startTime: number; 
    trackId: string;
    hasMoved: boolean;
  } | null>(null);

  const resizeRef = useRef<{ 
    originalStart: number;
    originalDuration: number;
  } | null>(null);

  // Compute other edges for snapping
  const otherEdges = useMemo(() => {
    if (!snapEnabled) return [];
    const allClips = tracks.flatMap(t => t.clips).filter(c => c.id !== clip.id);
    return getClipEdges(allClips);
  }, [tracks, clip.id, snapEnabled]);

  const snapThresholdTime = 8 / pixelsPerSecond; // 8px

  // Drag to move
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 || clip.locked) return; // Only left click
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { 
      startX: e.clientX, 
      startY: e.clientY, 
      startTime: clip.startTime,
      trackId: clip.trackId,
      hasMoved: false
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    
    if (!dragRef.current.hasMoved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
      dragRef.current.hasMoved = true;
    }
    
    if (dragRef.current.hasMoved) {
      setDragOffset({ x: dx, y: dy });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    
    if (!dragRef.current.hasMoved) {
      selectClip(clip.id, e.shiftKey);
    } else {
      // Find drop track
      const dropTrackEl = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-track-id]');
      let newTrackId = clip.trackId;
      if (dropTrackEl) {
        const id = dropTrackEl.getAttribute('data-track-id');
        const targetTrack = tracks.find(t => t.id === id);
        if (id && targetTrack && targetTrack.type === clip.type) {
          newTrackId = id;
        }
      }

      // Calculate new time
      const dt = dragOffset!.x / pixelsPerSecond;
      let newStartTime = dragRef.current.startTime + dt;
      
      // Snap
      if (snapEnabled) {
        newStartTime = snapToGrid(newStartTime, snapThresholdTime, otherEdges);
      }
      
      newStartTime = Math.max(0, newStartTime);
      moveClip(clip.id, newStartTime, newTrackId);
    }
    
    dragRef.current = null;
    setDragOffset(null);
  };

  // Resize
  const handleResizeStart = () => {
    if (clip.locked) return;
    saveHistory();
    resizeRef.current = { originalStart: clip.startTime, originalDuration: clip.duration };
  };

  const handleResizeLeft = (deltaX: number, isDone: boolean) => {
    if (!resizeRef.current) return;
    const dt = deltaX / pixelsPerSecond;
    let newStart = resizeRef.current.originalStart + dt;
    
    if (snapEnabled && !isDone) {
      newStart = snapToGrid(newStart, snapThresholdTime, otherEdges);
    }
    
    newStart = Math.max(0, newStart);
    const maxStart = resizeRef.current.originalStart + resizeRef.current.originalDuration - 0.5;
    newStart = Math.min(newStart, maxStart);
    
    const newDuration = resizeRef.current.originalStart + resizeRef.current.originalDuration - newStart;
    
    if (isDone) {
      resizeClip(clip.id, newStart, newDuration);
      setResizeOffset(null);
      resizeRef.current = null;
    } else {
      setResizeOffset({
        startX: newStart * pixelsPerSecond,
        width: newDuration * pixelsPerSecond
      });
    }
  };

  const handleResizeRight = (deltaX: number, isDone: boolean) => {
    if (!resizeRef.current) return;
    const dt = deltaX / pixelsPerSecond;
    let newEnd = resizeRef.current.originalStart + resizeRef.current.originalDuration + dt;
    
    if (snapEnabled && !isDone) {
      newEnd = snapToGrid(newEnd, snapThresholdTime, otherEdges);
    }
    
    let newDuration = newEnd - resizeRef.current.originalStart;
    newDuration = Math.max(0.5, newDuration);
    
    if (isDone) {
      resizeClip(clip.id, resizeRef.current.originalStart, newDuration);
      setResizeOffset(null);
      resizeRef.current = null;
    } else {
      setResizeOffset({
        startX: resizeRef.current.originalStart * pixelsPerSecond,
        width: newDuration * pixelsPerSecond
      });
    }
  };

  // Compute visual boundaries
  const left = resizeOffset ? resizeOffset.startX : clip.startTime * pixelsPerSecond;
  const width = resizeOffset ? resizeOffset.width : clip.duration * pixelsPerSecond;
  
  const yOffset = dragOffset?.y || 0;
  const xOffset = dragOffset?.x || 0;

  // Colors
  const bgColor = clip.color || (clip.type === 'video' ? '#1d4ed8' : clip.type === 'audio' ? '#059669' : '#d97706');
  
  return (
    <motion.div
      className={cn(
        "absolute rounded-md border flex flex-col overflow-hidden select-none group",
        isSelected ? "z-20 border-primary ring-1 ring-primary/50" : "z-10 border-transparent",
        clip.locked && "opacity-50"
      )}
      style={{
        left,
        width,
        height: track.height - 8,
        top: 4,
        backgroundColor: bgColor,
        transform: `translate(${xOffset}px, ${yOffset}px)`,
        cursor: clip.locked ? 'not-allowed' : dragOffset ? 'grabbing' : 'grab'
      }}
      whileHover={!clip.locked && !dragOffset ? { filter: 'brightness(1.15)' } : undefined}
      animate={{ scale: isSelected && !dragOffset ? 0.98 : 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onContextMenu={(e) => onContextMenu(e, clip.id)}
      data-testid={`clip-${clip.id}`}
    >
      {/* Clip Content */}
      <div className="px-2 py-1 flex-1 flex flex-col justify-between overflow-hidden pointer-events-none relative z-0">
        <span className="text-[10px] font-medium text-white/90 truncate drop-shadow-sm">{clip.name}</span>
        
        {clip.type === 'video' && (
          <div className="w-full h-1/2 flex gap-1 opacity-60 mix-blend-overlay mt-auto">
            {Array.from({ length: Math.max(1, Math.floor(width / 40)) }).map((_, i) => (
              <div key={i} className="h-full w-10 bg-white/30 rounded-sm shrink-0" />
            ))}
          </div>
        )}
        
        {clip.type === 'audio' && (
          <div className="w-full h-1/2 flex items-center gap-[2px] opacity-70 mt-auto">
            {Array.from({ length: Math.max(1, Math.floor(width / 5)) }).map((_, i) => {
              // Deterministic random based on clip id and index
              const seed = clip.id.charCodeAt(0) + i;
              const h = 20 + ((seed * 13) % 80);
              return (
                <div key={i} className="w-0.5 bg-white rounded-full" style={{ height: `${h}%` }} />
              );
            })}
          </div>
        )}

        {clip.type === 'subtitle' && clip.text && (
          <span className="text-[11px] font-semibold text-white truncate drop-shadow-md pb-0.5">
            {clip.text}
          </span>
        )}
      </div>

      {/* Background dark overlay for locked state */}
      {clip.locked && (
        <div className="absolute inset-0 bg-black/20 pattern-diagonal-lines pattern-bg-transparent pattern-black pattern-opacity-40 pattern-size-4 pointer-events-none" />
      )}

      {/* Handles */}
      {!clip.locked && isSelected && (
        <>
          <ResizeHandle side="left" onResize={handleResizeLeft} onResizeStart={handleResizeStart} />
          <ResizeHandle side="right" onResize={handleResizeRight} onResizeStart={handleResizeStart} />
        </>
      )}

      {/* Duration Badge */}
      {isHovered && !dragOffset && !resizeOffset && (
        <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-sm text-white px-1 rounded text-[8px] font-mono pointer-events-none z-10">
          {formatTime(clip.duration)}
        </div>
      )}
    </motion.div>
  );
});
