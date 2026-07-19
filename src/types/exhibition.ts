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
