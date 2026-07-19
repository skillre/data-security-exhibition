import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import type { ExhibitItem } from '../../types/exhibit';

interface VideoExhibitProps {
  exhibit: ExhibitItem;
  onClick?: (e: any) => void;
  onPointerOver?: (e: any) => void;
  onPointerOut?: () => void;
}

export function VideoExhibit({ exhibit, onClick, onPointerOver, onPointerOut }: VideoExhibitProps) {
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
    const target = isHovered ? 1.05 : 1.0;
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
      {/* 外框 */}
      <mesh>
        <boxGeometry args={[3.4, 2, 0.15]} />
        <meshStandardMaterial color="#0a0a2a" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* 发光边框 */}
      <mesh position={[0, 0, 0.08]}>
        <boxGeometry args={[3.45, 2.05, 0.01]} />
        <meshBasicMaterial 
          color={isHovered ? '#ff4081' : '#e91e63'} 
          transparent 
          opacity={isHovered ? 0.8 : 0.4} 
        />
      </mesh>

      {/* 屏幕 */}
      <mesh position={[0, 0, 0.09]}>
        <planeGeometry args={[3.2, 1.8]} />
        <meshStandardMaterial color="#1a0a2a" />
      </mesh>

      {/* 播放按钮背景 */}
      <mesh position={[0, 0, 0.1]}>
        <circleGeometry args={[0.4, 32]} />
        <meshBasicMaterial color="#e91e63" transparent opacity={0.9} />
      </mesh>

      {/* 播放图标 */}
      <Text
        position={[0.05, 0, 0.11]}
        fontSize={0.35}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        ▶
      </Text>

      {/* 底部发光条 */}
      <mesh position={[0, -1.05, 0.1]}>
        <boxGeometry args={[3.2, 0.05, 0.02]} />
        <meshBasicMaterial color="#e91e63" transparent opacity={0.8} />
      </mesh>

      {/* 视频标识 */}
      <Text
        position={[1.4, 0.8, 0.1]}
        fontSize={0.15}
        color="#e91e63"
        anchorX="center"
        anchorY="middle"
      >
        VIDEO
      </Text>
    </group>
  );
}
