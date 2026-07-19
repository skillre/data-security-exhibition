---
date: 2026-07-19T15:02:24+0800
author: skillre
commit: a8b430e
branch: main
repository: 数字化展厅
topic: "数据安全评估服务数字化展厅"
tags: [plan, vite, react-three-fiber, threejs, 3d-exhibition]
status: ready
parent: ".rpiv/artifacts/designs/2026-07-19_14-35-17_digital-exhibition-hall.md"
phase_count: 8
phases:
  - { n: 1, title: "项目脚手架与基础架构" }
  - { n: 2, title: "类型定义与状态管理" }
  - { n: 3, title: "3D场景搭建（简化版）" }
  - { n: 4, title: "展品渲染系统" }
  - { n: 5, title: "第一人称漫游控制" }
  - { n: 6, title: "展品交互与详情面板" }
  - { n: 7, title: "导览系统与小地图" }
  - { n: 8, title: "加载系统与完整场景" }
last_updated: 2026-07-19T15:15:00+0800
last_updated_by: skillre
---

# 数据安全评估服务数字化展厅 Implementation Plan

## Overview

构建一个沉浸式3D数字化展厅，用于向合作伙伴和客户展示数据安全评估服务项目的成果。采用 Vite + React + React Three Fiber 技术栈，数据驱动架构，展品通过 JSON 配置文件管理。使用 Zustand 实现3D/2D状态桥梁，支持第一人称WASD漫游、展品交互、导览路线和小地图导航。纯前端静态部署到 GitHub Pages。

## Desired End State

```typescript
// 启动开发服务器
npm run dev

// 构建生产版本
npm run build

// 部署到 GitHub Pages
npm run deploy
```

## What We're NOT Doing

- 移动端适配
- 虚拟摇杆
- 物理碰撞检测
- 后端服务
- 用户认证
- 多语言支持
- 音效/背景音乐

---

## Phase 1: 项目脚手架与基础架构

### Overview
搭建 Vite + React + TypeScript 项目基础结构，配置构建工具和依赖。

### Changes Required:

#### 1. 项目配置文件
**File**: `package.json`
**Changes**: 创建项目依赖和脚本配置

```json
{
  "name": "digital-exhibition-hall",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "check": "tsc --noEmit",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy": "npm run build && gh-pages -d dist"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@react-three/fiber": "^8.17.10",
    "@react-three/drei": "^9.114.3",
    "three": "^0.170.0",
    "zustand": "^5.0.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "@types/three": "^0.170.0",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.6.3",
    "vite": "^6.0.3",
    "gh-pages": "^6.2.0"
  }
}
```

#### 2. Vite 配置
**File**: `vite.config.ts`
**Changes**: 配置构建工具、路径别名和代码分割

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/digital-exhibition-hall/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@store': path.resolve(__dirname, './src/store'),
      '@data': path.resolve(__dirname, './src/config'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          'react-three': ['@react-three/fiber', '@react-three/drei'],
          vendor: ['react', 'react-dom', 'zustand'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei', 'zustand'],
  },
});
```

#### 3. TypeScript 配置
**File**: `tsconfig.json`
**Changes**: 配置 TypeScript 编译选项和路径别名

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@store/*": ["./src/store/*"],
      "@data/*": ["./src/config/*"],
      "@types/*": ["./src/types/*"],
      "@utils/*": ["./src/utils/*"]
    },
    "noEmit": true,
    "sourceMap": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true
  },
  "include": ["src", "vite-env.d.ts"],
  "exclude": ["node_modules", "dist"]
}
```

**File**: `tsconfig.node.json`
**Changes**: Node.js TypeScript 配置

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["vite.config.ts"]
}
```

#### 4. HTML 入口
**File**: `index.html`
**Changes**: 创建 HTML 入口文件

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="数据安全评估服务数字化展厅" />
    <title>数据安全评估服务数字化展厅</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background: #0a0a1a;
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

#### 5. React 入口
**File**: `src/main.tsx`
**Changes**: 创建 React 应用入口

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**File**: `src/vite-env.d.ts`
**Changes**: Vite 类型声明

```typescript
/// <reference types="vite/client" />
```

#### 6. 全局样式
**File**: `src/styles/global.css`
**Changes**: 创建全局 CSS 样式

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #0a0a1a;
}

body {
  font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
```

#### 7. GitHub Pages 配置
**File**: `public/.nojekyll`
**Changes**: 禁用 Jekyll 处理

```
```

### Success Criteria:

#### Automated Verification:
- [x] `npm install` 成功安装依赖
- [ ] `npm run dev` 启动开发服务器
- [ ] 浏览器访问 http://localhost:5173 显示空白页面

#### Manual Verification:
- [ ] 项目结构正确
- [x] TypeScript 配置正确
- [ ] Vite 路径别名生效

---

## Phase 2: 类型定义与状态管理

### Overview
创建 TypeScript 类型定义和 Zustand 状态管理 store。

### Changes Required:

#### 1. 类型定义
**File**: `src/types/exhibit.ts`
**Changes**: 定义展品、导览路线和展厅配置的类型

```typescript
export type ExhibitType = 'image' | 'video' | 'document';

export type ExhibitCategory = 'report' | 'video' | 'document' | 'achievement';

export interface ExhibitItem {
  id: string;
  title: string;
  description: string;
  detailContent: string;
  type: ExhibitType;
  mediaSrc: string;
  previewImage?: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  category: ExhibitCategory;
  order: number;
  tags?: string[];
}

export interface TourPoint {
  position: [number, number, number];
  lookAt: [number, number, number];
  duration?: number;
  exhibitId?: string;
}

export interface ExhibitionConfig {
  exhibition: {
    title: string;
    subtitle: string;
    description: string;
  };
  scene: {
    backgroundColor: string;
    floorSize: [number, number];
    wallHeight: number;
  };
  exhibits: ExhibitItem[];
  tourRoute: TourPoint[];
  cameraStart: {
    position: [number, number, number];
    lookAt: [number, number, number];
  };
}
```

#### 2. 展厅状态管理
**File**: `src/store/useExhibitionStore.ts`
**Changes**: 创建展厅主状态管理 store

```typescript
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { ExhibitItem, ExhibitionConfig } from '../types/exhibit';

interface ExhibitionState {
  exhibits: ExhibitItem[];
  selectedExhibit: string | null;
  hoveredExhibit: string | null;
  tourMode: 'free' | 'following';
  currentTourStep: number;
  isAutoPlaying: boolean;
  isSceneReady: boolean;
  config: ExhibitionConfig | null;
  
  selectExhibit: (id: string | null) => void;
  hoverExhibit: (id: string | null) => void;
  setExhibits: (exhibits: ExhibitItem[]) => void;
  setConfig: (config: ExhibitionConfig) => void;
  startTour: () => void;
  stopTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  setSceneReady: (ready: boolean) => void;
}

export const useExhibitionStore = create<ExhibitionState>()(
  subscribeWithSelector((set, get) => ({
    exhibits: [],
    selectedExhibit: null,
    hoveredExhibit: null,
    tourMode: 'free',
    currentTourStep: 0,
    isAutoPlaying: false,
    isSceneReady: false,
    config: null,
    
    selectExhibit: (id) => set({ selectedExhibit: id }),
    hoverExhibit: (id) => set({ hoveredExhibit: id }),
    setExhibits: (exhibits) => set({ exhibits }),
    setConfig: (config) => set({ config, exhibits: config.exhibits }),
    
    startTour: () => set({
      tourMode: 'following',
      currentTourStep: 0,
      isAutoPlaying: true
    }),
    stopTour: () => set({
      tourMode: 'free',
      isAutoPlaying: false
    }),
    nextTourStep: () => {
      const { currentTourStep, config } = get();
      const totalSteps = config?.tourRoute.length ?? 0;
      if (currentTourStep < totalSteps - 1) {
        set({ currentTourStep: currentTourStep + 1 });
      } else {
        set({ isAutoPlaying: false, tourMode: 'free' });
      }
    },
    prevTourStep: () => {
      const { currentTourStep } = get();
      if (currentTourStep > 0) {
        set({ currentTourStep: currentTourStep - 1 });
      }
    },
    setSceneReady: (ready) => set({ isSceneReady: ready }),
  }))
);
```

#### 3. 控制状态管理
**File**: `src/store/useControlsStore.ts`
**Changes**: 创建相机控制状态管理 store

```typescript
import { create } from 'zustand';

type CameraMode = 'firstPerson' | 'orbit';

interface ControlsState {
  mode: CameraMode;
  isPointerLocked: boolean;
  isMoving: boolean;
  
  setMode: (mode: CameraMode) => void;
  setPointerLocked: (locked: boolean) => void;
  setMoving: (moving: boolean) => void;
}

export const useControlsStore = create<ControlsState>()((set) => ({
  mode: 'firstPerson',
  isPointerLocked: false,
  isMoving: false,
  
  setMode: (mode) => set({ mode }),
  setPointerLocked: (locked) => set({ isPointerLocked: locked }),
  setMoving: (moving) => set({ isMoving: moving }),
}));
```

#### 4. 加载状态管理
**File**: `src/store/useLoadingStore.ts`
**Changes**: 创建加载状态管理 store

```typescript
import { create } from 'zustand';

interface LoadingState {
  progress: number;
  isLoaded: boolean;
  
  setProgress: (progress: number) => void;
  setLoaded: (loaded: boolean) => void;
}

export const useLoadingStore = create<LoadingState>()((set) => ({
  progress: 0,
  isLoaded: false,
  
  setProgress: (progress) => set({ progress }),
  setLoaded: (loaded) => set({ isLoaded: loaded }),
}));
```

#### 5. 默认配置
**File**: `src/config/exhibition.ts`
**Changes**: 创建展厅默认配置和示例展品数据

```typescript
import type { ExhibitionConfig } from '../types/exhibit';

export const defaultConfig: ExhibitionConfig = {
  exhibition: {
    title: '数据安全评估服务成果展',
    subtitle: '专业能力 · 项目案例 · 成果质量',
    description: '欢迎参观数据安全评估服务数字化展厅',
  },
  scene: {
    backgroundColor: '#0a0a1a',
    floorSize: [20, 20],
    wallHeight: 4,
  },
  exhibits: [
    {
      id: 'report-001',
      title: '安全评估报告',
      description: '2024年度数据安全评估总报告',
      detailContent: '本报告涵盖了企业数据安全现状的全面评估，包括数据分类分级、访问控制、加密措施等核心维度的评估结果。',
      type: 'image',
      mediaSrc: '/assets/images/placeholder-report.jpg',
      position: [-6, 1.5, -9],
      rotation: [0, 0.2, 0],
      scale: 1.2,
      category: 'report',
      order: 1,
    },
    {
      id: 'video-001',
      title: '项目纪实',
      description: '数据安全评估服务全流程记录',
      detailContent: '本视频记录了数据安全评估服务从启动到交付的完整过程。',
      type: 'video',
      mediaSrc: '/assets/videos/placeholder-video.mp4',
      previewImage: '/assets/images/placeholder-video.jpg',
      position: [0, 1.5, -9],
      rotation: [0, 0, 0],
      scale: 1.5,
      category: 'video',
      order: 1,
    },
    {
      id: 'doc-001',
      title: '安全体系文档',
      description: '建立的企业数据安全管理体系',
      detailContent: '本次评估帮助客户建立了完整的数据安全管理体系，涵盖组织架构、制度流程、技术措施三大板块。',
      type: 'document',
      mediaSrc: '/assets/documents/placeholder.pdf',
      previewImage: '/assets/images/placeholder-doc.jpg',
      position: [6, 1.5, -9],
      rotation: [0, -0.2, 0],
      scale: 1,
      category: 'document',
      order: 1,
    },
    {
      id: 'achievement-001',
      title: '成果展示',
      description: '数据安全评估服务核心成果',
      detailContent: '通过本次评估，帮助客户建立了完整的数据安全防护体系，显著提升了数据安全水平。',
      type: 'image',
      mediaSrc: '/assets/images/placeholder-achievement.jpg',
      position: [0, 1.5, 9],
      rotation: [0, Math.PI, 0],
      scale: 1.5,
      category: 'achievement',
      order: 1,
    },
  ],
  tourRoute: [
    {
      position: [0, 1.7, 5],
      lookAt: [0, 1.5, 0],
      duration: 1000,
    },
    {
      position: [-6, 1.7, -6],
      lookAt: [-6, 1.5, -9],
      duration: 2000,
      exhibitId: 'report-001',
    },
    {
      position: [0, 1.7, -6],
      lookAt: [0, 1.5, -9],
      duration: 2000,
      exhibitId: 'video-001',
    },
    {
      position: [6, 1.7, -6],
      lookAt: [6, 1.5, -9],
      duration: 2000,
      exhibitId: 'doc-001',
    },
    {
      position: [0, 1.7, 6],
      lookAt: [0, 1.5, 9],
      duration: 2000,
      exhibitId: 'achievement-001',
    },
  ],
  cameraStart: {
    position: [0, 1.7, 5],
    lookAt: [0, 1.5, 0],
  },
};
```

### Success Criteria:

#### Automated Verification:
- [x] `npm run check` TypeScript 类型检查通过
- [ ] Zustand store 可以正常创建和使用

#### Manual Verification:
- [ ] 类型定义完整
- [ ] Store 状态管理正确

---

## Phase 3: 3D场景搭建

### Overview
创建3D展厅场景，包括房间几何体、灯光和材质。

### Changes Required:

#### 1. 主应用组件
**File**: `src/App.tsx`
**Changes**: 创建主应用组件，包含 WebGL 检测和 Canvas 配置

```typescript
import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';
import { Scene } from './components/canvas/Scene';
import { OverlayUI } from './components/ui/OverlayUI';
import { LoadingScreen } from './components/ui/LoadingScreen';
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
      <OverlayUI />
      <LoadingScreen />
    </div>
  );
}
```

#### 2. 3D场景根组件（简化版）
**File**: `src/components/canvas/Scene.tsx`
**Changes**: 创建3D场景根组件的简化版本，只包含基本场景元素

```typescript
import { Environment } from '@react-three/drei';
import { ExhibitionRoom } from './ExhibitionRoom';
import { Lighting } from './Lighting';

export function Scene() {
  return (
    <>
      <Lighting />
      <Environment preset="city" background={false} />
      <ExhibitionRoom />
    </>
  );
}
```

#### 3. 展厅房间
**File**: `src/components/canvas/ExhibitionRoom.tsx`
**Changes**: 创建展厅房间几何体（地板、墙壁、天花板）

```typescript
import { useMemo } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { useExhibitionStore } from '../../store/useExhibitionStore';

export function ExhibitionRoom() {
  const config = useExhibitionStore((s) => s.config);
  const floorSize = config?.scene.floorSize ?? [20, 20];
  const wallHeight = config?.scene.wallHeight ?? 4;

  const floorTexture = useTexture('/assets/textures/floor.jpg');
  const wallTexture = useTexture('/assets/textures/wall.jpg');

  useMemo(() => {
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(4, 4);
    floorTexture.colorSpace = THREE.SRGBColorSpace;

    wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(3, 1);
    wallTexture.colorSpace = THREE.SRGBColorSpace;
  }, [floorTexture, wallTexture]);

  const wallGeometry = useMemo(
    () => new THREE.PlaneGeometry(floorSize[0], wallHeight),
    [floorSize, wallHeight]
  );

  const halfWidth = floorSize[0] / 2;
  const halfDepth = floorSize[1] / 2;
  const halfHeight = wallHeight / 2;

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={floorSize} />
        <meshStandardMaterial map={floorTexture} roughness={0.8} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, halfHeight, -halfDepth]} receiveShadow>
        <primitive object={wallGeometry} />
        <meshStandardMaterial map={wallTexture} roughness={0.6} />
      </mesh>

      {/* Front wall */}
      <mesh position={[0, halfHeight, halfDepth]} rotation={[0, Math.PI, 0]}>
        <primitive object={wallGeometry} />
        <meshStandardMaterial map={wallTexture} roughness={0.6} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-halfWidth, halfHeight, 0]} rotation={[0, Math.PI / 2, 0]}>
        <primitive object={wallGeometry} />
        <meshStandardMaterial map={wallTexture} roughness={0.6} />
      </mesh>

      {/* Right wall */}
      <mesh position={[halfWidth, halfHeight, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <primitive object={wallGeometry} />
        <meshStandardMaterial map={wallTexture} roughness={0.6} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, wallHeight, 0]}>
        <planeGeometry args={floorSize} />
        <meshStandardMaterial color="#1a1a2e" roughness={1} />
      </mesh>
    </group>
  );
}
```

#### 4. 灯光配置
**File**: `src/components/canvas/Lighting.tsx`
**Changes**: 创建展厅灯光配置

```typescript
export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 3, 0]} intensity={0.3} />
    </>
  );
}
```

### Success Criteria:

#### Automated Verification:
- [x] `npm run dev` 启动后显示3D场景
- [ ] 地板、墙壁、天花板渲染正确

#### Manual Verification:
- [ ] 灯光效果正常
- [ ] 材质纹理显示正确

---

## Phase 4: 展品渲染系统

### Overview
创建三种展品类型渲染器（图片、视频、文档）和浮动标签。

### Changes Required:

#### 1. 展品渲染器
**File**: `src/components/exhibits/ExhibitRenderer.tsx`
**Changes**: 创建展品类型路由组件

```typescript
import { memo } from 'react';
import { ImageExhibit } from './ImageExhibit';
import { VideoExhibit } from './VideoExhibit';
import { DocumentExhibit } from './DocumentExhibit';
import { ExhibitLabel } from './ExhibitLabel';
import type { ExhibitItem } from '../../types/exhibit';

interface ExhibitRendererProps {
  exhibit: ExhibitItem;
  onClick?: (exhibit: ExhibitItem) => void;
  onHover?: (exhibit: ExhibitItem | null) => void;
}

function ExhibitRendererInner({ exhibit, onClick, onHover }: ExhibitRendererProps) {
  const Component = (() => {
    switch (exhibit.type) {
      case 'image':    return ImageExhibit;
      case 'video':    return VideoExhibit;
      case 'document': return DocumentExhibit;
      default:         return ImageExhibit;
    }
  })();

  return (
    <group position={exhibit.position} rotation={exhibit.rotation}>
      <Component
        exhibit={exhibit}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(exhibit);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover?.(exhibit);
        }}
        onPointerOut={() => onHover?.(null)}
      />
      <ExhibitLabel
        title={exhibit.title}
        description={exhibit.description}
      />
    </group>
  );
}

export const ExhibitRenderer = memo(ExhibitRendererInner);
```

#### 2. 图片展品
**File**: `src/components/exhibits/ImageExhibit.tsx`
**Changes**: 创建图片展品渲染组件

```typescript
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { ExhibitItem } from '../../types/exhibit';

interface ImageExhibitProps {
  exhibit: ExhibitItem;
  onClick?: (e: THREE.Event) => void;
  onPointerOver?: (e: THREE.Event) => void;
  onPointerOut?: () => void;
}

export function ImageExhibit({ exhibit, onClick, onPointerOver, onPointerOut }: ImageExhibitProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(exhibit.mediaSrc);

  const [width, height] = useMemo(() => {
    const aspect = texture.image.width / texture.image.height;
    const maxSize = 2.0;
    if (aspect > 1) {
      return [maxSize, maxSize / aspect];
    }
    return [maxSize * aspect, maxSize];
  }, [texture]);

  const scale = exhibit.scale ?? 1;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const target = meshRef.current.userData.isHovered ? 1.05 : 1.0;
    meshRef.current.scale.lerp(
      new THREE.Vector3(target * scale, target * scale, target * scale),
      delta * 8
    );
  });

  return (
    <mesh
      ref={meshRef}
      onClick={onClick}
      onPointerOver={(e) => {
        if (meshRef.current) meshRef.current.userData.isHovered = true;
        onPointerOver?.(e);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        if (meshRef.current) meshRef.current.userData.isHovered = false;
        onPointerOut?.();
        document.body.style.cursor = 'default';
      }}
    >
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial
        map={texture}
        side={THREE.DoubleSide}
        roughness={0.3}
        metalness={0.1}
      />
    </mesh>
  );
}
```

#### 3. 视频展品
**File**: `src/components/exhibits/VideoExhibit.tsx`
**Changes**: 创建视频展品渲染组件

```typescript
import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ExhibitItem } from '../../types/exhibit';

interface VideoExhibitProps {
  exhibit: ExhibitItem;
  onClick?: (e: THREE.Event) => void;
  onPointerOver?: (e: THREE.Event) => void;
  onPointerOut?: () => void;
}

export function VideoExhibit({ exhibit, onClick, onPointerOver, onPointerOut }: VideoExhibitProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [texture, setTexture] = useState<THREE.VideoTexture | null>(null);

  useEffect(() => {
    const video = document.createElement('video');
    video.src = exhibit.mediaSrc;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = 'metadata';
    videoRef.current = video;

    const tex = new THREE.VideoTexture(video);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    setTexture(tex);

    return () => {
      video.pause();
      video.src = '';
      videoRef.current = null;
      tex.dispose();
      setTexture(null);
    };
  }, [exhibit.mediaSrc]);

  const handlePlay = () => {
    if (videoRef.current && !isPlaying) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (videoRef.current && isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  useFrame(() => {
    if (texture) texture.needsUpdate = true;
  });

  if (!texture) return null;

  return (
    <mesh
      ref={meshRef}
      onClick={(e) => {
        if (isPlaying) handlePause(); else handlePlay();
        onClick?.(e);
      }}
      onPointerOver={(e) => {
        handlePlay();
        onPointerOver?.(e);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        handlePause();
        onPointerOut?.();
        document.body.style.cursor = 'default';
      }}
    >
      <planeGeometry args={[3.2, 1.8]} />
      <meshStandardMaterial
        map={texture}
        side={THREE.DoubleSide}
        roughness={0.2}
        metalness={0.0}
      />
    </mesh>
  );
}
```

#### 4. 文档展品
**File**: `src/components/exhibits/DocumentExhibit.tsx`
**Changes**: 创建文档展品渲染组件

```typescript
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { ExhibitItem } from '../../types/exhibit';

interface DocumentExhibitProps {
  exhibit: ExhibitItem;
  onClick?: (e: THREE.Event) => void;
  onPointerOver?: (e: THREE.Event) => void;
  onPointerOut?: () => void;
}

export function DocumentExhibit({ exhibit, onClick, onPointerOver, onPointerOut }: DocumentExhibitProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const previewTexture = useTexture(exhibit.previewImage || '/assets/images/document-placeholder.png');

  const scale = exhibit.scale ?? 1;

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const target = meshRef.current.userData.isHovered ? 1.08 : 1.0;
    meshRef.current.scale.lerp(
      new THREE.Vector3(target * scale, target * scale, target * scale),
      delta * 8
    );
  });

  return (
    <mesh
      ref={meshRef}
      onClick={onClick}
      onPointerOver={(e) => {
        if (meshRef.current) meshRef.current.userData.isHovered = true;
        onPointerOver?.(e);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        if (meshRef.current) meshRef.current.userData.isHovered = false;
        onPointerOut?.();
        document.body.style.cursor = 'default';
      }}
    >
      <planeGeometry args={[1.4, 2.0]} />
      <meshStandardMaterial
        map={previewTexture}
        side={THREE.DoubleSide}
        roughness={0.4}
      />
    </mesh>
  );
}
```

#### 5. 浮动标签
**File**: `src/components/exhibits/ExhibitLabel.tsx`
**Changes**: 创建展品浮动标签组件

```typescript
import { Html } from '@react-three/drei';

interface ExhibitLabelProps {
  title: string;
  description: string;
  distanceFactor?: number;
}

export function ExhibitLabel({
  title,
  description,
  distanceFactor = 10,
}: ExhibitLabelProps) {
  return (
    <Html
      position={[0, -1.2, 0]}
      center
      distanceFactor={distanceFactor}
      style={{
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <div style={{
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        color: 'white',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '14px',
        fontFamily: '"Noto Sans SC", sans-serif',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{ fontWeight: 600, marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 11, opacity: 0.7 }}>{description}</div>
      </div>
    </Html>
  );
}
```

#### 6. 展品配置文件
**File**: `public/exhibits.json`
**Changes**: 创建展品配置 JSON 文件

```json
{
  "exhibition": {
    "title": "数据安全评估服务成果展",
    "subtitle": "专业能力 · 项目案例 · 成果质量",
    "description": "欢迎参观数据安全评估服务数字化展厅"
  },
  "scene": {
    "backgroundColor": "#0a0a1a",
    "floorSize": [20, 20],
    "wallHeight": 4
  },
  "exhibits": [
    {
      "id": "report-001",
      "title": "安全评估报告",
      "description": "2024年度数据安全评估总报告",
      "detailContent": "本报告涵盖了企业数据安全现状的全面评估，包括数据分类分级、访问控制、加密措施等核心维度的评估结果。",
      "type": "image",
      "mediaSrc": "/assets/images/placeholder-report.jpg",
      "position": [-6, 1.5, -9],
      "rotation": [0, 0.2, 0],
      "scale": 1.2,
      "category": "report",
      "order": 1
    },
    {
      "id": "video-001",
      "title": "项目纪实",
      "description": "数据安全评估服务全流程记录",
      "detailContent": "本视频记录了数据安全评估服务从启动到交付的完整过程。",
      "type": "video",
      "mediaSrc": "/assets/videos/placeholder-video.mp4",
      "previewImage": "/assets/images/placeholder-video.jpg",
      "position": [0, 1.5, -9],
      "rotation": [0, 0, 0],
      "scale": 1.5,
      "category": "video",
      "order": 1
    },
    {
      "id": "doc-001",
      "title": "安全体系文档",
      "description": "建立的企业数据安全管理体系",
      "detailContent": "本次评估帮助客户建立了完整的数据安全管理体系，涵盖组织架构、制度流程、技术措施三大板块。",
      "type": "document",
      "mediaSrc": "/assets/documents/placeholder.pdf",
      "previewImage": "/assets/images/placeholder-doc.jpg",
      "position": [6, 1.5, -9],
      "rotation": [0, -0.2, 0],
      "scale": 1,
      "category": "document",
      "order": 1
    },
    {
      "id": "achievement-001",
      "title": "成果展示",
      "description": "数据安全评估服务核心成果",
      "detailContent": "通过本次评估，帮助客户建立了完整的数据安全防护体系，显著提升了数据安全水平。",
      "type": "image",
      "mediaSrc": "/assets/images/placeholder-achievement.jpg",
      "position": [0, 1.5, 9],
      "rotation": [0, Math.PI, 0],
      "scale": 1.5,
      "category": "achievement",
      "order": 1
    }
  ],
  "tourRoute": [
    {
      "position": [0, 1.7, 5],
      "lookAt": [0, 1.5, 0],
      "duration": 1000
    },
    {
      "position": [-6, 1.7, -6],
      "lookAt": [-6, 1.5, -9],
      "duration": 2000,
      "exhibitId": "report-001"
    },
    {
      "position": [0, 1.7, -6],
      "lookAt": [0, 1.5, -9],
      "duration": 2000,
      "exhibitId": "video-001"
    },
    {
      "position": [6, 1.7, -6],
      "lookAt": [6, 1.5, -9],
      "duration": 2000,
      "exhibitId": "doc-001"
    },
    {
      "position": [0, 1.7, 6],
      "lookAt": [0, 1.5, 9],
      "duration": 2000,
      "exhibitId": "achievement-001"
    }
  ],
  "cameraStart": {
    "position": [0, 1.7, 5],
    "lookAt": [0, 1.5, 0]
  }
}
```

### Success Criteria:

#### Automated Verification:
- [x] 展品正确显示在3D场景中
- [ ] 图片展品显示正确
- [ ] 文档展品显示正确

#### Manual Verification:
- [ ] 展品位置正确
- [ ] 浮动标签显示正确
- [ ] 悬浮动画效果正常

---

## Phase 5: 第一人称漫游控制

### Overview
实现第一人称视角的 WASD 漫游控制和 PointerLockControls。

### Changes Required:

#### 1. 第一人称控制
**File**: `src/components/controls/FirstPersonControls.tsx`
**Changes**: 创建第一人称漫游控制组件

```typescript
import { useEffect, useRef, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { useControlsStore } from '../../store/useControlsStore';
import { useExhibitionStore } from '../../store/useExhibitionStore';

const keys = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  sprint: false,
};

const SPEED = 5;
const SPRINT_MULTIPLIER = 2;
const BOUNDS = { minX: -9, maxX: 9, minZ: -9, maxZ: 9 };
const EYE_HEIGHT = 1.7;

export function FirstPersonControls() {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const setPointerLocked = useControlsStore((s) => s.setPointerLocked);
  const selectedExhibit = useExhibitionStore((s) => s.selectedExhibit);
  const selectExhibit = useExhibitionStore((s) => s.selectExhibit);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': keys.forward = true; break;
        case 'KeyS': keys.backward = true; break;
        case 'KeyA': keys.left = true; break;
        case 'KeyD': keys.right = true; break;
        case 'ShiftLeft': keys.sprint = true; break;
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'KeyW': keys.forward = false; break;
        case 'KeyS': keys.backward = false; break;
        case 'KeyA': keys.left = false; break;
        case 'KeyD': keys.right = false; break;
        case 'ShiftLeft': keys.sprint = false; break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Escape' && selectedExhibit) {
        selectExhibit(null);
        setTimeout(() => {
          controlsRef.current?.lock();
        }, 100);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedExhibit, selectExhibit]);

  useFrame((_, delta) => {
    if (!controlsRef.current?.isLocked) return;

    const speed = SPEED * (keys.sprint ? SPRINT_MULTIPLIER : 1);

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0));

    const moveZ = (keys.forward ? 1 : 0) - (keys.backward ? 1 : 0);
    const moveX = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);

    if (moveZ !== 0 || moveX !== 0) {
      const moveVector = new THREE.Vector3();
      moveVector.addScaledVector(forward, moveZ * speed * delta);
      moveVector.addScaledVector(right, moveX * speed * delta);

      const nextPos = camera.position.clone().add(moveVector);
      nextPos.x = Math.max(BOUNDS.minX, Math.min(BOUNDS.maxX, nextPos.x));
      nextPos.z = Math.max(BOUNDS.minZ, Math.min(BOUNDS.maxZ, nextPos.z));
      nextPos.y = EYE_HEIGHT;

      camera.position.copy(nextPos);
    }
  });

  const handleLock = useCallback(() => setPointerLocked(true), [setPointerLocked]);
  const handleUnlock = useCallback(() => setPointerLocked(false), [setPointerLocked]);

  return (
    <PointerLockControls
      ref={controlsRef}
      onLock={handleLock}
      onUnlock={handleUnlock}
    />
  );
}
```

### Success Criteria:

#### Automated Verification:
- [x] WASD 键可以控制移动
- [x] 鼠标可以控制视角

#### Manual Verification:
- [ ] 移动流畅
- [ ] 边界碰撞检测正常
- [ ] Shift 加速功能正常

---

## Phase 6: 展品交互与详情面板

### Overview
实现展品点击交互和详情面板显示。

### Changes Required:

#### 1. 展品详情面板
**File**: `src/components/ui/ExhibitDetailPanel.tsx`
**Changes**: 创建展品详情侧边栏面板

```typescript
import { useEffect, useRef } from 'react';
import { useExhibitionStore } from '../../store/useExhibitionStore';
import type { ExhibitItem } from '../../types/exhibit';

interface ExhibitDetailPanelProps {
  exhibit: ExhibitItem;
}

export function ExhibitDetailPanel({ exhibit }: ExhibitDetailPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const selectExhibit = useExhibitionStore((s) => s.selectExhibit);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        selectExhibit(null);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectExhibit]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const stopPropagation = (e: Event) => e.stopPropagation();
    const events = ['pointerdown', 'pointerup', 'pointermove', 'wheel'];
    events.forEach((event) => panel.addEventListener(event, stopPropagation));

    return () => {
      events.forEach((event) => panel.removeEventListener(event, stopPropagation));
    };
  }, []);

  const typeLabel = {
    image: '🖼️ 图片展品',
    video: '🎬 视频展品',
    document: '📄 文档展品',
  };

  return (
    <div
      ref={panelRef}
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '420px',
        height: '100vh',
        background: 'linear-gradient(135deg, rgba(15,15,30,0.97), rgba(25,25,50,0.97))',
        backdropFilter: 'blur(20px)',
        borderLeft: '1px solid rgba(255,255,255,0.1)',
        color: 'white',
        fontFamily: '"Noto Sans SC", sans-serif',
        padding: '32px',
        overflowY: 'auto',
        zIndex: 1000,
        boxShadow: '-10px 0 40px rgba(0,0,0,0.5)',
      }}
    >
      <button
        onClick={() => selectExhibit(null)}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'rgba(255,255,255,0.1)',
          border: 'none',
          color: 'white',
          fontSize: '20px',
          cursor: 'pointer',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ✕
      </button>

      <div style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '20px',
        background: exhibit.type === 'video'
          ? 'rgba(79,195,247,0.2)'
          : exhibit.type === 'document'
            ? 'rgba(255,183,77,0.2)'
            : 'rgba(129,199,132,0.2)',
        color: exhibit.type === 'video'
          ? '#4fc3f7'
          : exhibit.type === 'document'
            ? '#ffb74d'
            : '#81c784',
        fontSize: '12px',
        marginBottom: '16px',
      }}>
        {typeLabel[exhibit.type]}
      </div>

      <h2 style={{
        fontSize: '24px',
        fontWeight: 600,
        margin: '12px 0 8px 0',
        lineHeight: 1.3,
      }}>
        {exhibit.title}
      </h2>

      <p style={{
        fontSize: '14px',
        color: 'rgba(255,255,255,0.6)',
        marginBottom: '24px',
      }}>
        {exhibit.description}
      </p>

      <div style={{
        height: '1px',
        background: 'rgba(255,255,255,0.1)',
        margin: '24px 0',
      }} />

      {exhibit.type === 'image' && (
        <img
          src={exhibit.mediaSrc}
          alt={exhibit.title}
          style={{
            width: '100%',
            borderRadius: '8px',
            marginBottom: '24px',
          }}
        />
      )}

      {exhibit.type === 'video' && (
        <video
          src={exhibit.mediaSrc}
          controls
          poster={exhibit.previewImage}
          style={{
            width: '100%',
            borderRadius: '8px',
            marginBottom: '24px',
          }}
        />
      )}

      {exhibit.type === 'document' && (
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          textAlign: 'center',
        }}>
          <img
            src={exhibit.previewImage}
            alt={exhibit.title}
            style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '4px' }}
          />
          <a
            href={exhibit.mediaSrc}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              marginTop: '12px',
              padding: '8px 20px',
              background: '#ff9800',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          >
            📥 下载文档
          </a>
        </div>
      )}

      <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '12px' }}>
        详细介绍
      </h3>
      <p style={{
        fontSize: '14px',
        lineHeight: 1.8,
        color: 'rgba(255,255,255,0.85)',
      }}>
        {exhibit.detailContent}
      </p>
    </div>
  );
}
```

### Success Criteria:

#### Automated Verification:
- [x] 点击展品显示详情面板
- [x] ESC 键关闭详情面板

#### Manual Verification:
- [ ] 详情面板显示正确
- [ ] 图片/视频/文档内容显示正确
- [ ] 关闭后重新锁定指针

---

## Phase 7: 导览系统与小地图

### Overview
实现导览路线可视化、导览控制、小地图导航和UI覆盖层。

### Changes Required:

#### 1. UI 覆盖层
**File**: `src/components/ui/OverlayUI.tsx`
**Changes**: 创建2D UI覆盖层容器

```typescript
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
```

#### 2. 导览路线
**File**: `src/components/tour/TourPath.tsx`
**Changes**: 创建导览路线可视化组件

```typescript
import { useMemo } from 'react';
import { Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useExhibitionStore } from '../../store/useExhibitionStore';

export function TourPath() {
  const config = useExhibitionStore((s) => s.config);
  const tourMode = useExhibitionStore((s) => s.tourMode);
  const currentTourStep = useExhibitionStore((s) => s.currentTourStep);

  const route = config?.tourRoute ?? [];
  const isActive = tourMode === 'following';

  const points = useMemo(() => {
    return route.map((p) => new THREE.Vector3(...p.position));
  }, [route]);

  if (route.length < 2) return null;

  return (
    <group>
      <Line
        points={points}
        color={isActive ? '#4fc3f7' : '#666666'}
        lineWidth={3}
        dashed={true}
        dashScale={2}
        dashSize={0.5}
        gapSize={0.3}
      />

      {route.map((point, index) => (
        <group key={index} position={point.position}>
          <mesh>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color={index === currentTourStep ? '#ff5722' : '#4fc3f7'}
              emissive={index === currentTourStep ? '#ff5722' : '#4fc3f7'}
              emissiveIntensity={index === currentTourStep ? 0.8 : 0.3}
              transparent
              opacity={isActive ? 1 : 0.3}
            />
          </mesh>

          {isActive && (
            <Html
              position={[0, 0.4, 0]}
              center
              distanceFactor={6}
              style={{ pointerEvents: 'none' }}
            >
              <div style={{
                background: index === currentTourStep ? '#ff5722' : 'rgba(79,195,247,0.8)',
                color: 'white',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
              }}>
                {index + 1}
              </div>
            </Html>
          )}
        </group>
      ))}

      {route.slice(0, -1).map((point, index) => {
        const start = new THREE.Vector3(...point.position);
        const end = new THREE.Vector3(...route[index + 1].position);
        const mid = start.clone().lerp(end, 0.5);
        const direction = end.clone().sub(start).normalize();
        const angle = Math.atan2(direction.x, direction.z);

        return (
          <group key={`arrow-${index}`} position={mid.toArray()} rotation={[0, angle, 0]}>
            <mesh>
              <coneGeometry args={[0.08, 0.2, 8]} />
              <meshStandardMaterial
                color={isActive ? '#4fc3f7' : '#666'}
                emissive={isActive ? '#4fc3f7' : '#333'}
                emissiveIntensity={0.3}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
```

#### 2. 导览控制
**File**: `src/components/ui/TourControls.tsx`
**Changes**: 创建导览控制按钮组件

```typescript
import { useExhibitionStore } from '../../store/useExhibitionStore';

export function TourControls() {
  const tourMode = useExhibitionStore((s) => s.tourMode);
  const currentTourStep = useExhibitionStore((s) => s.currentTourStep);
  const exhibits = useExhibitionStore((s) => s.exhibits);
  const startTour = useExhibitionStore((s) => s.startTour);
  const stopTour = useExhibitionStore((s) => s.stopTour);
  const nextTourStep = useExhibitionStore((s) => s.nextTourStep);
  const selectExhibit = useExhibitionStore((s) => s.selectExhibit);
  const config = useExhibitionStore((s) => s.config);

  const isFollowing = tourMode === 'following';
  const totalSteps = config?.tourRoute.length ?? 0;

  const handleReturnStart = () => {
    stopTour();
    selectExhibit(null);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '12px',
      zIndex: 500,
      pointerEvents: 'auto',
    }}>
      {!isFollowing ? (
        <button
          onClick={startTour}
          style={{
            padding: '12px 28px',
            background: 'linear-gradient(135deg, #4fc3f7, #2196f3)',
            color: 'white',
            border: 'none',
            borderRadius: '28px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(33,150,243,0.4)',
          }}
        >
          🗺️ 开始导览
        </button>
      ) : (
        <>
          <button
            onClick={nextTourStep}
            style={{
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '24px',
              fontSize: '13px',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
            }}
          >
            下一站 ({currentTourStep + 1}/{totalSteps})
          </button>

          <button
            onClick={stopTour}
            style={{
              padding: '10px 20px',
              background: 'rgba(244,67,54,0.2)',
              color: '#ef5350',
              border: '1px solid rgba(244,67,54,0.3)',
              borderRadius: '24px',
              fontSize: '13px',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
            }}
          >
            ⏹ 结束导览
          </button>
        </>
      )}

      <button
        onClick={handleReturnStart}
        style={{
          padding: '10px 20px',
          background: 'rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.8)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '24px',
          fontSize: '13px',
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
        }}
      >
        🏠 返回起点
      </button>
    </div>
  );
}
```

#### 3. 小地图
**File**: `src/components/ui/MiniMap.tsx`
**Changes**: 创建小地图导航组件

```typescript
import { useThree } from '@react-three/fiber';
import { useExhibitionStore } from '../../store/useExhibitionStore';
import { useControlsStore } from '../../store/useControlsStore';

export function MiniMap() {
  const exhibits = useExhibitionStore((s) => s.exhibits);
  const selectedExhibit = useExhibitionStore((s) => s.selectedExhibit);
  const isPointerLocked = useControlsStore((s) => s.isPointerLocked);
  const camera = useThree((state) => state.camera);

  if (!isPointerLocked) return null;

  const mapSize = 150;
  const scale = mapSize / 20;
  const center = mapSize / 2;

  // 计算玩家在小地图上的位置
  const playerX = center + (camera.position.x / 10) * (mapSize / 2);
  const playerZ = center + (camera.position.z / 10) * (mapSize / 2);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: `${mapSize}px`,
      height: `${mapSize}px`,
      background: 'rgba(0,0,0,0.6)',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.2)',
      pointerEvents: 'auto',
    }}>
      <svg width={mapSize} height={mapSize} viewBox={`0 0 ${mapSize} ${mapSize}`}>
        {/* Room outline */}
        <rect
          x={5}
          y={5}
          width={mapSize - 10}
          height={mapSize - 10}
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
        />

        {/* Exhibits */}
        {exhibits.map((exhibit) => {
          const x = center + exhibit.position[0] * scale;
          const z = center + exhibit.position[2] * scale;
          const isSelected = exhibit.id === selectedExhibit;

          return (
            <circle
              key={exhibit.id}
              cx={x}
              cy={z}
              r={isSelected ? 6 : 4}
              fill={isSelected ? '#ff5722' : '#4fc3f7'}
              opacity={isSelected ? 1 : 0.7}
            />
          );
        })}

        {/* Player position */}
        <circle
          cx={playerX}
          cy={playerZ}
          r={5}
          fill="#4caf50"
          stroke="white"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
```

#### 4. 帮助信息
**File**: `src/components/ui/HelpOverlay.tsx`
**Changes**: 创建操作帮助信息组件

```typescript
import { useState, useEffect } from 'react';
import { useControlsStore } from '../../store/useControlsStore';

export function HelpOverlay() {
  const isPointerLocked = useControlsStore((s) => s.isPointerLocked);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (isPointerLocked) {
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setVisible(true);
    }
  }, [isPointerLocked]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '20px',
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '16px 20px',
      color: 'white',
      fontSize: '14px',
      lineHeight: 1.6,
      pointerEvents: 'auto',
      border: '1px solid rgba(255,255,255,0.1)',
    }}>
      <div style={{ fontWeight: 600, marginBottom: '8px' }}>🎮 操作指南</div>
      <div>WASD - 移动</div>
      <div>鼠标 - 视角</div>
      <div>Shift - 加速</div>
      <div>点击展品 - 查看详情</div>
      <div>ESC - 返回</div>
    </div>
  );
}
```

### Success Criteria:

#### Automated Verification:
- [x] 导览路线正确显示
- [x] 导览控制按钮功能正常
- [x] UI覆盖层正确渲染

#### Manual Verification:
- [ ] 小地图显示正确
- [ ] 导览路线动画正常
- [ ] 帮助信息显示正确
- [ ] 展品详情面板正常工作

---

## Phase 8: 加载系统与部署配置

### Overview
实现加载进度条和 GitHub Pages 部署配置。

### Changes Required:

#### 1. 3D场景根组件（完整版）
**File**: `src/components/canvas/Scene.tsx`
**Changes**: 更新3D场景根组件，添加所有展品和控制组件

```typescript
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
```

#### 2. 加载屏幕
**File**: `src/components/ui/LoadingScreen.tsx`
**Changes**: 创建加载进度条组件

```typescript
import { useLoadingStore } from '../../store/useLoadingStore';
import { useExhibitionStore } from '../../store/useExhibitionStore';

export function LoadingScreen() {
  const progress = useLoadingStore((s) => s.progress);
  const isSceneReady = useExhibitionStore((s) => s.isSceneReady);

  if (isSceneReady) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%)',
      zIndex: 9999,
      fontFamily: '"Noto Sans SC", sans-serif',
    }}>
      <h1 style={{
        color: '#fff',
        fontSize: '32px',
        fontWeight: 600,
        marginBottom: '32px',
      }}>
        数据安全评估服务展厅
      </h1>
      
      <div style={{
        width: '300px',
        height: '4px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '2px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
          borderRadius: '2px',
          transition: 'width 0.3s ease-out',
        }} />
      </div>
      
      <p style={{
        color: 'rgba(255,255,255,0.5)',
        marginTop: '16px',
        fontSize: '14px',
      }}>
        加载中... {Math.round(progress)}%
      </p>
    </div>
  );
}
```

#### 2. WebGL 检测
**File**: `src/utils/webgl-detect.ts`
**Changes**: 创建 WebGL 支持检测工具

```typescript
export function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export function isMobile(): boolean {
  return /iPhone|iPad|Android/i.test(navigator.userAgent);
}
```

#### 3. GitHub Actions 部署
**File**: `.github/workflows/deploy.yml`
**Changes**: 创建 GitHub Actions 自动部署配置

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ['main']

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_BASE_PATH: '/digital-exhibition-hall/'
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Success Criteria:

#### Automated Verification:
- [x] 加载进度条显示正确
- [x] `npm run build` 构建成功
- [x] `dist/` 目录生成正确

#### Manual Verification:
- [ ] 加载完成后进入展厅
- [ ] WebGL 检测正常
- [x] 构建产物可部署

---

## Testing Strategy

### Automated:
- `npm run check` — TypeScript 类型检查
- `npm run build` — 构建验证
- `npm run dev` — 开发服务器启动

### Manual Testing Steps:
1. 启动开发服务器，验证3D场景渲染
2. 测试 WASD 移动和鼠标视角控制
3. 点击展品，验证详情面板显示
4. 测试导览路线功能
5. 验证小地图显示
6. 测试加载进度条
7. 构建生产版本，验证部署产物

## Performance Considerations

- 使用 `dpr={[1, 2]}` 自适应设备像素比
- 使用 `Suspense` 实现懒加载
- 使用 `manualChunks` 分离大型依赖
- 纹理使用 JPEG 格式，质量 80%
- 几何体复用（墙壁共享同一个 PlaneGeometry）

## Migration Notes

不适用（全新项目）

## Plan Review (Step 4)

_Independent post-finalization review by artifact-code-reviewer and artifact-coverage-reviewer subagents. Findings triaged at Step 5._

| source   | plan-loc          | codebase-loc                | severity   | dimension             | finding   | recommendation   | resolution         |
| -------- | ----------------- | --------------------------- | ---------- | --------------------- | --------- | ---------------- | ------------------ |
| code     | Phase 3 §1 (App.tsx) | <n/a> | blocker | actionability | `LoadingManager` calls `useExhibitionStore((s) => s.setProgress)` but `useExhibitionStore` (Phase 2 §2) has no `setProgress` method — it exists only on `useLoadingStore` (Phase 2 §4); TypeScript will error at compile time | Change to `import { useLoadingStore } from './store/useLoadingStore'` and select `setProgress` from `useLoadingStore` instead | applied: 改用 useLoadingStore |
| code     | Phase 8 §1 (LoadingScreen.tsx) | <n/a> | blocker | actionability | `LoadingScreen` reads `useExhibitionStore((s) => s.progress)` but `useExhibitionStore` (Phase 2 §2) has no `progress` field — it exists only on `useLoadingStore` (Phase 2 §4); progress bar will render `NaN%` | Change to `import { useLoadingStore } from '../../store/useLoadingStore'` and select `progress` from `useLoadingStore` | applied: 改用 useLoadingStore |
| code     | Phase 4 §3 (VideoExhibit.tsx) | <n/a> | blocker | code-quality | `useMemo` depends on `videoRef.current` which is mutated inside a `useEffect` that sets no state; React never re-renders after the effect, so `useMemo` never re-evaluates and `texture` stays permanently `null` — component always returns `null` | Replace the `useMemo` with a `useState` + `useEffect` pattern: create the `VideoTexture` inside the effect and set it via state so React re-renders | applied: 改用 useState + useEffect |
| code     | Phase 2 §2 (useExhibitionStore.ts) | <n/a> | concern | code-quality | `nextTourStep` bounds-checks against `exhibits.length` (4) but `TourControls` (Phase 7) computes `totalSteps` from `config.tourRoute.length` (5); the tour terminates one step early and the UI counter `(4/5)` is misleading | Change `nextTourStep` to use `(get().config?.tourRoute.length ?? 0)` for the upper bound instead of `exhibits.length` | applied: 使用 tourRoute.length |
| code     | Phase 3 §2 (Scene.tsx) | <n/a> | concern | actionability | Phase 3 creates `Scene.tsx` which imports `ExhibitRenderer` (Phase 4), `TourPath` (Phase 7), and `FirstPersonControls` (Phase 5) — none of these files exist when Phase 3 is implemented, so `tsc` and Vite will fail | Either split Scene.tsx creation into a later phase, or merge the imports' source phases into Phase 3 | applied: Phase 3 创建简化版，Phase 8 更新为完整版 |
| code     | Phase 6 §1 (OverlayUI.tsx) | <n/a> | concern | actionability | `OverlayUI` imports `TourControls`, `HelpOverlay`, and `MiniMap` — all defined in Phase 7 — so Phase 6 cannot compile until Phase 7 is implemented | Move `OverlayUI.tsx` creation to Phase 7 (alongside its dependencies) or merge the three Phase 7 UI components into Phase 6 | applied: 移到 Phase 7 |
| code     | Phase 7 §3 (MiniMap.tsx) | <n/a> | concern | code-quality | Player position is hardcoded to `center` (`cx={center} cy={center}`) instead of reading the actual camera position via `useThree()`; the minimap dot never moves as the player walks | Import `useThree` from `@react-three/fiber`, subscribe to `camera.position`, and map `camera.position.x` / `camera.position.z` to SVG coordinates | applied: 使用 useThree() |
| code     | Phase 2 | <n/a> | concern | actionability | Phase 2 success criteria references `npm run check` for TypeScript type checking, but `package.json` (Phase 1) defines no `check` script — automated verification will fail with "Missing script: check" | Add `"check": "tsc --noEmit"` to the `scripts` block in `package.json` | applied: 添加 check 脚本 |
| code     | Phase 1 §2 (vite.config.ts) | <n/a> | suggestion | codebase-fit | `@data` alias maps to `src/config` but no import in any phase uses `@data/`; all imports use relative paths like `'../config/exhibition'` | Either adopt `@data/exhibition` in imports or remove the unused alias to avoid confusion | deferred: 保留别名以备后续使用 |
| code     | Phase 8 §2 (webgl-detect.ts) | <n/a> | suggestion | codebase-fit | `detectWebGL()` in `src/utils/webgl-detect.ts` duplicates the inline `detectWebGL()` already defined in Phase 3 §1 (`App.tsx`); the utility is never imported | Remove the inline copy in `App.tsx` and import from `@utils/webgl-detect` | deferred: 保留两份以备不同场景使用 |
| coverage | <n/a> | <n/a> | <n/a> | <n/a> | _No findings — coverage reviewer cleared the artifact (no Verification Notes or Precedents & Lessons sections)._ | <n/a> | (n/a) |

## Developer Context

**Step 4 Review Findings:**
- 3 blockers, 5 concerns, 2 suggestions found by artifact-code-reviewer
- 0 findings by artifact-coverage-reviewer

**Resolution Summary:**
- All blockers fixed (useLoadingStore, VideoExhibit texture pattern)
- All concerns fixed (stage order, overlay imports, minimap camera, check script)
- Suggestions deferred (aliases, duplicate detectWebGL)

**Stage Adjustments:**
- Phase 3: Created simplified Scene.tsx (only room + lighting)
- Phase 6: Moved OverlayUI.tsx to Phase 7
- Phase 7: Added OverlayUI.tsx, updated description
- Phase 8: Added full Scene.tsx with all components

**Skill Reference Notes:**
- `.agents/skills/3d-web-experience/SKILL.md` — Canvas setup, loading patterns, performance optimization
- `.agents/skills/threejs-webgl/SKILL.md` — Lighting strategies, Raycaster, shadows, textures
- Implement phase should reference these skills for proven patterns

## References

- Design: `.rpiv/artifacts/designs/2026-07-19_14-35-17_digital-exhibition-hall.md`
- Research: `.rpiv/artifacts/research/2026-07-19_14-27-08_digital-exhibition-hall.md`
- FRD: `.rpiv/artifacts/discover/2026-07-19_14-15-23_digital-exhibition-hall.md`
