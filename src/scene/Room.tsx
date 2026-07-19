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
  // 创建边缘发光效果的材质
  const wallMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: wallColor,
      roughness: 0.7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95,
    }),
    [wallColor]
  );

  const floorMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: floorColor,
      roughness: 0.85,
      metalness: 0.1,
    }),
    [floorColor]
  );

  const ceilingMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({
      color: '#080c16',
      roughness: 0.95,
    }),
    []
  );

  // 边框线条材质
  const edgeMaterial = useMemo(
    () => new THREE.LineBasicMaterial({
      color: '#1a3a6a',
      transparent: true,
      opacity: 0.4,
    }),
    []
  );

  // 创建边框几何体
  const edges = useMemo(() => {
    const lines: THREE.Vector3[][] = [];

    // 地板边框
    lines.push([
      new THREE.Vector3(-width / 2, 0.02, -depth / 2),
      new THREE.Vector3(width / 2, 0.02, -depth / 2),
      new THREE.Vector3(width / 2, 0.02, depth / 2),
      new THREE.Vector3(-width / 2, 0.02, depth / 2),
      new THREE.Vector3(-width / 2, 0.02, -depth / 2),
    ]);

    // 天花板边框
    lines.push([
      new THREE.Vector3(-width / 2, height, -depth / 2),
      new THREE.Vector3(width / 2, height, -depth / 2),
      new THREE.Vector3(width / 2, height, depth / 2),
      new THREE.Vector3(-width / 2, height, depth / 2),
      new THREE.Vector3(-width / 2, height, -depth / 2),
    ]);

    // 垂直边框（四角）
    lines.push([new THREE.Vector3(-width / 2, 0.02, -depth / 2), new THREE.Vector3(-width / 2, height, -depth / 2)]);
    lines.push([new THREE.Vector3(width / 2, 0.02, -depth / 2), new THREE.Vector3(width / 2, height, -depth / 2)]);
    lines.push([new THREE.Vector3(width / 2, 0.02, depth / 2), new THREE.Vector3(width / 2, height, depth / 2)]);
    lines.push([new THREE.Vector3(-width / 2, 0.02, depth / 2), new THREE.Vector3(-width / 2, height, depth / 2)]);

    return lines;
  }, [width, depth, height]);

  return (
    <group position={position}>
      {/* 地板 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <primitive object={floorMaterial} />
      </mesh>

      {/* 天花板 */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]}>
        <planeGeometry args={[width, depth]} />
        <primitive object={ceilingMaterial} />
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

      {/* 边框线条 - 增强空间感 */}
      {edges.map((points, index) => (
        <line key={index}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={points.length}
              array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <primitive object={edgeMaterial} />
        </line>
      ))}

      {/* 底部发光条 - 科技感 */}
      <mesh position={[0, 0.05, -depth / 2 + 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width - 0.2, 0.1]} />
        <meshBasicMaterial color="#4488ff" transparent opacity={0.3} />
      </mesh>

      {/* 左侧发光条 */}
      <mesh position={[-width / 2 + 0.1, 0.05, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[depth - 0.2, 0.1]} />
        <meshBasicMaterial color="#4488ff" transparent opacity={0.3} />
      </mesh>

      {/* 右侧发光条 */}
      <mesh position={[width / 2 - 0.1, 0.05, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[depth - 0.2, 0.1]} />
        <meshBasicMaterial color="#4488ff" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
