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
