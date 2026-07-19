import { useState, useEffect } from 'react';
import { useExhibition } from '../store/useExhibition';

export function ControlHints() {
  const cameraMode = useExhibition((s) => s.cameraMode);
  const showHints = useExhibition((s) => s.showHints);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (showHints && cameraMode === 'free') {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [cameraMode, showHints]);

  if (!visible || cameraMode !== 'free') return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '24px',
      zIndex: 50
    }}>
      <div style={{
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '12px',
        padding: '16px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ color: '#93c5fd', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>操作指南</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', color: '#94a3b8', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <kbd style={{
              padding: '2px 6px',
              background: 'rgba(30, 41, 59, 0.8)',
              borderRadius: '4px',
              color: '#cbd5e1',
              fontFamily: 'monospace',
              fontSize: '11px'
            }}>W A S D</kbd>
            <span>移动</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <kbd style={{
              padding: '2px 6px',
              background: 'rgba(30, 41, 59, 0.8)',
              borderRadius: '4px',
              color: '#cbd5e1',
              fontFamily: 'monospace',
              fontSize: '11px'
            }}>鼠标</kbd>
            <span>环顾四周</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <kbd style={{
              padding: '2px 6px',
              background: 'rgba(30, 41, 59, 0.8)',
              borderRadius: '4px',
              color: '#cbd5e1',
              fontFamily: 'monospace',
              fontSize: '11px'
            }}>点击展品</kbd>
            <span>查看详情</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <kbd style={{
              padding: '2px 6px',
              background: 'rgba(30, 41, 59, 0.8)',
              borderRadius: '4px',
              color: '#cbd5e1',
              fontFamily: 'monospace',
              fontSize: '11px'
            }}>ESC</kbd>
            <span>退出漫游</span>
          </div>
        </div>
      </div>
    </div>
  );
}
