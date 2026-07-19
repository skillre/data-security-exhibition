import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticlesProps {
  count?: number;
  color?: string;
  spread?: number;
}

export function Particles({ count = 200, color = '#4488ff', spread = 30 }: ParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * spread,
          Math.random() * 5 + 0.5,
          (Math.random() - 0.5) * spread
        ),
        speed: Math.random() * 0.02 + 0.005,
        offset: Math.random() * Math.PI * 2,
      });
    }
    return temp;
  }, [count, spread]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particleColor = useMemo(() => new THREE.Color(color), [color]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    particles.forEach((particle, i) => {
      dummy.position.set(
        particle.position.x,
        particle.position.y + Math.sin(t * particle.speed + particle.offset) * 0.5,
        particle.position.z
      );
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color={particleColor} transparent opacity={0.6} />
    </instancedMesh>
  );
}
