import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { ExhibitItem } from '../../types/exhibit';

interface ImageExhibitProps {
  exhibit: ExhibitItem;
  onClick?: (e: THREE.Event) => void;
  onPointerOver?: (e: THREE.Event) => void;
  onPointerOut?: () => void;
}

export function ImageExhibit({ exhibit, onClick, onPointerOver, onPointerOut }: ImageExhibitProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(exhibit.mediaSrc);

  const [width, height] = useMemo(() => {
    const aspect = texture.image.width / texture.image.height;
    const maxSize = 2.0;
    if (aspect > 1) {
      return [maxSize, maxSize / aspect];
    }
    return [maxSize * aspect, maxSize];
  }, [texture]);

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
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial
        map={texture}
        side={THREE.DoubleSide}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  );
}
