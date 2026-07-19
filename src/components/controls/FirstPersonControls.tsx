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
};

const SPEED = 5;
const SPRINT_MULTIPLIER = 2.5;
const BOUNDS = { minX: -9.5, maxX: 9.5, minZ: -9.5, maxZ: 9.5 };

export function FirstPersonControls() {
  const { camera, gl, raycaster } = useThree();
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

  // 键盘事件监听 - 始终激活
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 如果有面板打开，不处理移动
      if (selectedExhibit) return;
      
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': keys.forward = true; break;
        case 'KeyS': case 'ArrowDown': keys.backward = true; break;
        case 'KeyA': case 'ArrowLeft': keys.left = true; break;
        case 'KeyD': case 'ArrowRight': keys.right = true; break;
        case 'ShiftLeft': case 'ShiftRight': keys.sprint = true; break;
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': keys.forward = false; break;
        case 'KeyS': case 'ArrowDown': keys.backward = false; break;
        case 'KeyA': case 'ArrowLeft': keys.left = false; break;
        case 'KeyD': case 'ArrowRight': keys.right = false; break;
        case 'ShiftLeft': case 'ShiftRight': keys.sprint = false; break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedExhibit]);

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

  // 自由模式 - 鼠标拖动旋转
  useEffect(() => {
    if (isPointerLocked) return; // 锁定模式下不处理
    
    const canvas = gl.domElement;
    
    const handleMouseDown = (e: MouseEvent) => {
      if (selectedExhibit) return;
      if (e.button === 0) {
        setIsDragging(true);
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || selectedExhibit) return;
      
      const deltaX = e.clientX - lastMousePos.current.x;
      const deltaY = e.clientY - lastMousePos.current.y;
      
      cameraRotation.current.theta -= deltaX * 0.005;
      cameraRotation.current.phi = Math.max(
        -Math.PI / 3,
        Math.min(Math.PI / 3, cameraRotation.current.phi - deltaY * 0.005)
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
    if (isPointerLocked) return;
    
    const canvas = gl.domElement;
    
    const handleWheel = (e: WheelEvent) => {
      if (selectedExhibit) return;
      
      const forward = new THREE.Vector3();
      camera.getWorldDirection(forward);
      forward.y = 0;
      forward.normalize();
      
      const distance = -e.deltaY * 0.01;
      camera.position.addScaledVector(forward, distance);
      
      camera.position.x = Math.max(BOUNDS.minX, Math.min(BOUNDS.maxX, camera.position.x));
      camera.position.z = Math.max(BOUNDS.minZ, Math.min(BOUNDS.maxZ, camera.position.z));
    };

    canvas.addEventListener('wheel', handleWheel);
    return () => canvas.removeEventListener('wheel', handleWheel);
  }, [camera, gl, isPointerLocked, selectedExhibit]);

  // 每帧更新 - 移动（两种模式都生效）
  useFrame((_, delta) => {
    if (selectedExhibit) return;

    const speed = SPEED * (keys.sprint ? SPRINT_MULTIPLIER : 1);
    const moveVector = new THREE.Vector3();

    // 计算前向和右向向量
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0));

    // 计算移动
    const moveZ = (keys.forward ? 1 : 0) - (keys.backward ? 1 : 0);
    const moveX = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);

    if (moveZ !== 0 || moveX !== 0) {
      moveVector.addScaledVector(forward, moveZ * speed * delta);
      moveVector.addScaledVector(right, moveX * speed * delta);

      const nextPos = camera.position.clone().add(moveVector);
      nextPos.x = Math.max(BOUNDS.minX, Math.min(BOUNDS.maxX, nextPos.x));
      nextPos.z = Math.max(BOUNDS.minZ, Math.min(BOUNDS.maxZ, nextPos.z));

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
      camera.quaternion.slerp(targetQuaternion, 0.15);
    }
  });

  // 锁定模式回调
  const handleLock = useCallback(() => {
    setPointerLocked(true);
  }, [setPointerLocked]);

  const handleUnlock = useCallback(() => {
    setPointerLocked(false);
    // 退出锁定时，同步当前相机角度
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    cameraRotation.current.theta = Math.atan2(direction.x, direction.z);
    cameraRotation.current.phi = Math.asin(direction.y);
  }, [setPointerLocked, camera]);

  // 点击事件 - 两种模式下都可以点击展品
  useEffect(() => {
    const canvas = gl.domElement;
    
    const handleClick = (e: MouseEvent) => {
      if (selectedExhibit) return;
      
      // 计算鼠标位置（归一化设备坐标）
      const rect = canvas.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      // 设置射线
      raycaster.setFromCamera(mouse, camera);

      // 检测与展品的交叉
      // 需要收集所有展品的 meshes
      const exhibitMeshes: THREE.Object3D[] = [];
      canvas.dispatchEvent(new CustomEvent('get-exhibit-meshes', {
        detail: { callback: (meshes: THREE.Object3D[]) => { exhibitMeshes.push(...meshes); } }
      }));

      const intersects = raycaster.intersectObjects(exhibitMeshes, true);
      
      if (intersects.length > 0) {
        // 找到最近的展品
        let obj = intersects[0].object;
        while (obj && !obj.userData.exhibitId) {
          obj = obj.parent as THREE.Object3D;
        }
        
        if (obj && obj.userData.exhibitId) {
          selectExhibit(obj.userData.exhibitId);
        }
      } else if (!isPointerLocked && !isDragging) {
        // 点击空白区域，进入锁定模式
        pointerLockRef.current?.lock();
      }
    };

    canvas.addEventListener('click', handleClick);
    return () => canvas.removeEventListener('click', handleClick);
  }, [gl, camera, raycaster, isPointerLocked, isDragging, selectedExhibit, selectExhibit]);

  return (
    <PointerLockControls
      ref={pointerLockRef}
      onLock={handleLock}
      onUnlock={handleUnlock}
    />
  );
}
