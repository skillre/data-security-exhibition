import { useRef, useState } from 'react';
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
  const meshRef = useRef<THREE.Mesh>(null);
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
    <group>
      {/* Screen frame */}
      <mesh
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
        <boxGeometry args={[3.2, 1.8, 0.1]} />
        <meshStandardMaterial color="#111111" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Screen */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[3, 1.6]} />
        <meshStandardMaterial color="#0a2a4a" />
      </mesh>

      {/* Play button */}
      <mesh position={[0, 0, 0.07]}>
        <circleGeometry args={[0.3, 32]} />
        <meshStandardMaterial color="#4fc3f7" transparent opacity={0.8} />
      </mesh>

      {/* Play icon */}
      <Text
        position={[0, 0, 0.08]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        ▶
      </Text>
    </group>
  );
}
