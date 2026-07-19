import { useRef, useState } from 'react';
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
  const meshRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const scale = exhibit.scale ?? 1;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const target = isHovered ? 1.08 : 1.0;
    meshRef.current.scale.lerp(
      new THREE.Vector3(target * scale, target * scale, target * scale),
      delta * 8
    );
  });

  return (
    <group>
      {/* Document base */}
      <mesh position={[0, -0.8, 0]}>
        <boxGeometry args={[1.6, 0.1, 0.4]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.6} roughness={0.3} />
      </mesh>

      {/* Document */}
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
        <boxGeometry args={[1.4, 2, 0.05]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.8} />
      </mesh>

      {/* Document lines */}
      {[0.6, 0.4, 0.2, 0, -0.2, -0.4].map((y, i) => (
        <mesh key={i} position={[0, y, 0.03]}>
          <boxGeometry args={[1, 0.05, 0.01]} />
          <meshStandardMaterial color="#cccccc" />
        </mesh>
      ))}

      {/* Document icon */}
      <Text
        position={[0, 0.7, 0.03]}
        fontSize={0.3}
        color="#ff9800"
        anchorX="center"
        anchorY="middle"
      >
        📄
      </Text>
    </group>
  );
}
