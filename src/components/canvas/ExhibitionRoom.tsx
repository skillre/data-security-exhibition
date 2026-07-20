import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { useExhibitionStore } from '../../store/useExhibitionStore';

// 预加载 PBR 贴图，避免首帧闪烁
useTexture.preload([
  '/assets/textures/floor/color.jpg',
  '/assets/textures/floor/normal.jpg',
  '/assets/textures/floor/roughness.jpg',
  '/assets/textures/wall/color.jpg',
  '/assets/textures/wall/normal.jpg',
  '/assets/textures/wall/roughness.jpg',
  '/assets/textures/metal/color.jpg',
  '/assets/textures/metal/normal.jpg',
  '/assets/textures/metal/roughness.jpg',
  '/assets/textures/metal/metalness.jpg',
]);

export function ExhibitionRoom() {
  const config = useExhibitionStore((s) => s.config);
  const floorSize = config?.scene.floorSize ?? [20, 20];
  const wallHeight = config?.scene.wallHeight ?? 4;

  const halfWidth = floorSize[0] / 2;
  const halfDepth = floorSize[1] / 2;

  return (
    <group>
      {/* ==================== 大理石地板 ==================== */}
      <MarbleFloor size={floorSize} />

      {/* ==================== 墙壁结构 ==================== */}
      {/* 后墙 */}
      <TechWall position={[0, wallHeight / 2, -halfDepth]} rotation={[0, 0, 0]} width={floorSize[0]} height={wallHeight} />
      
      {/* 前墙 - 带入口 */}
      <TechWall position={[-halfWidth / 2 - 1.5, wallHeight / 2, halfDepth]} rotation={[0, Math.PI, 0]} width={halfWidth - 3} height={wallHeight} />
      <TechWall position={[halfWidth / 2 + 1.5, wallHeight / 2, halfDepth]} rotation={[0, Math.PI, 0]} width={halfWidth - 3} height={wallHeight} />
      {/* 入口横梁 */}
      <TechBeam position={[0, wallHeight - 0.3, halfDepth]} width={3} />
      
      {/* 左墙 */}
      <TechWall position={[-halfWidth, wallHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]} width={floorSize[1]} height={wallHeight} />
      
      {/* 右墙 */}
      <TechWall position={[halfWidth, wallHeight / 2, 0]} rotation={[0, -Math.PI / 2, 0]} width={floorSize[1]} height={wallHeight} />

      {/* ==================== 柱子 ==================== */}
      <TechPillar position={[-halfWidth + 0.5, wallHeight / 2, -halfDepth + 0.5]} height={wallHeight} />
      <TechPillar position={[halfWidth - 0.5, wallHeight / 2, -halfDepth + 0.5]} height={wallHeight} />
      <TechPillar position={[-halfWidth + 0.5, wallHeight / 2, halfDepth - 0.5]} height={wallHeight} />
      <TechPillar position={[halfWidth - 0.5, wallHeight / 2, halfDepth - 0.5]} height={wallHeight} />

      {/* ==================== 科技屋顶 ==================== */}
      <TechCeiling position={[0, wallHeight, 0]} size={floorSize} />

      {/* ==================== P0: 接待台 ==================== */}
      <ReceptionDesk position={[0, 0, halfDepth - 2]} />

      {/* ==================== P0: 品牌背景墙 ==================== */}
      <BrandWall position={[0, wallHeight / 2, -halfDepth + 0.2]} width={floorSize[0] - 4} height={wallHeight - 0.5} />

      {/* ==================== P0: 悬浮数据球 + 能量环 ==================== */}
      <FloatingDataSphere position={[0, 2.5, 0]} />

      {/* ==================== P1: 悬浮光柱 ==================== */}
      <FloatingPillar position={[-3, 0, -2]} />
      <FloatingPillar position={[3, 0, -2]} />
      <FloatingPillar position={[-3, 0, 2]} />
      <FloatingPillar position={[3, 0, 2]} />

      {/* ==================== P1: 数据大屏 ==================== */}
      <DataScreen position={[0, 2, -halfDepth + 0.5]} />

      {/* ==================== P2: 悬浮装饰球 ==================== */}
      <FloatingOrb position={[-5, 3, -4]} scale={0.3} />
      <FloatingOrb position={[5, 3.5, -3]} scale={0.25} />
      <FloatingOrb position={[-4, 2.8, 3]} scale={0.35} />
      <FloatingOrb position={[4, 3.2, 4]} scale={0.2} />
      <FloatingOrb position={[0, 3.8, -5]} scale={0.15} />
      <FloatingOrb position={[-6, 2.5, 0]} scale={0.28} />

      {/* ==================== P2: 信息导览牌 ==================== */}
      <InfoBoard position={[-halfWidth + 1.5, 1.2, -halfDepth + 1.5]} rotation={[0, Math.PI / 4, 0]} />
      <InfoBoard position={[halfWidth - 1.5, 1.2, -halfDepth + 1.5]} rotation={[0, -Math.PI / 4, 0]} />
      <InfoBoard position={[-halfWidth + 1.5, 1.2, halfDepth - 1.5]} rotation={[0, Math.PI * 3 / 4, 0]} />
      <InfoBoard position={[halfWidth - 1.5, 1.2, halfDepth - 1.5]} rotation={[0, -Math.PI * 3 / 4, 0]} />

      {/* ==================== P3: 地面光圈 ==================== */}
      <GroundCircle position={[0, 0.02, 0]} radius={2} />
      <GroundCircle position={[-3, 0.02, 0]} radius={1} />
      <GroundCircle position={[3, 0.02, 0]} radius={1} />
      <GroundCircle position={[0, 0.02, -3]} radius={1} />
      <GroundCircle position={[0, 0.02, 3]} radius={1} />

      {/* ==================== 展位 ==================== */}
      <ExhibitBooth position={[-6, 0, -8.5]} />
      <ExhibitBooth position={[0, 0, -8.5]} />
      <ExhibitBooth position={[6, 0, -8.5]} />
      <ExhibitBooth position={[0, 0, 8.5]} />
    </group>
  );
}

// ==================== 地板组件（PBR 奶白大理石，低反光）====================
function MarbleFloor({ size }: { size: [number, number] }) {
  const [colorMap, normalMap, roughnessMap] = useTexture([
    '/assets/textures/floor/color.jpg',
    '/assets/textures/floor/normal.jpg',
    '/assets/textures/floor/roughness.jpg',
  ]);

  useMemo(() => {
    colorMap.colorSpace = THREE.SRGBColorSpace;
    for (const t of [colorMap, normalMap, roughnessMap]) {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(6, 6);
    }
  }, [colorMap, normalMap, roughnessMap]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={size} />
      {/* 奶白 color 叠加校正 + roughness≥0.7 + metalness=0 + 低 envMap 反射，避免刺眼 */}
      <meshStandardMaterial
        map={colorMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        color="#f7f3ea"
        roughness={0.82}
        metalness={0}
        envMapIntensity={0.35}
      />
    </mesh>
  );
}

// ==================== 墙面组件（PBR 白色石膏漆）====================
function TechWall({ position, rotation, width, height }: { position: [number, number, number]; rotation: [number, number, number]; width: number; height: number }) {
  const [colorMap, normalMap, roughnessMap] = useTexture([
    '/assets/textures/wall/color.jpg',
    '/assets/textures/wall/normal.jpg',
    '/assets/textures/wall/roughness.jpg',
  ]);

  // 多个墙面实例共享同一贴图对象；用固定 repeat（幂等设置，实例间不冲突）。
  // 石膏材质较均匀，纹理密度差异不明显。
  useMemo(() => {
    colorMap.colorSpace = THREE.SRGBColorSpace;
    for (const t of [colorMap, normalMap, roughnessMap]) {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(5, 2);
    }
  }, [colorMap, normalMap, roughnessMap]);

  return (
    <group position={position} rotation={rotation}>
      <mesh receiveShadow>
        <boxGeometry args={[width, height, 0.3]} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          roughnessMap={roughnessMap}
          color="#f4f6f8"
          roughness={0.9}
          metalness={0}
          envMapIntensity={0.4}
        />
      </mesh>
      <mesh position={[0, 0, 0.16]}>
        <boxGeometry args={[width * 0.95, height * 0.4, 0.02]} />
        <meshStandardMaterial color="#1e88e5" roughness={0.2} metalness={0.6} />
      </mesh>
      <mesh position={[0, height * 0.35, 0.16]}>
        <boxGeometry args={[width * 0.95, 0.15, 0.02]} />
        <meshStandardMaterial color="#e3f2fd" roughness={0.2} />
      </mesh>
      <mesh position={[0, -height * 0.45, 0.1]}>
        <boxGeometry args={[width, 0.15, 0.15]} />
        <meshStandardMaterial color="#263238" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, height * 0.42, 0.17]}>
        <boxGeometry args={[width * 0.9, 0.03, 0.01]} />
        <meshBasicMaterial color="#42a5f5" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 0, 0.17]}>
        <boxGeometry args={[width * 0.9, 0.02, 0.01]} />
        <meshBasicMaterial color="#64b5f6" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function TechBeam({ position, width }: { position: [number, number, number]; width: number }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[width, 0.6, 0.3]} />
        <meshStandardMaterial color="#f0f4f8" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0, 0.16]}>
        <boxGeometry args={[width * 0.9, 0.1, 0.02]} />
        <meshStandardMaterial color="#1e88e5" roughness={0.2} metalness={0.6} />
      </mesh>
    </group>
  );
}

// ==================== 柱子组件（PBR 金属）====================
function TechPillar({ position, height }: { position: [number, number, number]; height: number }) {
  const [colorMap, normalMap, roughnessMap, metalnessMap] = useTexture([
    '/assets/textures/metal/color.jpg',
    '/assets/textures/metal/normal.jpg',
    '/assets/textures/metal/roughness.jpg',
    '/assets/textures/metal/metalness.jpg',
  ]);

  useMemo(() => {
    colorMap.colorSpace = THREE.SRGBColorSpace;
    for (const t of [colorMap, normalMap, roughnessMap, metalnessMap]) {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(1, 3);
    }
  }, [colorMap, normalMap, roughnessMap, metalnessMap]);

  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.5, height, 0.5]} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          roughnessMap={roughnessMap}
          metalnessMap={metalnessMap}
          roughness={0.6}
          metalness={1}
          envMapIntensity={0.7}
        />
      </mesh>
      <mesh position={[0, height / 2 - 0.1, 0]}>
        <boxGeometry args={[0.55, 0.2, 0.55]} />
        <meshStandardMaterial color="#1e88e5" roughness={0.2} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.52, 0.15, 0.52]} />
        <meshStandardMaterial color="#42a5f5" roughness={0.2} metalness={0.5} />
      </mesh>
      <mesh position={[0, -height / 2 + 0.1, 0]}>
        <boxGeometry args={[0.55, 0.2, 0.55]} />
        <meshStandardMaterial color="#1e88e5" roughness={0.2} metalness={0.6} />
      </mesh>
    </group>
  );
}

// ==================== 屋顶组件 ====================
function TechCeiling({ position, size }: { position: [number, number, number]; size: [number, number] }) {
  return (
    <group position={position}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={size} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.1} />
      </mesh>
      {[-6, -3, 0, 3, 6].map((z) => (
        <mesh key={`ch-${z}`} position={[0, -0.02, z]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[size[0] - 2, 0.15]} />
          <meshStandardMaterial color="#1e88e5" roughness={0.2} metalness={0.6} />
        </mesh>
      ))}
      {[-8, -4, 0, 4, 8].map((x) => (
        <mesh key={`cv-${x}`} position={[x, -0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.1, size[1] - 2]} />
          <meshStandardMaterial color="#42a5f5" roughness={0.2} metalness={0.5} />
        </mesh>
      ))}
      {[-4, 0, 4].map((x) => (
        <group key={`light-${x}`}>
          <CeilingLightFixture position={[x, -0.05, -3]} />
          <CeilingLightFixture position={[x, -0.05, 0]} />
          <CeilingLightFixture position={[x, -0.05, 3]} />
        </group>
      ))}
    </group>
  );
}

function CeilingLightFixture({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.8, 0.05, 0.8]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[0.7, 0.08, 0.7]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.95} />
      </mesh>
    </group>
  );
}

// ==================== P0: 接待台 ====================
function ReceptionDesk({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  return (
    <group position={position} ref={groupRef}>
      {/* 台面主体 */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[6, 0.15, 1.2]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.1} metalness={0.8} />
      </mesh>
      
      {/* 台身 */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[5.8, 0.5, 1]} />
        <meshStandardMaterial color="#f0f4f8" roughness={0.3} metalness={0.2} />
      </mesh>
      
      {/* 蓝色装饰条 */}
      <mesh position={[0, 0.55, 0.6]}>
        <boxGeometry args={[6, 0.05, 0.02]} />
        <meshBasicMaterial color="#1e88e5" transparent opacity={0.9} />
      </mesh>
      
      {/* 底部发光 */}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[6.1, 0.02, 1.3]} />
        <meshBasicMaterial color="#42a5f5" transparent opacity={0.5} />
      </mesh>
      
      {/* Logo 文字 */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[3, 0.4, 0.05]} />
        <meshStandardMaterial color="#1e88e5" roughness={0.2} metalness={0.6} />
      </mesh>
    </group>
  );
}

// ==================== P0: 品牌背景墙 ====================
function BrandWall({ position, width, height }: { position: [number, number, number]; width: number; height: number }) {
  return (
    <group position={position}>
      {/* 背景板 */}
      <mesh>
        <boxGeometry args={[width, height, 0.2]} />
        <meshStandardMaterial color="#0d47a1" roughness={0.2} metalness={0.5} />
      </mesh>
      
      {/* 装饰边框 */}
      <mesh position={[0, 0, 0.11]}>
        <boxGeometry args={[width + 0.2, height + 0.2, 0.02]} />
        <meshBasicMaterial color="#42a5f5" transparent opacity={0.6} />
      </mesh>
      
      {/* 中心装饰 */}
      <mesh position={[0, 0, 0.12]}>
        <boxGeometry args={[width * 0.6, height * 0.6, 0.03]} />
        <meshStandardMaterial color="#1565c0" roughness={0.1} metalness={0.8} />
      </mesh>
      
      {/* 发光文字区域 */}
      <mesh position={[0, 0.2, 0.13]}>
        <boxGeometry args={[4, 0.6, 0.02]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
      
      <mesh position={[0, -0.3, 0.13]}>
        <boxGeometry args={[6, 0.4, 0.02]} />
        <meshBasicMaterial color="#90caf9" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

// ==================== P0: 悬浮数据球 ====================
function FloatingDataSphere({ position }: { position: [number, number, number] }) {
  const sphereRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    
    // 数据球上下浮动
    if (sphereRef.current) {
      sphereRef.current.position.y = Math.sin(t * 0.5) * 0.3;
      sphereRef.current.rotation.y = t * 0.2;
    }
    
    // 能量环旋转
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.3;
      ring1Ref.current.rotation.z = t * 0.2;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = t * 0.4;
      ring2Ref.current.rotation.x = t * 0.1;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = t * 0.35;
      ring3Ref.current.rotation.y = t * 0.25;
    }
  });

  return (
    <group position={position}>
      {/* 数据球 */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial 
          color="#1e88e5" 
          transparent 
          opacity={0.6} 
          roughness={0.1} 
          metalness={0.8}
          emissive="#1565c0"
          emissiveIntensity={0.3}
        />
      </mesh>
      
      {/* 内核 */}
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshBasicMaterial color="#42a5f5" transparent opacity={0.8} />
      </mesh>
      
      {/* 能量环 1 */}
      <group ref={ring1Ref}>
        <mesh>
          <torusGeometry args={[1.2, 0.05, 16, 100]} />
          <meshBasicMaterial color="#64b5f6" transparent opacity={0.8} />
        </mesh>
      </group>
      
      {/* 能量环 2 */}
      <group ref={ring2Ref}>
        <mesh>
          <torusGeometry args={[1.5, 0.04, 16, 100]} />
          <meshBasicMaterial color="#90caf9" transparent opacity={0.6} />
        </mesh>
      </group>
      
      {/* 能量环 3 */}
      <group ref={ring3Ref}>
        <mesh>
          <torusGeometry args={[1.8, 0.03, 16, 100]} />
          <meshBasicMaterial color="#bbdefb" transparent opacity={0.4} />
        </mesh>
      </group>
      
      {/* 光晕效果 */}
      <pointLight color="#42a5f5" intensity={2} distance={5} />
    </group>
  );
}

// ==================== P1: 悬浮光柱 ====================
function FloatingPillar({ position }: { position: [number, number, number] }) {
  const particlesRef = useRef<THREE.Points>(null);
  
  useFrame(() => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        let y = positions.getY(i);
        y += 0.02;
        if (y > 4) y = 0;
        positions.setY(i, y);
      }
      positions.needsUpdate = true;
    }
  });

  return (
    <group position={position}>
      {/* 光柱基座 */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 0.1, 16]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* 光柱主体 */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 4, 8]} />
        <meshBasicMaterial color="#42a5f5" transparent opacity={0.3} />
      </mesh>
      
      {/* 上升粒子效果 */}
      <points ref={particlesRef} position={[0, 0, 0]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={20}
            array={new Float32Array(
              Array.from({ length: 60 }, (_, i) => {
                const angle = (i % 4) * Math.PI / 2;
                const r = 0.15;
                return [Math.cos(angle) * r, Math.random() * 4, Math.sin(angle) * r];
              }).flat()
            )}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color="#64b5f6" size={0.05} transparent opacity={0.8} />
      </points>
      
      {/* 顶部发光 */}
      <pointLight position={[0, 4, 0]} color="#42a5f5" intensity={1} distance={3} />
    </group>
  );
}

// ==================== P1: 数据大屏 ====================
function DataScreen({ position }: { position: [number, number, number] }) {
  const screenRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (screenRef.current) {
      (screenRef.current.material as THREE.MeshBasicMaterial).opacity = 0.7 + Math.sin(clock.getElapsedTime()) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* 屏幕边框 */}
      <mesh>
        <boxGeometry args={[5, 2.5, 0.15]} />
        <meshStandardMaterial color="#263238" roughness={0.2} metalness={0.8} />
      </mesh>
      
      {/* 屏幕 */}
      <mesh ref={screenRef} position={[0, 0, 0.08]}>
        <planeGeometry args={[4.8, 2.3]} />
        <meshBasicMaterial color="#0d47a1" transparent opacity={0.8} />
      </mesh>
      
      {/* 屏幕发光边 */}
      <mesh position={[0, 0, 0.09]}>
        <boxGeometry args={[4.85, 2.35, 0.01]} />
        <meshBasicMaterial color="#42a5f5" transparent opacity={0.4} />
      </mesh>
      
      {/* 底部支架 */}
      <mesh position={[0, -1.5, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#37474f" roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  );
}

// ==================== P2: 悬浮装饰球 ====================
function FloatingOrb({ position, scale = 0.3 }: { position: [number, number, number]; scale?: number }) {
  const orbRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (orbRef.current) {
      const t = clock.getElapsedTime();
      orbRef.current.position.y = Math.sin(t * 0.5 + position[0]) * 0.2;
      orbRef.current.rotation.x = t * 0.3;
      orbRef.current.rotation.z = t * 0.2;
    }
  });

  return (
    <mesh ref={orbRef} position={position} scale={scale}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial 
        color="#42a5f5" 
        transparent 
        opacity={0.5} 
        roughness={0.1} 
        metalness={0.9}
        emissive="#1e88e5"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

// ==================== P2: 信息导览牌 ====================
function InfoBoard({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* 支架 */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshStandardMaterial color="#bdbdbd" roughness={0.3} metalness={0.7} />
      </mesh>
      
      {/* 牌子 */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[0.8, 0.6, 0.05]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.3} metalness={0.2} />
      </mesh>
      
      {/* 蓝色顶部 */}
      <mesh position={[0, 1.12, 0]}>
        <boxGeometry args={[0.8, 0.05, 0.06]} />
        <meshStandardMaterial color="#1e88e5" roughness={0.2} metalness={0.6} />
      </mesh>
    </group>
  );
}

// ==================== P3: 地面光圈 ====================
function GroundCircle({ position, radius }: { position: [number, number, number]; radius: number }) {
  const circleRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (circleRef.current) {
      (circleRef.current.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(Date.now() * 0.001) * 0.1;
    }
  });

  return (
    <mesh ref={circleRef} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.05, radius, 64]} />
      <meshBasicMaterial color="#42a5f5" transparent opacity={0.4} />
    </mesh>
  );
}

// ==================== 展位组件 ====================
function ExhibitBooth({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[3.5, 0.2, 2.5]} />
        <meshStandardMaterial color="#f0f4f8" roughness={0.2} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[3.55, 0.03, 2.55]} />
        <meshStandardMaterial color="#1e88e5" roughness={0.2} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.01, 0]}>
        <boxGeometry args={[3.6, 0.02, 2.6]} />
        <meshBasicMaterial color="#42a5f5" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
