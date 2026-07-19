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
