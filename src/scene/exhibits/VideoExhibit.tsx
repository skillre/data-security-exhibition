import { useState } from 'react';
import { Html } from '@react-three/drei';
import type { ExhibitConfig } from '../../types/exhibition';
import { useExhibition } from '../../store/useExhibition';

interface VideoExhibitProps {
  config: ExhibitConfig;
}

export function VideoExhibit({ config }: VideoExhibitProps) {
  const [hovered, setHovered] = useState(false);
  const selectExhibit = useExhibition((s) => s.selectExhibit);

  return (
    <group position={config.position}>
      {/* 屏幕边框 */}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => selectExhibit(config)}
        castShadow
      >
        <boxGeometry args={[4.2, 2.6, 0.1]} />
        <meshStandardMaterial
          color="#0a0e1a"
          roughness={0.2}
          metalness={0.9}
          emissive={hovered ? '#2244aa' : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>

      {/* 屏幕 */}
      <mesh position={[0, 0, 0.051]}>
        <planeGeometry args={[3.8, 2.2]} />
        <meshStandardMaterial color="#1a2a4a" roughness={0.3} />
      </mesh>

      {/* 播放按钮 */}
      <mesh position={[0, 0, 0.06]}>
        <circleGeometry args={[0.4, 32]} />
        <meshStandardMaterial
          color="#4488ff"
          transparent
          opacity={hovered ? 0.9 : 0.7}
          emissive="#4488ff"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* 标题 */}
      <Html position={[0, -1.6, 0.3]} center>
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '4px',
          padding: '4px 16px',
          color: 'white',
          fontSize: '14px'
        }}>
          <span style={{ color: '#93c5fd', fontWeight: 'bold' }}>{config.title}</span>
          <span style={{ color: '#94a3b8', marginLeft: '8px' }}>点击播放</span>
        </div>
      </Html>

      {/* Hover 提示 */}
      {hovered && (
        <Html position={[0, 1.8, 0.3]} center distanceFactor={8}>
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
