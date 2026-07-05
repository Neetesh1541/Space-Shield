import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import {
  Globe,
  Satellite,
  Orbit,
  Rocket,
  Sun,
  AlertTriangle,
  HelpCircle,
  Settings,
  Command as CmdIcon,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

/**
 * Premium ⌘K command palette — quick jump to any part of the mission.
 * Bind to Cmd/Ctrl+K globally.
 */
export const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const go = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <>
      {/* Floating hint */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-40 hidden md:flex items-center gap-2 px-3 py-2 rounded-lg glass-panel text-xs hover:border-primary/60 transition-colors"
        aria-label="Open command palette"
      >
        <CmdIcon className="h-3.5 w-3.5 text-primary" />
        <span className="text-muted-foreground">Quick command</span>
        <Badge variant="outline" className="ml-1 h-5 px-1.5 text-[10px] font-mono">⌘K</Badge>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Jump to a mission surface, run a scan, invoke an action…" />
        <CommandList>
          <CommandEmpty>No matching command.</CommandEmpty>

          <CommandGroup heading="Navigate">
            <CommandItem onSelect={() => go('/')}><Globe className="mr-2 h-4 w-4 text-primary" /> Mission Control</CommandItem>
            <CommandItem onSelect={() => go('/satellites')}><Satellite className="mr-2 h-4 w-4 text-primary" /> Live Satellites</CommandItem>
            <CommandItem onSelect={() => go('/space-debris')}><AlertTriangle className="mr-2 h-4 w-4 text-warning" /> Space Debris</CommandItem>
            <CommandItem onSelect={() => go('/solar-system')}><Orbit className="mr-2 h-4 w-4 text-primary" /> Solar System 3D</CommandItem>
            <CommandItem onSelect={() => go('/solar-activity')}><Sun className="mr-2 h-4 w-4 text-warning" /> Solar Activity</CommandItem>
            <CommandItem onSelect={() => go('/launch-planner')}><Rocket className="mr-2 h-4 w-4 text-accent" /> Launch Planner</CommandItem>
            <CommandItem onSelect={() => go('/rocket-launch')}><Rocket className="mr-2 h-4 w-4 text-accent" /> Rocket Simulator</CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => { setOpen(false); toast.success('Running conjunction scan…', { description: 'AI collision engine analyzing tracked catalog.' }); }}>
              <Zap className="mr-2 h-4 w-4 text-primary" /> Run collision scan
            </CommandItem>
            <CommandItem onSelect={() => { setOpen(false); window.print(); }}>
              <CmdIcon className="mr-2 h-4 w-4" /> Export current view (PDF)
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="System">
            <CommandItem onSelect={() => go('/settings')}><Settings className="mr-2 h-4 w-4" /> Settings</CommandItem>
            <CommandItem onSelect={() => go('/help-docs')}><HelpCircle className="mr-2 h-4 w-4" /> Help & Docs</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
