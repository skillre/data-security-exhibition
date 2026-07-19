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
