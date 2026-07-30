import { useRef, useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';
import { useEditorStore } from '@/store/editorStore';
import { formatTime } from '@/utils/timeline';

interface PlayheadProps {
  pixelsPerSecond: number;
  duration: number;
}

export function Playhead({ pixelsPerSecond, duration }: PlayheadProps) {
  const { currentTime, setCurrentTime, isPlaying } = useEditorStore();
  const playheadX = currentTime * pixelsPerSecond;
  const controls = useAnimationControls();
  const dragRef = useRef<{ startX: number; startTime: number } | null>(null);

  useEffect(() => {
    controls.set({ x: playheadX });
  }, [playheadX, controls, isPlaying]);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startTime: currentTime };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const deltaX = e.clientX - dragRef.current.startX;
    const deltaTime = deltaX / pixelsPerSecond;
    let newTime = dragRef.current.startTime + deltaTime;
    newTime = Math.max(0, Math.min(newTime, duration));
    setCurrentTime(newTime);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    dragRef.current = null;
  };

  return (
    <motion.div
      className="absolute top-0 bottom-0 w-px bg-red-500 z-30 flex flex-col items-center cursor-ew-resize"
      animate={controls}
      transition={{ type: "tween", ease: "linear", duration: isPlaying ? 0.1 : 0 }}
      style={{ left: 0 }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      data-testid="playhead"
    >
      <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-red-500 absolute -top-0 -translate-x-[5.5px]" />
      <div className="bg-red-500 text-white text-[9px] px-1 py-0.5 rounded-sm absolute -top-5 font-mono whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
        {formatTime(currentTime)}
      </div>
    </motion.div>
  );
}
