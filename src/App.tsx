import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { ExhibitionHall } from './scene/ExhibitionHall';
import { Navigation } from './ui/Navigation';
import { ExhibitDetail } from './ui/ExhibitDetail';
import { Minimap } from './ui/Minimap';
import { LoadingScreen } from './ui/LoadingScreen';
import { ControlHints } from './ui/ControlHints';
import { WebglFallback } from './ui/WebglFallback';
import { isWebGLSupported } from './utils/webgl';
import { detectDevice } from './utils/device';

function App() {
  if (!isWebGLSupported()) {
    return <WebglFallback />;
  }

  const device = detectDevice();

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0e1a', overflow: 'hidden' }}>
      {/* 3D 场景 */}
      <Canvas
        dpr={device.pixelRatio}
        camera={{ fov: 75, near: 0.1, far: 1000, position: [0, 2, 6] }}
        shadows={device.shadowsEnabled}
        gl={{
          antialias: !device.isLowEnd,
          powerPreference: device.isMobile ? 'low-power' : 'high-performance',
          stencil: false,
        }}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <ExhibitionHall />
        </Suspense>
      </Canvas>

      {/* UI 叠加层 */}
      <Navigation />
      <ExhibitDetail />
      <Minimap />
      <LoadingScreen />
      <ControlHints />
    </div>
  );
}

export default App;
