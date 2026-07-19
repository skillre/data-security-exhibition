import { useRef } from 'react';
import * as THREE from 'three';
import { useExhibitionStore } from '../../store/useExhibitionStore';

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
      {/* 中间柱子 */}
      <TechPillar position={[-halfWidth / 2, wallHeight / 2, 0]} height={wallHeight} />
      <TechPillar position={[halfWidth / 2, wallHeight / 2, 0]} height={wallHeight} />

      {/* ==================== 科技屋顶 ==================== */}
      <TechCeiling position={[0, wallHeight, 0]} size={floorSize} />

      {/* ==================== 展位 ==================== */}
      <ExhibitBooth position={[-6, 0, -8.5]} />
      <ExhibitBooth position={[0, 0, -8.5]} />
      <ExhibitBooth position={[6, 0, -8.5]} />
      <ExhibitBooth position={[0, 0, 8.5]} />
    </group>
  );
}

// 大理石地板组件
function MarbleFloor({ size }: { size: [number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // 创建大理石纹理
  const texture = new THREE.TextureLoader().load('data:image/svg+xml,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
      <defs>
        <filter id="marble">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="8" result="noise"/>
          <feColorMatrix type="saturate" values="0" in="noise" result="gray"/>
          <feComponentTransfer in="gray">
            <feFuncR type="linear" slope="0.15" intercept="0.85"/>
            <feFuncG type="linear" slope="0.12" intercept="0.88"/>
            <feFuncB type="linear" slope="0.1" intercept="0.9"/>
          </feComponentTransfer>
        </filter>
      </defs>
      <rect width="512" height="512" fill="#f5f0e8" filter="url(#marble)"/>
      <line x1="0" y1="256" x2="512" y2="256" stroke="#e0d8c8" stroke-width="2" opacity="0.5"/>
      <line x1="256" y1="0" x2="256" y2="512" stroke="#e0d8c8" stroke-width="2" opacity="0.5"/>
    </svg>
  `));
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);

  return (
    <group>
      {/* 主地板 */}
      <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={size} />
        <meshStandardMaterial 
          map={texture}
          color="#f5f0e8"
          roughness={0.1} 
          metalness={0.1}
          envMapIntensity={0.5}
        />
      </mesh>
      
      {/* 反光层 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <planeGeometry args={size} />
        <meshStandardMaterial 
          color="#ffffff"
          transparent
          opacity={0.05}
          roughness={0}
          metalness={1}
        />
      </mesh>
    </group>
  );
}

// 科技墙面组件
function TechWall({ position, rotation, width, height }: { position: [number, number, number]; rotation: [number, number, number]; width: number; height: number }) {
  return (
    <group position={position} rotation={rotation}>
      {/* 主墙面 - 白色 */}
      <mesh receiveShadow>
        <boxGeometry args={[width, height, 0.3]} />
        <meshStandardMaterial color="#f0f4f8" roughness={0.3} metalness={0.1} />
      </mesh>
      
      {/* 科技蓝装饰面板 */}
      <mesh position={[0, 0, 0.16]}>
        <boxGeometry args={[width * 0.95, height * 0.4, 0.02]} />
        <meshStandardMaterial color="#1e88e5" roughness={0.2} metalness={0.6} />
      </mesh>
      
      {/* 顶部白色装饰条 */}
      <mesh position={[0, height * 0.35, 0.16]}>
        <boxGeometry args={[width * 0.95, 0.15, 0.02]} />
        <meshStandardMaterial color="#e3f2fd" roughness={0.2} />
      </mesh>
      
      {/* 底部深色踢脚线 */}
      <mesh position={[0, -height * 0.45, 0.1]}>
        <boxGeometry args={[width, 0.15, 0.15]} />
        <meshStandardMaterial color="#263238" roughness={0.3} metalness={0.5} />
      </mesh>
      
      {/* 蓝色灯带 - 顶部 */}
      <mesh position={[0, height * 0.42, 0.17]}>
        <boxGeometry args={[width * 0.9, 0.03, 0.01]} />
        <meshBasicMaterial color="#42a5f5" transparent opacity={0.8} />
      </mesh>
      
      {/* 蓝色灯带 - 中部 */}
      <mesh position={[0, 0, 0.17]}>
        <boxGeometry args={[width * 0.9, 0.02, 0.01]} />
        <meshBasicMaterial color="#64b5f6" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

// 科技梁
function TechBeam({ position, width }: { position: [number, number, number]; width: number }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[width, 0.6, 0.3]} />
        <meshStandardMaterial color="#f0f4f8" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* 蓝色装饰条 */}
      <mesh position={[0, 0, 0.16]}>
        <boxGeometry args={[width * 0.9, 0.1, 0.02]} />
        <meshStandardMaterial color="#1e88e5" roughness={0.2} metalness={0.6} />
      </mesh>
    </group>
  );
}

// 科技柱子
function TechPillar({ position, height }: { position: [number, number, number]; height: number }) {
  return (
    <group position={position}>
      {/* 柱子主体 - 白色 */}
      <mesh>
        <boxGeometry args={[0.5, height, 0.5]} />
        <meshStandardMaterial color="#f0f4f8" roughness={0.2} metalness={0.2} />
      </mesh>
      
      {/* 蓝色装饰带 - 顶部 */}
      <mesh position={[0, height / 2 - 0.1, 0]}>
        <boxGeometry args={[0.55, 0.2, 0.55]} />
        <meshStandardMaterial color="#1e88e5" roughness={0.2} metalness={0.6} />
      </mesh>
      
      {/* 蓝色装饰带 - 中部 */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.52, 0.15, 0.52]} />
        <meshStandardMaterial color="#42a5f5" roughness={0.2} metalness={0.5} />
      </mesh>
      
      {/* 蓝色装饰带 - 底部 */}
      <mesh position={[0, -height / 2 + 0.1, 0]}>
        <boxGeometry args={[0.55, 0.2, 0.55]} />
        <meshStandardMaterial color="#1e88e5" roughness={0.2} metalness={0.6} />
      </mesh>
    </group>
  );
}

// 科技屋顶
function TechCeiling({ position, size }: { position: [number, number, number]; size: [number, number] }) {
  return (
    <group position={position}>
      {/* 主屋顶 - 白色 */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={size} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.1} />
      </mesh>
      
      {/* 蓝色装饰条 - 横向 */}
      {[-6, -3, 0, 3, 6].map((z) => (
        <mesh key={`ch-${z}`} position={[0, -0.02, z]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[size[0] - 2, 0.15]} />
          <meshStandardMaterial color="#1e88e5" roughness={0.2} metalness={0.6} />
        </mesh>
      ))}
      
      {/* 蓝色装饰条 - 纵向 */}
      {[-8, -4, 0, 4, 8].map((x) => (
        <mesh key={`cv-${x}`} position={[x, -0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.1, size[1] - 2]} />
          <meshStandardMaterial color="#42a5f5" roughness={0.2} metalness={0.5} />
        </mesh>
      ))}
      
      {/* 灯具 - 白色 */}
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

// 灯具组件
function CeilingLightFixture({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* 灯座 */}
      <mesh>
        <boxGeometry args={[0.8, 0.05, 0.8]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* 灯罩 */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[0.7, 0.08, 0.7]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.95} />
      </mesh>
    </group>
  );
}

// 展位组件
function ExhibitBooth({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* 底座 - 白色 */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[3.5, 0.2, 2.5]} />
        <meshStandardMaterial color="#f0f4f8" roughness={0.2} metalness={0.3} />
      </mesh>
      
      {/* 蓝色装饰边 */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[3.55, 0.03, 2.55]} />
        <meshStandardMaterial color="#1e88e5" roughness={0.2} metalness={0.6} />
      </mesh>
      
      {/* 底部蓝色灯带 */}
      <mesh position={[0, 0.01, 0]}>
        <boxGeometry args={[3.6, 0.02, 2.6]} />
        <meshBasicMaterial color="#42a5f5" transparent opacity={0.5} />
      </mesh>
    </group>
  );
}
