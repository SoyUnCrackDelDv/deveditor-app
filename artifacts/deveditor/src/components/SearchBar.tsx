import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function SearchBar() {
  return (
    <div className="relative" data-testid="search-bar">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input 
        placeholder="Buscar plantillas..." 
        className="pl-9 h-9 bg-secondary border-transparent focus:border-primary focus:bg-background transition-colors text-sm rounded-lg"
      />
    </div>
  );
}
