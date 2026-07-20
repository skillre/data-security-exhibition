import { useExhibitionStore } from '../../store/useExhibitionStore';
import { ExhibitDetailPanel } from './ExhibitDetailPanel';
import { TourControls } from './TourControls';
import { HelpOverlay } from './HelpOverlay';
import { MiniMap } from './MiniMap';
import { Crosshair } from './Crosshair';
import { QualitySettings } from './QualitySettings';

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
      {/* 准心 - 锁定模式时显示 */}
      <Crosshair />
      
      {/* 操作指南 */}
      <HelpOverlay />
      
      {/* 展品详情面板 */}
      {selectedExhibitData && (
        <div style={{ pointerEvents: 'auto' }}>
          <ExhibitDetailPanel exhibit={selectedExhibitData} />
        </div>
      )}
      
      {/* 导览控制 */}
      <div style={{ pointerEvents: 'auto' }}>
        <TourControls />
      </div>
      
      {/* 小地图 */}
      <MiniMap />

      {/* 画质切换 */}
      <QualitySettings />
    </div>
  );
}
