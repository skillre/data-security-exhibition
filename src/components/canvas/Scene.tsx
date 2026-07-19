import { Environment, Stars } from '@react-three/drei';
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
      {/* 背景星空 */}
      <Stars
        radius={50}
        depth={50}
        count={1000}
        factor={2}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* 雾效果 */}
      <fog attach="fog" args={['#0a0a1a', 10, 40]} />

      <Lighting />
      <Environment preset="night" background={false} />
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
