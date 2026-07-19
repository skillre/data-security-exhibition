---
date: 2026-07-19T14:27:08+0800
author: skillre
commit: a8b430e
branch: main
repository: 数字化展厅
topic: "数据安全评估服务数字化展厅技术方案"
tags: [research, codebase, vite, react-three-fiber, threejs, 3d-exhibition]
status: ready
last_updated: 2026-07-19T14:27:08+0800
last_updated_by: skillre
---

# Research: 数据安全评估服务数字化展厅技术方案

## Research Question

基于FRD需求，研究并确定数字化展厅的技术实现方案，包括项目脚手架、3D场景架构、展品渲染、交互系统、导览功能和部署方案。

## Summary

本研究覆盖了构建数据驱动3D数字化展厅的完整技术栈：Vite + React + React Three Fiber。研究发现，R3F生态成熟，有丰富的组件库支持。关键决策包括：使用四周墙壁布局展示展品、按内容类型分类、实现第一人称WASD漫游、JSON配置驱动展品管理、PointerLockControls实现FPS控制、静态部署到GitHub Pages。

## Detailed Findings

### 1. 项目脚手架与依赖链

**技术栈确定**：
- 构建工具：Vite 6.x
- 前端框架：React 18.x + TypeScript 5.x
- 3D渲染：Three.js 0.170+ + @react-three/fiber 8.x + @react-three/drei 9.x
- 状态管理：Zustand 5.x（轻量级，R3F官方推荐）

**依赖清单**：
```json
{
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

**Vite配置关键点**：
- `base`: 生产环境设置为 `/digital-exhibition-hall/`（GitHub Pages子路径）
- `resolve.alias`: 配置 `@/`、`@components/`、`@data/` 路径别名
- `build.rollupOptions.output.manualChunks`: 分离 three、react-three、vendor 三个chunk
- `build.chunkSizeWarningLimit`: 设置为 1500KB（3D资源较大）

**TypeScript配置关键点**：
- `strict: true`：启用严格模式
- `resolveJsonModule: true`：支持JSON配置文件导入
- `moduleResolution: "bundler"`：Vite推荐的模块解析策略

### 2. React Three Fiber Canvas 架构

**组件树结构**：
```
App.tsx
├── WebGL检测（检测浏览器是否支持WebGL）
├── <Canvas>（R3F根组件）
│   ├── <Suspense fallback={<LoadingBar />}>
│   │   ├── <ambientLight />（环境光）
│   │   ├── <directionalLight />（方向光，启用阴影）
│   │   ├── <Environment />（环境贴图，用于反射）
│   │   ├── <ExhibitionRoom />（展厅房间几何体）
│   │   ├── <ExhibitDisplay />（展品渲染，遍历exhibits数组）
│   │   └── <TourPath />（导览路线可视化）
│   └── <PointerLockControls />（第一人称控制）
├── <OverlayUI />（2D覆盖层，HTML组件）
│   ├── 展品详情面板（ExhibitDetailPanel）
│   ├── 导览控制（TourControls）
│   ├── 小地图（MiniMap）
│   └── 操作指引（HelpOverlay）
└── <LoadingScreen />（加载进度条）
```

**状态管理（Zustand）**：
```typescript
interface ExhibitionState {
  selectedExhibit: string | null;
  cameraMode: 'firstPerson' | 'orbit';
  isLoaded: boolean;
  tourMode: 'free' | 'following';
  currentTourStep: number;
  selectExhibit: (id: string | null) => void;
  setLoaded: (loaded: boolean) => void;
  setTourMode: (mode: 'free' | 'following') => void;
}
```

**3D/2D状态桥接**：
- 3D场景内的展品点击通过 `onClick` 事件更新 Zustand store
- 2D Overlay组件订阅 store 变化，显示/隐藏详情面板
- drei 的 `<Html>` 组件用于在3D空间中显示浮动标签

### 3. 第一人称相机控制（PointerLock + WASD）

**实现方案**：
- 使用 `@react-three/drei` 的 `PointerLockControls` 实现鼠标视角控制
- 自定义 `useFrame` hook 实现 WASD 键盘移动
- `Shift` 键加速移动（sprint）

**关键代码模式**：
```typescript
// 键盘状态管理
const movement = useRef({
  forward: false,
  backward: false,
  left: false,
  right: false,
  speed: 5
});

// useFrame 中更新相机位置
useFrame((_, delta) => {
  if (!controlsRef.current?.isLocked) return;
  
  const forward = new THREE.Vector3();
  camera.getWorldDirection(forward);
  forward.y = 0;
  forward.normalize();
  
  const right = new THREE.Vector3();
  right.crossVectors(forward, new THREE.Vector3(0, 1, 0));
  
  camera.position.addScaledVector(forward, -moveZ * speed * delta);
  camera.position.addScaledVector(right, moveX * speed * delta);
});
```

**边界碰撞检测**：
- 简单方案：使用 `Math.max/min` 限制相机在房间边界内
- 高级方案：使用 `@react-three/rapier` 实现物理碰撞

**移动端回退**：
- 检测移动设备后切换为 `OrbitControls`（轨道控制）
- 或实现虚拟摇杆（VirtualJoystick）

### 4. 展品数据模型与JSON配置

**TypeScript类型定义**：
```typescript
interface ExhibitItem {
  id: string;
  title: string;
  description: string;
  detailContent: string;
  type: 'image' | 'video' | 'document';
  mediaSrc: string;
  previewImage?: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  category: string;
  order: number;
}

interface ExhibitionConfig {
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

**JSON配置文件位置**：`public/exhibits.json`
- 运行时通过 `fetch` 加载，修改JSON即可改变展厅内容
- 也可以使用 Vite 的静态导入（`import config from './data/exhibits.json'`）

### 5. 展品3D渲染（按类型）

**图片展品**：
- `<mesh>` + `<planeGeometry>` + `<meshStandardMaterial>`
- 使用 `useTexture` 加载图片纹理
- 根据纹理宽高比计算展示尺寸
- 悬浮时缩放动画（useFrame + lerp）

**视频展品**：
- 创建 HTML `<video>` 元素
- 使用 `THREE.VideoTexture` 创建视频纹理
- 悬浮/选中时自动播放，离开时暂停
- 默认静音（浏览器自动播放策略）

**文档展品**：
- 显示预览图片（PDF封面缩略图）
- 点击后在详情面板中显示下载链接
- 使用 `<a>` 标签实现文档下载

**浮动标签**：
- 使用 drei 的 `<Html>` 组件
- `distanceFactor={8}` 实现透视缩放
- `pointerEvents: 'none'` 防止拦截3D点击

### 6. Raycaster点击检测与详情面板

**R3F内置事件系统**：
- R3F自动处理Raycaster，无需手动创建
- 在 `<mesh>` 上使用 `onClick`、`onPointerOver`、`onPointerOut` 事件
- 必须调用 `e.stopPropagation()` 防止事件冒泡

**PointerLockControls交互**：
- 点击展品时释放指针锁定：`document.exitPointerLock()`
- 关闭详情面板后重新锁定：通过 `makeDefault` 属性控制
- `makeDefault={!selectedExhibit}`：选中展品时禁用控制

**详情面板设计**：
- 固定宽度侧边栏（420px）
- 毛玻璃效果（`backdrop-filter: blur(20px)`）
- 按类型显示不同内容（图片全尺寸、视频播放器、文档下载）
- ESC键关闭

### 7. 加载进度条与场景初始化

**加载流程**：
1. `<Canvas>` 内的 `<Suspense>` 包裹所有3D内容
2. drei 的 `useProgress` hook 返回 `{ progress, active }`
3. `<LoadingBar>` 组件显示进度百分比和可视化进度条
4. 加载完成后淡出动画

**资产预加载**：
```typescript
// 在组件外调用预加载
useTexture.preload('/textures/floor.jpg');
useTexture.preload('/textures/wall.jpg');
```

**WebGL回退检测**：
```typescript
function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('webgl2'));
  } catch { return false; }
}
```

### 8. 导览路线可视化

**路线渲染**：
- 使用 drei 的 `<Line>` 组件绘制路线
- 虚线效果（`dashed={true}`）
- 路点标记：发光球体 + 步骤编号

**自动导览模式**：
- `useTourFollow` hook 管理导览状态
- 使用 `camera.lerp` 实现平滑相机移动
- `easeInOutCubic` 缓动函数
- 每个路点可配置停留时间

**返回起点**：
- 动画相机回到初始位置
- 保持视角平滑过渡

### 9. 静态构建与GitHub Pages部署

**构建配置**：
```bash
npm run build  # 生成 dist/ 目录
```

**GitHub Pages部署要求**：
- `public/.nojekyll` 文件：禁用Jekyll处理
- `vite.config.ts` 的 `base` 配置：必须匹配仓库名
- 使用 `gh-pages` 包或 GitHub Actions 自动部署

**大文件处理**：
- GitHub Pages软限制：~1GB仓库大小
- 视频文件建议外部托管（CDN、云存储）
- PDF文件如果较小（<5MB）可以放在 `public/` 目录

**部署脚本**：
```json
{
  "scripts": {
    "build": "tsc && vite build",
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

**GitHub Actions自动部署**（可选）：
```yaml
- name: Deploy to GitHub Pages
  uses: actions/deploy-pages@v4
```

### 10. UI Overlay架构（2D/3D边界）

**架构设计**：
- `<Canvas>` 内部：3D场景（展品、灯光、控制）
- `<Canvas>` 外部：HTML覆盖层（面板、按钮、指引）

**状态桥接**：
- Zustand store 同时被3D组件和2D组件访问
- 3D组件通过 `onClick` 更新 store
- 2D组件订阅 store 变化并渲染

**Z-index管理**：
- Canvas: z-index: 0
- Overlay: z-index: 10
- Detail Panel: z-index: 1000
- Loading Screen: z-index: 9999

**事件传播**：
- 2D面板需要 `pointerEvents: 'auto'` 才能接收点击
- 面板外区域 `pointerEvents: 'none'` 让事件穿透到3D场景

## Code References

- `vite.config.ts:1-50` — Vite构建配置，包括base路径、路径别名、chunk分离
- `src/App.tsx:1-100` — 主应用组件，包含Canvas和Overlay架构
- `src/components/Exhibition/ExhibitionScene.tsx:1-80` — 3D场景根组件
- `src/components/Exhibits/ImageExhibit.tsx:1-60` — 图片展品渲染
- `src/components/Exhibits/VideoExhibit.tsx:1-80` — 视频展品渲染
- `src/components/Exhibits/DocumentExhibit.tsx:1-60` — 文档展品渲染
- `src/components/Controls/FirstPersonControls.tsx:1-100` — WASD+PointerLock控制
- `src/components/UI/ExhibitDetailPanel.tsx:1-120` — 2D详情面板
- `src/components/Tour/TourPath.tsx:1-80` — 导览路线可视化
- `src/store/exhibition.ts:1-40` — Zustand状态管理
- `src/types/exhibit.ts:1-50` — TypeScript类型定义
- `src/data/exhibits.json:1-100` — 展品配置文件

## Integration Points

### Inbound References
- `src/main.tsx` → `src/App.tsx` — 应用入口
- `src/App.tsx` → `<Canvas>` — R3F场景根
- `<Canvas>` → 各展品组件 — 数据驱动渲染

### Outbound Dependencies
- `@react-three/fiber` — R3F核心渲染
- `@react-three/drei` — 辅助组件（Html, Line, PointerLockControls, useTexture, useProgress）
- `three` — Three.js核心库
- `zustand` — 状态管理

### Infrastructure Wiring
- `public/exhibits.json` — 展品配置（运行时加载）
- `public/assets/` — 静态资源（图片、视频、文档）
- `public/.nojekyll` — GitHub Pages配置
- `.github/workflows/deploy.yml` — CI/CD部署流水线（可选）

## Architecture Insights

**数据驱动架构**：
- 展品通过JSON配置文件管理，修改配置即可改变展厅内容
- 组件根据 `exhibit.type` 动态渲染不同类型的展品
- 支持运行时热更新配置

**状态管理策略**：
- Zustand store 作为3D/2D状态桥梁
- 3D场景内的交互通过事件回调更新 store
- 2D Overlay订阅 store 变化响应式渲染

**性能优化策略**：
- 使用 `useTexture` 自动缓存纹理
- 使用 `Suspense` 实现懒加载
- 使用 `manualChunks` 分离大型依赖
- 使用 `dpr={[1, 2]}` 自适应设备像素比

**移动端适配**：
- 检测移动设备后切换控制方案
- 使用 `OrbitControls` 替代 `PointerLockControls`
- 考虑实现虚拟摇杆

## Precedents & Lessons

### 类似项目参考

**Commit**: N/A（全新项目）
**Blast radius**: N/A

**相关开源项目**：
- React Three Fiber 官方示例：https://docs.pmnd.rs/react-three-fiber/getting-started/examples
- drei 组件库：https://github.com/pmndrs/drei
- Three.js 示例：https://threejs.org/examples/

**关键教训**：
1. PointerLockControls 与点击交互的冲突需要精心设计状态切换
2. 视频自动播放需要静音才能绕过浏览器策略
3. 大型3D资源需要压缩和懒加载
4. 移动端需要完全不同的控制方案

### Composite Lessons
- 使用 Zustand 管理3D/2D状态桥梁是R3F的最佳实践
- 使用 drei 的 `<Html>` 组件在3D空间中显示2D内容
- 使用 `useFrame` 实现平滑动画而非 CSS transitions
- 使用 `e.stopPropagation()` 防止3D事件冒泡

## Historical Context (from `.rpiv/artifacts/`)

- `.rpiv/artifacts/discover/2026-07-19_14-15-23_digital-exhibition-hall.md` — 需求分析文档，包含完整的需求和决策

## Developer Context

**Q (discover: 展厅风格): 你期望的数字化展厅是什么样的风格和体验？**
A: 虚拟空间漫游

**Q (discover: 展示重点): 对于合作伙伴/客户来说，他们最关心的是数据安全评估的哪个方面？**
A: 成果交付

**Q (discover: 3D技术栈): 你倾向于使用哪种3D技术栈？**
A: 让我推荐（推荐React Three Fiber）

**Q (discover: 前端框架): 你希望使用什么样的前端项目结构？**
A: 让我推荐（推荐Vite + React）

**Q (discover: 部署方式): 你对部署平台有什么偏好？**
A: 纯静态托管

**Q (discover: 数据存储): 你打算如何管理展厅中的展品内容（文档、海报、视频）？**
A: 项目目录

**Q (discover: 展厅结构): 你希望展厅的空间结构是怎样的？**
A: 单层展厅

**Q (discover: 交互功能): 你希望访客在展厅中能进行哪些交互？**
A: 自由漫游、展品互动

**Q (discover: 导览方式): 你希望访客如何参观展厅？**
A: 推荐路线+自由

**Q (discover: 访问权限): 展厅的访问权限如何控制？**
A: 完全公开

**Q (discover: 响应式设计): 你希望展厅支持哪些设备访问？**
A: 桌面优先

**Q (discover: 语言支持): 展厅需要支持哪些语言？**
A: 先做中文

**Q (research: 展厅布局): 基于技术调研，3D展厅的布局设计是一个关键决策。你对展厅的空间布局有什么偏好？**
A: 四周墙壁布局

**Q (research: 展品分类): 展品应该如何分类展示？这将影响3D场景的空间划分和参观路线设计。**
A: 内容类型

## Related Research

- N/A（首次研究）

## Open Questions

- 具体的展品内容：需要用户提供实际的图片、视频、文档文件
- 3D场景的具体尺寸和比例：需要根据展品数量和类型调整
- 视频文件托管方案：是否需要外部CDN还是放在项目目录

## References

- FRD: `.rpiv/artifacts/discover/2026-07-19_14-15-23_digital-exhibition-hall.md`
- 3D技能: `.agents/skills/3d-web-experience/SKILL.md`
- Three.js技能: `.agents/skills/threejs-webgl/SKILL.md`
- React Three Fiber文档: https://docs.pmnd.rs/react-three-fiber
- drei文档: https://github.com/pmndrs/drei
- Vite文档: https://vitejs.dev
- GitHub Pages部署: https://vitejs.dev/guide/static-deploy.html
