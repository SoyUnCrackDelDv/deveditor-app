import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Trash2, Palette, Edit2, Lock, Unlock } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';

interface ContextMenuProps {
  x: number;
  y: number;
  clipId: string | null;
  visible: boolean;
  onClose: () => void;
}

export function ContextMenu({ x, y, clipId, visible, onClose }: ContextMenuProps) {
  const { duplicateClip, deleteSelectedClips, changeClipColor, lockClip, tracks, selectClip } = useEditorStore();

  useEffect(() => {
    const handleClick = () => {
      if (visible) onClose();
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [visible, onClose]);

  if (!visible || !clipId) return null;

  const clip = tracks.flatMap(t => t.clips).find(c => c.id === clipId);
  if (!clip) return null;

  const PRESET_COLORS = ['#1d4ed8', '#4f46e5', '#7c3aed', '#db2777', '#e11d48', '#ea580c', '#d97706', '#059669', '#10b981'];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.1 }}
        className="fixed z-50 w-48 bg-popover border border-border rounded-lg shadow-xl overflow-hidden py-1"
        style={{ left: x, top: y }}
        onClick={(e) => e.stopPropagation()}
        data-testid="context-menu"
      >
        <button
          className="w-full px-3 py-1.5 flex items-center gap-2 text-xs text-foreground hover:bg-secondary transition-colors"
          onClick={() => { selectClip(clipId, false); duplicateClip(clipId); onClose(); }}
        >
          <Copy className="w-3.5 h-3.5" /> Duplicar
        </button>
        
        <button
          className="w-full px-3 py-1.5 flex items-center gap-2 text-xs text-destructive hover:bg-destructive/10 transition-colors"
          onClick={() => { selectClip(clipId, false); deleteSelectedClips(); onClose(); }}
        >
          <Trash2 className="w-3.5 h-3.5" /> Eliminar
        </button>
        
        <div className="h-px bg-border my-1" />
        
        <button
          className="w-full px-3 py-1.5 flex items-center gap-2 text-xs text-foreground hover:bg-secondary transition-colors"
          onClick={() => { lockClip(clipId, !clip.locked); onClose(); }}
        >
          {clip.locked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />} 
          {clip.locked ? 'Desbloquear' : 'Bloquear'}
        </button>

        <div className="h-px bg-border my-1" />

        <div className="px-3 py-1.5 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Palette className="w-3.5 h-3.5" /> Color
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {PRESET_COLORS.map(c => (
              <div
                key={c}
                className="w-5 h-5 rounded-full cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: c, border: clip.color === c ? '2px solid white' : 'none' }}
                onClick={() => { changeClipColor(clipId, c); onClose(); }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
