import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Template {
  id: string;
  name: string;
  category: string;
  isFavorite?: boolean;
  isNew?: boolean;
}

export function SubtitleCard({ template }: { template: Template }) {
  const getThumbnailStyle = (category: string) => {
    switch (category) {
      case 'TikTok':
        return (
          <div className="flex items-center justify-center h-full bg-slate-900/80">
            <span className="text-white font-bold text-lg italic tracking-tighter" style={{ textShadow: '-2px 0 0 #ff0050, 2px 0 0 #00f2fe' }}>POW!</span>
          </div>
        );
      case 'Neón':
        return (
          <div className="flex items-center justify-center h-full bg-black">
            <span className="text-fuchsia-400 font-bold text-lg tracking-wider" style={{ textShadow: '0 0 10px #e879f9, 0 0 20px #e879f9' }}>G L O W</span>
          </div>
        );
      case 'Gaming':
        return (
          <div className="flex items-center justify-center h-full bg-red-950/80">
            <span className="text-white font-black text-xl tracking-widest uppercase transform -skew-x-12 border-b-4 border-red-500">CLUTCH</span>
          </div>
        );
      case 'Cinemático':
        return (
          <div className="flex items-center justify-center h-full bg-[#050505]">
            <span className="text-amber-100/90 font-serif text-sm tracking-[0.3em] uppercase">The End</span>
          </div>
        );
      case 'Minimalista':
        return (
          <div className="flex items-center justify-center h-full bg-zinc-900">
            <span className="text-zinc-300 font-light text-sm tracking-widest">breathe</span>
          </div>
        );
      case 'Podcast':
        return (
          <div className="flex items-center justify-center h-full bg-slate-900">
            <div className="flex flex-col items-center gap-1">
              <span className="text-white font-medium text-xs bg-primary/20 px-2 py-0.5 rounded text-primary">Speaker 1</span>
              <span className="text-white font-semibold text-sm">Let me tell you...</span>
            </div>
          </div>
        );
      case 'Premium':
        return (
          <div className="flex items-center justify-center h-full bg-neutral-950">
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200">LUXURY</span>
          </div>
        );
      case 'Storytelling':
        return (
          <div className="flex items-center justify-center h-full bg-stone-900">
            <span className="text-stone-100 font-serif text-lg bg-stone-800/80 px-3 py-1 rounded-lg border border-stone-700/50 shadow-lg">Once upon a time</span>
          </div>
        );
      case 'Shorts':
        return (
          <div className="flex items-center justify-center h-full bg-slate-900">
            <span className="text-white font-black text-2xl uppercase" style={{ WebkitTextStroke: '1px black', textShadow: '4px 4px 0 #3b82f6' }}>WAIT!</span>
          </div>
        );
      case 'Reels':
        return (
          <div className="flex items-center justify-center h-full bg-gradient-to-tr from-pink-900/40 to-orange-900/40">
            <span className="text-white font-bold text-base px-3 py-1 bg-black/40 rounded-xl backdrop-blur-md">Aesthetic</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-full bg-secondary">
            <span className="text-foreground font-medium text-sm">Title</span>
          </div>
        );
    }
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
      }}
      className="group flex flex-col gap-2 relative"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      data-testid={`subtitle-card-${template.id}`}
    >
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-border/50 group-hover:border-primary/50 transition-colors shadow-sm group-hover:shadow-[0_0_15px_rgba(124,58,237,0.2)]">
        {getThumbnailStyle(template.category)}
        
        {/* Star Icon */}
        <button className="absolute top-2 right-2 p-1 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm transition-colors z-10">
          <Star className={cn("w-3.5 h-3.5", template.isFavorite ? "fill-amber-400 text-amber-400" : "text-white/70")} />
        </button>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-[2px]">
          <Button size="sm" className="h-7 text-xs bg-primary hover:bg-accent-glow text-white w-24">Aplicar</Button>
          <Button size="sm" variant="ghost" className="h-7 text-xs text-white hover:text-white hover:bg-white/20 w-24">Vista previa</Button>
        </div>
      </div>

      <div className="flex flex-col gap-0.5 px-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-foreground truncate">{template.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground">{template.category}</span>
          {template.isNew && (
            <span className="text-[9px] font-medium text-primary bg-primary/10 px-1 rounded-sm uppercase tracking-wider">New</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
