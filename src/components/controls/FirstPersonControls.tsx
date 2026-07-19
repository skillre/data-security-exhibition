import { useEffect, useRef, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { useControlsStore } from '../../store/useControlsStore';
import { useExhibitionStore } from '../../store/useExhibitionStore';

const keys = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  sprint: false,
};

const SPEED = 5;
const SPRINT_MULTIPLIER = 2;
const BOUNDS = { minX: -9, maxX: 9, minZ: -9, maxZ: 9 };
const EYE_HEIGHT = 1.7;

export function FirstPersonControls() {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const setPointerLocked = useControlsStore((s) => s.setPointerLocked);
  const selectedExhibit = useExhibitionStore((s) => s.selectedExhibit);
  const selectExhibit = useExhibitionStore((s) => s.selectExhibit);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': keys.forward = true; break;
        case 'KeyS': keys.backward = true; break;
        case 'KeyA': keys.left = true; break;
        case 'KeyD': keys.right = true; break;
        case 'ShiftLeft': keys.sprint = true; break;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': keys.forward = false; break;
        case 'KeyS': keys.backward = false; break;
        case 'KeyA': keys.left = false; break;
        case 'KeyD': keys.right = false; break;
        case 'ShiftLeft': keys.sprint = false; break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape' && selectedExhibit) {
        selectExhibit(null);
        setTimeout(() => {
          controlsRef.current?.lock();
        }, 100);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedExhibit, selectExhibit]);

  useFrame((_, delta) => {
    if (!controlsRef.current?.isLocked) return;

    const speed = SPEED * (keys.sprint ? SPRINT_MULTIPLIER : 1);

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0));

    const moveZ = (keys.forward ? 1 : 0) - (keys.backward ? 1 : 0);
    const moveX = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);

    if (moveZ !== 0 || moveX !== 0) {
      const moveVector = new THREE.Vector3();
      moveVector.addScaledVector(forward, moveZ * speed * delta);
      moveVector.addScaledVector(right, moveX * speed * delta);

      const nextPos = camera.position.clone().add(moveVector);
      nextPos.x = Math.max(BOUNDS.minX, Math.min(BOUNDS.maxX, nextPos.x));
      nextPos.z = Math.max(BOUNDS.minZ, Math.min(BOUNDS.maxZ, nextPos.z));
      nextPos.y = EYE_HEIGHT;

      camera.position.copy(nextPos);
    }
  });

  const handleLock = useCallback(() => setPointerLocked(true), [setPointerLocked]);
  const handleUnlock = useCallback(() => setPointerLocked(false), [setPointerLocked]);

  return (
    <PointerLockControls
      ref={controlsRef}
      onLock={handleLock}
      onUnlock={handleUnlock}
    />
  );
}
