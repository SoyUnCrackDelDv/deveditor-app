import { useEffect } from 'react';
import { useEditorStore } from '@/store/editorStore';

export function useKeyboardShortcuts() {
  const {
    deleteSelectedClips, copySelectedClips, pasteClips,
    duplicateClip, undo, redo, togglePlaying,
    selectedClipIds, clearSelection
  } = useEditorStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const active = document.activeElement;
      if (active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement) return;

      const ctrl = e.ctrlKey || e.metaKey;

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault(); deleteSelectedClips();
      }
      if (ctrl && e.key === 'c') { e.preventDefault(); copySelectedClips(); }
      if (ctrl && e.key === 'v') { e.preventDefault(); pasteClips(); }
      if (ctrl && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if (ctrl && (e.key === 'Z' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); }
      if (ctrl && e.key === 'd') {
        e.preventDefault();
        if (selectedClipIds.length > 0) selectedClipIds.forEach(id => duplicateClip(id));
      }
      if (e.key === ' ') { e.preventDefault(); togglePlaying(); }
      if (e.key === 'Escape') { clearSelection(); }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [deleteSelectedClips, copySelectedClips, pasteClips, duplicateClip, undo, redo, togglePlaying, selectedClipIds, clearSelection]);
}
