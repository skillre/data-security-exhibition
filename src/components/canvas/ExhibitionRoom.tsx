import { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { useExhibitionStore } from '../../store/useExhibitionStore';

export function ExhibitionRoom() {
  const config = useExhibitionStore((s) => s.config);
  const floorSize = config?.scene.floorSize ?? [20, 20];
  const wallHeight = config?.scene.wallHeight ?? 4;

  const floorTexture = useTexture('/assets/textures/floor.jpg');
  const wallTexture = useTexture('/assets/textures/wall.jpg');

  useMemo(() => {
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(4, 4);
    floorTexture.colorSpace = THREE.SRGBColorSpace;

    wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(3, 1);
    wallTexture.colorSpace = THREE.SRGBColorSpace;
  }, [floorTexture, wallTexture]);

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
        <meshStandardMaterial map={floorTexture} roughness={0.8} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, halfHeight, -halfDepth]} receiveShadow>
        <primitive object={wallGeometry} />
        <meshStandardMaterial map={wallTexture} roughness={0.6} />
      </mesh>

      {/* Front wall */}
      <mesh position={[0, halfHeight, halfDepth]} rotation={[0, Math.PI, 0]}>
        <primitive object={wallGeometry} />
        <meshStandardMaterial map={wallTexture} roughness={0.6} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-halfWidth, halfHeight, 0]} rotation={[0, Math.PI / 2, 0]}>
        <primitive object={wallGeometry} />
        <meshStandardMaterial map={wallTexture} roughness={0.6} />
      </mesh>

      {/* Right wall */}
      <mesh position={[halfWidth, halfHeight, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <primitive object={wallGeometry} />
        <meshStandardMaterial map={wallTexture} roughness={0.6} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, wallHeight, 0]}>
        <planeGeometry args={floorSize} />
        <meshStandardMaterial color="#1a1a2e" roughness={1} />
      </mesh>
    </group>
  );
}
