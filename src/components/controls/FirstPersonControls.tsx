import { useEffect, useRef, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { useControlsStore } from '../../store/useControlsStore';
import { useExhibitionStore } from '../../store/useExhibitionStore';

const SPEED = 5;
const SPRINT_MULTIPLIER = 2;
const BOUNDS = { minX: -9.5, maxX: 9.5, minZ: -9.5, maxZ: 9.5 };

export function FirstPersonControls() {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const keysRef = useRef<Set<string>>(new Set());
  
  const setPointerLocked = useControlsStore((s) => s.setPointerLocked);
  const selectedExhibit = useExhibitionStore((s) => s.selectedExhibit);
  const selectExhibit = useExhibitionStore((s) => s.selectExhibit);

  // 键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.code);
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.code);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // ESC 键处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        if (selectedExhibit) {
          selectExhibit(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedExhibit, selectExhibit]);

  // 每帧更新移动
  useFrame((_, delta) => {
    if (selectedExhibit) return;
    if (!controlsRef.current?.isLocked) return;

    const keys = keysRef.current;
    const speed = SPEED * (keys.has('ShiftLeft') || keys.has('ShiftRight') ? SPRINT_MULTIPLIER : 1);

    // 计算方向
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0));

    // 计算移动
    const moveVector = new THREE.Vector3();
    
    if (keys.has('KeyW') || keys.has('ArrowUp')) {
      moveVector.add(forward.clone().multiplyScalar(speed * delta));
    }
    if (keys.has('KeyS') || keys.has('ArrowDown')) {
      moveVector.add(forward.clone().multiplyScalar(-speed * delta));
    }
    if (keys.has('KeyA') || keys.has('ArrowLeft')) {
      moveVector.add(right.clone().multiplyScalar(-speed * delta));
    }
    if (keys.has('KeyD') || keys.has('ArrowRight')) {
      moveVector.add(right.clone().multiplyScalar(speed * delta));
    }

    // 应用移动
    if (moveVector.length() > 0) {
      const newPos = camera.position.clone().add(moveVector);
      newPos.x = Math.max(BOUNDS.minX, Math.min(BOUNDS.maxX, newPos.x));
      newPos.z = Math.max(BOUNDS.minZ, Math.min(BOUNDS.maxZ, newPos.z));
      camera.position.copy(newPos);
    }
  });

  // 锁定/解锁回调
  const handleLock = useCallback(() => {
    setPointerLocked(true);
  }, [setPointerLocked]);

  const handleUnlock = useCallback(() => {
    setPointerLocked(false);
    keysRef.current.clear();
  }, [setPointerLocked]);

  return (
    <PointerLockControls
      ref={controlsRef}
      onLock={handleLock}
      onUnlock={handleUnlock}
    />
  );
}
