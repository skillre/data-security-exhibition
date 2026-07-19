export function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export function isMobile(): boolean {
  return /iPhone|iPad|Android/i.test(navigator.userAgent);
}
