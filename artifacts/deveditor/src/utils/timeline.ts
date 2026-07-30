export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const frames = Math.floor((seconds % 1) * 30);
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}:${String(frames).padStart(2,'0')}`;
}

export function snapToGrid(value: number, snapThreshold: number, otherEdges: number[]): number {
  for (const edge of otherEdges) {
    if (Math.abs(value - edge) < snapThreshold) return edge;
  }
  return value;
}

export function getClipEdges(clips: import('../types/timeline').Clip[]): number[] {
  const edges: number[] = [];
  for (const clip of clips) {
    edges.push(clip.startTime);
    edges.push(clip.startTime + clip.duration);
  }
  return edges;
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}
