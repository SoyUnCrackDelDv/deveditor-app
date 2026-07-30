import { TopBar } from '@/components/TopBar';
import { Sidebar } from '@/components/Sidebar';
import { PreviewPlayer } from '@/components/PreviewPlayer';
import { Timeline } from '@/components/Timeline';
import { PropertiesPanel } from '@/components/PropertiesPanel';

export function Editor() {
  return (
    <div className="flex flex-col h-[100dvh] w-full bg-background text-foreground overflow-hidden">
      <TopBar />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <div className="h-[55%] flex flex-col shrink-0 min-h-0 border-b border-border">
            <PreviewPlayer />
          </div>
          <div className="h-[45%] shrink-0 min-h-0">
            <Timeline />
          </div>
        </div>
        
        <PropertiesPanel />
      </div>
    </div>
  );
}
