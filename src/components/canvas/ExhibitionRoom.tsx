import { useMemo } from 'react';
import * as THREE from 'three';
import { useExhibitionStore } from '../../store/useExhibitionStore';

export function ExhibitionRoom() {
  const config = useExhibitionStore((s) => s.config);
  const floorSize = config?.scene.floorSize ?? [20, 20];
  const wallHeight = config?.scene.wallHeight ?? 4;

  const wallGeometry = useMemo(
    () => new THREE.PlaneGeometry(floorSize[0], wallHeight),
    [floorSize, wallHeight]
  );

  const halfWidth = floorSize[0] / 2;
  const halfDepth = floorSize[1] / 2;
  const halfHeight = wallHeight / 2;

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={floorSize} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.8} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, halfHeight, -halfDepth]} receiveShadow>
        <primitive object={wallGeometry} />
        <meshStandardMaterial color="#0d0d1a" roughness={0.6} />
      </mesh>

      {/* Front wall */}
      <mesh position={[0, halfHeight, halfDepth]} rotation={[0, Math.PI, 0]}>
        <primitive object={wallGeometry} />
        <meshStandardMaterial color="#0d0d1a" roughness={0.6} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-halfWidth, halfHeight, 0]} rotation={[0, Math.PI / 2, 0]}>
        <primitive object={wallGeometry} />
        <meshStandardMaterial color="#0d0d1a" roughness={0.6} />
      </mesh>

      {/* Right wall */}
      <mesh position={[halfWidth, halfHeight, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <primitive object={wallGeometry} />
        <meshStandardMaterial color="#0d0d1a" roughness={0.6} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, wallHeight, 0]}>
        <planeGeometry args={floorSize} />
        <meshStandardMaterial color="#0a0a15" roughness={1} />
      </mesh>

      {/* Grid lines on floor */}
      <gridHelper
        args={[floorSize[0], 20, '#2a2a4a', '#1a1a3a']}
        position={[0, 0.01, 0]}
      />
    </group>
  );
}
