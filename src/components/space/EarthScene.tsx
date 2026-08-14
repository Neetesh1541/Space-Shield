import { useRef, useMemo, Suspense, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import earthTexture from '@/assets/earth-texture.jpg';
import type { Satellite } from '@/types/space';
import { Globe } from 'lucide-react';

interface EarthProps {
  satellites: Satellite[];
  showSolarSystem?: boolean;
  onSelectSatellite?: (sat: Satellite) => void;
  selectedId?: string | null;
}

// Moon Component
const Moon = () => {
  const moonRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (moonRef.current) {
      moonRef.current.rotation.y += 0.002;
    }
    if (orbitRef.current) {
      orbitRef.current.rotation.y = clock.getElapsedTime() * 0.1;
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

// Planet Component
interface PlanetProps {
  name: string;
  color: string;
  size: number;
  orbitRadius: number;
  orbitSpeed: number;
  hasRing?: boolean;
  ringColor?: string;
}

const Planet = ({ name, color, size, orbitRadius, orbitSpeed, hasRing, ringColor }: PlanetProps) => {
  const planetRef = useRef<THREE.Mesh>(null);
  const orbitRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.01;
    }
    if (orbitRef.current) {
      orbitRef.current.rotation.y = clock.getElapsedTime() * orbitSpeed;
    }
  });

  return (
    <group ref={orbitRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[orbitRadius - 0.02, orbitRadius + 0.02, 128]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>
      
      <mesh 
        ref={planetRef} 
        position={[orbitRadius, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.6} 
          metalness={0.2}
          emissive={color}
          emissiveIntensity={hovered ? 0.3 : 0.05}
        />
        {hovered && (
          <Html distanceFactor={10}>
            <div className="glass-panel px-2 py-1 text-xs whitespace-nowrap">
              {name}
            </div>
          </Html>
        )}
      </mesh>

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


const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(TextureLoader, earthTexture);

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0012;
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
      <Sphere args={[1.015, 64, 64]}>
        <meshBasicMaterial color="#7fdfff" transparent opacity={0.22} side={THREE.BackSide} />
      </Sphere>
      <Sphere args={[1.05, 64, 64]}>
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.12} side={THREE.BackSide} />
      </Sphere>
      <Sphere args={[1.12, 64, 64]}>
        <meshBasicMaterial color="#0891b2" transparent opacity={0.05} side={THREE.BackSide} />
      </Sphere>
    </>
  );
};

// Clickable satellite markers (visible spheres w/ hover label + click)
interface SatelliteMarkersProps {
  satellites: Satellite[];
  onSelect?: (sat: Satellite) => void;
  selectedId?: string | null;
}

const riskColor = (r: Satellite['riskLevel']) => r === 'critical' ? '#ff3355' : r === 'warning' ? '#ffb020' : '#33ffaa';

const SatelliteMarkers = ({ satellites, onSelect, selectedId }: SatelliteMarkersProps) => {
  const [hoverId, setHoverId] = useState<string | null>(null);
  // Show up to 60 as interactive meshes to keep FPS smooth
  const list = useMemo(() => {
    const sorted = [...satellites].sort((a, b) => {
      const w = (x: Satellite) => x.riskLevel === 'critical' ? 0 : x.riskLevel === 'warning' ? 1 : 2;
      return w(a) - w(b);
    });
    return sorted.slice(0, 60);
  }, [satellites]);

  return (
    <group>
      {list.map((sat) => {
        const isSel = selectedId === sat.id;
        const isHover = hoverId === sat.id;
        const c = riskColor(sat.riskLevel);
        return (
          <group key={sat.id} position={[sat.position.x, sat.position.y, sat.position.z]}>
            <mesh
              onPointerOver={(e) => { e.stopPropagation(); setHoverId(sat.id); document.body.style.cursor = 'pointer'; }}
              onPointerOut={() => { setHoverId(null); document.body.style.cursor = 'default'; }}
              onClick={(e) => { e.stopPropagation(); onSelect?.(sat); }}
            >
              <sphereGeometry args={[isSel || isHover ? 0.045 : 0.028, 12, 12]} />
              <meshStandardMaterial color={c} emissive={c} emissiveIntensity={isSel ? 2 : isHover ? 1.4 : 0.8} />
            </mesh>
            {/* halo */}
            <mesh>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshBasicMaterial color={c} transparent opacity={isSel ? 0.35 : isHover ? 0.22 : 0.08} />
            </mesh>
            {(isHover || isSel) && (
              <Html distanceFactor={8} style={{ pointerEvents: 'none' }}>
                <div className="glass-panel px-2 py-1 text-[10px] whitespace-nowrap -translate-y-6 border border-primary/40">
                  <div className="font-semibold text-primary">{sat.name}</div>
                  <div className="text-muted-foreground">{sat.orbitType} · {sat.altitude.toLocaleString()} km · {sat.riskLevel.toUpperCase()}</div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
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

  useFrame(() => {
    if (pointsRef.current) {
      const positionAttr = pointsRef.current.geometry.attributes.position;
      satellites.forEach((sat, i) => {
        positionAttr.setXYZ(i, sat.position.x, sat.position.y, sat.position.z);
      });
      positionAttr.needsUpdate = true;
    }
  });

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

const OrbitalRings = () => {
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
const AsteroidBelt = () => {
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
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.02;
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

const Scene = ({ satellites, showSolarSystem = false, onSelectSatellite, selectedId }: EarthProps) => {
  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 3, 5]} intensity={1.4} />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#22d3ee" />
      
      <Stars radius={100} depth={50} count={showSolarSystem ? 6000 : 12000} factor={4} saturation={0} fade speed={1} />
      
      {showSolarSystem && <RealisticSun position={[0, 0, 0]} size={2.2} />}
      
      <EarthOrbitGroup active={showSolarSystem}>
        <Suspense fallback={null}>
          <Earth />
        </Suspense>
        <AtmosphereGlow />
        <Moon />
        <OrbitalRings />
        <SatellitePoints satellites={satellites} />
        <SatelliteMarkers satellites={satellites} onSelect={onSelectSatellite} selectedId={selectedId} />
      </EarthOrbitGroup>

      
      {showSolarSystem && (
        <>
          <Planet name="Mercury" color="#b5b5b5" size={0.15} orbitRadius={5} orbitSpeed={0.08} />
          <Planet name="Venus" color="#e6c229" size={0.25} orbitRadius={6.5} orbitSpeed={0.06} />
          <Planet name="Mars" color="#cd5c5c" size={0.2} orbitRadius={8} orbitSpeed={0.04} />
          <Planet name="Jupiter" color="#d4a574" size={0.6} orbitRadius={11} orbitSpeed={0.02} />
          <Planet name="Saturn" color="#f4d03f" size={0.5} orbitRadius={14} orbitSpeed={0.015} hasRing ringColor="#c9a227" />
          <Planet name="Uranus" color="#7fdbff" size={0.35} orbitRadius={17} orbitSpeed={0.01} hasRing ringColor="#5fb3b3" />
          <Planet name="Neptune" color="#4169e1" size={0.35} orbitRadius={20} orbitSpeed={0.008} />
          <AsteroidBelt />
        </>
      )}
      
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        minDistance={1.5}
        maxDistance={showSolarSystem ? 80 : 10}
        autoRotate
        autoRotateSpeed={0.15}
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
      <p className="mt-4 text-sm text-muted-foreground">Loading Earth View...</p>
    </div>
  </div>
);

export const EarthScene = ({ satellites, showSolarSystem = false, onSelectSatellite, selectedId }: EarthProps) => {
  return (
    <div className="w-full h-full relative">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: showSolarSystem ? [0, 12, 28] : [0, 0, 3], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene satellites={satellites} showSolarSystem={showSolarSystem} onSelectSatellite={onSelectSatellite} selectedId={selectedId} />
        </Canvas>
      </Suspense>
    </div>
  );
};
