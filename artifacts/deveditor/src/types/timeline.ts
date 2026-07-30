export type TrackType = 'video' | 'audio' | 'subtitle';

export interface Clip {
  id: string;
  trackId: string;
  name: string;
  type: TrackType;
  startTime: number;   // seconds
  duration: number;    // seconds
  color?: string;
  text?: string;       // for subtitle clips
  locked?: boolean;
  selected?: boolean;
}

export interface Track {
  id: string;
  name: string;
  type: TrackType;
  height: number;      // px, default: video=72, audio=56, subtitle=48
  hidden: boolean;
  locked: boolean;
  muted: boolean;      // audio only
  clips: Clip[];
}

export interface TimelineState {
  tracks: Track[];
  selectedClipIds: string[];
  zoomLevel: number;         // pixels per second, range 20-400
  scrollLeft: number;
  scrollTop: number;
  snapEnabled: boolean;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  clipboard: Clip[];
  history: Track[][];
  historyIndex: number;
}
