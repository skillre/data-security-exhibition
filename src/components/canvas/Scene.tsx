import { Environment } from '@react-three/drei';
import { useExhibitionStore } from '../../store/useExhibitionStore';
import { ExhibitionRoom } from './ExhibitionRoom';
import { ExhibitRenderer } from '../exhibits/ExhibitRenderer';
import { TourPath } from '../tour/TourPath';
import { Lighting } from './Lighting';
import { FirstPersonControls } from '../controls/FirstPersonControls';

export function Scene() {
  const exhibits = useExhibitionStore((s) => s.exhibits);
  const selectExhibit = useExhibitionStore((s) => s.selectExhibit);
  const hoverExhibit = useExhibitionStore((s) => s.hoverExhibit);

  return (
    <>
      {/* 明亮的蓝天背景 */}
      <color attach="background" args={['#87ceeb']} />
      
      {/* 轻微雾效果 - 增加深度感 */}
      <fog attach="fog" args={['#e8f4f8', 15, 50]} />

      <Lighting />
      
      {/* 白天环境 */}
      <Environment preset="city" background={false} environmentIntensity={0.5} />
      
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
