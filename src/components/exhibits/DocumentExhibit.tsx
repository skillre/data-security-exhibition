import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { ExhibitItem } from '../../types/exhibit';

interface DocumentExhibitProps {
  exhibit: ExhibitItem;
  onClick?: (e: THREE.Event) => void;
  onPointerOver?: (e: THREE.Event) => void;
  onPointerOut?: () => void;
}

export function DocumentExhibit({ exhibit, onClick, onPointerOver, onPointerOut }: DocumentExhibitProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const previewTexture = useTexture(exhibit.previewImage || '/assets/images/document-placeholder.png');

  const scale = exhibit.scale ?? 1;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const target = meshRef.current.userData.isHovered ? 1.08 : 1.0;
    meshRef.current.scale.lerp(
      new THREE.Vector3(target * scale, target * scale, target * scale),
      delta * 8
    );
  });

  return (
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
      <planeGeometry args={[1.4, 2.0]} />
      <meshStandardMaterial
        map={previewTexture}
        side={THREE.DoubleSide}
        roughness={0.4}
      />
    </mesh>
  );
}
