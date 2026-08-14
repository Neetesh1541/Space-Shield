import { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Rocket, 
  Play, 
  Pause, 
  RotateCcw,
  Gauge,
  Timer,
  Fuel,
  Thermometer,
  ArrowUp,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RocketProps {
  phase: number;
  isLaunched: boolean;
  time: number;
}

const RocketBody = ({ phase, isLaunched, time }: RocketProps) => {
  const rocketRef = useRef<THREE.Group>(null);
  const exhaustRef = useRef<THREE.Points>(null);
  const stage1Ref = useRef<THREE.Group>(null);
  const stage2Ref = useRef<THREE.Group>(null);
  
  // Rocket position based on phase
  const [position, setPosition] = useState({ x: 0, y: -2, z: 0 });
  const [stage1Separated, setStage1Separated] = useState(false);
  const [stage2Separated, setStage2Separated] = useState(false);

  useFrame(() => {
    if (!isLaunched) return;
    
    // Phase 0-1: Liftoff
    if (phase === 0 || phase === 1) {
      setPosition(prev => ({
        ...prev,
        y: Math.min(prev.y + 0.02, 3)
      }));
    }
    
    // Phase 2: Stage 1 separation
    if (phase === 2 && !stage1Separated) {
      setStage1Separated(true);
    }
    
    // Phase 3: Trajectory
    if (phase >= 3) {
      setPosition(prev => ({
        x: prev.x + 0.01,
        y: prev.y + 0.005,
        z: prev.z
      }));
    }
    
    // Phase 4: Stage 2 separation
    if (phase === 4 && !stage2Separated) {
      setStage2Separated(true);
    }

    // Rotate exhaust particles
    if (exhaustRef.current && isLaunched && phase < 5) {
      exhaustRef.current.rotation.y += 0.1;
    }
  });

  // Exhaust particles
  const exhaustParticles = new Float32Array(300);
  for (let i = 0; i < 100; i++) {
    exhaustParticles[i * 3] = (Math.random() - 0.5) * 0.3;
    exhaustParticles[i * 3 + 1] = -Math.random() * 2;
    exhaustParticles[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
  }

  return (
    <group ref={rocketRef} position={[position.x, position.y, position.z]}>
      {/* Stage 2 (Payload) */}
      <group ref={stage2Ref} position={[stage2Separated ? 0.5 : 0, stage2Separated ? 0.5 : 0.8, 0]}>
        {/* Nose cone */}
        <mesh position={[0, 0.5, 0]}>
          <coneGeometry args={[0.15, 0.4, 8]} />
          <meshStandardMaterial color="#4fc3f7" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Payload fairing */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.3, 8]} />
          <meshStandardMaterial color="#e0e0e0" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>

      {/* Stage 1 (Main body) - separates at phase 2 */}
      <group ref={stage1Ref} position={[stage1Separated ? -0.3 : 0, stage1Separated ? -1.5 : 0, stage1Separated ? 0.2 : 0]}>
        {/* Main body */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.18, 0.22, 1.2, 12]} />
          <meshStandardMaterial color="#f5f5f5" metalness={0.5} roughness={0.4} />
        </mesh>
        
        {/* Stripes */}
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.185, 0.185, 0.1, 12]} />
          <meshStandardMaterial color="#ff5722" metalness={0.3} roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.205, 0.205, 0.1, 12]} />
          <meshStandardMaterial color="#ff5722" metalness={0.3} roughness={0.5} />
        </mesh>

        {/* Fins */}
        {[0, 90, 180, 270].map((rotation, i) => (
          <mesh 
            key={i} 
            position={[
              Math.cos((rotation * Math.PI) / 180) * 0.25,
              -0.5,
              Math.sin((rotation * Math.PI) / 180) * 0.25
            ]}
            rotation={[0, (rotation * Math.PI) / 180, 0]}
          >
            <boxGeometry args={[0.02, 0.3, 0.2]} />
            <meshStandardMaterial color="#333" metalness={0.7} roughness={0.3} />
          </mesh>
        ))}

        {/* Engine nozzle */}
        <mesh position={[0, -0.7, 0]}>
          <coneGeometry args={[0.12, 0.2, 8]} />
          <meshStandardMaterial color="#555" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Exhaust flames */}
      {isLaunched && phase < 5 && !stage1Separated && (
        <>
          <pointLight position={[0, -1.2, 0]} color="#ff6600" intensity={2} distance={3} />
          <points ref={exhaustRef} position={[0, -0.9, 0]}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={100}
                array={exhaustParticles}
                itemSize={3}
              />
            </bufferGeometry>
            <pointsMaterial size={0.05} color="#ff9900" transparent opacity={0.8} />
          </points>
          <mesh position={[0, -1, 0]}>
            <coneGeometry args={[0.15, 0.6, 8]} />
            <meshBasicMaterial color="#ff6600" transparent opacity={0.7} />
          </mesh>
        </>
      )}
    </group>
  );
};

const LaunchPad = () => {
  return (
    <group position={[0, -3, 0]}>
      {/* Platform */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[1, 1.2, 0.3, 16]} />
        <meshStandardMaterial color="#555" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Support towers */}
      {[0, 120, 240].map((rotation, i) => (
        <mesh 
          key={i}
          position={[
            Math.cos((rotation * Math.PI) / 180) * 0.8,
            0.8,
            Math.sin((rotation * Math.PI) / 180) * 0.8
          ]}
        >
          <boxGeometry args={[0.1, 1.5, 0.1]} />
          <meshStandardMaterial color="#777" metalness={0.5} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
};

const Scene = ({ phase, isLaunched, time }: RocketProps) => {
  // Sky color shifts from blue → black as we ascend (driven by phase)
  const skyColor = phase >= 4 ? '#000010' : phase >= 2 ? '#0a1530' : phase >= 1 ? '#1a3a6b' : '#3a7bd5';

  return (
    <>
      <color attach="background" args={[skyColor]} />
      <fog attach="fog" args={[skyColor, 15, 60]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#4fc3f7" />
      <hemisphereLight args={[skyColor, '#1a1a2e', 0.6]} />

      <Stars radius={100} depth={50} count={phase >= 3 ? 6000 : 2000} factor={4} saturation={0} fade speed={1} />

      <RocketBody phase={phase} isLaunched={isLaunched} time={time} />
      <LaunchPad />

      {/* Earth horizon curve visible from high altitude */}
      {phase >= 4 && (
        <mesh position={[0, -25, -20]}>
          <sphereGeometry args={[20, 64, 32]} />
          <meshStandardMaterial color="#1e6091" emissive="#0a3050" emissiveIntensity={0.3} />
        </mesh>
      )}

      {/* Ground (terrain) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.15, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.9} />
      </mesh>

      {/* Launch pad lights */}
      {!isLaunched && (
        <>
          <pointLight position={[2, -2, 2]} intensity={0.6} color="#4fc3f7" distance={5} />
          <pointLight position={[-2, -2, -2]} intensity={0.6} color="#ff6b1a" distance={5} />
        </>
      )}

      <OrbitControls enablePan={false} minDistance={3} maxDistance={20} target={[0, 0, 0]} />
    </>
  );
};

// ---- Vehicle definition (Falcon-9-class two-stage LEO launcher) ----
const VEHICLE = {
  dryMass: 25600,          // kg (upper stage + fairing + payload)
  stage1Prop: 411000,      // kg
  stage2Prop: 107500,      // kg
  stage1Mass: 22200,       // kg dry
  stage1Thrust: 7607000,   // N (sea level)
  stage1ThrustVac: 8227000,
  stage2Thrust: 981000,    // N (vacuum)
  stage1Isp: 282,          // s
  stage2Isp: 348,          // s
  dragArea: 10.5,          // m^2
  cd: 0.3,
};
const G0 = 9.80665;
const R_EARTH = 6371000;

const RocketLaunch = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLaunched, setIsLaunched] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [phase, setPhase] = useState(0);
  const [events, setEvents] = useState<{ t: number; msg: string }[]>([]);

  // Live flight state (integrated, not scripted)
  const [telemetry, setTelemetry] = useState({
    altitude: 0,       // m
    velocity: 0,       // km/h (display)
    speedMs: 0,        // m/s
    acceleration: 0,   // m/s^2
    fuel: 100,         // %
    temperature: 20,   // °C
    maxQ: 0,           // kPa
    dynamicPressure: 0,// kPa
    gForce: 1,
    downrange: 0,      // m
    throttle: 0,       // %
    mass: VEHICLE.dryMass + VEHICLE.stage1Mass + VEHICLE.stage1Prop + VEHICLE.stage2Prop,
    apoapsis: 0,       // m
    pitch: 90,         // deg
  });

  const phases = [
    { name: 'Pre-Launch', time: 0 },
    { name: 'Liftoff', time: 1 },
    { name: 'Max-Q', time: 60 },
    { name: 'Stage 1 Separation', time: 162 },
    { name: 'Stage 2 Ignition', time: 168 },
    { name: 'Orbit Insertion', time: 540 },
    { name: 'Mission Complete', time: 570 },
  ];

  const pushEvent = (t: number, msg: string) =>
    setEvents((prev) => (prev.some((e) => e.msg === msg) ? prev : [{ t, msg }, ...prev].slice(0, 40)));

  // Terminal countdown
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      setCountdown(null);
      setIsLaunched(true);
      pushEvent(0, 'Ignition sequence start — liftoff!');
      return;
    }
    const id = setTimeout(() => setCountdown((c) => (c === null ? null : c - 1)), 1000);
    return () => clearTimeout(id);
  }, [countdown]);

  useEffect(() => {
    if (!isLaunched || isPaused) return;

    const dt = 1; // simulated seconds per tick (10x real time)
    const interval = setInterval(() => {
      setTime((prevT) => {
        const t = prevT + dt;

        for (let i = phases.length - 1; i >= 0; i--) {
          if (t >= phases[i].time) { setPhase(i); break; }
        }

        setTelemetry((s) => {
          if (t > 600) return s;

          // --- Guidance: vertical rise then gravity turn ---
          const pitch = t < 12 ? 90 : Math.max(2, 90 - ((t - 12) / 210) * 88);
          const pitchRad = (pitch * Math.PI) / 180;

          // --- Propulsion ---
          const stage1Burn = t <= 162;
          const stage2Burn = t > 168 && t <= 540;
          // Max-Q throttle bucket
          const throttle = stage1Burn ? (t >= 50 && t <= 78 ? 0.72 : 1) : stage2Burn ? 1 : 0;

          const rho = 1.225 * Math.exp(-s.altitude / 8500);
          const pressureRatio = Math.min(1, rho / 1.225);
          const thrust = stage1Burn
            ? (VEHICLE.stage1Thrust * pressureRatio + VEHICLE.stage1ThrustVac * (1 - pressureRatio)) * throttle
            : stage2Burn
              ? VEHICLE.stage2Thrust
              : 0;
          const isp = stage1Burn ? VEHICLE.stage1Isp : VEHICLE.stage2Isp;
          const mdot = thrust > 0 ? thrust / (isp * G0) : 0;

          let mass = s.mass - mdot * dt;
          if (t > 162 && t <= 163) mass -= VEHICLE.stage1Mass; // stage 1 jettison
          mass = Math.max(VEHICLE.dryMass, mass);

          // --- Forces ---
          const v = s.speedMs;
          const q = 0.5 * rho * v * v;                       // Pa
          const drag = q * VEHICLE.cd * VEHICLE.dragArea;    // N
          const gLocal = G0 * Math.pow(R_EARTH / (R_EARTH + s.altitude), 2);
          const centrifugal = (v * Math.cos(pitchRad)) ** 2 / (R_EARTH + s.altitude);

          const aThrust = thrust / mass;
          const aDrag = drag / mass;
          const aNet = aThrust - aDrag - (gLocal - centrifugal) * Math.sin(pitchRad);

          const speedMs = Math.max(0, v + aNet * dt);
          const altitude = Math.max(0, s.altitude + speedMs * Math.sin(pitchRad) * dt);
          const downrange = s.downrange + speedMs * Math.cos(pitchRad) * dt;

          // --- Consumables / thermal ---
          const totalProp = VEHICLE.stage1Prop + VEHICLE.stage2Prop;
          const usedProp = totalProp - Math.max(0, mass - VEHICLE.dryMass - (t <= 162 ? VEHICLE.stage1Mass : 0));
          const fuel = Math.max(0, 100 - (usedProp / totalProp) * 100);
          const temperature = Math.round(20 + (q / 1000) * 22 + (speedMs > 2000 ? (speedMs - 2000) * 0.35 : 0));
          const qkPa = q / 1000;

          // --- Callouts ---
          if (t === 12) pushEvent(t, 'Pitch-over initiated — beginning gravity turn.');
          if (t === 50) pushEvent(t, 'Throttling down for Max-Q.');
          if (qkPa > s.maxQ && t > 40 && t < 90 && qkPa > 25) pushEvent(t, `Max-Q ${qkPa.toFixed(1)} kPa — vehicle at maximum dynamic pressure.`);
          if (t === 79) pushEvent(t, 'Throttle up — Max-Q passed.');
          if (t === 162) pushEvent(t, 'MECO — main engine cutoff.');
          if (t === 164) pushEvent(t, 'Stage separation confirmed.');
          if (t === 168) pushEvent(t, 'Second-stage ignition (SES-1).');
          if (t === 200) pushEvent(t, 'Fairing jettison — payload exposed to vacuum.');
          if (t === 540) pushEvent(t, 'SECO — orbital velocity achieved.');
          if (t === 560) pushEvent(t, 'Payload deploy — nominal insertion.');

          return {
            altitude,
            speedMs,
            velocity: speedMs * 3.6,
            acceleration: aNet,
            fuel,
            temperature,
            maxQ: Math.max(s.maxQ, qkPa),
            dynamicPressure: qkPa,
            gForce: Math.max(0, aThrust / G0),
            downrange,
            throttle: throttle * 100,
            mass,
            apoapsis: altitude + (speedMs * Math.cos(pitchRad)) ** 2 / (2 * gLocal),
            pitch,
          };
        });

        return t;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isLaunched, isPaused]);

  const handleLaunch = () => {
    setIsPaused(false);
    setCountdown(10);
    setEvents([{ t: 0, msg: 'Terminal count started — T-10 seconds.' }]);
  };

  const handleReset = () => {
    setIsLaunched(false);
    setIsPaused(false);
    setCountdown(null);
    setTime(0);
    setPhase(0);
    setEvents([]);
    setTelemetry({
      altitude: 0, velocity: 0, speedMs: 0, acceleration: 0, fuel: 100,
      temperature: 20, maxQ: 0, dynamicPressure: 0, gForce: 1, downrange: 0,
      throttle: 0, mass: VEHICLE.dryMass + VEHICLE.stage1Mass + VEHICLE.stage1Prop + VEHICLE.stage2Prop,
      apoapsis: 0, pitch: 90,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `T+${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };


  return (
    <div className="min-h-screen bg-background stars-bg">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
              <Rocket className="h-8 w-8 text-primary" />
              3D Rocket Launch Simulation
            </h1>
            <p className="text-muted-foreground mt-1">
              Interactive launch simulation with stage separation and real-time telemetry
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 3D Viewport */}
            <div className="lg:col-span-2">
              <Card className="glass-panel overflow-hidden">
                <div className="h-[500px] relative">
                  <Suspense fallback={
                    <div className="w-full h-full flex items-center justify-center bg-background">
                      <Rocket className="h-16 w-16 text-primary animate-bounce" />
                    </div>
                  }>
                    <Canvas camera={{ position: [5, 3, 8], fov: 50 }}>
                      <Scene phase={phase} isLaunched={isLaunched} time={time} />
                    </Canvas>
                  </Suspense>
                  
                  {/* Overlay - Mission Timer */}
                  <div className="absolute top-4 left-4 glass-panel px-4 py-2">
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4 text-primary" />
                      <span className="font-mono text-lg text-foreground">
                        {countdown !== null ? `T-00:${String(countdown).padStart(2, '0')}` : formatTime(time)}
                      </span>
                    </div>
                  </div>

                  {/* Current Phase */}
                  <div className="absolute top-4 right-4 glass-panel px-4 py-2">
                    <Badge className={cn(
                      "text-xs",
                      phase >= 5 ? "bg-success/20 text-success" :
                      phase >= 3 ? "bg-warning/20 text-warning" :
                      "bg-primary/20 text-primary"
                    )}>
                      {phases[phase]?.name}
                    </Badge>
                  </div>
                </div>

                {/* Controls */}
                <CardContent className="p-4 border-t border-border/50">
                  <div className="flex items-center justify-center gap-4">
                    {!isLaunched ? (
                      <Button onClick={handleLaunch} disabled={countdown !== null} variant="glow" size="lg" className="relative z-10">
                        <Play className="h-5 w-5 mr-2" />
                        {countdown !== null ? `Terminal count T-${countdown}` : 'Start Launch Sequence'}
                      </Button>
                    ) : (
                      <>
                        <Button 
                          onClick={() => setIsPaused(!isPaused)} 
                          variant="outline" 
                          size="lg"
                          className="relative z-10"
                        >
                          {isPaused ? <Play className="h-5 w-5 mr-2" /> : <Pause className="h-5 w-5 mr-2" />}
                          {isPaused ? 'Resume' : 'Pause'}
                        </Button>
                        <Button onClick={handleReset} variant="outline" size="lg" className="relative z-10">
                          <RotateCcw className="h-5 w-5 mr-2" />
                          Reset
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Telemetry Panel */}
            <div className="space-y-4">
              <Card className="glass-panel">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Live Telemetry
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <ArrowUp className="h-4 w-4" /> Altitude
                      </span>
                      <span className="font-mono text-foreground">{(telemetry.altitude / 1000).toFixed(1)} km</span>
                    </div>
                    <Progress value={(telemetry.altitude / 400000) * 100} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Gauge className="h-4 w-4" /> Velocity
                      </span>
                      <span className="font-mono text-foreground">{telemetry.velocity.toFixed(0)} km/h</span>
                    </div>
                    <Progress value={(telemetry.velocity / 28000) * 100} className="h-2" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Fuel className="h-4 w-4" /> Fuel
                      </span>
                      <span className="font-mono text-foreground">{telemetry.fuel.toFixed(1)}%</span>
                    </div>
                    <Progress 
                      value={telemetry.fuel} 
                      className={cn("h-2", telemetry.fuel < 20 && "bg-destructive/20")} 
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Thermometer className="h-4 w-4" /> Temperature
                      </span>
                      <span className={cn(
                        "font-mono",
                        telemetry.temperature > 1000 ? "text-destructive" : "text-foreground"
                      )}>
                        {telemetry.temperature}°C
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-2">Acceleration</p>
                    <p className="text-2xl font-bold text-primary">{telemetry.acceleration.toFixed(1)} m/s²</p>
                  </div>
                </CardContent>
              </Card>

              {/* Flight Data */}
              <Card className="glass-panel">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Flight Data</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { l: 'Dynamic Pressure', v: `${telemetry.dynamicPressure.toFixed(1)} kPa` },
                    { l: 'Max-Q', v: `${telemetry.maxQ.toFixed(1)} kPa` },
                    { l: 'G-Force', v: `${telemetry.gForce.toFixed(2)} g` },
                    { l: 'Throttle', v: `${telemetry.throttle.toFixed(0)} %` },
                    { l: 'Downrange', v: `${(telemetry.downrange / 1000).toFixed(1)} km` },
                    { l: 'Pitch', v: `${telemetry.pitch.toFixed(1)}°` },
                    { l: 'Vehicle Mass', v: `${(telemetry.mass / 1000).toFixed(1)} t` },
                    { l: 'Apoapsis Est.', v: `${(telemetry.apoapsis / 1000).toFixed(0)} km` },
                  ].map((d) => (
                    <div key={d.l} className="p-2 rounded-lg bg-secondary/30 border border-border/30">
                      <p className="text-[10px] text-muted-foreground uppercase">{d.l}</p>
                      <p className="font-mono text-foreground">{d.v}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Flight Callouts */}
              <Card className="glass-panel">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Flight Callouts</CardTitle>
                </CardHeader>
                <CardContent className="max-h-[240px] overflow-y-auto space-y-1.5 font-mono text-[11px]">
                  {events.length === 0 && <p className="text-muted-foreground">Vehicle on the pad. Awaiting terminal count.</p>}
                  {events.map((e, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-primary/70 shrink-0">{formatTime(e.t)}</span>
                      <span className="text-muted-foreground">{e.msg}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Phase Timeline */}
              <Card className="glass-panel">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Mission Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {phases.map((p, i) => (
                      <div 
                        key={p.name}
                        className={cn(
                          "flex items-center gap-3 p-2 rounded-lg transition-all",
                          i === phase && "bg-primary/10 border border-primary/30",
                          i < phase && "opacity-50"
                        )}
                      >
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          i < phase ? "bg-success" :
                          i === phase ? "bg-primary animate-pulse" :
                          "bg-muted"
                        )} />
                        <span className="text-sm flex-1">{p.name}</span>
                        <span className="text-xs font-mono text-muted-foreground">
                          T+{Math.floor(p.time / 60)}:{(p.time % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
};

export default RocketLaunch;
