import { useEffect, useMemo, useRef, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { EarthScene } from '@/components/space/EarthScene';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { useWorldSatellites } from '@/hooks/useWorldSatellites';
import { useAsteroidData } from '@/hooks/useAsteroidData';
import type { Satellite } from '@/types/space';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SatelliteDetailPanel } from '@/components/dashboard/SatelliteDetailPanel';
import {
  Radio, Activity, Gauge, Satellite as SatIcon, ShieldCheck, Signal,
  Thermometer, Zap, Terminal, Play, Pause, AlertTriangle, Globe2,
} from 'lucide-react';

const CONSOLES = [
  { code: 'FLIGHT', role: 'Flight Director', operator: 'Avtaar' },
  { code: 'CAPCOM', role: 'Capsule Comms', operator: 'R. Sharma' },
  { code: 'FIDO', role: 'Flight Dynamics', operator: 'K. Menon' },
  { code: 'GUIDO', role: 'Guidance', operator: 'L. Novak' },
  { code: 'EECOM', role: 'Environmental', operator: 'S. Tanaka' },
  { code: 'TELMU', role: 'Telemetry', operator: 'D. Okafor' },
  { code: 'INCO', role: 'Instrumentation', operator: 'M. Costa' },
  { code: 'SURGEON', role: 'Flight Surgeon', operator: 'Dr. A. Rao' },
];

const GROUND_STATIONS = [
  { name: 'Madrid DSN (DSS-63)', band: 'X / Ka', country: 'Spain' },
  { name: 'Goldstone DSN (DSS-14)', band: 'S / X', country: 'USA' },
  { name: 'Canberra DSN (DSS-43)', band: 'S / X', country: 'Australia' },
  { name: 'Byalalu IDSN-32', band: 'S / X', country: 'India' },
  { name: 'Kourou ESTRACK', band: 'S', country: 'French Guiana' },
  { name: 'Svalbard SG-1', band: 'X / Ka', country: 'Norway' },
];

const COMMS_TEMPLATES = [
  'FLIGHT, FIDO — state vector nominal, no maneuver required.',
  'TELMU reports all bus voltages within limits.',
  'INCO — S-band lock re-acquired over {station}.',
  'GUIDO — conjunction screening complete, {n} objects evaluated.',
  'EECOM — thermal margins green, radiator loop stable.',
  'CAPCOM — station copies, crew proceeding with timeline.',
  'FLIGHT — advisory: debris conjunction inside 24h window, monitoring.',
  'SURGEON — crew biomed telemetry nominal.',
];

const pad = (n: number) => String(n).padStart(2, '0');

const MissionControl = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [running, setRunning] = useState(true);
  const [met, setMet] = useState(0);
  const [log, setLog] = useState<{ t: string; msg: string }[]>([]);
  const [selectedSat, setSelectedSat] = useState<Satellite | null>(null);
  const [autoRotateLog, setAutoRotateLog] = useState(true);
  const logRef = useRef<HTMLDivElement>(null);

  const { satellites, stats } = useWorldSatellites();
  const { data: asteroids } = useAsteroidData();

  // Mission Elapsed Time
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setMet((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  // Comms loop chatter
  useEffect(() => {
    if (!running || !autoRotateLog) return;
    const id = setInterval(() => {
      const tpl = COMMS_TEMPLATES[Math.floor(Math.random() * COMMS_TEMPLATES.length)];
      const msg = tpl
        .replace('{station}', GROUND_STATIONS[Math.floor(Math.random() * GROUND_STATIONS.length)].name)
        .replace('{n}', String(satellites.length || 0));
      const now = new Date();
      setLog((prev) => [
        { t: `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}:${pad(now.getUTCSeconds())}Z`, msg },
        ...prev,
      ].slice(0, 60));
    }, 4000);
    return () => clearInterval(id);
  }, [running, autoRotateLog, satellites.length]);

  const metStr = useMemo(() => {
    const d = Math.floor(met / 86400);
    const h = Math.floor((met % 86400) / 3600);
    const m = Math.floor((met % 3600) / 60);
    const s = met % 60;
    return `${d}d ${pad(h)}:${pad(m)}:${pad(s)}`;
  }, [met]);

  const health = Math.max(
    40,
    100 - stats.critical * 6 - stats.warning * 1.5
  );

  const gauges = [
    { label: 'Bus Voltage', value: 28.4, unit: 'V', pct: 92, icon: Zap },
    { label: 'Array Power', value: 118.6, unit: 'kW', pct: 88, icon: Activity },
    { label: 'Cabin Temp', value: 22.4, unit: '°C', pct: 74, icon: Thermometer },
    { label: 'Downlink', value: 512, unit: 'kbps', pct: 81, icon: Signal },
  ];

  return (
    <div className="min-h-screen bg-background nebula-bg stars-bg">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {/* Console header */}
          <div className="mb-6 rounded-xl border border-primary/30 glass-panel px-4 py-3 flex flex-wrap items-center justify-between gap-4 scan-overlay">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Radio className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Mission Control Room</h1>
                <p className="text-xs text-muted-foreground uppercase tracking-[0.2em]">
                  SpaceShield Operations · Flight Director Loop
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right font-mono">
                <p className="text-[10px] text-muted-foreground uppercase">Mission Elapsed Time</p>
                <p className="text-xl text-primary glow-text">{metStr}</p>
              </div>
              <Button variant={running ? 'outline' : 'default'} size="sm" onClick={() => setRunning(!running)}>
                {running ? <><Pause className="h-4 w-4 mr-1" /> Hold</> : <><Play className="h-4 w-4 mr-1" /> Resume</>}
              </Button>
            </div>
          </div>

          {/* Status strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3 mb-6">
            {[
              { label: 'GO / NO-GO', value: stats.critical > 0 ? 'NO-GO' : 'GO', crit: stats.critical > 0 },
              { label: 'Tracked Objects', value: satellites.length.toLocaleString() },
              { label: 'Critical', value: stats.critical, crit: stats.critical > 0 },
              { label: 'Warnings', value: stats.warning },
              { label: 'NEOs Today', value: asteroids?.length ?? 0 },
              { label: 'Net Health', value: `${health.toFixed(0)}%` },
            ].map((s) => (
              <Card key={s.label} variant="glass" className={s.crit ? 'border-destructive/50' : ''}>
                <CardContent className="p-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
                  <p className={`text-lg font-bold font-mono ${s.crit ? 'text-destructive' : 'text-foreground'}`}>{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main wall */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Big screen */}
            <div className="xl:col-span-2 h-[520px] rounded-xl overflow-hidden border border-primary/30 bg-card/30 backdrop-blur relative">
              <EarthScene
                satellites={satellites}
                onSelectSatellite={setSelectedSat}
                selectedId={selectedSat?.id ?? null}
              />
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <Badge variant="outline" className="bg-background/70 font-mono text-[10px]">MAIN VIEWSCREEN · WORLD MAP</Badge>
                <Badge variant="outline" className="bg-destructive/20 text-destructive border-destructive/40 animate-pulse text-[10px]">
                  ● REC
                </Badge>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 justify-between">
                <div className="glass-panel px-3 py-2 font-mono text-[10px] space-y-0.5">
                  <p className="text-muted-foreground">TRACK: {selectedSat?.name ?? 'AUTO-SCAN'}</p>
                  <p className="text-muted-foreground">MODE: REAL-TIME · GEODETIC</p>
                </div>
                <div className="glass-panel px-3 py-2 font-mono text-[10px]">
                  <p className="text-muted-foreground">Click any object to pull its flight file</p>
                </div>
              </div>
            </div>

            {/* Comms loop */}
            <Card variant="glass" className="h-[520px] flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="flex items-center gap-2"><Terminal className="h-4 w-4 text-primary" /> Flight Loop</span>
                  <span className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    AUTO <Switch checked={autoRotateLog} onCheckedChange={setAutoRotateLog} />
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto font-mono text-[11px] space-y-2" ref={logRef}>
                {log.length === 0 && (
                  <p className="text-muted-foreground">Awaiting loop traffic…</p>
                )}
                {log.map((l, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-primary/70 shrink-0">{l.t}</span>
                    <span className={l.msg.includes('advisory') ? 'text-warning' : 'text-muted-foreground'}>{l.msg}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Console positions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <Card variant="glass" className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldCheck className="h-4 w-4 text-primary" /> Console Positions
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {CONSOLES.map((c, i) => (
                  <div key={c.code} className="p-3 rounded-lg bg-secondary/30 border border-border/40">
                    <div className="flex items-center justify-between">
                      <p className="font-mono text-xs font-bold text-primary">{c.code}</p>
                      <span className={`h-2 w-2 rounded-full ${i % 5 === 3 ? 'bg-warning' : 'bg-success'} animate-pulse`} />
                    </div>
                    <p className="text-[11px] mt-1">{c.role}</p>
                    <p className="text-[10px] text-muted-foreground">{c.operator}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Gauge className="h-4 w-4 text-primary" /> Systems
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {gauges.map((g) => (
                  <div key={g.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <g.icon className="h-3.5 w-3.5" /> {g.label}
                      </span>
                      <span className="font-mono">{g.value} {g.unit}</span>
                    </div>
                    <Progress value={g.pct} className="h-1.5" />
                  </div>
                ))}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Constellation Health</span>
                    <span className="font-mono">{health.toFixed(0)}%</span>
                  </div>
                  <Progress value={health} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ground network */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <Card variant="glass">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Globe2 className="h-4 w-4 text-primary" /> Ground Station Network
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {GROUND_STATIONS.map((g, i) => (
                  <div key={g.name} className="flex items-center justify-between p-2 rounded-lg bg-secondary/20 text-xs">
                    <div>
                      <p className="font-medium">{g.name}</p>
                      <p className="text-[10px] text-muted-foreground">{g.country} • {g.band} band</p>
                    </div>
                    <Badge
                      variant="outline"
                      className={i % 3 === 2 ? 'bg-muted text-muted-foreground' : 'bg-success/15 text-success border-success/40'}
                    >
                      {i % 3 === 2 ? 'STANDBY' : 'LOCKED'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="h-4 w-4 text-warning" /> Watch List
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[300px] overflow-y-auto">
                {satellites
                  .filter((s) => s.riskLevel !== 'safe')
                  .slice(0, 12)
                  .map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSat(s)}
                      className="w-full text-left flex items-center justify-between p-2 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors text-xs"
                    >
                      <span className="flex items-center gap-2">
                        <SatIcon className="h-3.5 w-3.5 text-primary" /> {s.name}
                      </span>
                      <Badge
                        variant="outline"
                        className={s.riskLevel === 'critical' ? 'status-critical' : 'status-warning'}
                      >
                        {s.riskLevel} • {Math.round(s.altitude)} km
                      </Badge>
                    </button>
                  ))}
                {satellites.filter((s) => s.riskLevel !== 'safe').length === 0 && (
                  <p className="text-xs text-muted-foreground">No elevated-risk objects on the board.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Footer />
        </main>
      </div>

      <Dialog open={!!selectedSat} onOpenChange={(o) => !o && setSelectedSat(null)}>
        <DialogContent className="max-w-lg p-0 bg-transparent border-0 shadow-none">
          {selectedSat && <SatelliteDetailPanel satellite={selectedSat} compact />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MissionControl;
