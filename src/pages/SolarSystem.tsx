import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { InteractiveEarthScene } from '@/components/space/InteractiveEarthScene';
import { PlanetaryDataPanel } from '@/components/dashboard/PlanetaryDataPanel';
import { SpaceMissionsPanel } from '@/components/dashboard/SpaceMissionsPanel';
import { CollisionPredictionPanel } from '@/components/dashboard/CollisionPredictionPanel';
import { CollisionAlertBanner } from '@/components/dashboard/CollisionAlertBanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useWorldSatellites } from '@/hooks/useWorldSatellites';
import { Orbit, Sun, Moon as MoonIcon, Globe, Rocket, Star, AlertTriangle, Brain, Radar } from 'lucide-react';

const SOLAR_SYSTEM_FACTS = [
  { label: 'Age', value: '4.6 billion years' },
  { label: 'Diameter', value: '~287.5 billion km' },
  { label: 'Planets', value: '8 major planets' },
  { label: 'Dwarf Planets', value: '5 recognized' },
  { label: 'Known Moons', value: '290+' },
  { label: 'Asteroids', value: '1.1+ million' },
];

const SolarSystem = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCollisionPanel, setShowCollisionPanel] = useState(false);
  const { satellites, stats } = useWorldSatellites();

  return (
    <div className="min-h-screen bg-background stars-bg nebula-bg aurora-bg">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {/* AI Collision Alert Banner */}
          <div className="mb-4">
            <CollisionAlertBanner 
              satellites={satellites}
              autoAnalyze={false}
              onViewDetails={() => setShowCollisionPanel(true)}
            />
          </div>

          {/* Page Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Orbit className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Solar System Explorer</h1>
                  <p className="text-sm text-muted-foreground">
                    Interactive 3D view with real-time satellite tracking and AI collision prediction
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="hidden md:flex">
                  <Radar className="h-3 w-3 mr-1" />
                  {satellites.length} Active Objects
                </Badge>
                <Button 
                  variant={showCollisionPanel ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setShowCollisionPanel(!showCollisionPanel)}
                >
                  <Brain className="h-4 w-4 mr-1" />
                  AI Analysis
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {SOLAR_SYSTEM_FACTS.map((fact) => (
              <Card key={fact.label} variant="glass" className="text-center">
                <CardContent className="p-3">
                  <p className="text-xs text-muted-foreground">{fact.label}</p>
                  <p className="font-bold text-lg">{fact.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 3D Solar System View */}
            <div className={`${showCollisionPanel ? 'lg:col-span-2' : 'lg:col-span-2'} h-[600px] rounded-xl overflow-hidden border border-border/50 bg-card/30 backdrop-blur relative`}>
              <InteractiveEarthScene satellites={satellites} showSolarSystem={true} />
              
              {/* Info Overlay */}
              <div className="absolute top-4 left-4">
                <Badge variant="outline" className="bg-background/80">
                  <Sun className="h-3 w-3 mr-1 text-yellow-500" />
                  Solar System View
                </Badge>
              </div>

              <div className="absolute bottom-4 left-4 right-80">
                <div className="glass-panel px-4 py-3">
                  <div className="flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-blue-400" />
                      <span>Terrestrial Planets</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-orange-400" />
                      <span>Gas Giants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-cyan-400" />
                      <span>Ice Giants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-300" />
                      <span>Asteroid Belt</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Status Overlay */}
              <div className="absolute bottom-4 right-4">
                <div className="glass-panel px-3 py-2">
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-success" />
                      <span>{stats.safe}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-warning" />
                      <span>{stats.warning}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-destructive" />
                      <span>{stats.critical}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Either Collision Analysis or Planetary Data */}
            <div className="h-[600px]">
              {showCollisionPanel ? (
                <CollisionPredictionPanel satellites={satellites} />
              ) : (
                <PlanetaryDataPanel />
              )}
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-6">
            <Tabs defaultValue="missions" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="missions">
                  <Rocket className="h-4 w-4 mr-1" />
                  Missions
                </TabsTrigger>
                <TabsTrigger value="moons">
                  <MoonIcon className="h-4 w-4 mr-1" />
                  Moons
                </TabsTrigger>
                <TabsTrigger value="facts">
                  <Star className="h-4 w-4 mr-1" />
                  Facts
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="missions" className="mt-4">
                <div className="h-[400px]">
                  <SpaceMissionsPanel />
                </div>
              </TabsContent>
              
              <TabsContent value="moons" className="mt-4">
                <Card variant="glass">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MoonIcon className="h-5 w-5" />
                      Notable Moons of the Solar System
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { name: 'Moon', planet: 'Earth', diameter: '3,474 km' },
                        { name: 'Io', planet: 'Jupiter', diameter: '3,643 km' },
                        { name: 'Europa', planet: 'Jupiter', diameter: '3,122 km' },
                        { name: 'Ganymede', planet: 'Jupiter', diameter: '5,268 km' },
                        { name: 'Callisto', planet: 'Jupiter', diameter: '4,821 km' },
                        { name: 'Titan', planet: 'Saturn', diameter: '5,150 km' },
                        { name: 'Enceladus', planet: 'Saturn', diameter: '504 km' },
                        { name: 'Triton', planet: 'Neptune', diameter: '2,707 km' },
                      ].map((moon) => (
                        <div key={moon.name} className="p-3 rounded-lg bg-secondary/30 border border-border/30">
                          <p className="font-medium">{moon.name}</p>
                          <p className="text-xs text-muted-foreground">{moon.planet}</p>
                          <p className="text-xs text-primary">{moon.diameter}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="facts" className="mt-4">
                <Card variant="glass">
                  <CardHeader>
                    <CardTitle>Interesting Solar System Facts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        'The Sun contains 99.86% of the mass in the Solar System',
                        'Jupiter has the shortest day of all planets at 9.9 hours',
                        'Venus is the hottest planet despite Mercury being closer to the Sun',
                        'Saturn could float in water due to its low density',
                        'A day on Venus is longer than its year',
                        'The Great Red Spot on Jupiter has been raging for over 400 years',
                        'Neptune has the strongest winds in the Solar System',
                        'Mars has the largest volcano in the Solar System (Olympus Mons)',
                      ].map((fact, i) => (
                        <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-secondary/20">
                          <Star className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{fact}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
};

export default SolarSystem;
