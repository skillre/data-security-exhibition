import { useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PointerLockControls } from '@react-three/drei';
import { useSpring } from '@react-spring/three';
import * as THREE from 'three';
import { useExhibition } from '../store/useExhibition';
import config from '../config/exhibition.json';

export function CameraController() {
  const cameraMode = useExhibition((s) => s.cameraMode);
  const currentWaypointIndex = useExhibition((s) => s.currentWaypointIndex);
  const selectedExhibit = useExhibition((s) => s.selectedExhibit);

  const { camera } = useThree();

  const waypoint = config.tour.waypoints[currentWaypointIndex] || config.tour.waypoints[0];

  // 引导式模式的弹簧动画
  const [spring, api] = useSpring(() => ({
    px: waypoint.position[0],
    py: waypoint.position[1],
    pz: waypoint.position[2],
    lx: waypoint.lookAt[0],
    ly: waypoint.lookAt[1],
    lz: waypoint.lookAt[2],
    config: { mass: 1, tension: 120, friction: 25 },
  }));

  // 更新相机目标
  useEffect(() => {
    if (cameraMode === 'guided') {
      const wp = config.tour.waypoints[currentWaypointIndex];
      if (wp) {
        api.start({
          px: wp.position[0],
          py: wp.position[1],
          pz: wp.position[2],
          lx: wp.lookAt[0],
          ly: wp.lookAt[1],
          lz: wp.lookAt[2],
        });
      }
    }
  }, [cameraMode, currentWaypointIndex, api]);

  // 展品聚焦模式
  useEffect(() => {
    if (cameraMode === 'exhibit-focus' && selectedExhibit) {
      const [x, y, z] = selectedExhibit.position;
      api.start({
        px: x,
        py: y + 0.5,
        pz: z + 3,
        lx: x,
        ly: y,
        lz: z,
      });
    }
  }, [cameraMode, selectedExhibit, api]);

  // 每帧更新相机
  useFrame(() => {
    if (cameraMode === 'guided' || cameraMode === 'exhibit-focus') {
      camera.position.set(
        spring.px.get(),
        spring.py.get(),
        spring.pz.get()
      );
      camera.lookAt(
        spring.lx.get(),
        spring.ly.get(),
        spring.lz.get()
      );
    }
  });

  return (
    <>
      {cameraMode === 'free' && <PointerLockControls />}
      {cameraMode === 'exhibit-focus' && selectedExhibit && (
        <OrbitControls
          target={new THREE.Vector3(...selectedExhibit.position)}
          enableDamping
          dampingFactor={0.05}
          minDistance={1.5}
          maxDistance={6}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 6}
        />
      )}
    </>
  );
}
