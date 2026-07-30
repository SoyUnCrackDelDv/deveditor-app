import { useState } from 'react';
import { Settings2, Type, Move, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export function PropertiesPanel() {
  const { activeSection } = useEditorStore();

  return (
    <div className="w-[280px] shrink-0 border-l border-border bg-card flex flex-col z-10 hidden md:flex shadow-[-2px_0_10px_rgba(0,0,0,0.2)]">
      <div className="h-14 border-b border-border flex items-center px-4 shrink-0 bg-background/50">
        <h2 className="font-semibold text-sm tracking-wide text-foreground flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-muted-foreground" />
          Propiedades
        </h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 flex flex-col gap-6">
          {activeSection === 'subtitles' ? <SubtitleProperties /> : <TransformProperties />}
        </div>
      </ScrollArea>
    </div>
  );
}

function TransformProperties() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Transform Group */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-1">
          <Move className="w-4 h-4 text-primary" />
          Transformar
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] text-muted-foreground">Escala</span>
            <div className="flex items-center gap-2 bg-secondary px-2 py-1.5 rounded border border-border/50">
              <span className="text-xs text-muted-foreground font-mono">X</span>
              <input type="text" defaultValue="100%" className="bg-transparent w-full text-xs text-foreground font-mono outline-none" />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] text-muted-foreground opacity-0">Y</span>
            <div className="flex items-center gap-2 bg-secondary px-2 py-1.5 rounded border border-border/50">
              <span className="text-xs text-muted-foreground font-mono">Y</span>
              <input type="text" defaultValue="100%" className="bg-transparent w-full text-xs text-foreground font-mono outline-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">Posición</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 bg-secondary px-2 py-1.5 rounded border border-border/50">
              <span className="text-xs text-muted-foreground font-mono">X</span>
              <input type="text" defaultValue="0.0" className="bg-transparent w-full text-xs text-foreground font-mono outline-none" />
            </div>
            <div className="flex items-center gap-2 bg-secondary px-2 py-1.5 rounded border border-border/50">
              <span className="text-xs text-muted-foreground font-mono">Y</span>
              <input type="text" defaultValue="0.0" className="bg-transparent w-full text-xs text-foreground font-mono outline-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">Rotación</span>
            <span className="text-[11px] text-foreground font-mono">0°</span>
          </div>
          <Slider defaultValue={[0]} max={360} className="py-2" />
        </div>
      </div>

      <div className="h-px bg-border/50" />

      {/* Opacity Group */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-1">
          <ImageIcon className="w-4 h-4 text-primary" />
          Opacidad
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">Nivel</span>
            <span className="text-[11px] text-foreground font-mono">100%</span>
          </div>
          <Slider defaultValue={[100]} max={100} className="py-2" />
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">Modo de fusión</span>
          <select className="bg-secondary border border-border/50 rounded px-2 py-1 text-xs text-foreground outline-none">
            <option>Normal</option>
            <option>Multiplicar</option>
            <option>Pantalla</option>
            <option>Superponer</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function SubtitleProperties() {
  const COLORS = ['#ffffff', '#000000', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
  const [activeColor, setActiveColor] = useState('#ffffff');

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Texto Group */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground mb-1">
          <Type className="w-4 h-4 text-amber-500" />
          Estilo de Texto
        </div>
        
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] text-muted-foreground">Fuente</span>
          <select className="bg-secondary border border-border/50 rounded px-2 py-2 text-xs text-foreground outline-none w-full font-medium">
            <option>Inter</option>
            <option>Montserrat</option>
            <option>Bebas Neue</option>
            <option>Oswald</option>
            <option>Playfair Display</option>
          </select>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">Tamaño</span>
            <span className="text-[11px] text-foreground font-mono">24</span>
          </div>
          <Slider defaultValue={[24]} max={120} className="py-2" />
        </div>

        <div className="flex items-center justify-between mt-2 bg-secondary p-1 rounded border border-border/50">
          <Button variant="ghost" size="sm" className="h-7 px-3 bg-background shadow-sm">
            <AlignLeft className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-3 text-muted-foreground">
            <AlignCenter className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-3 text-muted-foreground">
            <AlignRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      <div className="h-px bg-border/50" />

      {/* Color Group */}
      <div className="flex flex-col gap-3">
        <span className="text-[11px] text-muted-foreground">Color de relleno</span>
        <div className="grid grid-cols-4 gap-2">
          {COLORS.map(c => (
            <button
              key={c}
              onClick={() => setActiveColor(c)}
              className="w-full aspect-square rounded-full border-2 border-transparent focus:outline-none transition-all flex items-center justify-center relative"
              style={{ backgroundColor: c, borderColor: activeColor === c ? '#7c3aed' : 'transparent' }}
            >
              {activeColor === c && (
                <div className="w-full h-full rounded-full border-2 border-background absolute inset-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-border/50" />

      {/* Animation Group */}
      <div className="flex flex-col gap-3">
        <span className="text-[11px] text-muted-foreground">Animación</span>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="h-16 flex flex-col gap-1 bg-secondary/50 hover:bg-primary/20 hover:text-primary border-primary/50 text-primary">
            <span className="text-xs font-semibold">Pop In</span>
          </Button>
          <Button variant="outline" size="sm" className="h-16 flex flex-col gap-1 bg-secondary/50 text-muted-foreground">
            <span className="text-xs">Typewriter</span>
          </Button>
          <Button variant="outline" size="sm" className="h-16 flex flex-col gap-1 bg-secondary/50 text-muted-foreground">
            <span className="text-xs">Fade Up</span>
          </Button>
          <Button variant="outline" size="sm" className="h-16 flex flex-col gap-1 bg-secondary/50 text-muted-foreground">
            <span className="text-xs">Glitch</span>
          </Button>
        </div>
      </div>

      <Button className="w-full mt-4 bg-primary hover:bg-accent-glow text-white shadow-[0_0_15px_rgba(124,58,237,0.3)]">
        Aplicar a todos
      </Button>
    </div>
  );
}
