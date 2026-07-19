import { useEffect } from 'react';
import { useProgress } from '@react-three/drei';
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
  const { progress } = useProgress();
  const setLoadProgress = useExhibition((s) => s.setLoadProgress);
  const setLoaded = useExhibition((s) => s.setLoaded);

  useEffect(() => {
    setLoadProgress(progress);
    if (progress >= 100) {
      setTimeout(() => setLoaded(true), 500);
    }
  }, [progress, setLoadProgress, setLoaded]);

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
