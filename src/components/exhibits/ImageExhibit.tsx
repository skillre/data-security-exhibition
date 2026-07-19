import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import type { ExhibitItem } from '../../types/exhibit';

interface ImageExhibitProps {
  exhibit: ExhibitItem;
  onClick?: (e: any) => void;
  onPointerOver?: (e: any) => void;
  onPointerOut?: () => void;
}

export function ImageExhibit({ exhibit, onClick, onPointerOver, onPointerOut }: ImageExhibitProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const scale = exhibit.scale ?? 1;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const target = isHovered ? 1.05 : 1.0;
    meshRef.current.scale.lerp(
      new THREE.Vector3(target * scale, target * scale, target * scale),
      delta * 8
    );
  });

  return (
    <group
      ref={meshRef}
      onClick={onClick}
      onPointerOver={(e) => {
        setIsHovered(true);
        onPointerOver?.(e);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setIsHovered(false);
        onPointerOut?.();
        document.body.style.cursor = 'default';
      }}
    >
      {/* 外框 - 发光边框 */}
      <mesh>
        <boxGeometry args={[2.2, 1.7, 0.15]} />
        <meshStandardMaterial color="#0a0a2a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* 发光边框 */}
      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[2.25, 1.75, 0.01]} />
        <meshBasicMaterial 
          color={isHovered ? '#00ffff' : '#00d4ff'} 
          transparent 
          opacity={isHovered ? 0.8 : 0.4} 
        />
      </mesh>

      {/* 展示区域 */}
      <mesh position={[0, 0, 0.09]}>
        <planeGeometry args={[2, 1.5]} />
        <meshStandardMaterial color="#0d1f3c" />
      </mesh>

      {/* 图片图标 */}
      <Text
        position={[0, 0.1, 0.1]}
        fontSize={0.5}
        color="#4fc3f7"
        anchorX="center"
        anchorY="middle"
      >
        🖼️
      </Text>

      {/* 底部发光条 */}
      <mesh position={[0, -0.9, 0.1]}>
        <boxGeometry args={[2, 0.05, 0.02]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}
