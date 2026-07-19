import { useState, useEffect } from 'react';
import { useControlsStore } from '../../store/useControlsStore';

export function HelpOverlay() {
  const isPointerLocked = useControlsStore((s) => s.isPointerLocked);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (isPointerLocked) {
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setVisible(true);
    }
  }, [isPointerLocked]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '20px',
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(10px)',
      borderRadius: '12px',
      padding: '16px 20px',
      color: 'white',
      fontSize: '14px',
      lineHeight: 1.6,
      pointerEvents: 'auto',
      border: '1px solid rgba(255,255,255,0.1)',
    }}>
      <div style={{ fontWeight: 600, marginBottom: '8px' }}>🎮 操作指南</div>
      <div>WASD - 移动</div>
      <div>鼠标 - 视角</div>
      <div>Shift - 加速</div>
      <div>点击展品 - 查看详情</div>
      <div>ESC - 返回</div>
    </div>
  );
}
