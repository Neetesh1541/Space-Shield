import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EarthOrbitGroupProps {
  /** When true, the Earth system orbits the Sun (heliocentric solar-system view). */
  active: boolean;
  radius?: number;
  speed?: number;
  paused?: boolean;
  children: React.ReactNode;
}

/**
 * Wraps the Earth + Moon + satellite system.
 * In Earth view the system stays at the origin.
 * In Solar-System view it orbits the Sun (which sits at the origin), so the
 * scene is correctly heliocentric.
 */
export const EarthOrbitGroup = ({
  active,
  radius = 7.25,
  speed = 0.05,
  paused = false,
  children,
}: EarthOrbitGroupProps) => {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!active || paused || !ref.current) return;
    const t = clock.getElapsedTime() * speed;
    ref.current.position.set(Math.cos(t) * radius, 0, Math.sin(t) * radius);
  });

  if (!active) return <>{children}</>;

  return (
    <>
      {/* Earth's orbital path around the Sun */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.02, radius + 0.02, 160]} />
        <meshBasicMaterial color="#4fc3f7" transparent opacity={0.18} side={THREE.DoubleSide} />
      </mesh>
      <group ref={ref} position={[radius, 0, 0]}>
        {children}
      </group>
    </>
  );
};
