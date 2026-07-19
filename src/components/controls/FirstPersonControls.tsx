import { useEffect, useRef, useCallback, useState } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { useControlsStore } from '../../store/useControlsStore';
import { useExhibitionStore } from '../../store/useExhibitionStore';

// 键盘状态
const keys = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  sprint: false,
  up: false,
  down: false,
};

const SPEED = 5;
const SPRINT_MULTIPLIER = 2.5;
const BOUNDS = { minX: -9.5, maxX: 9.5, minZ: -9.5, maxZ: 9.5 };

export function FirstPersonControls() {
  const { camera, gl } = useThree();
  const pointerLockRef = useRef<any>(null);
  
  const setPointerLocked = useControlsStore((s) => s.setPointerLocked);
  const isPointerLocked = useControlsStore((s) => s.isPointerLocked);
  const selectedExhibit = useExhibitionStore((s) => s.selectedExhibit);
  const selectExhibit = useExhibitionStore((s) => s.selectExhibit);
  
  // 自由模式下的鼠标拖动状态
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const cameraRotation = useRef({ theta: 0, phi: 0 });

  // 初始化相机旋转角度
  useEffect(() => {
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    cameraRotation.current.theta = Math.atan2(direction.x, direction.z);
    cameraRotation.current.phi = Math.asin(direction.y);
  }, [camera]);

  // 键盘事件监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': keys.forward = true; break;
        case 'KeyS': case 'ArrowDown': keys.backward = true; break;
        case 'KeyA': case 'ArrowLeft': keys.left = true; break;
        case 'KeyD': case 'ArrowRight': keys.right = true; break;
        case 'ShiftLeft': case 'ShiftRight': keys.sprint = true; break;
        case 'Space': keys.up = true; break;
        case 'ControlLeft': case 'ControlRight': keys.down = true; break;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': keys.forward = false; break;
        case 'KeyS': case 'ArrowDown': keys.backward = false; break;
        case 'KeyA': case 'ArrowLeft': keys.left = false; break;
        case 'KeyD': case 'ArrowRight': keys.right = false; break;
        case 'ShiftLeft': case 'ShiftRight': keys.sprint = false; break;
        case 'Space': keys.up = false; break;
        case 'ControlLeft': case 'ControlRight': keys.down = false; break;
      }
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
          // 如果有展品选中，先关闭面板
          selectExhibit(null);
        } else if (isPointerLocked) {
          // 如果是锁定模式，退出锁定
          pointerLockRef.current?.unlock();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedExhibit, selectExhibit, isPointerLocked]);

  // 鼠标事件 - 自由模式下的拖动旋转
  useEffect(() => {
    const canvas = gl.domElement;
    
    const handleMouseDown = (e: MouseEvent) => {
      if (isPointerLocked || selectedExhibit) return;
      if (e.button === 0) { // 左键
        setIsDragging(true);
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || isPointerLocked) return;
      
      const deltaX = e.clientX - lastMousePos.current.x;
      const deltaY = e.clientY - lastMousePos.current.y;
      
      cameraRotation.current.theta -= deltaX * 0.003;
      cameraRotation.current.phi = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, cameraRotation.current.phi - deltaY * 0.003)
      );
      
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [gl, isDragging, isPointerLocked, selectedExhibit]);

  // 滚轮缩放
  useEffect(() => {
    const canvas = gl.domElement;
    
    const handleWheel = (e: WheelEvent) => {
      if (isPointerLocked || selectedExhibit) return;
      
      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();
      
      const distance = -e.deltaY * 0.01;
      camera.position.addScaledVector(forward, distance);
      
      // 限制边界
      camera.position.x = Math.max(BOUNDS.minX, Math.min(BOUNDS.maxX, camera.position.x));
      camera.position.z = Math.max(BOUNDS.minZ, Math.min(BOUNDS.maxZ, camera.position.z));
    };

    canvas.addEventListener('wheel', handleWheel);
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [camera, gl, isPointerLocked, selectedExhibit]);

  // 每帧更新 - 移动和旋转
  useFrame((_, delta) => {
    if (selectedExhibit) return; // 面板打开时不移动

    const speed = SPEED * (keys.sprint ? SPRINT_MULTIPLIER : 1);

    // 计算移动方向
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0));

    const moveZ = (keys.forward ? 1 : 0) - (keys.backward ? 1 : 0);
    const moveX = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
    const moveY = (keys.up ? 1 : 0) - (keys.down ? 1 : 0);

    // 应用移动
    if (moveZ !== 0 || moveX !== 0 || moveY !== 0) {
      const moveVector = new THREE.Vector3();
      moveVector.addScaledVector(forward, moveZ * speed * delta);
      moveVector.addScaledVector(right, moveX * speed * delta);
      moveVector.y = moveY * speed * delta * 0.5;

      const nextPos = camera.position.clone().add(moveVector);
      nextPos.x = Math.max(BOUNDS.minX, Math.min(BOUNDS.maxX, nextPos.x));
      nextPos.z = Math.max(BOUNDS.minZ, Math.min(BOUNDS.maxZ, nextPos.z));
      nextPos.y = Math.max(0.5, Math.min(3.5, nextPos.y));

      camera.position.copy(nextPos);
    }

    // 自由模式下应用旋转
    if (!isPointerLocked) {
      const targetQuaternion = new THREE.Quaternion();
      const euler = new THREE.Euler(
        cameraRotation.current.phi,
        cameraRotation.current.theta,
        0,
        'YXZ'
      );
      targetQuaternion.setFromEuler(euler);
      camera.quaternion.slerp(targetQuaternion, 0.1);
    }
  });

  // 锁定模式回调
  const handleLock = useCallback(() => {
    setPointerLocked(true);
  }, [setPointerLocked]);

  const handleUnlock = useCallback(() => {
    setPointerLocked(false);
  }, [setPointerLocked]);

  // 点击空白区域进入锁定模式
  useEffect(() => {
    const canvas = gl.domElement;
    
    const handleClick = () => {
      // 如果已经有展品选中，不处理
      if (selectedExhibit) return;
      
      // 检查是否点击到了展品（通过 R3F 的事件系统处理）
      // 这里只处理点击空白区域的情况
      
      // 如果不是锁定模式，点击进入锁定模式
      if (!isPointerLocked && !isDragging) {
        // 延迟一点，避免和展品点击冲突
        setTimeout(() => {
          if (!selectedExhibit) {
            pointerLockRef.current?.lock();
          }
        }, 100);
      }
    };

    canvas.addEventListener('click', handleClick);
    return () => canvas.removeEventListener('click', handleClick);
  }, [gl, isPointerLocked, isDragging, selectedExhibit]);

  return (
    <>
      {/* 锁定模式控制器 */}
      <PointerLockControls
        ref={pointerLockRef}
        onLock={handleLock}
        onUnlock={handleUnlock}
      />
    </>
  );
}
