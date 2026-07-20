import { useRef } from 'react';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ExhibitLabelProps {
  title: string;
  subtitle?: string;
  icon?: string;
  isHovered?: boolean;
  distanceFactor?: number;
}

export function ExhibitLabel({
  title,
  subtitle,
  icon,
  isHovered = false,
  distanceFactor = 8,
}: ExhibitLabelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const opacityRef = useRef(1);

  // 根据距离计算透明度
  useFrame(({ camera }) => {
    if (!groupRef.current) return;

    // 获取标签世界位置
    const worldPos = new THREE.Vector3();
    groupRef.current.getWorldPosition(worldPos);

    // 计算距离
    const distance = camera.position.distanceTo(worldPos);

    // 距离衰减公式
    let opacity = 1;
    if (distance < 3) {
      opacity = 1; // 近处完全不透明
    } else if (distance < 8) {
      opacity = 1 - (distance - 3) * 0.1; // 3-8m 线性衰减
    } else if (distance < 15) {
      opacity = 0.5 - (distance - 8) * 0.05; // 8-15m 继续衰减
    } else {
      opacity = 0.15; // 远处保持最低可见度
    }

    // 悬停时提高透明度
    if (isHovered) {
      opacity = Math.max(opacity, 0.9);
    }

    opacityRef.current = opacity;
  });

  return (
    <group ref={groupRef}>
      <Html
        position={[0, -1.5, 0]} // 标签下移到展品下方
        center
        distanceFactor={distanceFactor}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          transition: 'opacity 0.3s ease',
        }}
      >
        <div
          style={{
            background: isHovered 
              ? 'rgba(0, 20, 40, 0.9)' 
              : 'rgba(0, 10, 30, 0.75)',
            backdropFilter: 'blur(12px)',
            color: 'white',
            padding: '10px 18px',
            borderRadius: '8px',
            fontSize: '13px',
            fontFamily: '"Noto Sans SC", sans-serif',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            border: isHovered 
              ? '1px solid rgba(79, 195, 247, 0.6)' 
              : '1px solid rgba(79, 195, 247, 0.2)',
            boxShadow: isHovered 
              ? '0 4px 20px rgba(0, 0, 0, 0.5), 0 0 15px rgba(79, 195, 247, 0.3)' 
              : '0 2px 10px rgba(0, 0, 0, 0.3)',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.3s ease',
            opacity: opacityRef.current,
          }}
        >
          {/* 图标 */}
          {icon && (
            <div style={{ 
              fontSize: '18px', 
              marginBottom: '4px',
            }}>
              {icon}
            </div>
          )}
          
          {/* 主标题 */}
          <div style={{ 
            fontWeight: 600, 
            fontSize: '14px',
            color: isHovered ? '#4fc3f7' : '#ffffff',
            marginBottom: subtitle ? '4px' : 0,
          }}>
            {title}
          </div>
          
          {/* 副标题 */}
          {subtitle && (
            <div style={{ 
              fontSize: '11px', 
              color: 'rgba(255, 255, 255, 0.6)',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '4px',
              marginTop: '2px',
            }}>
              {subtitle}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}
