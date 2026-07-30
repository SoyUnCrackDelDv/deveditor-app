import { useState } from 'react';
import { motion } from 'framer-motion';
import { SearchBar } from '@/components/SearchBar';
import { SubtitleCard } from '@/components/SubtitleCard';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  'Todos',
  'TikTok',
  'Shorts',
  'Reels',
  'Podcast',
  'Gaming',
  'Minimalista',
  'Premium',
  'Neón',
  'Cinemático',
  'Storytelling'
];

const TEMPLATES = [
  { id: '1', name: 'TikTok Pop', category: 'TikTok', isNew: true },
  { id: '2', name: 'Viral Box', category: 'TikTok' },
  { id: '3', name: 'Glitch Text', category: 'TikTok' },
  { id: '4', name: 'Shorts Bounce', category: 'Shorts', isFavorite: true },
  { id: '5', name: 'Quick Read', category: 'Shorts' },
  { id: '6', name: 'Reels Elegant', category: 'Reels' },
  { id: '7', name: 'Insta Bold', category: 'Reels' },
  { id: '8', name: 'Soft Drop', category: 'Reels' },
  { id: '9', name: 'Mic Clean', category: 'Podcast', isFavorite: true },
  { id: '10', name: 'Waveform Sync', category: 'Podcast' },
  { id: '11', name: 'Killfeed Red', category: 'Gaming', isNew: true },
  { id: '12', name: 'Pixel Arcade', category: 'Gaming' },
  { id: '13', name: 'Cyber Stream', category: 'Gaming' },
  { id: '14', name: 'Thin Sans', category: 'Minimalista' },
  { id: '15', name: 'Fade In', category: 'Minimalista' },
  { id: '16', name: 'Clean White', category: 'Minimalista' },
  { id: '17', name: 'Gold Luxury', category: 'Premium' },
  { id: '18', name: 'Platinum', category: 'Premium' },
  { id: '19', name: 'Neon Glow', category: 'Neón', isFavorite: true },
  { id: '20', name: 'Cyberpunk', category: 'Neón' },
  { id: '21', name: 'Synthwave', category: 'Neón' },
  { id: '22', name: 'Cine Bold', category: 'Cinemático' },
  { id: '23', name: 'Director Cut', category: 'Cinemático' },
  { id: '24', name: 'Narrative', category: 'Storytelling' },
  { id: '25', name: 'Warm Whisper', category: 'Storytelling' },
];

export function SubtitleLibrary({ inSidebar = false }: { inSidebar?: boolean }) {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [filter, setFilter] = useState<'populares'|'recientes'|'favoritos'|'nuevos'>('populares');

  const filteredTemplates = TEMPLATES.filter(t => {
    if (activeCategory !== 'Todos' && t.category !== activeCategory) return false;
    if (filter === 'favoritos' && !t.isFavorite) return false;
    if (filter === 'nuevos' && !t.isNew) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden" data-testid="subtitle-library">
      <div className="p-4 flex flex-col gap-4 shrink-0 border-b border-border/50">
        <SearchBar />
        
        <div className="flex items-center gap-2">
          {(['populares', 'recientes', 'favoritos', 'nuevos'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1 text-[11px] rounded-full capitalize font-medium transition-colors border",
                filter === f 
                  ? "bg-primary text-white border-primary" 
                  : "bg-secondary text-muted-foreground border-transparent hover:text-foreground"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <ScrollArea className="w-full pb-2 -mb-2">
          <div className="flex items-center gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-md whitespace-nowrap transition-colors relative",
                  activeCategory === cat ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                {cat}
                {activeCategory === cat && (
                  <motion.div 
                    layoutId="activeCategoryIndicator"
                    className="absolute -bottom-[6px] left-0 right-0 h-[2px] bg-primary rounded-t-full"
                  />
                )}
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="h-1.5" />
        </ScrollArea>
      </div>

      <ScrollArea className="flex-1 p-4">
        <motion.div 
          className={cn("grid gap-4", inSidebar ? "grid-cols-2" : "grid-cols-3")}
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.04 }
            }
          }}
        >
          {filteredTemplates.map(template => (
            <SubtitleCard key={template.id} template={template} />
          ))}
          
          {filteredTemplates.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground text-sm">
              No se encontraron plantillas.
            </div>
          )}
        </motion.div>
      </ScrollArea>
    </div>
  );
}
