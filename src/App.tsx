import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';
import { Scene } from './components/canvas/Scene';
import { useExhibitionStore } from './store/useExhibitionStore';
import { useLoadingStore } from './store/useLoadingStore';
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
    if (!active && progress === 100) {
      setTimeout(() => setSceneReady(true), 500);
    }
  }, [progress, active, setProgress, setSceneReady]);

  return null;
}

export default function App() {
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null);
  const setConfig = useExhibitionStore((s) => s.setConfig);

  useEffect(() => {
    setWebGLSupported(detectWebGL());
    setConfig(defaultConfig);
  }, [setConfig]);

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
        dpr={[1, 2]}
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
    </div>
  );
}
