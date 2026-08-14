import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  SPACE_AGENCIES,
  CONSTELLATIONS,
  UPCOMING_MISSIONS,
  ISS_FACTS,
  ISS_MODULES,
  LAUNCH_SITES,
  ORBIT_REFERENCE,
} from '@/data/spaceData';
import { Building2, Satellite, Rocket, Radio, MapPin, Orbit, Search, ExternalLink, Users } from 'lucide-react';

const SpaceData = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const agencies = SPACE_AGENCIES.filter(
    (a) => !q || a.name.toLowerCase().includes(q) || a.acronym.toLowerCase().includes(q) || a.country.toLowerCase().includes(q)
  );
  const constellations = CONSTELLATIONS.filter(
    (c) => !q || c.name.toLowerCase().includes(q) || c.operator.toLowerCase().includes(q) || c.orbit.toLowerCase().includes(q)
  );
  const missions = UPCOMING_MISSIONS.filter(
    (m) => !q || m.name.toLowerCase().includes(q) || m.agency.toLowerCase().includes(q) || m.destination.toLowerCase().includes(q)
  );

  const totalActive = CONSTELLATIONS.reduce((s, c) => s + c.active, 0);
  const totalPlanned = CONSTELLATIONS.reduce((s, c) => s + c.planned, 0);

  return (
    <div className="min-h-screen bg-background nebula-bg stars-bg">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Global Space Database</h1>
                <p className="text-sm text-muted-foreground">
                  Agencies, constellations, launch sites, the ISS and every upcoming flagship mission
                </p>
              </div>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search agency, constellation, mission…"
                className="pl-9"
              />
            </div>
          </div>

          {/* Top stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Space agencies tracked', value: SPACE_AGENCIES.length, icon: Building2 },
              { label: 'Active constellation sats', value: totalActive.toLocaleString(), icon: Satellite },
              { label: 'Planned by 2030', value: totalPlanned.toLocaleString(), icon: Orbit },
              { label: 'Major launch sites', value: LAUNCH_SITES.length, icon: MapPin },
            ].map((s) => (
              <Card key={s.label} variant="glass">
                <CardContent className="p-4 flex items-center gap-3">
                  <s.icon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xl font-bold">{s.value}</p>
                    <p className="text-[11px] text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="agencies">
            <TabsList className="grid w-full max-w-3xl grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="agencies">Agencies</TabsTrigger>
              <TabsTrigger value="constellations">Constellations</TabsTrigger>
              <TabsTrigger value="missions">Missions</TabsTrigger>
              <TabsTrigger value="iss">ISS</TabsTrigger>
              <TabsTrigger value="sites">Launch Sites</TabsTrigger>
            </TabsList>

            <TabsContent value="agencies" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {agencies.map((a) => (
                  <Card key={a.acronym} variant="glass" className="hover:border-primary/40 transition-colors">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center justify-between text-base">
                        <span>{a.acronym}</span>
                        <Badge variant="outline">{a.country}</Badge>
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">{a.name}</p>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                      <div className="grid grid-cols-3 gap-2">
                        <div><p className="text-muted-foreground">Founded</p><p className="font-medium">{a.founded}</p></div>
                        <div><p className="text-muted-foreground">Budget</p><p className="font-medium">${a.budgetUsdBn}B</p></div>
                        <div><p className="text-muted-foreground">Staff</p><p className="font-medium">{a.employees}</p></div>
                      </div>
                      <p className="text-muted-foreground">HQ: <span className="text-foreground">{a.hq}</span></p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {a.flagshipPrograms.map((p) => (
                          <Badge key={p} variant="secondary" className="text-[10px]">{p}</Badge>
                        ))}
                      </div>
                      <a href={a.site} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline pt-1">
                        Official site <ExternalLink className="h-3 w-3" />
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="constellations" className="mt-4">
              <Card variant="glass">
                <CardContent className="p-0 divide-y divide-border/40">
                  {constellations.map((c) => (
                    <div key={c.name} className="p-4 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Satellite className="h-4 w-4 text-primary" />
                          <span className="font-medium">{c.name}</span>
                          <Badge variant="outline" className="text-[10px]">{c.orbit}</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {c.operator} • {c.altitudeKm.toLocaleString()} km • {c.purpose}
                        </span>
                      </div>
                      <Progress value={Math.min(100, (c.active / c.planned) * 100)} className="h-1.5" />
                      <p className="text-[11px] text-muted-foreground">
                        {c.active.toLocaleString()} active of {c.planned.toLocaleString()} planned
                        ({((c.active / c.planned) * 100).toFixed(1)}% deployed)
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="missions" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {missions.map((m) => (
                  <Card key={m.name} variant="glass">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center justify-between text-base">
                        <span className="flex items-center gap-2"><Rocket className="h-4 w-4 text-warning" />{m.name}</span>
                        {m.crewed && <Badge className="bg-warning/20 text-warning border-warning/40"><Users className="h-3 w-3 mr-1" />Crewed</Badge>}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        <div><p className="text-muted-foreground">Agency</p><p className="font-medium">{m.agency}</p></div>
                        <div><p className="text-muted-foreground">Vehicle</p><p className="font-medium">{m.vehicle}</p></div>
                        <div><p className="text-muted-foreground">Window</p><p className="font-medium">{m.window}</p></div>
                      </div>
                      <p className="text-muted-foreground">Destination: <span className="text-foreground">{m.destination}</span></p>
                      <p>{m.summary}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="iss" className="mt-4 space-y-4">
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Radio className="h-5 w-5 text-primary" />International Space Station</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {ISS_FACTS.map((f) => (
                      <div key={f.label} className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                        <p className="text-[10px] text-muted-foreground uppercase">{f.label}</p>
                        <p className="text-sm font-medium">{f.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground mb-2">Pressurised modules</p>
                    <div className="flex flex-wrap gap-1.5">
                      {ISS_MODULES.map((m) => (
                        <Badge key={m} variant="secondary" className="text-[10px]">{m}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card variant="glass">
                <CardHeader><CardTitle className="text-base">Orbital regimes reference</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {ORBIT_REFERENCE.map((o) => (
                    <div key={o.regime} className="p-3 rounded-lg bg-secondary/30 border border-border/30 text-xs space-y-1">
                      <p className="font-bold text-primary">{o.regime}</p>
                      <p className="text-muted-foreground">{o.range}</p>
                      <p className="text-muted-foreground">Period: {o.period}</p>
                      <p>{o.use}</p>
                      <Badge variant="outline" className="text-[10px]">{o.objects}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sites" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {LAUNCH_SITES.map((s) => (
                  <Card key={s.name} variant="glass">
                    <CardContent className="p-4 space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <p className="font-medium text-sm leading-tight">{s.name}</p>
                      </div>
                      <p className="text-muted-foreground">{s.operator} • {s.country}</p>
                      <p className="text-muted-foreground">
                        {s.lat.toFixed(2)}°, {s.lon.toFixed(2)}° • {s.pads} active pads
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <Footer />
        </main>
      </div>
    </div>
  );
};

export default SpaceData;
