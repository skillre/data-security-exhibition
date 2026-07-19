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
