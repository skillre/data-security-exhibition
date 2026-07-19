import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useExhibition } from '../store/useExhibition';
import config from '../config/exhibition.json';
import type { ExhibitionConfig } from '../types/exhibition';
import { Room } from './Room';
import { Lighting } from './Lighting';
import { Particles } from './Particles';
import { GridFloor } from './GridFloor';
import { ExhibitRouter } from './exhibits/ExhibitRouter';
import { CameraController } from '../camera/CameraController';

const exhibitionConfig = config as unknown as ExhibitionConfig;

export function ExhibitionHall() {
  const setLoaded = useExhibition((s) => s.setLoaded);
  const setLoadProgress = useExhibition((s) => s.setLoadProgress);
  const frameCount = useRef(0);

  // 程序化场景没有外部资源需要加载，几帧后直接标记为已加载
  useFrame(() => {
    frameCount.current++;
    const progress = Math.min(frameCount.current / 10 * 100, 100);
    setLoadProgress(progress);
    if (frameCount.current >= 15) {
      setLoaded(true);
    }
  });

  return (
    <>
      {/* 相机控制 */}
      <CameraController />

      {/* 灯光 */}
      <Lighting />

      {/* 粒子效果 */}
      <Particles count={300} color="#4488ff" spread={50} />

      {/* 科技感地板 */}
      <GridFloor />

      {/* 各展区 */}
      {exhibitionConfig.zones.map((zone) => (
        <group key={zone.id} position={zone.position as [number, number, number]}>
          <Room
            width={zone.size[0]}
            depth={zone.size[1]}
            height={zone.size[2]}
            wallColor={zone.wallColor}
            floorColor={zone.floorColor}
          />
          {zone.exhibits.map((exhibit) => (
            <ExhibitRouter key={exhibit.id} config={exhibit} />
          ))}
        </group>
      ))}
    </>
  );
}
