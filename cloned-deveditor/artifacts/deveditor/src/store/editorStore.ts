import { create } from 'zustand';

export type Section = 'projects' | 'multimedia' | 'audio' | 'subtitles' | 'templates' | 'favorites' | 'export';

interface EditorState {
  activeSection: Section | null;
  setActiveSection: (section: Section | null) => void;
  isPlaying: boolean;
  togglePlaying: () => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  duration: number;
  zoomLevel: number;
  setZoomLevel: (zoom: number) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  activeSection: 'multimedia',
  setActiveSection: (section) => set((state) => ({ activeSection: state.activeSection === section ? null : section })),
  isPlaying: false,
  togglePlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),
  currentTime: 84,
  setCurrentTime: (time) => set({ currentTime: time }),
  duration: 330,
  zoomLevel: 100,
  setZoomLevel: (zoom) => set({ zoomLevel: zoom }),
}));
