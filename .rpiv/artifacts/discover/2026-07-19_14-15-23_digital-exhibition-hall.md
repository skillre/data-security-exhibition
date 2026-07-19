---
date: 2026-07-19T14:15:23+0800
author: skillre
commit: a8b430e
branch: main
repository: 数字化展厅
topic: "数据安全评估服务数字化展厅"
tags: [intent, frd, threejs, react-three-fiber, 3d-exhibition]
status: ready
last_updated: 2026-07-19T14:15:23+0800
last_updated_by: skillre
---

# FRD: 数据安全评估服务数字化展厅

## Summary

构建一个沉浸式3D数字化展厅，用于向合作伙伴和客户展示数据安全评估服务项目的成果。展厅采用虚拟空间漫游风格，访客可以在3D空间中自由探索，点击展品查看详细内容。项目采用Vite + React + React Three Fiber技术栈，纯前端静态部署，所有展品内容（图片、视频、文档）存放在项目目录中。

## Problem & Intent

我们完成了一个数据安全评估服务项目，过程中积累了大量文档资料、海报和视频。客户要求制作一个数字化展厅，能够将评估服务的内容展示给客户全公司的员工。核心目标是向合作伙伴和客户展示我们的专业能力、项目案例和成果质量，重点突出成果交付：报告数量、建立的安全体系、带来的业务价值。

## Goals

- 创建一个沉浸式3D虚拟展厅，让访客能够自由漫游探索
- 展示数据安全评估服务的成果交付：报告、安全体系、业务价值
- 支持图片展品（海报、报告封面）、视频展品、文档展品（PDF/Word）三种类型
- 提供推荐参观路线，同时允许自由探索
- 实现展品互动：点击展品可查看详细内容
- 纯前端静态部署，可部署到GitHub Pages等免费平台
- 桌面优先，移动端也可访问

## Non-Goals

- 不需要用户登录或权限控制（完全公开访问）
- 不需要多语言支持（先做中文）
- 不需要后端服务器或数据库
- 不需要社交互动功能（留言、点赞、分享）
- 不需要虚拟讲解员或语音导览
- 不需要移动端优先优化（桌面优先）

## Functional Requirements

1. 系统 SHALL 提供一个3D虚拟展厅空间，访客可以在其中自由漫游
2. 系统 SHALL 支持三种展品类型：图片展品、视频展品、文档展品
3. 系统 SHALL 允许访客点击展品查看详细内容（弹窗或侧边栏）
4. 系统 SHALL 提供推荐参观路线，访客可以选择跟随或自由探索
5. 系统 SHALL 将所有展品内容存放在项目目录中
6. 系统 SHALL 提供展品管理配置文件，方便添加/修改展品
7. 系统 SHALL 支持键盘和鼠标控制漫游（WASD移动，鼠标视角）
8. 系统 SHALL 在3D场景中显示展品的标题和简介
9. 系统 SHALL 支持展品分类展示（按项目阶段或内容类型）
10. 系统 SHALL 提供返回起点或重置视角的功能

## Non-Functional Requirements

- **Performance**: 3D场景首次加载时间 < 10秒（桌面端），帧率 > 30fps
- **Security**: 纯前端静态资源，无用户数据收集，无XSS风险
- **UX / Accessibility**: 桌面优先，支持键盘快捷键，提供操作指引
- **Reliability**: 静态资源部署，无服务器依赖，高可用性

## Constraints & Assumptions

- 技术栈：Vite + React + React Three Fiber，纯前端静态部署
- 部署平台：GitHub Pages / Vercel / Netlify 等免费静态托管
- 3D资产：完全从零创建，使用Three.js几何体和免费资源
- 浏览器支持：现代浏览器（Chrome, Firefox, Safari, Edge）
- 展品内容：项目目录中存放，支持图片、视频、PDF格式
- 开发环境：仅在本地开发，不在本地运行或安装依赖

## Acceptance Criteria

- [ ] 运行 `npm run dev` 可启动本地开发服务器，显示3D展厅
- [ ] 访客可以使用WASD键在3D空间中自由移动
- [ ] 访客可以使用鼠标控制视角（左右上下旋转）
- [ ] 点击展品会弹出详情面板，显示展品标题、描述和内容
- [ ] 展品详情面板可以关闭，返回3D场景
- [ ] 3D场景中有明显的推荐路线指引（地面标记或箭头）
- [ ] 运行 `npm run build` 可生成静态部署文件
- [ ] 生成的静态文件可直接部署到GitHub Pages
- [ ] 展品配置文件（JSON格式）可以方便地添加新展品
- [ ] 3D场景加载时显示加载进度条

## Recommended Approach

采用Vite + React + React Three Fiber构建纯前端3D展厅应用。使用Three.js创建3D场景（几何体建模），@react-three/fiber渲染，@react-three/drei提供相机控制和辅助组件。展品通过JSON配置文件管理，支持图片、视频、PDF三种类型。漫游使用PointerLockControls实现第一人称视角，展品交互使用Raycasting检测点击。部署时构建为静态文件，可直接托管到GitHub Pages等平台。

## Decisions

### 展厅风格
**Question**: 你期望的数字化展厅是什么样的风格和体验？
**Recommended**: 虚拟空间漫游
**Chosen**: 虚拟空间漫游
**Rationale**: 用户明确要求沉浸式3D虚拟空间，可自由漫游探索

### 展示重点
**Question**: 对于合作伙伴/客户来说，他们最关心的是数据安全评估的哪个方面？
**Recommended**: 成果交付
**Chosen**: 成果交付
**Rationale**: 用户选择重点展示报告数量、安全体系、业务价值

### 3D技术栈
**Question**: 你倾向于使用哪种3D技术栈？
**Recommended**: React Three Fiber
**Chosen**: 让我推荐（推荐React Three Fiber）
**Rationale**: React生态成熟，社区支持好，适合构建交互式3D场景

### 前端框架
**Question**: 你希望使用什么样的前端项目结构？
**Recommended**: Vite + React
**Chosen**: 让我推荐（推荐Vite + React）
**Rationale**: 现代化构建工具，可轻松部署到Vercel、Netlify等免费平台

### 部署方式
**Question**: 你对部署平台有什么偏好？
**Recommended**: 纯静态托管
**Chosen**: 纯静态托管
**Rationale**: 无需后端服务器，部署简单，维护成本低

### 数据存储
**Question**: 你打算如何管理展厅中的展品内容（文档、海报、视频）？
**Recommended**: 项目目录
**Chosen**: 项目目录
**Rationale**: 简单直接，适合少量内容，无需外部服务

### 展厅结构
**Question**: 你希望展厅的空间结构是怎样的？
**Recommended**: 单层展厅
**Chosen**: 单层展厅
**Rationale**: 结构简单，易于实现，用户体验流畅

### 交互功能
**Question**: 你希望访客在展厅中能进行哪些交互？
**Recommended**: 自由漫游、展品互动
**Chosen**: 自由漫游、展品互动
**Rationale**: 核心交互需求，自由探索+点击查看详情

### 导览方式
**Question**: 你希望访客如何参观展厅？
**Recommended**: 推荐路线+自由
**Chosen**: 推荐路线+自由
**Rationale**: 平衡引导和自由度，既提供路线又允许探索

### 访问权限
**Question**: 展厅的访问权限如何控制？
**Recommended**: 完全公开
**Chosen**: 完全公开
**Rationale**: 任何人知道链接都可以访问，无需登录，简化实现

### 响应式设计
**Question**: 你希望展厅支持哪些设备访问？
**Recommended**: 桌面优先
**Chosen**: 桌面优先
**Rationale**: 3D场景在桌面端体验最好，移动端也可访问但非重点

### 语言支持
**Question**: 展厅需要支持哪些语言？
**Recommended**: 先做中文
**Chosen**: 先做中文
**Rationale**: 先实现中文版本，后续可扩展其他语言

## Open Questions

- 3D场景的具体布局设计：展品如何摆放，空间如何划分
- 免费3D资源来源：使用Three.js几何体建模还是寻找免费3D模型
- 具体的展品内容：需要用户提供实际的图片、视频、文档文件

## Suggested Follow-ups

- 考虑添加背景音乐或环境音效，增强沉浸感
- 考虑添加昼夜模式切换，增加场景变化
- 考虑添加展品搜索功能，方便快速定位
- 考虑添加访客统计，了解展品热度

## References

- 输入需求：用户口头描述的数据安全评估服务项目成果展示需求
- 相关技能：`.agents/skills/3d-web-experience/SKILL.md`、`.agents/skills/threejs-webgl/SKILL.md`
- rpiv流程：discover技能文档
