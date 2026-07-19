import { useExhibitionStore } from '../../store/useExhibitionStore';

export function ExhibitionRoom() {
  const config = useExhibitionStore((s) => s.config);
  const floorSize = config?.scene.floorSize ?? [20, 20];
  const wallHeight = config?.scene.wallHeight ?? 4;

  const halfWidth = floorSize[0] / 2;
  const halfDepth = floorSize[1] / 2;

  return (
    <group>
      {/* ==================== 地板 ==================== */}
      {/* 主地板 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={floorSize} />
        <meshStandardMaterial color="#0c0c1d" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* 地板发光网格 */}
      {Array.from({ length: 21 }, (_, i) => i - 10).map((x) => (
        <mesh key={`gv-${x}`} position={[x, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.02, floorSize[1]]} />
          <meshBasicMaterial color="#1a3a5a" transparent opacity={0.4} />
        </mesh>
      ))}
      {Array.from({ length: 21 }, (_, i) => i - 10).map((z) => (
        <mesh key={`gh-${z}`} position={[0, 0.005, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[floorSize[0], 0.02]} />
          <meshBasicMaterial color="#1a3a5a" transparent opacity={0.4} />
        </mesh>
      ))}

      {/* 地板中心十字发光 */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.1, floorSize[1]]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[floorSize[0], 0.1]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.3} />
      </mesh>

      {/* ==================== 墙壁结构 ==================== */}
      {/* 后墙 - 主墙 */}
      <WallPanel position={[0, wallHeight / 2, -halfDepth]} rotation={[0, 0, 0]} width={floorSize[0]} height={wallHeight} />
      
      {/* 前墙 - 入口墙（带开口） */}
      <WallPanel position={[-halfWidth / 2 - 1.5, wallHeight / 2, halfDepth]} rotation={[0, Math.PI, 0]} width={halfWidth - 3} height={wallHeight} />
      <WallPanel position={[halfWidth / 2 + 1.5, wallHeight / 2, halfDepth]} rotation={[0, Math.PI, 0]} width={halfWidth - 3} height={wallHeight} />
      {/* 入口上方横梁 */}
      <mesh position={[0, wallHeight - 0.3, halfDepth]}>
        <boxGeometry args={[3, 0.6, 0.3]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* 左墙 */}
      <WallPanel position={[-halfWidth, wallHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]} width={floorSize[1]} height={wallHeight} />
      
      {/* 右墙 */}
      <WallPanel position={[halfWidth, wallHeight / 2, 0]} rotation={[0, -Math.PI / 2, 0]} width={floorSize[1]} height={wallHeight} />

      {/* ==================== 墙面装饰条 ==================== */}
      {/* 后墙水平装饰条 */}
      <WallAccent position={[0, 1, -halfDepth + 0.02]} width={floorSize[0] - 2} />
      <WallAccent position={[0, 2.5, -halfDepth + 0.02]} width={floorSize[0] - 2} />
      
      {/* 左墙水平装饰条 */}
      <WallAccent position={[-halfWidth + 0.02, 1, 0]} rotation={[0, Math.PI / 2, 0]} width={floorSize[1] - 2} />
      <WallAccent position={[-halfWidth + 0.02, 2.5, 0]} rotation={[0, Math.PI / 2, 0]} width={floorSize[1] - 2} />
      
      {/* 右墙水平装饰条 */}
      <WallAccent position={[halfWidth - 0.02, 1, 0]} rotation={[0, -Math.PI / 2, 0]} width={floorSize[1] - 2} />
      <WallAccent position={[halfWidth - 0.02, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]} width={floorSize[1] - 2} />

      {/* ==================== 柱子 ==================== */}
      {/* 四角柱子 */}
      <Pillar position={[-halfWidth + 0.5, wallHeight / 2, -halfDepth + 0.5]} height={wallHeight} />
      <Pillar position={[halfWidth - 0.5, wallHeight / 2, -halfDepth + 0.5]} height={wallHeight} />
      <Pillar position={[-halfWidth + 0.5, wallHeight / 2, halfDepth - 0.5]} height={wallHeight} />
      <Pillar position={[halfWidth - 0.5, wallHeight / 2, halfDepth - 0.5]} height={wallHeight} />

      {/* ==================== 屋顶 ==================== */}
      {/* 主屋顶 */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, wallHeight, 0]}>
        <planeGeometry args={floorSize} />
        <meshStandardMaterial color="#080818" roughness={0.8} metalness={0.4} />
      </mesh>

      {/* 屋顶灯管 */}
      {[-6, -3, 0, 3, 6].map((x) => (
        <CeilingLight key={`cl-${x}`} position={[x, wallHeight - 0.05, 0]} length={floorSize[1] - 4} />
      ))}

      {/* 屋顶通风口 */}
      <Vent position={[-4, wallHeight - 0.1, -4]} />
      <Vent position={[4, wallHeight - 0.1, -4]} />
      <Vent position={[-4, wallHeight - 0.1, 4]} />
      <Vent position={[4, wallHeight - 0.1, 4]} />

      {/* 屋顶边缘装饰 */}
      <mesh position={[0, wallHeight - 0.02, -halfDepth + 0.2]}>
        <boxGeometry args={[floorSize[0] - 1, 0.04, 0.4]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0, wallHeight - 0.02, halfDepth - 0.2]}>
        <boxGeometry args={[floorSize[0] - 1, 0.04, 0.4]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.6} />
      </mesh>
      <mesh position={[-halfWidth + 0.2, wallHeight - 0.02, 0]}>
        <boxGeometry args={[0.4, 0.04, floorSize[1] - 1]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.6} />
      </mesh>
      <mesh position={[halfWidth - 0.2, wallHeight - 0.02, 0]}>
        <boxGeometry args={[0.4, 0.04, floorSize[1] - 1]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.6} />
      </mesh>

      {/* ==================== 展位 ==================== */}
      <ExhibitBooth position={[-6, 0, -8.5]} />
      <ExhibitBooth position={[0, 0, -8.5]} />
      <ExhibitBooth position={[6, 0, -8.5]} />
      <ExhibitBooth position={[0, 0, 8.5]} />
    </group>
  );
}

// 墙面板组件
function WallPanel({ position, rotation, width, height }: { position: [number, number, number]; rotation: [number, number, number]; width: number; height: number }) {
  return (
    <group position={position} rotation={rotation}>
      {/* 主墙面 */}
      <mesh receiveShadow>
        <boxGeometry args={[width, height, 0.3]} />
        <meshStandardMaterial color="#12122a" roughness={0.4} metalness={0.6} />
      </mesh>
      
      {/* 墙面内凹面板 */}
      <mesh position={[0, 0, 0.16]}>
        <boxGeometry args={[width - 0.5, height - 0.5, 0.02]} />
        <meshStandardMaterial color="#0a0a20" roughness={0.3} metalness={0.7} />
      </mesh>
    </group>
  );
}

// 墙面装饰条
function WallAccent({ position, rotation, width }: { position: [number, number, number]; rotation?: [number, number, number]; width: number }) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[width, 0.08, 0.05]} />
      <meshBasicMaterial color="#00d4ff" transparent opacity={0.5} />
    </mesh>
  );
}

// 柱子组件
function Pillar({ position, height }: { position: [number, number, number]; height: number }) {
  return (
    <group position={position}>
      {/* 柱子主体 */}
      <mesh>
        <boxGeometry args={[0.4, height, 0.4]} />
        <meshStandardMaterial color="#1a1a35" roughness={0.3} metalness={0.8} />
      </mesh>
      
      {/* 柱子顶部发光 */}
      <mesh position={[0, height / 2 - 0.02, 0]}>
        <boxGeometry args={[0.5, 0.04, 0.5]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.8} />
      </mesh>
      
      {/* 柱子底部发光 */}
      <mesh position={[0, -height / 2 + 0.02, 0]}>
        <boxGeometry args={[0.5, 0.04, 0.5]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.8} />
      </mesh>
      
      {/* 柱子中间装饰带 */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.42, 0.1, 0.42]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

// 屋顶灯管
function CeilingLight({ position, length }: { position: [number, number, number]; length: number }) {
  return (
    <group position={position}>
      {/* 灯管外壳 */}
      <mesh>
        <boxGeometry args={[0.15, 0.05, length]} />
        <meshStandardMaterial color="#2a2a4a" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* 灯管发光 */}
      <mesh position={[0, -0.03, 0]}>
        <boxGeometry args={[0.1, 0.02, length - 0.2]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
      </mesh>
      
      {/* 灯光效果 */}
      <pointLight position={[0, -0.1, 0]} intensity={0.3} distance={5} color="#ffffff" />
    </group>
  );
}

// 通风口
function Vent({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[1, 0.05, 1]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* 通风口格栅 */}
      {[-0.3, -0.1, 0.1, 0.3].map((offset) => (
        <mesh key={offset} position={[offset, 0.03, 0]}>
          <boxGeometry args={[0.05, 0.02, 0.9]} />
          <meshStandardMaterial color="#2a2a4a" />
        </mesh>
      ))}
    </group>
  );
}

// 展位组件
function ExhibitBooth({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* 展位底座 */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[3.5, 0.2, 2.5]} />
        <meshStandardMaterial color="#0f0f25" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* 底座发光边 */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[3.55, 0.02, 2.55]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.6} />
      </mesh>
      
      {/* 底座底部发光 */}
      <mesh position={[0, 0.01, 0]}>
        <boxGeometry args={[3.6, 0.02, 2.6]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
