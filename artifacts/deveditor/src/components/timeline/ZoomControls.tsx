import { ZoomIn, ZoomOut, Magnet } from 'lucide-react';
import { useEditorStore } from '@/store/editorStore';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';

export function ZoomControls() {
  const { zoomLevel, zoomIn, zoomOut, setZoomLevel, snapEnabled, toggleSnap } = useEditorStore();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className={cn("h-7 w-7", snapEnabled ? "text-primary bg-primary/10" : "text-muted-foreground")}
        onClick={toggleSnap}
        title="Snap to Grid"
        data-testid="btn-toggle-snap"
      >
        <Magnet className="w-4 h-4" />
      </Button>

      <div className="w-px h-4 bg-border mx-1" />

      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={zoomOut} data-testid="btn-zoom-out">
        <ZoomOut className="w-4 h-4" />
      </Button>
      
      <div className="w-24">
        <Slider 
          value={[zoomLevel]} 
          min={20} 
          max={400} 
          step={1} 
          onValueChange={([val]) => setZoomLevel(val)} 
          className="py-1"
          data-testid="slider-zoom"
        />
      </div>

      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={zoomIn} data-testid="btn-zoom-in">
        <ZoomIn className="w-4 h-4" />
      </Button>

      <span className="text-[10px] text-muted-foreground font-mono w-8 text-right select-none">
        {Math.round((zoomLevel / 80) * 100)}%
      </span>
    </div>
  );
}
