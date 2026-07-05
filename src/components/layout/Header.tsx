import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Settings, Menu, Rocket, Globe, HelpCircle, User, LogOut, Crown, Command } from 'lucide-react';
import logoUrl from '@/assets/spaceshield-logo.png';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface HeaderProps {
  onMenuToggle?: () => void;
}

export const Header = ({ onMenuToggle }: HeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="h-16 border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuToggle}>
            <Menu className="h-5 w-5" />
          </Button>

          <button onClick={() => navigate('/')} className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/40 blur-2xl rounded-full animate-pulse" />
              <img src={logoUrl} alt="SpaceShield logo" width={40} height={40} className="relative h-10 w-10 object-contain drop-shadow-[0_0_12px_hsl(var(--primary)/0.6)]" />
            </div>
            <div className="text-left">
              <h1 className="font-bold text-lg tracking-tight leading-none">
                Space<span className="text-gradient">Shield</span>
              </h1>
              <p className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block tracking-wider uppercase">
                Orbital Defense · Collision Intelligence
              </p>
            </div>
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <Globe className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Status:</span>
            <Badge variant="outline" className="bg-success/10 text-success border-success/30">
              <span className="h-1.5 w-1.5 rounded-full bg-success mr-1.5 animate-pulse" />
              All Systems Operational
            </Badge>
          </div>
          <div className="h-8 w-px bg-border" />
          <button onClick={() => navigate('/launch-planner')} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
            <Rocket className="h-4 w-4 text-warning" />
            <span className="text-muted-foreground">Next Launch:</span>
            <span className="font-medium">SpaceX Starlink • 04:32:15</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/help-docs')} title="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive animate-pulse" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => navigate('/settings')} title="Settings">
            <Settings className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hidden sm:flex ml-2 pl-2 border-l border-border items-center gap-3 hover:opacity-90 transition-opacity">
                <div className="text-right">
                  <p className="text-xs font-medium">Neetesh Kumar</p>
                  <p className="text-[10px] text-muted-foreground">Mission Control</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-primary-foreground ring-2 ring-primary/20">
                  NK
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 z-[60]">
              <DropdownMenuLabel>
                <p className="font-medium">Neetesh Kumar</p>
                <p className="text-[10px] text-muted-foreground font-normal">neeteshk1104@gmail.com</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/')}>
                <User className="h-4 w-4 mr-2" /> Mission Control
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="h-4 w-4 mr-2" /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/help-docs')}>
                <HelpCircle className="h-4 w-4 mr-2" /> Help & Docs
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast.success('Pro plan request received! 🚀', { description: 'We\'ll contact you at neeteshk1104@gmail.com' })}>
                <Crown className="h-4 w-4 mr-2 text-warning" /> Upgrade to Pro
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.info('Signed out (demo mode)')}>
                <LogOut className="h-4 w-4 mr-2" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
