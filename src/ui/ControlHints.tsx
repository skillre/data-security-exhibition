import { useState, useEffect } from 'react';
import { useExhibition } from '../store/useExhibition';

export function ControlHints() {
  const cameraMode = useExhibition((s) => s.cameraMode);
  const showHints = useExhibition((s) => s.showHints);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (showHints && cameraMode === 'free') {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 8000);
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
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(59, 130, 246, 0.4)',
        borderRadius: '12px',
        padding: '16px 20px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ color: '#93c5fd', fontSize: '13px', fontWeight: 'bold', marginBottom: '10px' }}>🕹️ 自由漫游模式</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#cbd5e1', fontSize: '13px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <kbd style={{ padding: '4px 10px', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '6px', color: '#93c5fd', fontFamily: 'monospace', fontSize: '12px', minWidth: '80px', textAlign: 'center' }}>W A S D</kbd>
            <span>移动视角</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <kbd style={{ padding: '4px 10px', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '6px', color: '#93c5fd', fontFamily: 'monospace', fontSize: '12px', minWidth: '80px', textAlign: 'center' }}>鼠标左键拖拽</kbd>
            <span>旋转视角</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <kbd style={{ padding: '4px 10px', background: 'rgba(59, 130, 246, 0.2)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '6px', color: '#93c5fd', fontFamily: 'monospace', fontSize: '12px', minWidth: '80px', textAlign: 'center' }}>点击展品</kbd>
            <span>查看详情</span>
          </div>
        </div>
        <div style={{ color: '#64748b', fontSize: '11px', marginTop: '10px' }}>点击右上角"引导参观"可切换回引导模式</div>
      </div>
    </div>
  );
}
