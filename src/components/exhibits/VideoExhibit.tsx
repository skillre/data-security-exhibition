import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ExhibitItem } from '../../types/exhibit';

interface VideoExhibitProps {
  exhibit: ExhibitItem;
  onClick?: (e: THREE.Event) => void;
  onPointerOver?: (e: THREE.Event) => void;
  onPointerOut?: () => void;
}

export function VideoExhibit({ exhibit, onClick, onPointerOver, onPointerOut }: VideoExhibitProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);

  useEffect(() => {
    const video = document.createElement('video');
    video.src = exhibit.mediaSrc;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = 'metadata';
    videoRef.current = video;

    const tex = new THREE.VideoTexture(video);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    setTexture(tex);

    return () => {
      video.pause();
      video.src = '';
      videoRef.current = null;
      tex.dispose();
      setTexture(null);
    };
  }, [exhibit.mediaSrc]);

  const handlePlay = () => {
    if (videoRef.current && !isPlaying) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (videoRef.current && isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  useFrame(() => {
    if (texture) texture.needsUpdate = true;
  });

  if (!texture) return null;

  return (
    <mesh
      ref={meshRef}
      onClick={(e) => {
        if (isPlaying) handlePause(); else handlePlay();
        onClick?.(e);
      }}
      onPointerOver={(e) => {
        handlePlay();
        onPointerOver?.(e);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        handlePause();
        onPointerOut?.();
        document.body.style.cursor = 'default';
      }}
    >
      <planeGeometry args={[3.2, 1.8]} />
      <meshStandardMaterial
        map={texture}
        side={THREE.DoubleSide}
        roughness={0.2}
        metalness={0.0}
      />
    </mesh>
  );
}
