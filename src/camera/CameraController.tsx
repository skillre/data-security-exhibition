import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useExhibition } from '../store/useExhibition';
import config from '../config/exhibition.json';
import type { ExhibitionConfig } from '../types/exhibition';

const exhibitionConfig = config as unknown as ExhibitionConfig;

export function CameraController() {
  const cameraMode = useExhibition((s) => s.cameraMode);
  const currentWaypointIndex = useExhibition((s) => s.currentWaypointIndex);
  const selectedExhibit = useExhibition((s) => s.selectedExhibit);

  const { camera, gl } = useThree();
  const orbitRef = useRef<any>(null);
  const targetPos = useRef(new THREE.Vector3(0, 2, 6));
  const targetLookAt = useRef(new THREE.Vector3(0, 2, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 2, 0));
  const isInitialized = useRef(false);

  // 初始化相机位置
  useEffect(() => {
    const wp = exhibitionConfig.tour.waypoints[0];
    if (wp) {
      camera.position.set(wp.position[0], wp.position[1], wp.position[2]);
      targetPos.current.set(wp.position[0], wp.position[1], wp.position[2]);
      targetLookAt.current.set(wp.lookAt[0], wp.lookAt[1], wp.lookAt[2]);
      currentLookAt.current.set(wp.lookAt[0], wp.lookAt[1], wp.lookAt[2]);
      camera.lookAt(wp.lookAt[0], wp.lookAt[1], wp.lookAt[2]);
      isInitialized.current = true;
    }
  }, [camera]);

  // 更新相机目标
  useEffect(() => {
    if (cameraMode === 'guided') {
      const wp = exhibitionConfig.tour.waypoints[currentWaypointIndex];
      if (wp) {
        targetPos.current.set(wp.position[0], wp.position[1], wp.position[2]);
        targetLookAt.current.set(wp.lookAt[0], wp.lookAt[1], wp.lookAt[2]);
      }
    }
  }, [cameraMode, currentWaypointIndex]);

  // 展品聚焦模式
  useEffect(() => {
    if (cameraMode === 'exhibit-focus' && selectedExhibit) {
      const [x, y, z] = selectedExhibit.position;
      targetPos.current.set(x, y + 0.5, z + 3);
      targetLookAt.current.set(x, y, z);
    }
  }, [cameraMode, selectedExhibit]);

  // 平滑相机移动
  useFrame(() => {
    if (cameraMode === 'guided' || cameraMode === 'exhibit-focus') {
      // 平滑插值位置
      camera.position.lerp(targetPos.current, 0.05);
      // 平滑插值朝向
      currentLookAt.current.lerp(targetLookAt.current, 0.05);
      camera.lookAt(currentLookAt.current);
    }
  });

  // 处理自由漫游的鼠标控制
  useEffect(() => {
    if (cameraMode !== 'free') return;

    let isMouseDown = false;
    let prevX = 0;
    let prevY = 0;
    const euler = new THREE.Euler(0, 0, 0, 'YXZ');

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        isMouseDown = true;
        prevX = e.clientX;
        prevY = e.clientY;
      }
    };

    const handleMouseUp = () => {
      isMouseDown = false;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDown) return;
      const dx = (e.clientX - prevX) * 0.002;
      const dy = (e.clientY - prevY) * 0.002;
      prevX = e.clientX;
      prevY = e.clientY;

      euler.setFromQuaternion(camera.quaternion);
      euler.y -= dx;
      euler.x -= dy;
      euler.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, euler.x));
      camera.quaternion.setFromEuler(euler);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const speed = 0.15;
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);

      switch (e.key.toLowerCase()) {
        case 'w':
          camera.position.addScaledVector(direction, speed);
          break;
        case 's':
          camera.position.addScaledVector(direction, -speed);
          break;
        case 'a':
          const left = new THREE.Vector3().crossVectors(camera.up, direction).normalize();
          camera.position.addScaledVector(left, speed);
          break;
        case 'd':
          const right = new THREE.Vector3().crossVectors(direction, camera.up).normalize();
          camera.position.addScaledVector(right, speed);
          break;
      }
    };

    const canvas = gl.domElement;
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [cameraMode, camera, gl]);

  return null;
}
