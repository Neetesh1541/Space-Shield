import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Github, Linkedin, Mail, Globe, Rocket } from 'lucide-react';

interface DeveloperMessageProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeveloperMessage = ({ open, onOpenChange }: DeveloperMessageProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-lg glass-panel">
      <DialogHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-base font-bold text-primary-foreground ring-2 ring-primary/30">
            AV
          </div>
          <div className="text-left">
            <DialogTitle className="text-lg">A message from Avtaar</DialogTitle>
            <DialogDescription className="text-xs">
              Neetesh Kumar · Founder & Developer, SpaceShield
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      <div className="space-y-3 text-sm text-muted-foreground">
        <p>
          Hey, and welcome aboard. <span className="text-foreground font-medium">SpaceShield</span> started
          as a simple question: what if anyone — not just a national agency — could watch what is happening
          above our heads in real time?
        </p>
        <p>
          Everything you see here is built on open data from NASA, NOAA and public satellite catalogues,
          layered with AI collision screening, Kessler-cascade modelling and mission-grade telemetry views.
          The orbit is getting crowded, and awareness is the first line of defence.
        </p>
        <p className="text-foreground">
          Fly safe, keep looking up. 🚀
        </p>
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        <Badge variant="outline"><Rocket className="h-3 w-3 mr-1" /> Orbital Safety</Badge>
        <Badge variant="outline">Open Data</Badge>
        <Badge variant="outline">Made in India</Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2">
        <Button variant="outline" size="sm" asChild>
          <a href="https://www.neetesh.tech" target="_blank" rel="noopener noreferrer">
            <Globe className="h-4 w-4 mr-2" /> Website
          </a>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href="mailto:neeteshk1104@gmail.com">
            <Mail className="h-4 w-4 mr-2" /> Email
          </a>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href="https://github.com/neetesh1541" target="_blank" rel="noopener noreferrer">
            <Github className="h-4 w-4 mr-2" /> GitHub
          </a>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href="https://in.linkedin.com/in/neetesh-kumar-846616287" target="_blank" rel="noopener noreferrer">
            <Linkedin className="h-4 w-4 mr-2" /> LinkedIn
          </a>
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);
