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

  // 发光线条材质
  const glowMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: '#00d4ff', transparent: true, opacity: 0.6 }),
    []
  );

  return (
    <group>
      {/* 地板 - 深色带微光 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={floorSize} />
        <meshStandardMaterial color="#0a0a1a" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* 地板发光线条 - 横向 */}
      {[-8, -4, 0, 4, 8].map((z) => (
        <mesh key={`h-${z}`} position={[0, 0.01, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[floorSize[0], 0.05]} />
          <primitive object={glowMaterial} />
        </mesh>
      ))}

      {/* 地板发光线条 - 纵向 */}
      {[-8, -4, 0, 4, 8].map((x) => (
        <mesh key={`v-${x}`} position={[x, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.05, floorSize[1]]} />
          <primitive object={glowMaterial} />
        </mesh>
      ))}

      {/* 墙壁 - 深色 */}
      <mesh position={[0, halfHeight, -halfDepth]} receiveShadow>
        <primitive object={wallGeometry} />
        <meshStandardMaterial color="#0d0d1a" roughness={0.4} metalness={0.6} />
      </mesh>

      <mesh position={[0, halfHeight, halfDepth]} rotation={[0, Math.PI, 0]}>
        <primitive object={wallGeometry} />
        <meshStandardMaterial color="#0d0d1a" roughness={0.4} metalness={0.6} />
      </mesh>

      <mesh position={[-halfWidth, halfHeight, 0]} rotation={[0, Math.PI / 2, 0]}>
        <primitive object={wallGeometry} />
        <meshStandardMaterial color="#0d0d1a" roughness={0.4} metalness={0.6} />
      </mesh>

      <mesh position={[halfWidth, halfHeight, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <primitive object={wallGeometry} />
        <meshStandardMaterial color="#0d0d1a" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* 天花板 */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, wallHeight, 0]}>
        <planeGeometry args={floorSize} />
        <meshStandardMaterial color="#050510" roughness={1} />
      </mesh>

      {/* 墙壁顶部发光条 - 四周 */}
      {/* 后墙 */}
      <mesh position={[0, wallHeight - 0.05, -halfDepth + 0.01]}>
        <boxGeometry args={[floorSize[0], 0.08, 0.02]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.8} />
      </mesh>
      {/* 前墙 */}
      <mesh position={[0, wallHeight - 0.05, halfDepth - 0.01]}>
        <boxGeometry args={[floorSize[0], 0.08, 0.02]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.8} />
      </mesh>
      {/* 左墙 */}
      <mesh position={[-halfWidth + 0.01, wallHeight - 0.05, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[floorSize[1], 0.08, 0.02]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.8} />
      </mesh>
      {/* 右墙 */}
      <mesh position={[halfWidth - 0.01, wallHeight - 0.05, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[floorSize[1], 0.08, 0.02]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.8} />
      </mesh>

      {/* 展位底座 - 发光效果 */}
      {(
        [
          [-6, 0.05, -9],
          [0, 0.05, -9],
          [6, 0.05, -9],
          [0, 0.05, 9],
        ] as [number, number, number][]
      ).map((pos, i) => (
        <group key={i} position={pos}>
          <mesh>
            <boxGeometry args={[3, 0.1, 2]} />
            <meshStandardMaterial color="#111122" metalness={0.9} roughness={0.1} />
          </mesh>
          {/* 底座发光边 */}
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[3.05, 0.02, 2.05]} />
            <meshBasicMaterial color="#00d4ff" transparent opacity={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
