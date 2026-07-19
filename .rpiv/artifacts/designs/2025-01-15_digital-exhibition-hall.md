---
date: 2025-01-15T11:00:00+08:00
author: MiMo
commit: n/a
branch: main
repository: 数字化展厅
topic: "数据安全评估服务数字化展厅 — 架构设计"
tags: [design, threejs, r3f, 3d-exhibition, vercel]
status: in-progress
last_updated: 2025-01-15T11:00:00+08:00
last_updated_by: MiMo
parent: .rpiv/artifacts/research/2025-01-15_digital-exhibition-hall.md
---

# Design: 数据安全评估服务数字化展厅

## Summary

使用 React Three Fiber 构建 3D 沉浸式数字化展厅，通过程序化生成所有 3D 几何体（不依赖外部模型文件），采用深蓝渐变科技风视觉设计。系统分为 8 个垂直切片：项目基础 → 类型定义 → 房间组件 → 展品组件 → 相机导航 → UI 叠加层 → 配置驱动 → 部署优化。每个切片独立可验证，逐步构建完整的展厅体验。

## Requirements

- 3D 沉浸式虚拟展厅，用户可自由漫游和查看展品
- 按内容类型分区：文档资料区、海报展示区、视频播放区、数据看板区
- 混合导航：默认引导式参观 + 可切换自由漫游
- 展品交互：点击查看详情弹窗（文档/海报/视频）
- 3D 小地图显示当前位置
- 配置文件驱动内容管理
- 多端适配：PC/平板/手机
- 深蓝渐变 + 科技感视觉风格
- WebGL 降级方案
- 部署到 Vercel 免费套餐

## Current State Analysis

### Key Discoveries

- 全新项目，无现有代码库
- 已安装 3D 相关技能文件（3d-web-experience、threejs-webgl）
- 本地仅做代码开发，不在本地安装运行依赖
- Vercel 免费套餐 100GB 带宽/月，足够 500-2000 访客

### 技术栈确定

| 层 | 技术 | 版本 |
|---|---|---|
| 3D 渲染 | React Three Fiber | ^8.x |
| 3D 辅助 | @react-three/drei | ^9.x |
| 3D 后处理 | @react-three/postprocessing | ^2.x |
| 状态管理 | Zustand | ^4.x |
| 动画 | @react-spring/three | ^9.x |
| UI 样式 | Tailwind CSS | ^3.x |
| 构建工具 | Vite | ^5.x |
| 语言 | TypeScript | ^5.x |
| 包管理 | npm | - |

## Scope

### Building
- Vite + React + TypeScript 项目脚手架
- 程序化 3D 展厅场景（房间、墙壁、地板、天花板）
- 4 种展品组件（海报、文档、视频、数据看板）
- 混合相机导航系统（引导式 + 自由漫游）
- HTML 叠加层 UI（导航菜单、展品详情、小地图、加载画面）
- JSON 配置文件驱动
- 设备自适应与性能优化
- WebGL 降级方案
- Vercel 部署配置

### Not Building
- 后台管理系统
- 用户登录/权限
- 实时多人在线
- VR/AR 支持
- 自定义 3D 模型导入

## Decisions

### D1: 3D 框架选型
**Question**: React Three Fiber vs 原生 Three.js
**Chosen**: React Three Fiber — 开发效率高 2-3 倍，声明式 JSX 匹配展厅数据结构
**Rationale**: 展厅是数据驱动的应用，R3F 的组件化天然匹配展区 → 展品的层级结构

### D2: 状态管理
**Question**: Zustand vs Redux vs Context API
**Chosen**: Zustand — 轻量（~1KB），天然集成 R3F，无样板代码
**Rationale**: 展厅状态简单（导航模式、当前展区、展品详情），不需要 Redux 的复杂性

### D3: 动画方案
**Question**: @react-spring/three vs GSAP vs Framer Motion
**Chosen**: @react-spring/three — 物理引擎驱动，与 R3F 深度集成
**Rationale**: 相机飞行动画需要物理级平滑过渡，react-spring 的弹簧动画最适合

### D4: 3D 场景构建方式
**Question**: 程序化生成 vs 外部 3D 模型文件
**Chosen**: 程序化生成 — 代码构建所有几何体
**Rationale**: 部署体积极小（代码 < 100KB vs 模型 10-50MB），加载快，易维护

### D5: 视频托管方案
**Question**: 嵌入部署 vs 外部托管
**Chosen**: 外部托管（YouTube 未列出视频 / Cloudflare Stream）
**Rationale**: 节省 Vercel 带宽，视频是最大的带宽消耗源

### D6: CSS 方案
**Question**: Tailwind CSS vs CSS Modules vs Styled Components
**Chosen**: Tailwind CSS — 快速构建 UI 叠加层样式
**Rationale**: HTML 叠加层（导航、详情弹窗）需要快速迭代样式

## Architecture

### 项目结构

```
digital-exhibition-hall/
├── public/
│   ├── textures/              # WebP 纹理文件
│   │   ├── wall.webp          # 墙壁纹理
│   │   ├── floor.webp         # 地板纹理
│   │   └── ceiling.webp       # 天花板纹理
│   ├── posters/               # 海报图片
│   │   └── *.webp
│   └── favicon.ico
├── src/
│   ├── main.tsx               # 应用入口
│   ├── App.tsx                # 根组件
│   ├── index.css              # 全局样式 + Tailwind
│   ├── types/
│   │   └── exhibition.ts      # 类型定义
│   ├── config/
│   │   └── exhibition.json    # 展厅配置文件
│   ├── store/
│   │   └── useExhibition.ts   # Zustand 状态管理
│   ├── scene/
│   │   ├── ExhibitionHall.tsx  # 展厅主场景
│   │   ├── Room.tsx           # 参数化房间组件
│   │   ├── Lighting.tsx       # 灯光系统
│   │   ├── Particles.tsx      # 粒子效果
│   │   ├── GridFloor.tsx      # 科技感地板
│   │   └── exhibits/
│   │       ├── ExhibitRouter.tsx    # 展品路由
│   │       ├── PosterExhibit.tsx    # 海报展品
│   │       ├── DocumentExhibit.tsx  # 文档展品
│   │       ├── VideoExhibit.tsx     # 视频展品
│   │       └── DataVizExhibit.tsx   # 数据看板展品
│   ├── camera/
│   │   ├── CameraController.tsx  # 相机控制系统
│   │   ├── GuidedTour.tsx       # 引导式参观
│   │   └── FreeRoam.tsx         # 自由漫游
│   ├── ui/
│   │   ├── Navigation.tsx       # 导航菜单
│   │   ├── ExhibitDetail.tsx    # 展品详情弹窗
│   │   ├── Minimap.tsx          # 小地图
│   │   ├── LoadingScreen.tsx    # 加载画面
│   │   ├── ControlHints.tsx     # 操作提示
│   │   └── WebglFallback.tsx    # WebGL 降级
│   └── utils/
│       ├── device.ts            # 设备检测
│       └── webgl.ts             # WebGL 检测
├── vercel.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tsconfig.node.json
├── package.json
└── index.html
```

### ### src/types/exhibition.ts — NEW

```typescript
// 展品类型定义
export type ExhibitType = 'poster' | 'document' | 'video' | 'dataviz';

// 展品配置
export interface ExhibitConfig {
  id: string;
  type: ExhibitType;
  title: string;
  description: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  // 海报/文档：图片URL
  imageUrl?: string;
  // 视频：嵌入URL
  videoUrl?: string;
  // 文档：内容文件路径
  contentPath?: string;
  // 数据看板：数据
  data?: DataVizItem[];
}

// 数据看板数据项
export interface DataVizItem {
  label: string;
  value: number;
  color: string;
}

// 展区配置
export interface ZoneConfig {
  id: string;
  name: string;
  description: string;
  position: [number, number, number];
  size: [number, number, number];
  wallColor?: string;
  floorColor?: string;
  exhibits: ExhibitConfig[];
}

// 观察点（用于引导式参观）
export interface Waypoint {
  position: [number, number, number];
  lookAt: [number, number, number];
  label: string;
  zoneId: string;
}

// 展厅配置
export interface ExhibitionConfig {
  exhibition: {
    title: string;
    subtitle: string;
    version: string;
  };
  settings: {
    backgroundColor: string;
    ambientColor: string;
    ambientIntensity: number;
    particleColor: string;
  };
  zones: ZoneConfig[];
  tour: {
    waypoints: Waypoint[];
  };
}

// 导航模式
export type CameraMode = 'guided' | 'free' | 'exhibit-focus';

// 展厅状态
export interface ExhibitionState {
  // 导航
  cameraMode: CameraMode;
  currentWaypointIndex: number;
  setCameraMode: (mode: CameraMode) => void;
  nextWaypoint: () => void;
  prevWaypoint: () => void;
  goToWaypoint: (index: number) => void;

  // 展品
  selectedExhibit: ExhibitConfig | null;
  selectExhibit: (exhibit: ExhibitConfig | null) => void;

  // 加载
  isLoaded: boolean;
  loadProgress: number;
  setLoaded: (loaded: boolean) => void;
  setLoadProgress: (progress: number) => void;

  // UI
  showMinimap: boolean;
  showHints: boolean;
  toggleMinimap: () => void;
  toggleHints: () => void;
}
```

### ### src/config/exhibition.json — NEW

```json
{
  "exhibition": {
    "title": "数据安全评估服务成果展",
    "subtitle": "守护数据安全，赋能数字未来",
    "version": "1.0.0"
  },
  "settings": {
    "backgroundColor": "#0a0e1a",
    "ambientColor": "#4488ff",
    "ambientIntensity": 0.3,
    "particleColor": "#4488ff"
  },
  "zones": [
    {
      "id": "entrance",
      "name": "入口大厅",
      "description": "欢迎来到数据安全评估服务成果展",
      "position": [0, 0, 0],
      "size": [16, 12, 5],
      "wallColor": "#0d1525",
      "floorColor": "#0a1020",
      "exhibits": [
        {
          "id": "welcome-screen",
          "type": "video",
          "title": "项目概览",
          "description": "数据安全评估服务项目介绍视频",
          "position": [0, 2.5, -5.8],
          "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
        }
      ]
    },
    {
      "id": "documents",
      "name": "文档资料区",
      "description": "项目过程中沉淀的核心文档资料",
      "position": [0, 0, -16],
      "size": [20, 16, 5],
      "wallColor": "#0d1525",
      "floorColor": "#0a1020",
      "exhibits": [
        {
          "id": "doc-assessment-report",
          "type": "document",
          "title": "数据安全评估报告",
          "description": "全面的数据安全评估报告，涵盖风险分析和建议",
          "position": [-8, 1.8, -7.5],
          "imageUrl": "/posters/doc-assessment.webp"
        },
        {
          "id": "doc-compliance-guide",
          "type": "document",
          "title": "合规指南",
          "description": "数据安全合规性检查指南",
          "position": [-4, 1.8, -7.5],
          "imageUrl": "/posters/doc-compliance.webp"
        },
        {
          "id": "doc-risk-matrix",
          "type": "document",
          "title": "风险矩阵",
          "description": "数据安全风险评估矩阵",
          "position": [0, 1.8, -7.5],
          "imageUrl": "/posters/doc-risk.webp"
        },
        {
          "id": "doc-remediation-plan",
          "type": "document",
          "title": "整改方案",
          "description": "数据安全问题整改实施方案",
          "position": [4, 1.8, -7.5],
          "imageUrl": "/posters/doc-remediation.webp"
        },
        {
          "id": "doc-executive-summary",
          "type": "document",
          "title": "执行摘要",
          "description": "面向管理层的项目执行摘要",
          "position": [8, 1.8, -7.5],
          "imageUrl": "/posters/doc-summary.webp"
        }
      ]
    },
    {
      "id": "posters",
      "name": "海报展示区",
      "description": "项目宣传海报和可视化成果",
      "position": [-20, 0, 0],
      "size": [16, 12, 5],
      "wallColor": "#0d1525",
      "floorColor": "#0a1020",
      "exhibits": [
        {
          "id": "poster-security-overview",
          "type": "poster",
          "title": "数据安全总览",
          "description": "数据安全评估服务整体概览海报",
          "position": [-7.5, 2.5, -5.8],
          "imageUrl": "/posters/poster-overview.webp"
        },
        {
          "id": "poster-threat-landscape",
          "type": "poster",
          "title": "威胁态势",
          "description": "当前数据安全威胁态势分析",
          "position": [-2.5, 2.5, -5.8],
          "imageUrl": "/posters/poster-threats.webp"
        },
        {
          "id": "poster-protection-layers",
          "type": "poster",
          "title": "防护体系",
          "description": "多层次数据安全防护体系",
          "position": [2.5, 2.5, -5.8],
          "imageUrl": "/posters/poster-protection.webp"
        },
        {
          "id": "poster-compliance-framework",
          "type": "poster",
          "title": "合规框架",
          "description": "数据安全合规框架与标准",
          "position": [7.5, 2.5, -5.8],
          "imageUrl": "/posters/poster-compliance.webp"
        }
      ]
    },
    {
      "id": "videos",
      "name": "视频播放区",
      "description": "项目宣传视频和演示",
      "position": [20, 0, 0],
      "size": [16, 12, 5],
      "wallColor": "#0d1525",
      "floorColor": "#0a1020",
      "exhibits": [
        {
          "id": "video-project-intro",
          "type": "video",
          "title": "项目介绍",
          "description": "数据安全评估服务项目介绍",
          "position": [-4, 2.5, -5.8],
          "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
        },
        {
          "id": "video-demo",
          "type": "video",
          "title": "评估演示",
          "description": "数据安全评估流程演示",
          "position": [4, 2.5, -5.8],
          "videoUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
        }
      ]
    },
    {
      "id": "dashboard",
      "name": "数据看板区",
      "description": "项目关键数据和成果指标",
      "position": [0, 0, 16],
      "size": [16, 12, 5],
      "wallColor": "#0d1525",
      "floorColor": "#0a1020",
      "exhibits": [
        {
          "id": "dataviz-risk-scores",
          "type": "dataviz",
          "title": "风险评分分布",
          "description": "各系统数据安全风险评分分布",
          "position": [-4, 2, -5.8],
          "data": [
            { "label": "高风险", "value": 15, "color": "#ff4444" },
            { "label": "中风险", "value": 35, "color": "#ffaa00" },
            { "label": "低风险", "value": 50, "color": "#44ff44" }
          ]
        },
        {
          "id": "dataviz-compliance-rate",
          "type": "dataviz",
          "title": "合规达标率",
          "description": "各维度合规达标情况",
          "position": [4, 2, -5.8],
          "data": [
            { "label": "数据分类", "value": 92, "color": "#4488ff" },
            { "label": "访问控制", "value": 88, "color": "#44aaff" },
            { "label": "加密传输", "value": 95, "color": "#44ddff" },
            { "label": "审计日志", "value": 85, "color": "#44ffff" }
          ]
        }
      ]
    }
  ],
  "tour": {
    "waypoints": [
      {
        "position": [0, 2, 6],
        "lookAt": [0, 2, 0],
        "label": "入口大厅",
        "zoneId": "entrance"
      },
      {
        "position": [0, 2, -10],
        "lookAt": [0, 2, -16],
        "label": "文档资料区",
        "zoneId": "documents"
      },
      {
        "position": [-14, 2, 0],
        "lookAt": [-20, 2, 0],
        "label": "海报展示区",
        "zoneId": "posters"
      },
      {
        "position": [14, 2, 0],
        "lookAt": [20, 2, 0],
        "label": "视频播放区",
        "zoneId": "videos"
      },
      {
        "position": [0, 2, 10],
        "lookAt": [0, 2, 16],
        "label": "数据看板区",
        "zoneId": "dashboard"
      }
    ]
  }
}
```

### ### src/store/useExhibition.ts — NEW

```typescript
import { create } from 'zustand';
import type { CameraMode, ExhibitConfig, ExhibitionState } from '../types/exhibition';

export const useExhibition = create<ExhibitionState>((set, get) => ({
  // 导航状态
  cameraMode: 'guided',
  currentWaypointIndex: 0,
  setCameraMode: (mode: CameraMode) => set({ cameraMode: mode }),
  nextWaypoint: () => {
    const { currentWaypointIndex } = get();
    set({ currentWaypointIndex: currentWaypointIndex + 1 });
  },
  prevWaypoint: () => {
    const { currentWaypointIndex } = get();
    set({ currentWaypointIndex: Math.max(0, currentWaypointIndex - 1) });
  },
  goToWaypoint: (index: number) => set({ currentWaypointIndex: index }),

  // 展品状态
  selectedExhibit: null,
  selectExhibit: (exhibit: ExhibitConfig | null) => set({ selectedExhibit: exhibit }),

  // 加载状态
  isLoaded: false,
  loadProgress: 0,
  setLoaded: (loaded: boolean) => set({ isLoaded: loaded }),
  setLoadProgress: (progress: number) => set({ loadProgress: progress }),

  // UI 状态
  showMinimap: true,
  showHints: true,
  toggleMinimap: () => set((s) => ({ showMinimap: !s.showMinimap })),
  toggleHints: () => set((s) => ({ showHints: !s.showHints })),
}));
```

### ### src/utils/device.ts — NEW

```typescript
export interface DeviceCapabilities {
  isMobile: boolean;
  isLowEnd: boolean;
  pixelRatio: number;
  maxTextureSize: number;
  shadowsEnabled: boolean;
}

export function detectDevice(): DeviceCapabilities {
  const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);

  let isLowEnd = false;
  let maxTextureSize = 2048;

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        isLowEnd = /SwiftShader|Mesa|Intel|Adreno 3|Adreno 4|PowerVR|Mali-4/i.test(gpu);
      }
      maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    }
  } catch {
    // WebGL not available
  }

  return {
    isMobile,
    isLowEnd,
    pixelRatio: isMobile ? 1 : Math.min(window.devicePixelRatio, 2),
    maxTextureSize: Math.min(maxTextureSize, 2048),
    shadowsEnabled: !isLowEnd && !isMobile,
  };
}
```

### ### src/utils/webgl.ts — NEW

```typescript
export function isWebGLSupported(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}
```

### ### src/scene/Room.tsx — NEW

```tsx
import { useMemo } from 'react';
import * as THREE from 'three';

interface RoomProps {
  width: number;
  depth: number;
  height: number;
  wallColor?: string;
  floorColor?: string;
  position?: [number, number, number];
}

export function Room({
  width,
  depth,
  height,
  wallColor = '#0d1525',
  floorColor = '#0a1020',
  position = [0, 0, 0],
}: RoomProps) {
  const wallMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: wallColor, roughness: 0.8, side: THREE.DoubleSide }),
    [wallColor]
  );
  const floorMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: floorColor, roughness: 0.9 }),
    [floorColor]
  );

  return (
    <group position={position}>
      {/* 地板 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <primitive object={floorMaterial} />
      </mesh>

      {/* 天花板 */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial color="#0a0e1a" roughness={0.95} />
      </mesh>

      {/* 后墙 */}
      <mesh position={[0, height / 2, -depth / 2]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <primitive object={wallMaterial} />
      </mesh>

      {/* 左墙 */}
      <mesh position={[-width / 2, height / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[depth, height]} />
        <primitive object={wallMaterial} />
      </mesh>

      {/* 右墙 */}
      <mesh position={[width / 2, height / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[depth, height]} />
        <primitive object={wallMaterial} />
      </mesh>
    </group>
  );
}
```

### ### src/scene/Lighting.tsx — NEW

```tsx
export function Lighting() {
  return (
    <>
      {/* 环境光 - 基础照明 */}
      <ambientLight intensity={0.3} color="#1a2a4a" />

      {/* 半球光 - 天空/地面填充 */}
      <hemisphereLight args={['#1a3a6a', '#0a0a1a', 0.4]} />

      {/* 主方向光 - 模拟天窗 */}
      <directionalLight
        position={[10, 15, 10]}
        intensity={1.2}
        color="#4488ff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
        shadow-bias={-0.0001}
      />

      {/* 科技感点光源 */}
      <pointLight position={[0, 4, 0]} intensity={0.5} color="#4488ff" distance={15} decay={2} />
      <pointLight position={[-10, 3, -10]} intensity={0.3} color="#2266cc" distance={12} decay={2} />
      <pointLight position={[10, 3, 10]} intensity={0.3} color="#2266cc" distance={12} decay={2} />
    </>
  );
}
```

### ### src/scene/Particles.tsx — NEW

```tsx
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticlesProps {
  count?: number;
  color?: string;
  spread?: number;
}

export function Particles({ count = 200, color = '#4488ff', spread = 30 }: ParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * spread,
          Math.random() * 5 + 0.5,
          (Math.random() - 0.5) * spread
        ),
        speed: Math.random() * 0.02 + 0.005,
        offset: Math.random() * Math.PI * 2,
      });
    }
    return temp;
  }, [count, spread]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particleColor = useMemo(() => new THREE.Color(color), [color]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();

    particles.forEach((particle, i) => {
      dummy.position.set(
        particle.position.x,
        particle.position.y + Math.sin(t * particle.speed + particle.offset) * 0.5,
        particle.position.z
      );
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02, 8, 8]} />
      <meshBasicMaterial color={particleColor} transparent opacity={0.6} />
    </instancedMesh>
  );
}
```

### ### src/scene/GridFloor.tsx — NEW

```tsx
import * as THREE from 'three';
import { useMemo } from 'react';

export function GridFloor() {
  const gridMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#4488ff') },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec2 vUv;

        void main() {
          vec2 grid = abs(fract(vUv * 20.0 - 0.5) - 0.5) / fwidth(vUv * 20.0);
          float line = min(grid.x, grid.y);
          float gridAlpha = 1.0 - min(line, 1.0);

          float glow = sin(uTime * 0.5) * 0.3 + 0.7;
          vec3 finalColor = uColor * glow * gridAlpha;
          float alpha = gridAlpha * 0.3;

          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, []);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
      <planeGeometry args={[100, 100]} />
      <primitive object={gridMaterial} />
    </mesh>
  );
}
```

### ### src/scene/exhibits/PosterExhibit.tsx — NEW

```tsx
import { useState } from 'react';
import { Html } from '@react-three/drei';
import type { ExhibitConfig } from '../../types/exhibition';
import { useExhibition } from '../../store/useExhibition';

interface PosterExhibitProps {
  config: ExhibitConfig;
}

export function PosterExhibit({ config }: PosterExhibitProps) {
  const [hovered, setHovered] = useState(false);
  const selectExhibit = useExhibition((s) => s.selectExhibit);

  return (
    <group
      position={config.position}
      rotation={config.rotation}
    >
      {/* 画框 */}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => selectExhibit(config)}
        castShadow
      >
        <boxGeometry args={[2.2, 3, 0.08]} />
        <meshStandardMaterial
          color={hovered ? '#4488ff' : '#1a1a2e'}
          roughness={0.3}
          metalness={0.8}
          emissive={hovered ? '#2244aa' : '#000000'}
          emissiveIntensity={hovered ? 0.5 : 0}
        />
      </mesh>

      {/* 海报画面 */}
      <mesh position={[0, 0, 0.041]}>
        <planeGeometry args={[2, 2.8]} />
        <meshStandardMaterial color="#1a2a4a" roughness={0.5} />
      </mesh>

      {/* 标题牌 */}
      <mesh position={[0, -1.8, 0.05]}>
        <planeGeometry args={[2, 0.4]} />
        <meshStandardMaterial color="#0a0e1a" roughness={0.5} />
      </mesh>

      {/* Hover 提示 */}
      {hovered && (
        <Html position={[0, 2, 0.5]} center distanceFactor={8}>
          <div className="bg-slate-900/90 backdrop-blur-sm border border-blue-500/30 rounded-lg px-4 py-2 text-white text-sm whitespace-nowrap">
            <div className="font-bold text-blue-300">{config.title}</div>
            <div className="text-xs text-slate-400 mt-1">点击查看详情</div>
          </div>
        </Html>
      )}
    </group>
  );
}
```

### ### src/scene/exhibits/DocumentExhibit.tsx — NEW

```tsx
import { useState } from 'react';
import { Html } from '@react-three/drei';
import type { ExhibitConfig } from '../../types/exhibition';
import { useExhibition } from '../../store/useExhibition';

interface DocumentExhibitProps {
  config: ExhibitConfig;
}

export function DocumentExhibit({ config }: DocumentExhibitProps) {
  const [hovered, setHovered] = useState(false);
  const selectExhibit = useExhibition((s) => s.selectExhibit);

  return (
    <group position={config.position}>
      {/* 展柜底座 */}
      <mesh position={[0, -0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.6, 1]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* 玻璃罩 */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.3, 1, 0.9]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.1}
          roughness={0}
          metalness={0}
          transmission={0.9}
          thickness={0.05}
        />
      </mesh>

      {/* 文档 */}
      <mesh
        position={[0, 0.2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => selectExhibit(config)}
      >
        <planeGeometry args={[1, 0.7]} />
        <meshStandardMaterial
          color={hovered ? '#4488ff' : '#f0f0f0'}
          roughness={0.8}
          emissive={hovered ? '#2244aa' : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>

      {/* 标题 */}
      <Html position={[0, -0.8, 0.6]} center>
        <div className="bg-slate-900/80 backdrop-blur-sm border border-blue-500/20 rounded px-3 py-1 text-white text-xs text-center whitespace-nowrap">
          {config.title}
        </div>
      </Html>

      {/* Hover 提示 */}
      {hovered && (
        <Html position={[0, 1.5, 0]} center distanceFactor={6}>
          <div className="bg-slate-900/90 backdrop-blur-sm border border-blue-500/30 rounded-lg px-4 py-2 text-white text-sm">
            <div className="font-bold text-blue-300">{config.title}</div>
            <div className="text-xs text-slate-400 mt-1">{config.description}</div>
          </div>
        </Html>
      )}
    </group>
  );
}
```

### ### src/scene/exhibits/VideoExhibit.tsx — NEW

```tsx
import { useState } from 'react';
import { Html } from '@react-three/drei';
import type { ExhibitConfig } from '../../types/exhibition';
import { useExhibition } from '../../store/useExhibition';

interface VideoExhibitProps {
  config: ExhibitConfig;
}

export function VideoExhibit({ config }: VideoExhibitProps) {
  const [hovered, setHovered] = useState(false);
  const selectExhibit = useExhibition((s) => s.selectExhibit);

  return (
    <group position={config.position}>
      {/* 屏幕边框 */}
      <mesh
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => selectExhibit(config)}
        castShadow
      >
        <boxGeometry args={[4.2, 2.6, 0.1]} />
        <meshStandardMaterial
          color="#0a0e1a"
          roughness={0.2}
          metalness={0.9}
          emissive={hovered ? '#2244aa' : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>

      {/* 屏幕 */}
      <mesh position={[0, 0, 0.051]}>
        <planeGeometry args={[3.8, 2.2]} />
        <meshStandardMaterial color="#1a2a4a" roughness={0.3} />
      </mesh>

      {/* 播放按钮 */}
      <mesh position={[0, 0, 0.06]}>
        <circleGeometry args={[0.4, 32]} />
        <meshStandardMaterial
          color="#4488ff"
          transparent
          opacity={hovered ? 0.9 : 0.7}
          emissive="#4488ff"
          emissiveIntensity={0.5}
        />
      </mesh>

      {/* 标题 */}
      <Html position={[0, -1.6, 0.3]} center>
        <div className="bg-slate-900/80 backdrop-blur-sm border border-blue-500/20 rounded px-4 py-1 text-white text-sm">
          <span className="text-blue-300 font-bold">{config.title}</span>
          <span className="text-slate-400 ml-2">点击播放</span>
        </div>
      </Html>

      {/* Hover 提示 */}
      {hovered && (
        <Html position={[0, 1.8, 0.3]} center distanceFactor={8}>
          <div className="bg-slate-900/90 backdrop-blur-sm border border-blue-500/30 rounded-lg px-4 py-2 text-white text-sm">
            <div className="font-bold text-blue-300">{config.title}</div>
            <div className="text-xs text-slate-400 mt-1">{config.description}</div>
          </div>
        </Html>
      )}
    </group>
  );
}
```

### ### src/scene/exhibits/DataVizExhibit.tsx — NEW

```tsx
import { useMemo } from 'react';
import { Html, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { ExhibitConfig } from '../../types/exhibition';

interface DataVizExhibitProps {
  config: ExhibitConfig;
}

export function DataVizExhibit({ config }: DataVizExhibitProps) {
  const data = config.data || [];
  const maxValue = useMemo(() => Math.max(...data.map((d) => d.value), 1), [data]);

  const bars = useMemo(() => {
    const barWidth = 0.6;
    const gap = 0.2;
    const totalWidth = data.length * (barWidth + gap) - gap;
    const startX = -totalWidth / 2 + barWidth / 2;

    return data.map((item, index) => ({
      ...item,
      x: startX + index * (barWidth + gap),
      height: (item.value / maxValue) * 3,
      width: barWidth,
    }));
  }, [data, maxValue]);

  return (
    <group position={config.position}>
      {/* 背景板 */}
      <mesh position={[0, 1.5, -0.05]}>
        <planeGeometry args={[5, 4]} />
        <meshStandardMaterial color="#0a0e1a" roughness={0.8} />
      </mesh>

      {/* 标题 */}
      <Text
        position={[0, 3.8, 0]}
        fontSize={0.25}
        color="#4488ff"
        anchorX="center"
        anchorY="middle"
        font={undefined}
      >
        {config.title}
      </Text>

      {/* 柱状图 */}
      {bars.map((bar, index) => (
        <group key={index} position={[bar.x, 0, 0]}>
          {/* 柱子 */}
          <mesh position={[0, bar.height / 2, 0]}>
            <boxGeometry args={[bar.width, bar.height, 0.3]} />
            <meshStandardMaterial
              color={bar.color}
              emissive={bar.color}
              emissiveIntensity={0.3}
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>

          {/* 数值标签 */}
          <Text
            position={[0, bar.height + 0.2, 0]}
            fontSize={0.18}
            color="#ffffff"
            anchorX="center"
            anchorY="bottom"
            font={undefined}
          >
            {`${bar.value}%`}
          </Text>

          {/* 类别标签 */}
          <Text
            position={[0, -0.2, 0]}
            fontSize={0.15}
            color="#8888aa"
            anchorX="center"
            anchorY="top"
            font={undefined}
          >
            {bar.label}
          </Text>
        </group>
      ))}

      {/* 描述 */}
      <Html position={[0, -0.6, 0.3]} center>
        <div className="text-slate-400 text-xs text-center max-w-[300px]">
          {config.description}
        </div>
      </Html>
    </group>
  );
}
```

### ### src/scene/exhibits/ExhibitRouter.tsx — NEW

```tsx
import type { ExhibitConfig } from '../../types/exhibition';
import { PosterExhibit } from './PosterExhibit';
import { DocumentExhibit } from './DocumentExhibit';
import { VideoExhibit } from './VideoExhibit';
import { DataVizExhibit } from './DataVizExhibit';

interface ExhibitRouterProps {
  config: ExhibitConfig;
}

export function ExhibitRouter({ config }: ExhibitRouterProps) {
  switch (config.type) {
    case 'poster':
      return <PosterExhibit config={config} />;
    case 'document':
      return <DocumentExhibit config={config} />;
    case 'video':
      return <VideoExhibit config={config} />;
    case 'dataviz':
      return <DataVizExhibit config={config} />;
    default:
      return null;
  }
}
```

### ### src/camera/CameraController.tsx — NEW

```tsx
import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PointerLockControls } from '@react-three/drei';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { useExhibition } from '../store/useExhibition';
import config from '../config/exhibition.json';

const { Vector3 } = THREE;

export function CameraController() {
  const cameraMode = useExhibition((s) => s.cameraMode);
  const currentWaypointIndex = useExhibition((s) => s.currentWaypointIndex);
  const selectedExhibit = useExhibition((s) => s.selectedExhibit);

  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  const waypoint = config.tour.waypoints[currentWaypointIndex] || config.tour.waypoints[0];

  // 引导式模式的弹簧动画
  const [spring, api] = useSpring(() => ({
    px: waypoint.position[0],
    py: waypoint.position[1],
    pz: waypoint.position[2],
    lx: waypoint.lookAt[0],
    ly: waypoint.lookAt[1],
    lz: waypoint.lookAt[2],
    config: { mass: 1, tension: 120, friction: 25 },
  }));

  // 更新相机目标
  useEffect(() => {
    if (cameraMode === 'guided') {
      const wp = config.tour.waypoints[currentWaypointIndex];
      if (wp) {
        api.start({
          px: wp.position[0],
          py: wp.position[1],
          pz: wp.position[2],
          lx: wp.lookAt[0],
          ly: wp.lookAt[1],
          lz: wp.lookAt[2],
        });
      }
    }
  }, [cameraMode, currentWaypointIndex, api]);

  // 展品聚焦模式
  useEffect(() => {
    if (cameraMode === 'exhibit-focus' && selectedExhibit) {
      const [x, y, z] = selectedExhibit.position;
      api.start({
        px: x,
        py: y + 0.5,
        pz: z + 3,
        lx: x,
        ly: y,
        lz: z,
      });
    }
  }, [cameraMode, selectedExhibit, api]);

  // 每帧更新相机
  useFrame(() => {
    if (cameraMode === 'guided' || cameraMode === 'exhibit-focus') {
      camera.position.set(
        spring.px.get(),
        spring.py.get(),
        spring.pz.get()
      );
      camera.lookAt(
        spring.lx.get(),
        spring.ly.get(),
        spring.lz.get()
      );
    }
  });

  return (
    <>
      {cameraMode === 'free' && (
        <PointerLockControls />
      )}
      {cameraMode === 'exhibit-focus' && selectedExhibit && (
        <OrbitControls
          target={new Vector3(...selectedExhibit.position)}
          enableDamping
          dampingFactor={0.05}
          minDistance={1.5}
          maxDistance={6}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 6}
        />
      )}
    </>
  );
}
```

### ### src/ui/Navigation.tsx — NEW

```tsx
import { useExhibition } from '../store/useExhibition';
import config from '../config/exhibition.json';

export function Navigation() {
  const cameraMode = useExhibition((s) => s.cameraMode);
  const setCameraMode = useExhibition((s) => s.setCameraMode);
  const currentWaypointIndex = useExhibition((s) => s.currentWaypointIndex);
  const nextWaypoint = useExhibition((s) => s.nextWaypoint);
  const prevWaypoint = useExhibition((s) => s.prevWaypoint);
  const goToWaypoint = useExhibition((s) => s.goToWaypoint);
  const selectedExhibit = useExhibition((s) => s.selectedExhibit);
  const selectExhibit = useExhibition((s) => s.selectExhibit);

  const waypoints = config.tour.waypoints;

  const handleBackToTour = () => {
    selectExhibit(null);
    setCameraMode('guided');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      {/* 顶部导航栏 */}
      <div className="flex items-center justify-between px-6 py-4 pointer-events-auto">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className="text-white font-bold text-sm">{config.exhibition.title}</h1>
            <p className="text-blue-300/60 text-xs">{config.exhibition.subtitle}</p>
          </div>
        </div>

        {/* 模式切换 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCameraMode('guided')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              cameraMode === 'guided'
                ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-700/50'
            }`}
          >
            引导参观
          </button>
          <button
            onClick={() => setCameraMode('free')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              cameraMode === 'free'
                ? 'bg-blue-500/30 text-blue-300 border border-blue-500/50'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-700/50'
            }`}
          >
            自由漫游
          </button>
          {selectedExhibit && (
            <button
              onClick={handleBackToTour}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-700/50"
            >
              返回参观
            </button>
          )}
        </div>
      </div>

      {/* 展区快速导航 */}
      {cameraMode === 'guided' && (
        <div className="absolute left-1/2 -translate-x-1/2 top-16 flex items-center gap-2 pointer-events-auto">
          <button
            onClick={prevWaypoint}
            disabled={currentWaypointIndex === 0}
            className="w-8 h-8 rounded-full bg-slate-800/70 text-white flex items-center justify-center disabled:opacity-30 hover:bg-slate-700/70 transition-all"
          >
            ←
          </button>
          {waypoints.map((wp, index) => (
            <button
              key={wp.zoneId}
              onClick={() => goToWaypoint(index)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                currentWaypointIndex === index
                  ? 'bg-blue-500/40 text-blue-200 border border-blue-400/50'
                  : 'bg-slate-800/50 text-slate-500 border border-slate-700/30 hover:text-slate-300'
              }`}
            >
              {wp.label}
            </button>
          ))}
          <button
            onClick={nextWaypoint}
            disabled={currentWaypointIndex === waypoints.length - 1}
            className="w-8 h-8 rounded-full bg-slate-800/70 text-white flex items-center justify-center disabled:opacity-30 hover:bg-slate-700/70 transition-all"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
```

### ### src/ui/ExhibitDetail.tsx — NEW

```tsx
import { useExhibition } from '../store/useExhibition';

export function ExhibitDetail() {
  const selectedExhibit = useExhibition((s) => s.selectedExhibit);
  const selectExhibit = useExhibition((s) => s.selectExhibit);

  if (!selectedExhibit) return null;

  const handleClose = () => {
    selectExhibit(null);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* 内容面板 */}
      <div className="relative bg-slate-900/95 border border-blue-500/30 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl shadow-blue-500/10">
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-500/20">
          <div>
            <h2 className="text-white font-bold text-lg">{selectedExhibit.title}</h2>
            <p className="text-blue-300/60 text-sm mt-1">
              {selectedExhibit.type === 'poster' && '海报'}
              {selectedExhibit.type === 'document' && '文档'}
              {selectedExhibit.type === 'video' && '视频'}
              {selectedExhibit.type === 'dataviz' && '数据看板'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 内容区域 */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* 视频类型 - 嵌入播放器 */}
          {selectedExhibit.type === 'video' && selectedExhibit.videoUrl && (
            <div className="aspect-video rounded-lg overflow-hidden bg-black mb-4">
              <iframe
                src={selectedExhibit.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* 海报/文档类型 - 图片展示 */}
          {(selectedExhibit.type === 'poster' || selectedExhibit.type === 'document') && selectedExhibit.imageUrl && (
            <div className="rounded-lg overflow-hidden bg-slate-800 mb-4">
              <img
                src={selectedExhibit.imageUrl}
                alt={selectedExhibit.title}
                className="w-full h-auto"
              />
            </div>
          )}

          {/* 描述 */}
          <p className="text-slate-300 text-sm leading-relaxed">
            {selectedExhibit.description}
          </p>
        </div>
      </div>
    </div>
  );
}
```

### ### src/ui/Minimap.tsx — NEW

```tsx
import { useExhibition } from '../store/useExhibition';
import config from '../config/exhibition.json';

export function Minimap() {
  const showMinimap = useExhibition((s) => s.showMinimap);
  const currentWaypointIndex = useExhibition((s) => s.currentWaypointIndex);
  const goToWaypoint = useExhibition((s) => s.goToWaypoint);
  const setCameraMode = useExhibition((s) => s.setCameraMode);

  if (!showMinimap) return null;

  const waypoints = config.tour.waypoints;

  // 简化的小地图坐标映射
  const mapSize = 160;
  const scale = 3;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-slate-900/90 backdrop-blur-sm border border-blue-500/30 rounded-xl p-3 shadow-lg">
        <div className="text-blue-300/60 text-xs mb-2 text-center">展厅地图</div>
        <svg width={mapSize} height={mapSize} viewBox={`-80 -80 ${mapSize} ${mapSize}`}>
          {/* 背景 */}
          <rect x="-80" y="-80" width={mapSize} height={mapSize} fill="#0a0e1a" rx="8" />

          {/* 连接线 */}
          {waypoints.map((wp, i) => {
            if (i === 0) return null;
            const prev = waypoints[i - 1];
            return (
              <line
                key={`line-${i}`}
                x1={prev.position[0] / scale}
                y1={-prev.position[2] / scale}
                x2={wp.position[0] / scale}
                y2={-wp.position[2] / scale}
                stroke="#4488ff"
                strokeWidth="1"
                strokeOpacity="0.3"
              />
            );
          })}

          {/* 展区标记 */}
          {waypoints.map((wp, index) => {
            const x = wp.position[0] / scale;
            const y = -wp.position[2] / scale;
            const isActive = currentWaypointIndex === index;

            return (
              <g
                key={wp.zoneId}
                onClick={() => {
                  goToWaypoint(index);
                  setCameraMode('guided');
                }}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? 8 : 5}
                  fill={isActive ? '#4488ff' : '#1a2a4a'}
                  stroke="#4488ff"
                  strokeWidth={isActive ? 2 : 1}
                  strokeOpacity={isActive ? 1 : 0.5}
                />
                {isActive && (
                  <circle
                    cx={x}
                    cy={y}
                    r={12}
                    fill="none"
                    stroke="#4488ff"
                    strokeWidth="1"
                    strokeOpacity="0.3"
                  >
                    <animate
                      attributeName="r"
                      from="8"
                      to="16"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="stroke-opacity"
                      from="0.5"
                      to="0"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}
                <text
                  x={x}
                  y={y + 18}
                  textAnchor="middle"
                  fill={isActive ? '#ffffff' : '#8888aa'}
                  fontSize="8"
                >
                  {wp.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
```

### ### src/ui/LoadingScreen.tsx — NEW

```tsx
import { useExhibition } from '../store/useExhibition';

export function LoadingScreen() {
  const isLoaded = useExhibition((s) => s.isLoaded);
  const loadProgress = useExhibition((s) => s.loadProgress);

  if (isLoaded) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-[#0a0e1a] flex flex-col items-center justify-center">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h1 className="text-white text-2xl font-bold text-center">数据安全评估服务成果展</h1>
        <p className="text-blue-300/60 text-sm text-center mt-2">守护数据安全，赋能数字未来</p>
      </div>

      {/* 进度条 */}
      <div className="w-64">
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-300"
            style={{ width: `${loadProgress}%` }}
          />
        </div>
        <p className="text-slate-500 text-xs text-center mt-3">
          {loadProgress < 100 ? `正在加载... ${Math.round(loadProgress)}%` : '准备就绪'}
        </p>
      </div>
    </div>
  );
}
```

### ### src/ui/ControlHints.tsx — NEW

```tsx
import { useState, useEffect } from 'react';
import { useExhibition } from '../store/useExhibition';

export function ControlHints() {
  const cameraMode = useExhibition((s) => s.cameraMode);
  const showHints = useExhibition((s) => s.showHints);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (showHints && cameraMode === 'free') {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [cameraMode, showHints]);

  if (!visible || cameraMode !== 'free') return null;

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <div className="bg-slate-900/90 backdrop-blur-sm border border-blue-500/30 rounded-xl p-4 shadow-lg">
        <div className="text-blue-300 text-xs font-bold mb-2">操作指南</div>
        <div className="space-y-1.5 text-slate-400 text-xs">
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 font-mono">W A S D</kbd>
            <span>移动</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 font-mono">鼠标</kbd>
            <span>环顾四周</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 font-mono">点击展品</kbd>
            <span>查看详情</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 font-mono">ESC</kbd>
            <span>退出漫游</span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### ### src/ui/WebglFallback.tsx — NEW

```tsx
export function WebglFallback() {
  return (
    <div className="fixed inset-0 z-[300] bg-[#0a0e1a] flex flex-col items-center justify-center p-8">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 className="text-white text-xl font-bold mb-4">浏览器不支持 WebGL</h1>
        <p className="text-slate-400 text-sm mb-6">
          您的浏览器或设备不支持 WebGL 3D 渲染。请尝试以下方案：
        </p>
        <ul className="text-slate-400 text-sm text-left space-y-2 mb-8">
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>使用最新版本的 Chrome、Firefox、Safari 或 Edge 浏览器</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>确保浏览器已启用硬件加速</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400 mt-1">•</span>
            <span>尝试在桌面设备上访问以获得最佳体验</span>
          </li>
        </ul>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-500/20 border border-blue-500/40 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-colors"
        >
          刷新重试
        </button>
      </div>
    </div>
  );
}
```

### ### src/scene/ExhibitionHall.tsx — NEW

```tsx
import { useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import { useExhibition } from '../store/useExhibition';
import config from '../config/exhibition.json';
import { Room } from './Room';
import { Lighting } from './Lighting';
import { Particles } from './Particles';
import { GridFloor } from './GridFloor';
import { ExhibitRouter } from './exhibits/ExhibitRouter';
import { CameraController } from '../camera/CameraController';

export function ExhibitionHall() {
  const { progress } = useProgress();
  const setLoadProgress = useExhibition((s) => s.setLoadProgress);
  const setLoaded = useExhibition((s) => s.setLoaded);

  useEffect(() => {
    setLoadProgress(progress);
    if (progress >= 100) {
      setTimeout(() => setLoaded(true), 500);
    }
  }, [progress, setLoadProgress, setLoaded]);

  return (
    <>
      {/* 相机控制 */}
      <CameraController />

      {/* 灯光 */}
      <Lighting />

      {/* 粒子效果 */}
      <Particles count={300} color="#4488ff" spread={50} />

      {/* 科技感地板 */}
      <GridFloor />

      {/* 各展区 */}
      {config.zones.map((zone) => (
        <group key={zone.id} position={zone.position}>
          <Room
            width={zone.size[0]}
            depth={zone.size[1]}
            height={zone.size[2]}
            wallColor={zone.wallColor}
            floorColor={zone.floorColor}
          />
          {zone.exhibits.map((exhibit) => (
            <ExhibitRouter key={exhibit.id} config={exhibit} />
          ))}
        </group>
      ))}
    </>
  );
}
```

### ### src/App.tsx — NEW

```tsx
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
    <div className="w-screen h-screen bg-[#0a0e1a] overflow-hidden">
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
```

### ### src/main.tsx — NEW

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### ### src/index.css — NEW

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #0a0e1a;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #0a0e1a;
}

::-webkit-scrollbar-thumb {
  background: #1a2a4a;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #2a3a5a;
}
```

### ### index.html — NEW

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta name="description" content="数据安全评估服务数字化展厅" />
    <title>数据安全评估服务成果展</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### ### package.json — NEW

```json
{
  "name": "digital-exhibition-hall",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.88.0",
    "@react-three/postprocessing": "^2.15.0",
    "three": "^0.159.0",
    "zustand": "^4.4.0",
    "@react-spring/three": "^9.7.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/three": "^0.159.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.3.0",
    "typescript": "^5.2.0",
    "vite": "^5.0.0"
  }
}
```

### ### vite.config.ts — NEW

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          'r3f': ['@react-three/fiber', '@react-three/drei'],
        },
      },
    },
  },
});
```

### ### tsconfig.json — NEW

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### ### tsconfig.node.json — NEW

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

### ### tailwind.config.js — NEW

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### ### postcss.config.js — NEW

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### ### vercel.json — NEW

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

## Slices

### Slice 1: 项目基础与类型定义
**Files**: `package.json`, `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `src/main.tsx`, `src/index.css`, `src/types/exhibition.ts`, `src/utils/webgl.ts`, `src/utils/device.ts`

#### Automated Verification:
- [ ] `npm install` 成功完成
- [ ] `npm run check` (TypeScript 类型检查) 通过
- [ ] `npm run build` 成功构建

#### Manual Verification:
- [ ] 项目结构完整，所有配置文件存在
- [ ] TypeScript 类型定义覆盖所有展品和展区类型

### Slice 2: 状态管理与配置文件
**Files**: `src/store/useExhibition.ts`, `src/config/exhibition.json`

#### Automated Verification:
- [ ] `npm run check` 通过
- [ ] Zustand store 导出正确
- [ ] JSON 配置文件格式正确

#### Manual Verification:
- [ ] 状态管理覆盖导航、展品、加载、UI 四个维度
- [ ] 配置文件包含 5 个展区和完整展品数据

### Slice 3: 3D 房间与灯光系统
**Files**: `src/scene/Room.tsx`, `src/scene/Lighting.tsx`, `src/scene/Particles.tsx`, `src/scene/GridFloor.tsx`

#### Automated Verification:
- [ ] `npm run check` 通过
- [ ] 所有 3D 组件导出正确

#### Manual Verification:
- [ ] 房间组件支持参数化配置（宽、深、高、颜色）
- [ ] 灯光系统包含环境光、半球光、方向光、点光源
- [ ] 粒子效果正确渲染
- [ ] 科技感地板网格着色器工作正常

### Slice 4: 展品组件
**Files**: `src/scene/exhibits/PosterExhibit.tsx`, `src/scene/exhibits/DocumentExhibit.tsx`, `src/scene/exhibits/VideoExhibit.tsx`, `src/scene/exhibits/DataVizExhibit.tsx`, `src/scene/exhibits/ExhibitRouter.tsx`

#### Automated Verification:
- [ ] `npm run check` 通过
- [ ] 所有展品组件导出正确
- [ ] ExhibitRouter 正确路由到各展品组件

#### Manual Verification:
- [ ] 海报展品显示画框和 hover 效果
- [ ] 文档展品显示玻璃展柜
- [ ] 视频展品显示屏幕和播放按钮
- [ ] 数据看板显示 3D 柱状图
- [ ] 所有展品点击触发详情弹窗

### Slice 5: 相机导航系统
**Files**: `src/camera/CameraController.tsx`

#### Automated Verification:
- [ ] `npm run check` 通过
- [ ] 相机控制器正确导出

#### Manual Verification:
- [ ] 引导式模式：相机平滑飞行到各展区
- [ ] 自由漫游模式：PointerLock 控制生效
- [ ] 展品聚焦模式：相机对准选中展品
- [ ] 模式切换流畅无卡顿

### Slice 6: UI 叠加层
**Files**: `src/ui/Navigation.tsx`, `src/ui/ExhibitDetail.tsx`, `src/ui/Minimap.tsx`, `src/ui/LoadingScreen.tsx`, `src/ui/ControlHints.tsx`, `src/ui/WebglFallback.tsx`

#### Automated Verification:
- [ ] `npm run check` 通过
- [ ] 所有 UI 组件导出正确

#### Manual Verification:
- [ ] 导航菜单显示展区列表和模式切换按钮
- [ ] 展品详情弹窗正确显示内容（视频嵌入、图片、描述）
- [ ] 小地图显示各展区位置和当前位置
- [ ] 加载画面显示进度条
- [ ] 操作提示在自由漫游模式下显示
- [ ] WebGL 降级页面在不支持 WebGL 时显示

### Slice 7: 主场景组装
**Files**: `src/scene/ExhibitionHall.tsx`, `src/App.tsx`

#### Automated Verification:
- [ ] `npm run check` 通过
- [ ] `npm run build` 成功
- [ ] 构建产物 < 20MB

#### Manual Verification:
- [ ] 展厅主场景包含所有展区
- [ ] 加载进度正确显示
- [ ] 3D 场景渲染正确
- [ ] UI 叠加层正常显示

### Slice 8: 部署配置
**Files**: `vercel.json`

#### Automated Verification:
- [ ] `npm run build` 成功
- [ ] `dist/` 目录生成正确
- [ ] `vercel.json` 配置正确

#### Manual Verification:
- [ ] Vercel 部署成功
- [ ] 通过公开 URL 可访问
- [ ] 多端访问正常

## Desired End State

用户在浏览器中打开展厅链接后：
1. 看到加载画面和进度条
2. 进入 3D 展厅，自动开始引导式参观
3. 点击导航菜单切换展区，相机平滑飞行
4. 点击展品查看详情弹窗
5. 切换到自由漫游模式，用 WASD 在展厅中移动
6. 小地图显示当前位置
7. 手机端触摸操作流畅

## File Map

```
package.json                    # NEW - 项目配置
tsconfig.json                   # NEW - TypeScript 配置
tsconfig.node.json              # NEW - Node TypeScript 配置
vite.config.ts                  # NEW - Vite 构建配置
tailwind.config.js              # NEW - Tailwind CSS 配置
postcss.config.js               # NEW - PostCSS 配置
index.html                      # NEW - HTML 入口
vercel.json                     # NEW - Vercel 部署配置
src/main.tsx                    # NEW - React 入口
src/App.tsx                     # NEW - 根组件
src/index.css                   # NEW - 全局样式
src/types/exhibition.ts         # NEW - 类型定义
src/config/exhibition.json      # NEW - 展厅配置
src/store/useExhibition.ts      # NEW - Zustand 状态
src/utils/device.ts             # NEW - 设备检测
src/utils/webgl.ts              # NEW - WebGL 检测
src/scene/ExhibitionHall.tsx    # NEW - 展厅主场景
src/scene/Room.tsx              # NEW - 房间组件
src/scene/Lighting.tsx          # NEW - 灯光系统
src/scene/Particles.tsx         # NEW - 粒子效果
src/scene/GridFloor.tsx         # NEW - 科技地板
src/scene/exhibits/ExhibitRouter.tsx    # NEW - 展品路由
src/scene/exhibits/PosterExhibit.tsx    # NEW - 海报展品
src/scene/exhibits/DocumentExhibit.tsx  # NEW - 文档展品
src/scene/exhibits/VideoExhibit.tsx     # NEW - 视频展品
src/scene/exhibits/DataVizExhibit.tsx   # NEW - 数据看板
src/camera/CameraController.tsx  # NEW - 相机控制
src/ui/Navigation.tsx           # NEW - 导航菜单
src/ui/ExhibitDetail.tsx        # NEW - 展品详情
src/ui/Minimap.tsx              # NEW - 小地图
src/ui/LoadingScreen.tsx        # NEW - 加载画面
src/ui/ControlHints.tsx         # NEW - 操作提示
src/ui/WebglFallback.tsx        # NEW - WebGL 降级
```

## Ordering Constraints

- Slice 1 必须最先完成（项目基础）
- Slice 2 依赖 Slice 1（需要 TypeScript 和 Zustand）
- Slice 3 依赖 Slice 1（需要 Three.js 和 React）
- Slice 4 依赖 Slice 2 + Slice 3（需要类型定义和房间组件）
- Slice 5 依赖 Slice 2（需要状态管理）
- Slice 6 依赖 Slice 2（需要状态管理）
- Slice 7 依赖 Slice 3 + Slice 4 + Slice 5 + Slice 6（组装所有组件）
- Slice 8 依赖 Slice 7（部署需要构建成功）

## Verification Notes

- Three.js 在 SSR 环境中需要特殊处理（本项目纯客户端，无需担心）
- PointerLockControls 需要用户交互才能激活
- 移动端不支持 PointerLockControls，需要提供触摸替代方案
- YouTube 嵌入需要网络访问
- 大量粒子可能影响低端设备性能

## Performance Considerations

- 使用 InstancedMesh 渲染粒子，减少 draw calls
- 设备检测后自适应渲染质量
- 低端设备关闭阴影
- 移动端降低 DPR
- 使用 React.lazy() 懒加载展区组件
- 纹理使用 WebP 格式压缩

## Migration Notes

不适用（全新项目）

## Pattern References

- 3D Web Experience Skill: `.agents/skills/3d-web-experience/SKILL.md`
- Three.js WebGL Skill: `.agents/skills/threejs-webgl/SKILL.md`

## Developer Context

**Q (discover: 技术框架选型)**: React Three Fiber vs 原生 Three.js
A: 选择 React Three Fiber — 开发效率高 2-3 倍

**Q (discover: 部署平台选择)**: Vercel 免费套餐
A: 确认使用 Vercel — 100GB 带宽/月足够

**Q (discover: 内容管理方式)**: 配置文件驱动
A: JSON 配置文件定义展区布局和展品列表

**Q (discover: 视觉风格方向)**: 深蓝渐变 + 科技感
A: 深蓝灰渐变背景 + 科技蓝/青色主色调 + 粒子效果

**Q (research: 技术框架选型)**: R3F + drei + Zustand + Vite + Tailwind CSS
A: 确认技术栈

## Design History

- Slice 1: 项目基础与类型定义 — pending
- Slice 2: 状态管理与配置文件 — pending
- Slice 3: 3D 房间与灯光系统 — pending
- Slice 4: 展品组件 — pending
- Slice 5: 相机导航系统 — pending
- Slice 6: UI 叠加层 — pending
- Slice 7: 主场景组装 — pending
- Slice 8: 部署配置 — pending

## References

- FRD: `.rpiv/artifacts/discover/2025-01-15_digital-exhibition-hall.md`
- Research: `.rpiv/artifacts/research/2025-01-15_digital-exhibition-hall.md`
- 3D Web Experience Skill: `.agents/skills/3d-web-experience/SKILL.md`
- Three.js WebGL Skill: `.agents/skills/threejs-webgl/SKILL.md`
