import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Globe,
  Satellite,
  Orbit,
  Rocket,
  AlertTriangle,
  BarChart3,
  Settings,
  HelpCircle,
  Layers,
  Zap,
  Sun,
  Radio,
  Database,
} from 'lucide-react';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  badge?: string | number;
  onClick?: () => void;
}

const NavItem = ({ icon: Icon, label, isActive, badge, onClick }: NavItemProps) => (
  <Button
    variant="ghost"
    className={cn(
      'w-full justify-start gap-3 h-11 px-3 font-normal transition-all duration-200 relative z-10',
      isActive && 'bg-primary/10 text-primary border-l-2 border-primary rounded-l-none'
    )}
    onClick={onClick}
  >
    <Icon className="h-4 w-4" />
    <span className="flex-1 text-left">{label}</span>
    {badge !== undefined && (
      <span className={cn(
        'text-[10px] px-1.5 py-0.5 rounded-full font-medium',
        typeof badge === 'number' && badge > 0 
          ? 'bg-destructive/20 text-destructive' 
          : 'bg-muted text-muted-foreground'
      )}>
        {badge}
      </span>
    )}
  </Button>
);

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed md:sticky top-0 left-0 h-screen w-64 bg-card/80 backdrop-blur-xl border-r border-border/50 z-50 transition-transform duration-300',
          'md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full pt-16 md:pt-4">
          {/* Main Navigation */}
          <div className="flex-1 p-3 space-y-1 overflow-y-auto">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-3 mb-2">
              Monitoring
            </p>
            <NavItem icon={Radio} label="Mission Control" isActive={location.pathname === '/mission-control'} onClick={() => handleNav('/mission-control')} />
            <NavItem icon={Globe} label="Earth View" isActive={location.pathname === '/'} onClick={() => handleNav('/')} />
            <NavItem icon={Satellite} label="Satellites" badge={390} isActive={location.pathname === '/satellites'} onClick={() => handleNav('/satellites')} />
            <NavItem icon={Orbit} label="Space Debris" badge={98} isActive={location.pathname === '/space-debris'} onClick={() => handleNav('/space-debris')} />
            <NavItem icon={AlertTriangle} label="Asteroids" badge={3} isActive={location.pathname === '/'} onClick={() => handleNav('/')} />
            <NavItem icon={Zap} label="Solar Activity" isActive={location.pathname === '/solar-activity'} onClick={() => handleNav('/solar-activity')} />

            <div className="py-3">
              <div className="h-px bg-border/50" />
            </div>

            <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-3 mb-2">
              Exploration
            </p>
            <NavItem icon={Database} label="Space Database" isActive={location.pathname === '/space-data'} onClick={() => handleNav('/space-data')} />
            <NavItem icon={Sun} label="Solar System" isActive={location.pathname === '/solar-system'} onClick={() => handleNav('/solar-system')} />

            <div className="py-3">
              <div className="h-px bg-border/50" />
            </div>

            <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-3 mb-2">
              Simulation
            </p>
            <NavItem icon={Rocket} label="Rocket Launch" isActive={location.pathname === '/rocket-launch'} onClick={() => handleNav('/rocket-launch')} />
            <NavItem icon={Layers} label="Launch Planner" isActive={location.pathname === '/launch-planner'} onClick={() => handleNav('/launch-planner')} />
            <NavItem icon={BarChart3} label="Analytics" isActive={location.pathname === '/'} onClick={() => handleNav('/')} />

            <div className="py-3">
              <div className="h-px bg-border/50" />
            </div>

            <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-3 mb-2">
              System
            </p>
            <NavItem icon={Settings} label="Settings" isActive={location.pathname === '/settings'} onClick={() => handleNav('/settings')} />
            <NavItem icon={HelpCircle} label="Help & Docs" isActive={location.pathname === '/help-docs'} onClick={() => handleNav('/help-docs')} />
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border/50">
            <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
              <p className="text-xs font-medium mb-1">Pro Features</p>
              <p className="text-[10px] text-muted-foreground mb-2">
                Unlock AI predictions & advanced simulations
              </p>
              <Button
                variant="glow"
                size="sm"
                className="w-full text-xs"
                onClick={() => {
                  import('sonner').then(({ toast }) =>
                    toast.success('Pro plan request received! 🚀', {
                      description: "We'll contact you at neeteshk1104@gmail.com",
                    })
                  );
                }}
              >
                Upgrade Now
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};