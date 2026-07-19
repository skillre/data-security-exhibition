---
date: 2025-01-15T10:30:00+08:00
author: MiMo
commit: n/a
branch: main
repository: 数字化展厅
topic: "数据安全评估服务数字化展厅 — 技术调研"
tags: [research, threejs, r3f, vercel, 3d-exhibition, performance]
status: ready
last_updated: 2025-01-15T10:30:00+08:00
last_updated_by: MiMo
---

# Research: 数据安全评估服务数字化展厅 — 技术调研

## Research Question

基于 FRD 中确定的需求（3D 沉浸式展厅、多端适配、Vercel 部署、配置驱动），调研最佳技术实现方案，包括前端框架选型、3D 场景构建方案、性能优化策略和部署方案。

## Summary

推荐使用 **React Three Fiber (R3F) + @react-three/drei + Zustand + Vite + Tailwind CSS** 技术栈。R3F 的声明式 JSX 天然匹配展厅的数据驱动架构（展区 → 展品 → 交互），drei 提供 100+ 现成 3D 组件，开发效率比原生 Three.js 高 2-3 倍。展厅 3D 场景通过代码程序化生成（不依赖外部模型文件），部署体积控制在 15MB 以内，Vercel 免费套餐完全够用。

## Detailed Findings

### 1. 技术框架选型：React Three Fiber

**选型理由**：
- 声明式 JSX 写法天然匹配展厅结构：`<Room>` → `<Wall>` → `<Exhibit>` → `<PosterExhibit>`
- drei 提供所有需要的组件：`OrbitControls`、`PointerLockControls`、`Html`（2D叠加层）、`Text`（3D文字）、`useTexture`、`useProgress`
- Zustand 状态管理天然集成 R3F，管理导航模式、当前展区、展品详情等状态
- HMR 热更新让调整展品布局、灯光、相机路径即时生效

**技术栈清单**：

| 层 | 技术 | 用途 |
|---|---|---|
| 3D 渲染 | React Three Fiber + drei | 3D 场景、相机控制、交互 |
| 状态管理 | Zustand | 导航状态、展品详情、UI 状态 |
| 动画 | @react-spring/three | 相机飞行、展品动效 |
| UI 样式 | Tailwind CSS | HTML 叠加层样式 |
| 构建工具 | Vite | 快速 HMR、优化构建 |
| 语言 | TypeScript | 类型安全 |
| 部署 | Vercel | 免费静态托管、CDN |

**Bundle 大小估算**：
- Three.js core: ~150KB gzipped
- R3F: ~40KB gzipped
- drei (按需): ~80KB gzipped
- Zustand: ~1KB gzipped
- React + ReactDOM: ~40KB gzipped
- **合计: ~350KB gzipped**（可接受，通过代码分割和懒加载优化首屏）

### 2. 程序化 3D 展厅构建方案

**核心思路**：通过代码构建所有 3D 几何体（墙壁、地板、天花板、展品台），不依赖外部 GLB/GLTF 模型文件。

**优势**：
- 部署体积极小（代码 < 100KB vs 外部模型可能 10-50MB）
- 加载速度快（无需下载和解析模型文件）
- 易于维护和修改（改代码 vs 改 3D 建模软件）
- 完全可控的几何体参数

**展区组件架构**：
```
ExhibitionHall (主场景)
├── EntranceHall (入口大厅)
│   ├── Room (墙壁 + 地板 + 天花板)
│   ├── ExhibitionLighting (灯光系统)
│   └── WelcomeScreen (欢迎视频屏)
├── DocumentGallery (文档资料区)
│   ├── Room
│   ├── DocumentCase × N (玻璃展柜)
│   └── Spotlight × N
├── PosterGallery (海报展示区)
│   ├── Room
│   ├── PosterFrame × N (海报画框)
│   └── AccentLighting
├── VideoTheater (视频播放区)
│   ├── Room
│   ├── VideoScreen × N (大屏幕)
│   └── AmbientLighting
└── DataDashboard (数据看板区)
    ├── Room
    ├── DataVisualization (3D 数据可视化)
    └── InfoPanel
```

**展品类型组件**：
- `PosterExhibit`：墙面挂画式海报，hover 显示标题，点击弹出大图
- `DocumentCaseExhibit`：玻璃展柜中的文档，点击弹出文档内容
- `VideoScreenExhibit`：嵌入式大屏幕，使用 VideoTexture 播放视频
- `DataVizExhibit`：3D 数据可视化（柱状图、饼图等）

### 3. 导航系统方案

**混合导航模式实现**：

| 模式 | 实现方式 | 触发方式 |
|---|---|---|
| 引导式 | `@react-spring/three` 相机飞行动画 | 默认模式，点击导航菜单 |
| 自由漫游 | `PointerLockControls` + WASD | 切换按钮 |
| 展品聚焦 | `OrbitControls` (限制范围) | 点击展品时自动切换 |

**相机飞行动画**：
- 使用 `@react-spring/three` 的 `useSpring` 实现平滑过渡
- 预设多个观察点（waypoints），每个展区至少 1-2 个
- 飞行时间 1.5-2 秒，缓动曲线 `ease-in-out`

**小地图**：
- 使用 drei 的 `Html` 组件在右上角叠加 2D 小地图
- 标注用户当前位置和各展区位置
- 点击小地图可快速跳转

### 4. 多端适配与性能优化

**设备分级策略**：

| 设备 | 目标帧率 | 最大三角面数 | 纹理尺寸 | 阴影 |
|---|---|---|---|---|
| 高端 PC | 60fps | 500K | 2048×2048 | 2048 map |
| 普通 PC | 30-60fps | 200K | 1024×1024 | 1024 map |
| 旗舰手机 | 30-60fps | 100K | 1024×1024 | 512 map |
| 入门手机 | 30fps | 50K | 512×512 | 关闭阴影 |

**GPU 检测与自适应**：
```typescript
// 检测设备能力，动态调整渲染质量
const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
const debugInfo = gl?.getExtension('WEBGL_debug_renderer_info');
const gpu = gl?.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
const isLowEnd = /SwiftShader|Mesa|Intel|Adreno 3|Adreno 4|PowerVR/i.test(gpu);
```

**关键优化策略**：
1. **自适应 DPR**：移动端 `dpr=1`，桌面端 `dpr=Math.min(devicePixelRatio, 2)`
2. **阴影分级**：低端设备完全关闭阴影
3. **纹理压缩**：所有纹理使用 WebP 格式，最大 1024×1024
4. **实例化渲染**：重复展品使用 `InstancedMesh`
5. **懒加载**：使用 React `lazy()` 按需加载展区组件
6. **视锥剔除**：Three.js 自动处理，通过场景分组优化

**WebGL 降级方案**：
- 检测 WebGL 支持，不支持时显示静态图片 + 文字说明
- 使用 `navigator.gpu` 检测 WebGPU 支持

### 5. Vercel 部署方案

**免费套餐限制**：

| 资源 | 限制 | 本项目预估 |
|---|---|---|
| 带宽 | 100 GB/月 | 2-10 GB（500-2000 访客） |
| 构建时间 | 6000 分钟/月 | ~30 分钟 |
| Serverless | 100 GB-Hrs | 不需要（纯静态） |
| 自定义域名 | 50 个 | 1 个 |
| 部署大小 | ~100 MB | ~15 MB |

**部署配置**：
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

**视频托管策略**：
- 视频文件不放在 Vercel 部署中（节省带宽）
- 推荐方案：YouTube 未列出视频（免费）或 Cloudflare Stream（低成本）
- 展厅内通过 iframe 嵌入播放

**自动部署流程**：
1. GitHub 仓库连接 Vercel
2. 推送到 `main` 分支自动触发生产部署
3. PR 自动创建预览部署（独立 URL）
4. Vercel CDN 全球加速

### 6. 配置文件驱动方案

**配置文件结构**：
```json
// src/config/exhibits.json
{
  "exhibition": {
    "title": "数据安全评估服务成果展",
    "subtitle": "守护数据安全，赋能数字未来"
  },
  "zones": [
    {
      "id": "entrance",
      "name": "入口大厅",
      "position": [0, 0, 0],
      "size": [20, 15, 6],
      "exhibits": [
        {
          "id": "welcome-video",
          "type": "video",
          "title": "项目概览",
          "position": [0, 3, -7],
          "videoUrl": "https://youtube.com/embed/xxx",
          "description": "数据安全评估服务项目介绍"
        }
      ]
    },
    {
      "id": "documents",
      "name": "文档资料区",
      "position": [0, 0, -20],
      "size": [25, 20, 6],
      "exhibits": [
        {
          "id": "doc-1",
          "type": "document",
          "title": "数据安全评估报告",
          "position": [-10, 1.5, -5],
          "content": "/docs/assessment-report.md",
          "thumbnail": "/thumbnails/doc-1.webp"
        }
      ]
    }
  ],
  "tour": {
    "waypoints": [
      { "position": [0, 2, 8], "lookAt": [0, 2, 0], "label": "入口大厅" },
      { "position": [0, 2, -15], "lookAt": [0, 2, -20], "label": "文档资料区" }
    ]
  }
}
```

## Architecture Insights

1. **组件即展区**：R3F 的组件树天然映射展厅的空间结构，每个展区是一个 React 组件
2. **配置即内容**：JSON 配置文件定义展区布局和展品列表，修改配置即可更新展厅内容
3. **状态即导航**：Zustand store 管理当前导航模式、所在展区、选中展品等状态
4. **程序化生成**：所有 3D 几何体通过代码构建，部署体积小、加载快、易维护
5. **渐进式加载**：先加载入口大厅，其他展区懒加载，优化首屏体验

## Code References

- `src/App.tsx` — 主应用入口，Canvas 配置
- `src/scene/ExhibitionHall.tsx` — 展厅主场景组件
- `src/scene/Room.tsx` — 参数化房间组件
- `src/scene/exhibits/PosterExhibit.tsx` — 海报展品组件
- `src/scene/exhibits/VideoExhibit.tsx` — 视频展品组件
- `src/scene/exhibits/DocumentExhibit.tsx` — 文档展品组件
- `src/scene/CameraController.tsx` — 相机控制系统
- `src/scene/Lighting.tsx` — 灯光系统
- `src/ui/Navigation.tsx` — 导航菜单 UI
- `src/ui/ExhibitDetail.tsx` — 展品详情弹窗
- `src/ui/Minimap.tsx` — 小地图
- `src/ui/LoadingScreen.tsx` — 加载画面
- `src/store/exhibition.ts` — Zustand 状态管理
- `src/config/exhibits.json` — 展厅配置文件

## Integration Points

### Inbound References
- 配置文件 `exhibits.json` 被所有展区组件读取
- Zustand store 被场景组件和 UI 组件共同使用

### Outbound Dependencies
- `three` — 3D 渲染核心
- `@react-three/fiber` — React 集成
- `@react-three/drei` — 3D 辅助组件
- `zustand` — 状态管理
- `@react-spring/three` — 动画
- `tailwindcss` — UI 样式

### Infrastructure Wiring
- Vercel 自动部署（GitHub → Vercel）
- Vite 构建配置（代码分割、资源优化）
- CDN 缓存策略（静态资源长缓存）

## Precedents & Lessons

### 典型案例参考
- **Smithsonian Open Access 3D**：Three.js + GLB 模型 + 轨道控制
- **Google Arts & Culture**：街景式导航 + 360° 房间 + 热点交互
- **Mozilla Hubs**：多用户房间 + 空间音频（本项目不需要）
- **Kunstmatrix**：虚拟画廊构建器 + 拖放式展品放置

### 关键经验
1. **阴影是最大的 GPU 瓶颈**：低端设备必须关闭阴影
2. **视频不要放在部署包中**：使用外部托管（YouTube/Cloudflare）
3. **WebGL 需要 HTTPS**：Vercel 默认提供
4. **Vite 的 `base` 配置**：Vercel 部署使用 `'/'`，不要用 `'./'`

## Developer Context

**Q (discover: 技术框架选型)**: React Three Fiber vs 原生 Three.js
A: 选择 React Three Fiber — 开发效率高 2-3 倍，声明式 JSX 匹配展厅数据结构

**Q (discover: 部署平台选择)**: Vercel 免费套餐
A: 确认使用 Vercel — 100GB 带宽/月足够，支持自动部署和预览链接

**Q (discover: 内容管理方式)**: 配置文件驱动
A: JSON 配置文件定义展区布局和展品列表，修改配置即可更新

**Q (discover: 视觉风格方向)**: 深蓝渐变 + 科技感
A: 深蓝灰渐变背景 + 科技蓝/青色主色调 + 粒子效果 + 发光线条

## Open Questions

- 视频文件的具体托管方案待确认（YouTube 未列出 vs Cloudflare Stream）
- 客户环境的具体部署形式待确认（静态文件 or Node.js）
- 数据看板区的具体数据来源和可视化形式待确认

## Related Research

- 3D Web Experience Skill: `.agents/skills/3d-web-experience/SKILL.md`
- Three.js WebGL Skill: `.agents/skills/threejs-webgl/SKILL.md`
- FRD: `.rpiv/artifacts/discover/2025-01-15_digital-exhibition-hall.md`
