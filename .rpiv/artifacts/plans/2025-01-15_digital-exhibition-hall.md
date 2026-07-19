---
date: 2025-01-15T11:30:00+08:00
author: MiMo
commit: n/a
branch: main
repository: 数字化展厅
topic: "数据安全评估服务数字化展厅 — 实施计划"
tags: [plan, threejs, r3f, 3d-exhibition, vercel]
status: ready
last_updated: 2025-01-15T11:30:00+08:00
last_updated_by: MiMo
parent: .rpiv/artifacts/designs/2025-01-15_digital-exhibition-hall.md
---

# Plan: 数据安全评估服务数字化展厅

## Summary

基于架构设计文档，将数字化展厅分为 8 个实施阶段（Phase），每个阶段对应设计中的一个切片（Slice）。每个阶段完成后进行验证，确保代码正确后再推进到下一阶段。最终部署到 Vercel 提供预览链接。

## Phases

### Phase 1: 项目基础与类型定义

**目标**：搭建项目脚手架，定义所有 TypeScript 类型

**文件清单**：
- `package.json` — 项目配置和依赖
- `tsconfig.json` — TypeScript 配置
- `tsconfig.node.json` — Node TypeScript 配置
- `vite.config.ts` — Vite 构建配置
- `tailwind.config.js` — Tailwind CSS 配置
- `postcss.config.js` — PostCSS 配置
- `index.html` — HTML 入口
- `src/main.tsx` — React 入口
- `src/index.css` — 全局样式
- `src/types/exhibition.ts` — 类型定义
- `src/utils/webgl.ts` — WebGL 检测
- `src/utils/device.ts` — 设备检测

**成功标准**：
- [ ] `npm install` 成功完成
- [ ] `npm run check` TypeScript 类型检查通过
- [ ] `npm run build` 构建成功
- [ ] 所有类型定义完整覆盖展品、展区、状态

---

### Phase 2: 状态管理与配置文件

**目标**：实现 Zustand 状态管理和展厅配置文件

**文件清单**：
- `src/store/useExhibition.ts` — Zustand 状态管理
- `src/config/exhibition.json` — 展厅配置（5个展区、完整展品数据）

**依赖**：Phase 1

**成功标准**：
- [ ] `npm run check` 通过
- [ ] Zustand store 导出正确
- [ ] JSON 配置文件格式正确，包含 5 个展区

---

### Phase 3: 3D 房间与灯光系统

**目标**：实现程序化 3D 场景基础设施

**文件清单**：
- `src/scene/Room.tsx` — 参数化房间组件
- `src/scene/Lighting.tsx` — 灯光系统
- `src/scene/Particles.tsx` — 粒子效果
- `src/scene/GridFloor.tsx` — 科技感地板

**依赖**：Phase 1

**成功标准**：
- [ ] `npm run check` 通过
- [ ] 房间组件支持参数化配置
- [ ] 灯光系统包含 4 种光源
- [ ] 粒子效果和地板着色器正确渲染

---

### Phase 4: 展品组件

**目标**：实现 4 种展品组件

**文件清单**：
- `src/scene/exhibits/PosterExhibit.tsx` — 海报展品
- `src/scene/exhibits/DocumentExhibit.tsx` — 文档展品
- `src/scene/exhibits/VideoExhibit.tsx` — 视频展品
- `src/scene/exhibits/DataVizExhibit.tsx` — 数据看板展品
- `src/scene/exhibits/ExhibitRouter.tsx` — 展品路由

**依赖**：Phase 2 + Phase 3

**成功标准**：
- [ ] `npm run check` 通过
- [ ] 4 种展品组件正确渲染
- [ ] ExhibitRouter 正确路由
- [ ] 所有展品支持 hover 和点击交互

---

### Phase 5: 相机导航系统

**目标**：实现混合导航模式

**文件清单**：
- `src/camera/CameraController.tsx` — 相机控制（引导式 + 自由漫游 + 展品聚焦）

**依赖**：Phase 2

**成功标准**：
- [ ] `npm run check` 通过
- [ ] 引导式模式：相机平滑飞行
- [ ] 自由漫游模式：PointerLock 控制
- [ ] 展品聚焦模式：相机对准展品

---

### Phase 6: UI 叠加层

**目标**：实现所有 HTML UI 组件

**文件清单**：
- `src/ui/Navigation.tsx` — 导航菜单
- `src/ui/ExhibitDetail.tsx` — 展品详情弹窗
- `src/ui/Minimap.tsx` — 小地图
- `src/ui/LoadingScreen.tsx` — 加载画面
- `src/ui/ControlHints.tsx` — 操作提示
- `src/ui/WebglFallback.tsx` — WebGL 降级

**依赖**：Phase 2

**成功标准**：
- [ ] `npm run check` 通过
- [ ] 导航菜单显示展区列表和模式切换
- [ ] 展品详情弹窗支持视频/图片/文档展示
- [ ] 小地图显示各展区位置
- [ ] 加载画面显示进度条
- [ ] WebGL 降级页面正常显示

---

### Phase 7: 主场景组装

**目标**：组装所有组件，完成完整展厅

**文件清单**：
- `src/scene/ExhibitionHall.tsx` — 展厅主场景
- `src/App.tsx` — 根组件

**依赖**：Phase 3 + Phase 4 + Phase 5 + Phase 6

**成功标准**：
- [ ] `npm run check` 通过
- [ ] `npm run build` 成功
- [ ] 构建产物 < 20MB
- [ ] 展厅主场景包含所有展区
- [ ] 加载进度正确显示
- [ ] 3D 场景渲染正确
- [ ] UI 叠加层正常显示

---

### Phase 8: 部署配置与上线

**目标**：配置 Vercel 部署，提供预览链接

**文件清单**：
- `vercel.json` — Vercel 部署配置

**依赖**：Phase 7

**成功标准**：
- [ ] `npm run build` 成功
- [ ] `dist/` 目录生成正确
- [ ] Vercel 部署成功
- [ ] 通过公开 URL 可访问
- [ ] 多端访问正常

---

## 执行顺序

```
Phase 1 (基础)
  ↓
Phase 2 (状态) ← Phase 3 (3D) [可并行]
  ↓
Phase 4 (展品) ← Phase 5 (相机) ← Phase 6 (UI) [可并行]
  ↓
Phase 7 (组装)
  ↓
Phase 8 (部署)
```

## 关键注意事项

1. **不在本地安装依赖**：所有代码编写在本地完成，但 `npm install` 和 `npm run build` 需要在 Vercel 构建环境中执行
2. **代码即配置**：展厅内容通过 `exhibition.json` 配置文件管理，修改配置即可更新展品
3. **性能优先**：移动端关闭阴影、降低 DPR、使用 WebP 纹理
4. **渐进式加载**：先加载入口大厅，其他展区懒加载

## 设计文档引用

完整代码实现参见：`.rpiv/artifacts/designs/2025-01-15_digital-exhibition-hall.md`
