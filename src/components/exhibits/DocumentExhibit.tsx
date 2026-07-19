import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import type { ExhibitItem } from '../../types/exhibit';

interface DocumentExhibitProps {
  exhibit: ExhibitItem;
  onClick?: (e: any) => void;
  onPointerOver?: (e: any) => void;
  onPointerOut?: () => void;
}

export function DocumentExhibit({ exhibit, onClick, onPointerOver, onPointerOut }: DocumentExhibitProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const scale = exhibit.scale ?? 1;

  // 设置 exhibitId 到 userData
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.userData.exhibitId = exhibit.id;
    }
  }, [exhibit.id]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const target = isHovered ? 1.08 : 1.0;
    groupRef.current.scale.lerp(
      new THREE.Vector3(target * scale, target * scale, target * scale),
      delta * 8
    );
  });

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(exhibit);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
        onPointerOver?.(exhibit);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setIsHovered(false);
        onPointerOut?.();
        document.body.style.cursor = 'default';
      }}
    >
      {/* 底座 */}
      <mesh position={[0, -1, 0]}>
        <boxGeometry args={[1.8, 0.15, 0.6]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* 底座发光边 */}
      <mesh position={[0, -0.92, 0]}>
        <boxGeometry args={[1.85, 0.02, 0.65]} />
        <meshBasicMaterial color="#ff9800" transparent opacity={0.6} />
      </mesh>

      {/* 文档主体 */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.4, 2, 0.08]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
      </mesh>

      {/* 发光边框 */}
      <mesh position={[0, 0, 0.045]}>
        <boxGeometry args={[1.45, 2.05, 0.01]} />
        <meshBasicMaterial 
          color={isHovered ? '#ffc107' : '#ff9800'} 
          transparent 
          opacity={isHovered ? 0.8 : 0.3} 
        />
      </mesh>

      {/* 文档线条 */}
      {[0.7, 0.5, 0.3, 0.1, -0.1, -0.3].map((y, i) => (
        <mesh key={i} position={[0, y, 0.05]}>
          <boxGeometry args={[1, 0.04, 0.01]} />
          <meshStandardMaterial color="#cccccc" />
        </mesh>
      ))}

      {/* 文档图标 */}
      <Text
        position={[0, 0.8, 0.06]}
        fontSize={0.25}
        color="#ff9800"
        anchorX="center"
        anchorY="middle"
      >
        📄
      </Text>

      {/* 文档标识 */}
      <Text
        position={[0, -0.7, 0.06]}
        fontSize={0.12}
        color="#ff9800"
        anchorX="center"
        anchorY="middle"
      >
        DOCUMENT
      </Text>
    </group>
  );
}
