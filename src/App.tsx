import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';
import { Scene } from './components/canvas/Scene';
import { OverlayUI } from './components/ui/OverlayUI';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { useExhibitionStore } from './store/useExhibitionStore';
import { useLoadingStore } from './store/useLoadingStore';
import { useSettingsStore } from './store/useSettingsStore';
import { defaultConfig } from './config/exhibition';

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function LoadingManager() {
  const { progress, active } = useProgress();
  const setProgress = useLoadingStore((s) => s.setProgress);
  const setSceneReady = useExhibitionStore((s) => s.setSceneReady);

  useEffect(() => {
    setProgress(progress);
    // 放宽判定：只要加载器不再活跃（!active）即视为就绪，
    // 不强求 progress===100（历史坑：进度停在 <100 导致整个 UI 卡死）。
    if (!active) {
      const t = setTimeout(() => setSceneReady(true), 300);
      return () => clearTimeout(t);
    }
  }, [progress, active, setProgress, setSceneReady]);

  return null;
}

export default function App() {
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null);
  const setConfig = useExhibitionStore((s) => s.setConfig);
  const setSceneReady = useExhibitionStore((s) => s.setSceneReady);
  const dpr = useSettingsStore((s) => s.preset.dpr);

  useEffect(() => {
    setWebGLSupported(detectWebGL());
    setConfig(defaultConfig);
  }, [setConfig]);

  // 硬超时兜底：无论资源是否加载完，进入后最多 5 秒强制就绪，
  // 防止 useProgress 卡在 active 导致 OverlayUI 永远不显示。
  useEffect(() => {
    if (!webGLSupported) return;
    const t = setTimeout(() => setSceneReady(true), 5000);
    return () => clearTimeout(t);
  }, [webGLSupported, setSceneReady]);

  if (webGLSupported === null) return null;

  if (!webGLSupported) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a1a',
        color: '#fff',
        fontFamily: '"Noto Sans SC", sans-serif',
      }}>
        <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>
          您的浏览器不支持 WebGL
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)' }}>
          请使用 Chrome、Firefox、Safari 或 Edge 浏览器访问
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a1a' }}>
      <Canvas
        shadows
        dpr={[1, dpr]}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        camera={{
          fov: 70,
          near: 0.1,
          far: 100,
          position: [0, 1.7, 5],
        }}
      >
        <Suspense fallback={null}>
          <Scene />
          <LoadingManager />
        </Suspense>
      </Canvas>
      
      {/* UI 覆盖层 - 在 Canvas 外部 */}
      <OverlayUI />
      
      {/* 加载屏幕 */}
      <LoadingScreen />
    </div>
  );
}
