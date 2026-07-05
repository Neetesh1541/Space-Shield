import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { EarthScene } from '@/components/space/EarthScene';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { AsteroidPanel } from '@/components/dashboard/AsteroidPanel';
import { SatelliteList } from '@/components/dashboard/SatelliteList';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { MissionClock } from '@/components/dashboard/MissionClock';
import { SolarWeatherPanel } from '@/components/dashboard/SolarWeatherPanel';
import { CollisionPredictionPanel } from '@/components/dashboard/CollisionPredictionPanel';
import { CollisionAlertBanner } from '@/components/dashboard/CollisionAlertBanner';
import { PlanetaryDataPanel } from '@/components/dashboard/PlanetaryDataPanel';
import { SpaceMissionsPanel } from '@/components/dashboard/SpaceMissionsPanel';
import { ISSTrackerPanel } from '@/components/dashboard/ISSTrackerPanel';
import { SatelliteDetailPanel } from '@/components/dashboard/SatelliteDetailPanel';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useWorldSatellites } from '@/hooks/useWorldSatellites';
import { useAsteroidData } from '@/hooks/useAsteroidData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Satellite } from '@/types/space';
import { 
  Satellite as SatelliteIcon, 
  Globe, 
  AlertTriangle, 
  Shield,
  Orbit,
  Moon,
  Rocket,
  Radio
} from 'lucide-react';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSolarSystem, setShowSolarSystem] = useState(false);
  const [selectedSat, setSelectedSat] = useState<Satellite | null>(null);
  const { satellites, isLoading: satellitesLoading, stats: satelliteStats, spaceDebris } = useWorldSatellites();
  const { data: asteroids } = useAsteroidData();

  const hazardousAsteroids = asteroids?.filter(a => a.isPotentiallyHazardous).length || 0;
  const highRiskDebris = spaceDebris?.filter(d => d.riskLevel === 'high').length || 0;

  return (
    <div className="min-h-screen bg-background nebula-bg stars-bg">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {/* AI Collision Alert Banner */}
          <div className="mb-4">
            <CollisionAlertBanner 
              satellites={satellites}
              autoAnalyze={false}
            />
          </div>

          {/* Mission Clock */}
          <div className="mb-6">
            <MissionClock />
          </div>

          {/* Stats Grid - 2 rows */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="Active Satellites"
              value={satelliteStats.total}
              subtitle={`${satelliteStats.byOrbit.LEO} LEO • ${satelliteStats.byOrbit.GEO} GEO`}
              icon={SatelliteIcon}
              variant="glow"
            />
            <StatsCard
              title="Tracked Debris"
              value={satelliteStats.debris?.total ?? 127}
              subtitle={`${highRiskDebris} high-risk objects`}
              icon={Globe}
              variant={highRiskDebris > 10 ? 'warning' : 'default'}
            />
            <StatsCard
              title="NEO Detected"
              value={asteroids?.length || 0}
              subtitle={`${hazardousAsteroids} hazardous`}
              icon={AlertTriangle}
              variant={hazardousAsteroids > 0 ? 'warning' : 'default'}
            />
            <StatsCard
              title="Risk Score"
              value={satelliteStats.critical > 0 ? 'HIGH' : 'LOW'}
              subtitle={`${satelliteStats.critical} critical alerts`}
              icon={Shield}
              variant={satelliteStats.critical > 0 ? 'critical' : 'success'}
            />
          </div>

          {/* Second Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="MEO Satellites"
              value={satelliteStats.byOrbit.MEO}
              subtitle="Navigation & Communication"
              icon={Orbit}
            />
            <StatsCard
              title="Moon Distance"
              value="384,400"
              subtitle="km from Earth"
              icon={Moon}
            />
            <StatsCard
              title="Active Missions"
              value={12}
              subtitle="5 crewed • 7 robotic"
              icon={Rocket}
              variant="glow"
            />
            <StatsCard
              title="Signal Status"
              value="NOMINAL"
              subtitle="All systems operational"
              icon={Radio}
              variant="success"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 3D Earth/Solar System View - Takes 2 columns */}
            <div className="lg:col-span-2 h-[500px] md:h-[600px] rounded-xl overflow-hidden border border-border/50 bg-card/30 backdrop-blur relative">
              <EarthScene
                satellites={satellites}
                showSolarSystem={showSolarSystem}
                onSelectSatellite={setSelectedSat}
                selectedId={selectedSat?.id ?? null}
              />
              
              {/* View Toggle */}
              <div className="absolute top-4 left-4 flex gap-2">
                <Button
                  size="sm"
                  variant={!showSolarSystem ? 'default' : 'outline'}
                  onClick={() => setShowSolarSystem(false)}
                  className="relative z-10"
                >
                  <Globe className="h-4 w-4 mr-1" />
                  Earth View
                </Button>
                <Button
                  size="sm"
                  variant={showSolarSystem ? 'default' : 'outline'}
                  onClick={() => setShowSolarSystem(true)}
                  className="relative z-10"
                >
                  <Orbit className="h-4 w-4 mr-1" />
                  Solar System
                </Button>
              </div>

              {/* Live Badge */}
              <div className="absolute top-4 right-4">
                <Badge variant="outline" className="bg-success/20 text-success border-success/50 animate-pulse">
                  <span className="w-2 h-2 bg-success rounded-full mr-2" />
                  LIVE
                </Badge>
              </div>
              
              {/* Overlay Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="glass-panel px-3 py-2 text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-success" />
                    <span className="text-muted-foreground">Safe: {satelliteStats.safe}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-warning" />
                    <span className="text-muted-foreground">Warning: {satelliteStats.warning}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-destructive" />
                    <span className="text-muted-foreground">Critical: {satelliteStats.critical}</span>
                  </div>
                </div>
                
                <div className="glass-panel px-3 py-2">
                  <p className="text-[10px] text-muted-foreground uppercase">
                    {showSolarSystem ? 'Zoom out to see all planets' : 'Drag to rotate • Scroll to zoom'}
                  </p>
                </div>
              </div>
            </div>

            {/* Alerts Panel */}
            <div className="h-[500px] md:h-[600px]">
              <AlertsPanel />
            </div>
          </div>

          {/* ISS Tracker & Missions Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="h-[400px]">
              <ISSTrackerPanel />
            </div>
            <div className="h-[400px]">
              <SpaceMissionsPanel />
            </div>
            <div className="h-[400px]">
              <PlanetaryDataPanel />
            </div>
          </div>

          {/* Secondary Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* AI Collision Prediction */}
            <div className="h-[450px]">
              <CollisionPredictionPanel satellites={satellites} />
            </div>

            {/* Solar Weather */}
            <div className="h-[450px]">
              <SolarWeatherPanel />
            </div>
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Asteroid Panel */}
            <div className="h-[400px]">
              <AsteroidPanel />
            </div>

            {/* Satellite List */}
            <div className="h-[400px]">
              <SatelliteList satellites={satellites.slice(0, 50)} isLoading={satellitesLoading} />
            </div>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Index;
