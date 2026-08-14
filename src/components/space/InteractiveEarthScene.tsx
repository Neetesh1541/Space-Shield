import { useRef, useMemo, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere, Html, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import earthTexture from '@/assets/earth-texture.jpg';
import type { Satellite } from '@/types/space';
import { Globe } from 'lucide-react';
import { SolarSystemControls } from './SolarSystemControls';

interface InteractiveEarthSceneProps {
  satellites: Satellite[];
  showSolarSystem?: boolean;
}

interface SceneProps extends InteractiveEarthSceneProps {
  orbitSpeed: number;
  isPaused: boolean;
  showOrbits: boolean;
  showLabels: boolean;
  planetVisibility: Record<string, boolean>;
  selectedPlanet: string | null;
  cameraDistance: number;
}

// Moon Component
const Moon = ({ orbitSpeed, isPaused }: { orbitSpeed: number; isPaused: boolean }) => {
  const moonRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (isPaused) return;
    if (moonRef.current) {
      moonRef.current.rotation.y += 0.002 * orbitSpeed;
    }
    if (orbitRef.current) {
      orbitRef.current.rotation.y = clock.getElapsedTime() * 0.1 * orbitSpeed;
    }
  });

  return (
    <group ref={orbitRef}>
      <mesh ref={moonRef} position={[2.5, 0, 0]}>
        <sphereGeometry args={[0.27, 32, 32]} />
        <meshStandardMaterial color="#c4c4c4" roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.45, 2.55, 64]} />
        <meshBasicMaterial color="#888888" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};

// Planet Component with enhanced interactivity
interface PlanetProps {
  name: string;
  color: string;
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  globalSpeed: number;
  hasRing?: boolean;
  ringColor?: string;
  isPaused: boolean;
  showOrbit: boolean;
  showLabel: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

const Planet = ({ 
  name, 
  color, 
  size, 
  orbitRadius, 
  orbitSpeed, 
  globalSpeed,
  hasRing, 
  ringColor,
  isPaused,
  showOrbit,
  showLabel,
  isSelected,
  onSelect
}: PlanetProps) => {
  const planetRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (isPaused) return;
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.01 * globalSpeed;
    }
    if (orbitRef.current) {
      orbitRef.current.rotation.y = clock.getElapsedTime() * orbitSpeed * globalSpeed;
    }
  });

  return (
    <group ref={orbitRef}>
      {/* Orbit path */}
      {showOrbit && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[orbitRadius - 0.02, orbitRadius + 0.02, 128]} />
          <meshBasicMaterial 
            color={isSelected ? '#ffffff' : color} 
            transparent 
            opacity={isSelected ? 0.4 : 0.15} 
            side={THREE.DoubleSide} 
          />
        </mesh>
      )}
      
      <mesh 
        ref={planetRef} 
        position={[orbitRadius, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.6} 
          metalness={0.2}
          emissive={color}
          emissiveIntensity={isSelected ? 0.5 : hovered ? 0.3 : 0.05}
        />
        {(hovered || showLabel || isSelected) && (
          <Html distanceFactor={10}>
            <div className={`glass-panel px-2 py-1 text-xs whitespace-nowrap ${isSelected ? 'border-primary border' : ''}`}>
              {name}
              {isSelected && <span className="ml-1 text-primary">●</span>}
            </div>
          </Html>
        )}
      </mesh>

      {/* Rings (Saturn, Uranus) */}
      {hasRing && (
        <group position={[orbitRadius, 0, 0]} rotation={[Math.PI / 3, 0, 0]}>
          <mesh>
            <ringGeometry args={[size * 1.4, size * 2, 64]} />
            <meshBasicMaterial color={ringColor || color} transparent opacity={0.4} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}
    </group>
  );
};

// Realistic Sun (multi-layer animated corona)
import { RealisticSun } from './RealisticSun';
import { EarthOrbitGroup } from './EarthOrbitGroup';

const Earth = ({ isPaused, orbitSpeed }: { isPaused: boolean; orbitSpeed: number }) => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(TextureLoader, earthTexture);

  useFrame(() => {
    if (isPaused) return;
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001 * orbitSpeed;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0012 * orbitSpeed;
    }
  });

  return (
    <group>
      <Sphere ref={earthRef} args={[1, 64, 64]}>
        <meshStandardMaterial map={texture} />
      </Sphere>
      <Sphere ref={cloudsRef} args={[1.01, 64, 64]}>
        <meshStandardMaterial color="#ffffff" transparent opacity={0.12} />
      </Sphere>
    </group>
  );
};

const AtmosphereGlow = () => {
  return (
    <>
      <Sphere args={[1.02, 64, 64]}>
        <meshBasicMaterial color="#4fc3f7" transparent opacity={0.15} side={THREE.BackSide} />
      </Sphere>
      <Sphere args={[1.05, 64, 64]}>
        <meshBasicMaterial color="#00bcd4" transparent opacity={0.08} side={THREE.BackSide} />
      </Sphere>
    </>
  );
};

interface SatellitePointsProps {
  satellites: Satellite[];
}

const SatellitePoints = ({ satellites }: SatellitePointsProps) => {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(satellites.length * 3);
    const colors = new Float32Array(satellites.length * 3);

    satellites.forEach((sat, i) => {
      positions[i * 3] = sat.position.x;
      positions[i * 3 + 1] = sat.position.y;
      positions[i * 3 + 2] = sat.position.z;

      let color: [number, number, number];
      switch (sat.riskLevel) {
        case 'critical':
          color = [1, 0.2, 0.2];
          break;
        case 'warning':
          color = [1, 0.8, 0.2];
          break;
        default:
          color = [0.2, 1, 0.6];
      }
      colors[i * 3] = color[0];
      colors[i * 3 + 1] = color[1];
      colors[i * 3 + 2] = color[2];
    });

    return { positions, colors };
  }, [satellites]);

  if (satellites.length === 0) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={satellites.length} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={satellites.length} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent opacity={0.9} sizeAttenuation />
    </points>
  );
};

const OrbitalRings = ({ showOrbits }: { showOrbits: boolean }) => {
  if (!showOrbits) return null;
  
  const ringColors = ['#4fc3f7', '#81c784', '#ffb74d'];
  const radii = [1.15, 1.5, 2.0];

  return (
    <>
      {radii.map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + (i * 0.1), 0, 0]}>
          <ringGeometry args={[radius - 0.005, radius + 0.005, 128]} />
          <meshBasicMaterial color={ringColors[i]} transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </>
  );
};

// Asteroid Belt
const AsteroidBelt = ({ isPaused, orbitSpeed }: { isPaused: boolean; orbitSpeed: number }) => {
  const asteroids = useMemo(() => {
    return Array.from({ length: 150 }, (_, i) => ({
      position: new THREE.Vector3(
        Math.cos((i / 150) * Math.PI * 2) * (4 + Math.random() * 0.5),
        (Math.random() - 0.5) * 0.3,
        Math.sin((i / 150) * Math.PI * 2) * (4 + Math.random() * 0.5)
      ),
      size: 0.01 + Math.random() * 0.02,
    }));
  }, []);

  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (isPaused) return;
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.02 * orbitSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      {asteroids.map((asteroid, i) => (
        <mesh key={i} position={asteroid.position}>
          <sphereGeometry args={[asteroid.size, 8, 8]} />
          <meshStandardMaterial color="#8b7355" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
};

// Camera controller for planet focus
const CameraController = ({ selectedPlanet, cameraDistance }: { selectedPlanet: string | null; cameraDistance: number }) => {
  const { camera } = useThree();
  
  useEffect(() => {
    if (selectedPlanet) {
      // Focus camera based on planet (simplified - you could calculate actual positions)
      const planetDistances: Record<string, number> = {
        Mercury: 5,
        Venus: 6.5,
        Earth: 0,
        Mars: 8,
        Jupiter: 11,
        Saturn: 14,
        Uranus: 17,
        Neptune: 20,
      };
      const distance = planetDistances[selectedPlanet] || 0;
      camera.position.set(distance * 0.8, 3, distance + 5);
    }
  }, [selectedPlanet, camera]);

  return null;
};

const Scene = ({ 
  satellites, 
  showSolarSystem, 
  orbitSpeed, 
  isPaused,
  showOrbits,
  showLabels,
  planetVisibility,
  selectedPlanet,
  cameraDistance
}: SceneProps) => {
  
  const handlePlanetSelect = (name: string) => {
    // This is handled at parent level
  };

  const planets = [
    { name: 'Mercury', color: '#b5b5b5', size: 0.15, orbitRadius: 5, orbitSpeed: 0.08 },
    { name: 'Venus', color: '#e6c229', size: 0.25, orbitRadius: 6.5, orbitSpeed: 0.06 },
    { name: 'Mars', color: '#cd5c5c', size: 0.2, orbitRadius: 8, orbitSpeed: 0.04 },
    { name: 'Jupiter', color: '#d4a574', size: 0.6, orbitRadius: 11, orbitSpeed: 0.02 },
    { name: 'Saturn', color: '#f4d03f', size: 0.5, orbitRadius: 14, orbitSpeed: 0.015, hasRing: true, ringColor: '#c9a227' },
    { name: 'Uranus', color: '#7fdbff', size: 0.35, orbitRadius: 17, orbitSpeed: 0.01, hasRing: true, ringColor: '#5fb3b3' },
    { name: 'Neptune', color: '#4169e1', size: 0.35, orbitRadius: 20, orbitSpeed: 0.008 },
  ];

  return (
    <>
      <CameraController selectedPlanet={selectedPlanet} cameraDistance={cameraDistance} />
      
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4fc3f7" />
      
      <Stars radius={100} depth={50} count={8000} factor={4} saturation={0} fade speed={isPaused ? 0 : 1} />
      
      {showSolarSystem && <RealisticSun position={[0, 0, 0]} size={2.2} />}
      
      <EarthOrbitGroup active={!!showSolarSystem} paused={isPaused} speed={0.05 * orbitSpeed}>
        <Suspense fallback={null}>
          <Earth isPaused={isPaused} orbitSpeed={orbitSpeed} />
        </Suspense>
        <AtmosphereGlow />
        <Moon orbitSpeed={orbitSpeed} isPaused={isPaused} />
        <OrbitalRings showOrbits={showOrbits} />
        <SatellitePoints satellites={satellites} />
      </EarthOrbitGroup>
      
      {showSolarSystem && (
        <>
          {planets.map((planet) => (
            planetVisibility[planet.name] !== false && (
              <Planet
                key={planet.name}
                {...planet}
                globalSpeed={orbitSpeed}
                isPaused={isPaused}
                showOrbit={showOrbits}
                showLabel={showLabels}
                isSelected={selectedPlanet === planet.name}
                onSelect={() => {}}
              />
            )
          ))}
          <AsteroidBelt isPaused={isPaused} orbitSpeed={orbitSpeed} />
        </>
      )}
      
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        minDistance={1.5}
        maxDistance={showSolarSystem ? 80 : 10}
        autoRotate={!isPaused}
        autoRotateSpeed={0.2 * orbitSpeed}
      />
    </>
  );
};

const LoadingFallback = () => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-radial from-secondary/20 to-background">
    <div className="text-center">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full animate-pulse" />
        <Globe className="h-16 w-16 text-primary relative animate-spin" style={{ animationDuration: '3s' }} />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Loading Solar System...</p>
    </div>
  </div>
);

export const InteractiveEarthScene = ({ satellites, showSolarSystem = false }: InteractiveEarthSceneProps) => {
  const [orbitSpeed, setOrbitSpeed] = useState(1);
  const [zoom, setZoom] = useState(15);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const [planetVisibility, setPlanetVisibility] = useState<Record<string, boolean>>({});

  const handleTogglePlanetVisibility = (planet: string) => {
    setPlanetVisibility(prev => ({
      ...prev,
      [planet]: prev[planet] === undefined ? false : !prev[planet]
    }));
  };

  return (
    <div className="w-full h-full relative">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: showSolarSystem ? [0, 12, zoom + 14] : [0, 0, 3], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene 
            satellites={satellites} 
            showSolarSystem={showSolarSystem}
            orbitSpeed={orbitSpeed}
            isPaused={isPaused}
            showOrbits={showOrbits}
            showLabels={showLabels}
            planetVisibility={planetVisibility}
            selectedPlanet={selectedPlanet}
            cameraDistance={zoom}
          />
        </Canvas>
      </Suspense>
      
      {showSolarSystem && (
        <SolarSystemControls
          orbitSpeed={orbitSpeed}
          onOrbitSpeedChange={setOrbitSpeed}
          zoom={zoom}
          onZoomChange={setZoom}
          selectedPlanet={selectedPlanet}
          onSelectPlanet={setSelectedPlanet}
          isPaused={isPaused}
          onTogglePause={() => setIsPaused(!isPaused)}
          showOrbits={showOrbits}
          onToggleOrbits={() => setShowOrbits(!showOrbits)}
          showLabels={showLabels}
          onToggleLabels={() => setShowLabels(!showLabels)}
          planetVisibility={planetVisibility}
          onTogglePlanetVisibility={handleTogglePlanetVisibility}
        />
      )}
    </div>
  );
};
