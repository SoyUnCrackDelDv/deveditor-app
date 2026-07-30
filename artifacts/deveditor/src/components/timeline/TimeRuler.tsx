import { useMemo } from 'react';
import { formatTime } from '@/utils/timeline';

interface TimeRulerProps {
  pixelsPerSecond: number;
  scrollLeft: number;
  duration: number;
  width: number;
}

export function TimeRuler({ pixelsPerSecond, scrollLeft, duration, width }: TimeRulerProps) {
  // Determine interval based on zoom level
  const interval = useMemo(() => {
    if (pixelsPerSecond < 40) return 30; // low zoom: 30s
    if (pixelsPerSecond < 100) return 10; // medium zoom: 10s
    if (pixelsPerSecond < 200) return 5;  // high zoom: 5s
    return 1; // very high zoom: 1s
  }, [pixelsPerSecond]);

  const markers = useMemo(() => {
    const arr = [];
    for (let i = 0; i <= duration; i += interval) {
      arr.push({ time: i, label: formatTime(i) });
    }
    return arr;
  }, [duration, interval]);

  const minorTicks = useMemo(() => {
    const arr = [];
    const minorInterval = interval / 5;
    for (let i = 0; i <= duration; i += minorInterval) {
      if (i % interval !== 0) { // Don't overlap with major ticks
        arr.push(i);
      }
    }
    return arr;
  }, [duration, interval]);

  return (
    <div className="h-7 border-b border-border bg-[#0d0d0f]/90 sticky top-0 z-20 flex items-end select-none">
      {/* Major ticks */}
      {markers.map((marker) => (
        <div
          key={marker.time}
          className="absolute bottom-0 flex flex-col items-center"
          style={{ left: marker.time * pixelsPerSecond }}
        >
          <span className="text-[10px] text-muted-foreground mb-[2px] -ml-6 whitespace-nowrap">
            {marker.label}
          </span>
          <div className="w-px h-1.5 bg-muted-foreground/50" />
        </div>
      ))}
      {/* Minor ticks */}
      {minorTicks.map((time) => (
        <div
          key={`minor-${time}`}
          className="absolute bottom-0 w-px h-1 bg-border/50"
          style={{ left: time * pixelsPerSecond }}
        />
      ))}
    </div>
  );
}
