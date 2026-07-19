import { useState } from 'react';
import { Html } from '@react-three/drei';
import type { ExhibitConfig } from '../../types/exhibition';
import { useExhibition } from '../../store/useExhibition';

interface DocumentExhibitProps {
  config: ExhibitConfig;
}

export function DocumentExhibit({ config }: DocumentExhibitProps) {
  const [hovered, setHovered] = useState(false);
  const selectExhibit = useExhibition((s) => s.selectExhibit);

  return (
    <group position={config.position}>
      {/* 展柜底座 */}
      <mesh position={[0, -0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.6, 1]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* 玻璃罩 */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.3, 1, 0.9]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.1}
          roughness={0}
          metalness={0}
          transmission={0.9}
          thickness={0.05}
        />
      </mesh>

      {/* 文档 */}
      <mesh
        position={[0, 0.2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => selectExhibit(config)}
      >
        <planeGeometry args={[1, 0.7]} />
        <meshStandardMaterial
          color={hovered ? '#4488ff' : '#f0f0f0'}
          roughness={0.8}
          emissive={hovered ? '#2244aa' : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>

      {/* 标题 */}
      <Html position={[0, -0.8, 0.6]} center>
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '4px',
          padding: '4px 12px',
          color: 'white',
          fontSize: '12px',
          textAlign: 'center',
          whiteSpace: 'nowrap'
        }}>
          {config.title}
        </div>
      </Html>

      {/* Hover 提示 */}
      {hovered && (
        <Html position={[0, 1.5, 0]} center distanceFactor={6}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            padding: '8px 16px',
            color: 'white',
            fontSize: '14px'
          }}>
            <div style={{ fontWeight: 'bold', color: '#93c5fd' }}>{config.title}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{config.description}</div>
          </div>
        </Html>
      )}
    </group>
  );
}
