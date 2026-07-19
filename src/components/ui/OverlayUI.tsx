import { useExhibitionStore } from '../../store/useExhibitionStore';
import { ExhibitDetailPanel } from './ExhibitDetailPanel';
import { TourControls } from './TourControls';
import { HelpOverlay } from './HelpOverlay';
import { MiniMap } from './MiniMap';

export function OverlayUI() {
  const selectedExhibit = useExhibitionStore((s) => s.selectedExhibit);
  const exhibits = useExhibitionStore((s) => s.exhibits);
  const isSceneReady = useExhibitionStore((s) => s.isSceneReady);

  if (!isSceneReady) return null;

  const selectedExhibitData = exhibits.find((e) => e.id === selectedExhibit);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 10,
      fontFamily: '"Noto Sans SC", sans-serif',
    }}>
      <HelpOverlay />
      
      {selectedExhibitData && (
        <div style={{ pointerEvents: 'auto' }}>
          <ExhibitDetailPanel exhibit={selectedExhibitData} />
        </div>
      )}
      
      <TourControls />
      <MiniMap />
    </div>
  );
}
