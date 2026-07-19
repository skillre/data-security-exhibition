import { useRef } from 'react';
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
  const meshRef = useRef<THREE.Mesh>(null);
  const scale = exhibit.scale ?? 1;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const target = meshRef.current.userData.isHovered ? 1.05 : 1.0;
    meshRef.current.scale.lerp(
      new THREE.Vector3(target * scale, target * scale, target * scale),
      delta * 8
    );
  });

  return (
    <group>
      {/* Frame */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={(e) => {
          if (meshRef.current) meshRef.current.userData.isHovered = true;
          onPointerOver?.(e);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          if (meshRef.current) meshRef.current.userData.isHovered = false;
          onPointerOut?.();
          document.body.style.cursor = 'default';
        }}
      >
        <boxGeometry args={[2, 1.5, 0.1]} />
        <meshStandardMaterial color="#1e3a5f" metalness={0.3} roughness={0.4} />
      </mesh>

      {/* Image placeholder */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[1.8, 1.3]} />
        <meshStandardMaterial color="#2a5a8f" />
      </mesh>

      {/* Category icon */}
      <Text
        position={[0, 0, 0.07]}
        fontSize={0.5}
        color="#4fc3f7"
        anchorX="center"
        anchorY="middle"
      >
        🖼️
      </Text>
    </group>
  );
}
