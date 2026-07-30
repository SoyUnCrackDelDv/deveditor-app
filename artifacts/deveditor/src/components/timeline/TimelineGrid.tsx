import { useMemo } from 'react';

interface TimelineGridProps {
  pixelsPerSecond: number;
  duration: number;
  width: number;
}

export function TimelineGrid({ pixelsPerSecond, duration, width }: TimelineGridProps) {
  const interval = useMemo(() => {
    if (pixelsPerSecond < 40) return 30;
    if (pixelsPerSecond < 100) return 10;
    if (pixelsPerSecond < 200) return 5;
    return 1;
  }, [pixelsPerSecond]);

  const markers = useMemo(() => {
    const arr = [];
    for (let i = 0; i <= duration; i += interval) {
      arr.push(i);
    }
    return arr;
  }, [duration, interval]);

  return (
    <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden" style={{ minWidth: width }}>
      {markers.map(time => (
        <div
          key={`grid-${time}`}
          className="absolute top-0 bottom-0 w-px bg-white"
          style={{ left: time * pixelsPerSecond }}
        />
      ))}
    </div>
  );
}
