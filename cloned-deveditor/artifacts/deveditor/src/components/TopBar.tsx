import { Save, Settings, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

export function TopBar() {
  return (
    <div className="h-14 w-full border-b border-border bg-card flex items-center justify-between px-4 shrink-0 z-10 relative">
      <div className="flex items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer group" data-testid="logo-container">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.3)] group-hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-shadow">
            <span className="font-bold text-white tracking-tighter text-lg leading-none">DE</span>
          </div>
          <span className="font-semibold text-foreground hidden sm:inline-block">DevEditor</span>
        </div>

        {/* Project Name */}
        <div className="w-48 relative">
          <Input 
            defaultValue="Untitled Project" 
            className="h-8 bg-transparent border-transparent hover:border-border focus:bg-background transition-colors text-sm px-2 font-medium"
            data-testid="input-project-name"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Actions */}
        <div className="flex items-center gap-1 mr-2 hidden sm:flex">
          <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground gap-2" data-testid="btn-save">
            <Save className="w-4 h-4" />
            <span className="text-xs">Saved</span>
            <kbd className="hidden lg:inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>S
            </kbd>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" data-testid="btn-settings">
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        <Button size="sm" className="h-8 gap-2 bg-primary hover:bg-accent-glow text-white shadow-[0_0_10px_rgba(124,58,237,0.2)]" data-testid="btn-export">
          <Download className="w-4 h-4" />
          <span>Export</span>
        </Button>

        <Avatar className="h-8 w-8 border border-border cursor-pointer hover:opacity-80 transition-opacity" data-testid="avatar-user">
          <AvatarFallback className="bg-secondary text-xs text-foreground font-medium">JD</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
