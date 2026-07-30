import { create } from 'zustand';
import { Track, Clip } from '@/types/timeline';
import { generateId } from '@/utils/timeline';

// --- MOCK DATA ---
const MOCK_TRACKS: Track[] = [
  {
    id: 'v3', name: 'V3', type: 'video', height: 52, hidden: false, locked: false, muted: false,
    clips: [],
  },
  {
    id: 'v2', name: 'V2 (Subtítulos)', type: 'subtitle', height: 48, hidden: false, locked: false, muted: false,
    clips: [
      { id: 'sc1', trackId: 'v2', name: 'Hola, bienvenidos', type: 'subtitle', startTime: 10, duration: 4, color: '#d97706', text: 'Hola, bienvenidos' },
      { id: 'sc2', trackId: 'v2', name: 'Hoy vamos a aprender...', type: 'subtitle', startTime: 15, duration: 6, color: '#d97706', text: 'Hoy vamos a aprender...' },
      { id: 'sc3', trackId: 'v2', name: 'Paso número uno', type: 'subtitle', startTime: 22, duration: 3, color: '#d97706', text: 'Paso número uno' },
      { id: 'sc4', trackId: 'v2', name: 'Mira cómo funciona', type: 'subtitle', startTime: 30, duration: 8, color: '#d97706', text: 'Mira cómo funciona' },
    ],
  },
  {
    id: 'v1', name: 'V1 (Video Principal)', type: 'video', height: 72, hidden: false, locked: false, muted: false,
    clips: [
      { id: 'vc1', trackId: 'v1', name: 'IMG_8492.MOV', type: 'video', startTime: 0, duration: 45, color: '#1d4ed8' },
      { id: 'vc2', trackId: 'v1', name: 'B-Roll_City.mp4', type: 'video', startTime: 45, duration: 30, color: '#4f46e5' },
      { id: 'vc3', trackId: 'v1', name: 'IMG_8493.MOV', type: 'video', startTime: 75, duration: 40, color: '#1d4ed8' },
    ],
  },
  {
    id: 'a1', name: 'A1 (Música)', type: 'audio', height: 56, hidden: false, locked: false, muted: false,
    clips: [
      { id: 'ac1', trackId: 'a1', name: 'lofi-study-beat.mp3', type: 'audio', startTime: 0, duration: 120, color: '#059669' },
    ],
  },
  {
    id: 'a2', name: 'A2 (SFX)', type: 'audio', height: 56, hidden: false, locked: false, muted: false,
    clips: [
      { id: 'ac2', trackId: 'a2', name: 'whoosh.wav', type: 'audio', startTime: 10, duration: 2, color: '#10b981' },
      { id: 'ac3', trackId: 'a2', name: 'impact.wav', type: 'audio', startTime: 44, duration: 3, color: '#10b981' },
      { id: 'ac4', trackId: 'a2', name: 'whoosh.wav', type: 'audio', startTime: 74, duration: 2, color: '#10b981' },
    ],
  },
];

export type Section = 'projects' | 'multimedia' | 'audio' | 'subtitles' | 'templates' | 'favorites' | 'export';

interface EditorStore {
  // Sidebar
  activeSection: Section | null;
  setActiveSection: (section: Section | null) => void;

  // Playback
  isPlaying: boolean;
  togglePlaying: () => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  duration: number;

  // Timeline
  tracks: Track[];
  selectedClipIds: string[];
  zoomLevel: number;
  snapEnabled: boolean;
  clipboard: Clip[];

  // History (undo/redo)
  history: Track[][];
  historyIndex: number;
  saveHistory: () => void;
  undo: () => void;
  redo: () => void;

  // Zoom
  setZoomLevel: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;

  // Selection
  selectClip: (clipId: string, multi: boolean) => void;
  selectClips: (clipIds: string[]) => void;
  clearSelection: () => void;

  // Clip operations
  moveClip: (clipId: string, newStartTime: number, newTrackId: string) => void;
  resizeClip: (clipId: string, newStartTime: number, newDuration: number) => void;
  deleteSelectedClips: () => void;
  duplicateClip: (clipId: string) => void;
  renameClip: (clipId: string, name: string) => void;
  changeClipColor: (clipId: string, color: string) => void;
  lockClip: (clipId: string, locked: boolean) => void;
  copySelectedClips: () => void;
  pasteClips: () => void;

  // Track operations
  toggleTrackHidden: (trackId: string) => void;
  toggleTrackLocked: (trackId: string) => void;
  toggleTrackMuted: (trackId: string) => void;
  addTrack: (type: Track['type']) => void;
  deleteTrack: (trackId: string) => void;

  // Snap
  toggleSnap: () => void;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  activeSection: 'multimedia',
  setActiveSection: (section) => set((state) => ({ activeSection: state.activeSection === section ? null : section })),

  isPlaying: false,
  togglePlaying: () => set((s) => ({ isPlaying: !s.isPlaying })),
  currentTime: 0,
  setCurrentTime: (time) => set({ currentTime: Math.max(0, Math.min(time, get().duration)) }),
  duration: 130,

  tracks: MOCK_TRACKS,
  selectedClipIds: [],
  zoomLevel: 80,
  snapEnabled: true,
  clipboard: [],
  history: [MOCK_TRACKS],
  historyIndex: 0,

  saveHistory: () => {
    const { tracks, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(tracks)));
    set({ history: newHistory.slice(-50), historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({ tracks: JSON.parse(JSON.stringify(history[newIndex])), historyIndex: newIndex });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({ tracks: JSON.parse(JSON.stringify(history[newIndex])), historyIndex: newIndex });
    }
  },

  setZoomLevel: (zoom) => set({ zoomLevel: Math.max(20, Math.min(400, zoom)) }),
  zoomIn: () => set((s) => ({ zoomLevel: Math.min(400, s.zoomLevel * 1.25) })),
  zoomOut: () => set((s) => ({ zoomLevel: Math.max(20, s.zoomLevel * 0.8) })),

  selectClip: (clipId, multi) => {
    const { selectedClipIds, tracks } = get();
    // Check if clip is locked
    const allClips = tracks.flatMap(t => t.clips);
    const clip = allClips.find(c => c.id === clipId);
    if (clip?.locked) return;
    if (multi) {
      if (selectedClipIds.includes(clipId)) {
        set({ selectedClipIds: selectedClipIds.filter(id => id !== clipId) });
      } else {
        set({ selectedClipIds: [...selectedClipIds, clipId] });
      }
    } else {
      set({ selectedClipIds: [clipId] });
    }
  },
  selectClips: (clipIds) => set({ selectedClipIds: clipIds }),
  clearSelection: () => set({ selectedClipIds: [] }),

  moveClip: (clipId, newStartTime, newTrackId) => {
    get().saveHistory();
    set((s) => {
      const tracks = s.tracks.map(track => {
        // Remove clip from old track
        const filtered = track.clips.filter(c => c.id !== clipId);
        if (track.id === newTrackId) {
          // Find the clip (from any track)
          const allClips = s.tracks.flatMap(t => t.clips);
          const clip = allClips.find(c => c.id === clipId);
          if (!clip) return track;
          const updated = { ...clip, trackId: newTrackId, startTime: Math.max(0, newStartTime) };
          return { ...track, clips: [...filtered.filter(c => c.id !== clipId), updated] };
        }
        return { ...track, clips: filtered };
      });
      return { tracks };
    });
  },

  resizeClip: (clipId, newStartTime, newDuration) => {
    set((s) => ({
      tracks: s.tracks.map(track => ({
        ...track,
        clips: track.clips.map(c =>
          c.id === clipId
            ? { ...c, startTime: Math.max(0, newStartTime), duration: Math.max(0.5, newDuration) }
            : c
        ),
      })),
    }));
  },

  deleteSelectedClips: () => {
    get().saveHistory();
    const { selectedClipIds } = get();
    set((s) => ({
      tracks: s.tracks.map(track => ({
        ...track,
        clips: track.clips.filter(c => !selectedClipIds.includes(c.id) || c.locked),
      })),
      selectedClipIds: [],
    }));
  },

  duplicateClip: (clipId) => {
    get().saveHistory();
    set((s) => ({
      tracks: s.tracks.map(track => {
        const clip = track.clips.find(c => c.id === clipId);
        if (!clip) return track;
        const duplicate = { ...clip, id: generateId(), startTime: clip.startTime + clip.duration };
        return { ...track, clips: [...track.clips, duplicate] };
      }),
    }));
  },

  renameClip: (clipId, name) => {
    set((s) => ({
      tracks: s.tracks.map(track => ({
        ...track,
        clips: track.clips.map(c => c.id === clipId ? { ...c, name, text: c.type === 'subtitle' ? name : c.text } : c),
      })),
    }));
  },

  changeClipColor: (clipId, color) => {
    set((s) => ({
      tracks: s.tracks.map(track => ({
        ...track,
        clips: track.clips.map(c => c.id === clipId ? { ...c, color } : c),
      })),
    }));
  },

  lockClip: (clipId, locked) => {
    set((s) => ({
      tracks: s.tracks.map(track => ({
        ...track,
        clips: track.clips.map(c => c.id === clipId ? { ...c, locked } : c),
      })),
    }));
  },

  copySelectedClips: () => {
    const { selectedClipIds, tracks } = get();
    const allClips = tracks.flatMap(t => t.clips);
    const copied = allClips.filter(c => selectedClipIds.includes(c.id));
    set({ clipboard: copied });
  },

  pasteClips: () => {
    const { clipboard } = get();
    if (clipboard.length === 0) return;
    get().saveHistory();
    const minStart = Math.min(...clipboard.map(c => c.startTime));
    const now = get().currentTime;
    set((s) => {
      const newTracks = s.tracks.map(track => {
        const clipsForTrack = clipboard.filter(c => c.trackId === track.id);
        if (clipsForTrack.length === 0) return track;
        const pasted = clipsForTrack.map(c => ({
          ...c,
          id: generateId(),
          startTime: c.startTime - minStart + now,
        }));
        return { ...track, clips: [...track.clips, ...pasted] };
      });
      return { tracks: newTracks };
    });
  },

  toggleTrackHidden: (trackId) =>
    set((s) => ({ tracks: s.tracks.map(t => t.id === trackId ? { ...t, hidden: !t.hidden } : t) })),
  toggleTrackLocked: (trackId) =>
    set((s) => ({ tracks: s.tracks.map(t => t.id === trackId ? { ...t, locked: !t.locked } : t) })),
  toggleTrackMuted: (trackId) =>
    set((s) => ({ tracks: s.tracks.map(t => t.id === trackId ? { ...t, muted: !t.muted } : t) })),

  addTrack: (type) => {
    const names = { video: 'V', audio: 'A', subtitle: 'SUB' };
    const existing = get().tracks.filter(t => t.type === type).length;
    const heights = { video: 72, audio: 56, subtitle: 48 };
    get().saveHistory();
    set((s) => ({
      tracks: [{
        id: generateId(),
        name: `${names[type]}${existing + 1}`,
        type,
        height: heights[type],
        hidden: false,
        locked: false,
        muted: false,
        clips: [],
      }, ...s.tracks],
    }));
  },

  deleteTrack: (trackId) => {
    get().saveHistory();
    set((s) => ({ tracks: s.tracks.filter(t => t.id !== trackId) }));
  },

  toggleSnap: () => set((s) => ({ snapEnabled: !s.snapEnabled })),
}));
