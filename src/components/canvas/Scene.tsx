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
      <Lighting />
      <Environment preset="city" background={false} />
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
