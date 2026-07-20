import { Environment } from '@react-three/drei';
import { useExhibitionStore } from '../../store/useExhibitionStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { ExhibitionRoom } from './ExhibitionRoom';
import { ExhibitRenderer } from '../exhibits/ExhibitRenderer';
import { TourPath } from '../tour/TourPath';
import { Lighting } from './Lighting';
import { FirstPersonControls } from '../controls/FirstPersonControls';

export function Scene() {
  const exhibits = useExhibitionStore((s) => s.exhibits);
  const selectExhibit = useExhibitionStore((s) => s.selectExhibit);
  const hoverExhibit = useExhibitionStore((s) => s.hoverExhibit);
  const hdriResolution = useSettingsStore((s) => s.preset.hdriResolution);

  return (
    <>
      {/* 明亮的蓝天背景 */}
      <color attach="background" args={['#87ceeb']} />
      
      {/* 轻微雾效果 - 增加深度感 */}
      <fog attach="fog" args={['#e8f4f8', 15, 50]} />

      <Lighting />
      
      {/* HDRI 环境光：真实室内全景驱动环境光照与反射。
          分辨率联动画质档；background={false} 保留蓝天背景，不过曝。*/}
      <Environment
        files={`/assets/hdri/interior_${hdriResolution}.hdr`}
        background={false}
        environmentIntensity={0.65}
      />
      
      <ExhibitionRoom />
      
      {exhibits.map((exhibit) => (
        <ExhibitRenderer
          key={exhibit.id}
          exhibit={exhibit}
          onClick={(ex) => selectExhibit(ex.id)}
          onHover={(ex) => hoverExhibit(ex?.id ?? null)}
        />
      ))}
      
      <TourPath />
      <FirstPersonControls />
    </>
  );
}
