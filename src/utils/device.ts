export interface DeviceCapabilities {
  isMobile: boolean;
  isLowEnd: boolean;
  pixelRatio: number;
  maxTextureSize: number;
  shadowsEnabled: boolean;
}

export function detectDevice(): DeviceCapabilities {
  const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);

  let isLowEnd = false;
  let maxTextureSize = 2048;

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        isLowEnd = /SwiftShader|Mesa|Intel|Adreno 3|Adreno 4|PowerVR|Mali-4/i.test(gpu);
      }
      maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    }
  } catch {
    // WebGL not available
  }

  return {
    isMobile,
    isLowEnd,
    pixelRatio: isMobile ? 1 : Math.min(window.devicePixelRatio, 2),
    maxTextureSize: Math.min(maxTextureSize, 2048),
    shadowsEnabled: !isLowEnd && !isMobile,
  };
}
