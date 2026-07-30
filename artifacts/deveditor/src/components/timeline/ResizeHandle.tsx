import { useRef } from 'react';
import { cn } from '@/lib/utils';

interface ResizeHandleProps {
  side: 'left' | 'right';
  onResize: (deltaX: number, isDone: boolean) => void;
  onResizeStart?: () => void;
}

export function ResizeHandle({ side, onResize, onResizeStart }: ResizeHandleProps) {
  const dragRef = useRef<{ startX: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX };
    onResizeStart?.();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    e.stopPropagation();
    const deltaX = e.clientX - dragRef.current.startX;
    onResize(deltaX, false);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    e.stopPropagation();
    e.currentTarget.releasePointerCapture(e.pointerId);
    const deltaX = e.clientX - dragRef.current.startX;
    dragRef.current = null;
    onResize(deltaX, true);
  };

  return (
    <div
      className={cn(
        "absolute top-0 bottom-0 w-2 cursor-col-resize z-10 flex items-center justify-center opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity",
        side === 'left' ? "-left-1" : "-right-1"
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      data-testid={`resize-handle-${side}`}
    >
      <div className="w-1 h-1/3 bg-white rounded-full shadow-sm" />
    </div>
  );
}
