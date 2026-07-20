import { create } from 'zustand';

export type QualityLevel = 'high' | 'medium' | 'low';

/** 各画质档位的渲染参数预算（见设计文档 §5.2） */
export interface QualityPreset {
  /** HDRI 分辨率档位 */
  hdriResolution: '1k' | '2k';
  /** 后处理：none / 仅 SMAA / Bloom + SMAA */
  postProcessing: 'none' | 'smaa' | 'bloom';
  /** 是否开启地面反射，以及反射贴图分辨率 */
  reflection: false | 512;
  /** 阴影贴图分辨率，0 表示关闭阴影 */
  shadowMapSize: 0 | 1024 | 2048;
  /** 粒子数量 */
  particleCount: number;
  /** 渲染 DPR 上限 */
  dpr: number;
}

export const QUALITY_PRESETS: Record<QualityLevel, QualityPreset> = {
  high: {
    hdriResolution: '2k',
    postProcessing: 'bloom',
    reflection: 512,
    shadowMapSize: 2048,
    particleCount: 80,
    dpr: 2,
  },
  medium: {
    hdriResolution: '1k',
    postProcessing: 'smaa',
    reflection: false,
    shadowMapSize: 1024,
    particleCount: 40,
    dpr: 1.5,
  },
  low: {
    hdriResolution: '1k',
    postProcessing: 'none',
    reflection: false,
    shadowMapSize: 0,
    particleCount: 0,
    dpr: 1,
  },
};

/** 首次进入时根据 CPU 逻辑核心数粗判默认档位 */
function detectDefaultQuality(): QualityLevel {
  const cores =
    typeof navigator !== 'undefined' && navigator.hardwareConcurrency
      ? navigator.hardwareConcurrency
      : 4;
  if (cores >= 8) return 'high';
  if (cores <= 2) return 'low';
  return 'medium';
}

interface SettingsState {
  quality: QualityLevel;
  preset: QualityPreset;
  setQuality: (quality: QualityLevel) => void;
}

const initialQuality = detectDefaultQuality();

export const useSettingsStore = create<SettingsState>()((set) => ({
  quality: initialQuality,
  preset: QUALITY_PRESETS[initialQuality],
  setQuality: (quality) =>
    set({ quality, preset: QUALITY_PRESETS[quality] }),
}));
