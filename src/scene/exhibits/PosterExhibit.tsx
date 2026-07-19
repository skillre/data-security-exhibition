import { useState } from 'react';
import { Html } from '@react-three/drei';
import type { ExhibitConfig } from '../../types/exhibition';
import { useExhibition } from '../../store/useExhibition';

interface PosterExhibitProps {
  config: ExhibitConfig;
}

export function PosterExhibit({ config }: PosterExhibitProps) {
  const [hovered, setHovered] = useState(false);
  const selectExhibit = useExhibition((s) => s.selectExhibit);

  return (
    <group position={config.position} rotation={config.rotation}>
      {/* 画框 */}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => selectExhibit(config)}
        castShadow
      >
        <boxGeometry args={[2.2, 3, 0.08]} />
        <meshStandardMaterial
          color={hovered ? '#4488ff' : '#1a1a2e'}
          roughness={0.3}
          metalness={0.8}
          emissive={hovered ? '#2244aa' : '#000000'}
          emissiveIntensity={hovered ? 0.5 : 0}
        />
      </mesh>

      {/* 海报画面 */}
      <mesh position={[0, 0, 0.041]}>
        <planeGeometry args={[2, 2.8]} />
        <meshStandardMaterial color="#1a2a4a" roughness={0.5} />
      </mesh>

      {/* 标题牌 */}
      <mesh position={[0, -1.8, 0.05]}>
        <planeGeometry args={[2, 0.4]} />
        <meshStandardMaterial color="#0a0e1a" roughness={0.5} />
      </mesh>

      {/* Hover 提示 */}
      {hovered && (
        <Html position={[0, 2, 0.5]} center distanceFactor={8}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            padding: '8px 16px',
            color: 'white',
            fontSize: '14px',
            whiteSpace: 'nowrap'
          }}>
            <div style={{ fontWeight: 'bold', color: '#93c5fd' }}>{config.title}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>点击查看详情</div>
          </div>
        </Html>
      )}
    </group>
  );
}
