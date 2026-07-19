import { useMemo } from 'react';
import * as THREE from 'three';

interface RoomProps {
  width: number;
  depth: number;
  height: number;
  wallColor?: string;
  floorColor?: string;
  position?: [number, number, number];
}

export function Room({
  width,
  depth,
  height,
  wallColor = '#0d1525',
  floorColor = '#0a1020',
  position = [0, 0, 0],
}: RoomProps) {
  const wallMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.8, side: THREE.DoubleSide }),
    [wallColor]
  );
  const floorMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: floorColor, roughness: 0.9 }),
    [floorColor]
  );

  return (
    <group position={position}>
      {/* 地板 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <primitive object={floorMaterial} />
      </mesh>

      {/* 天花板 */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#0a0e1a" roughness={0.95} />
      </mesh>

      {/* 后墙 */}
      <mesh position={[0, height / 2, -depth / 2]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <primitive object={wallMaterial} />
      </mesh>

      {/* 左墙 */}
      <mesh position={[-width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[depth, height]} />
        <primitive object={wallMaterial} />
      </mesh>

      {/* 右墙 */}
      <mesh position={[width / 2, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[depth, height]} />
        <primitive object={wallMaterial} />
      </mesh>
    </group>
  );
}
