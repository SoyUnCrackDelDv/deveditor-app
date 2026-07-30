import { 
  FolderClosed, 
  ImagePlay, 
  Music, 
  Type, 
  LayoutTemplate, 
  Star, 
  Upload 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore, Section } from '@/store/editorStore';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { SubtitleLibrary } from '@/components/SubtitleLibrary';

const SECTIONS: { id: Section; label: string; icon: React.ElementType }[] = [
  { id: 'projects', label: 'Proyectos', icon: FolderClosed },
  { id: 'multimedia', label: 'Multimedia', icon: ImagePlay },
  { id: 'audio', label: 'Audio', icon: Music },
  { id: 'subtitles', label: 'Subtítulos', icon: Type },
  { id: 'templates', label: 'Plantillas', icon: LayoutTemplate },
  { id: 'favorites', label: 'Favoritos', icon: Star },
  { id: 'export', label: 'Exportar', icon: Upload },
];

export function Sidebar() {
  const { activeSection, setActiveSection } = useEditorStore();

  return (
    <div className="flex h-full border-r border-border bg-background z-10 shrink-0">
      {/* Icon Strip */}
      <div className="w-16 flex flex-col items-center py-4 gap-4 border-r border-border bg-card z-20" data-testid="sidebar-icon-strip">
        {SECTIONS.map((section) => {
          const isActive = activeSection === section.id;
          const Icon = section.icon;
          
          return (
            <Tooltip key={section.id} delayDuration={0}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200",
                    isActive 
                      ? "bg-primary/20 text-primary shadow-[0_0_15px_rgba(124,58,237,0.15)]" 
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                  data-testid={`tab-${section.id}`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-popover border-border text-foreground font-medium">
                {section.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>

      {/* Sliding Content Panel */}
      <AnimatePresence initial={false}>
        {activeSection && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 340, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden bg-card/50 flex flex-col z-10"
            data-testid="sidebar-content-panel"
          >
            <div className="w-[340px] h-full flex flex-col">
              <div className="h-12 border-b border-border flex items-center px-4 shrink-0">
                <h2 className="font-semibold text-sm tracking-wide text-foreground">
                  {SECTIONS.find(s => s.id === activeSection)?.label}
                </h2>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {activeSection === 'subtitles' && <SubtitleLibrary inSidebar={true} />}
                {activeSection === 'multimedia' && <MockMultimedia />}
                {activeSection === 'audio' && <MockAudio />}
                {/* Add fallbacks for other sections if needed */}
                {['projects', 'templates', 'favorites', 'export'].includes(activeSection) && (
                  <div className="p-4 text-sm text-muted-foreground text-center mt-10">
                    Contenido de {SECTIONS.find(s => s.id === activeSection)?.label} mock.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MockMultimedia() {
  return (
    <div className="p-4 grid grid-cols-2 gap-3" data-testid="mock-multimedia">
      {[1,2,3,4,5,6,7,8].map(i => (
        <div key={i} className="aspect-video bg-secondary rounded-lg border border-border/50 hover:border-primary/50 transition-colors overflow-hidden group relative cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-purple-900/40 opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm">
              <span className="text-white text-xs">+</span>
            </div>
          </div>
          <span className="absolute bottom-1 right-1 text-[9px] bg-black/70 px-1 rounded text-white/80 font-mono">00:1{i}</span>
        </div>
      ))}
    </div>
  );
}

function MockAudio() {
  return (
    <div className="p-4 flex flex-col gap-2" data-testid="mock-audio">
      {[1,2,3,4,5].map(i => (
        <div key={i} className="p-3 rounded-lg bg-secondary border border-border/50 hover:border-primary/50 transition-colors flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 rounded bg-emerald-900/30 flex items-center justify-center text-emerald-500 shrink-0">
            <Music className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-foreground truncate">Ambient Track {i}</div>
            <div className="text-[10px] text-muted-foreground">02:3{i} • Cinematic</div>
          </div>
        </div>
      ))}
    </div>
  );
}
