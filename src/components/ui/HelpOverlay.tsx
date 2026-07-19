import { useState, useEffect } from 'react';
import { useControlsStore } from '../../store/useControlsStore';
import { useExhibitionStore } from '../../store/useExhibitionStore';

export function HelpOverlay() {
  const isPointerLocked = useControlsStore((s) => s.isPointerLocked);
  const selectedExhibit = useExhibitionStore((s) => s.selectedExhibit);
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  // 5秒后自动隐藏（除非在锁定模式）
  useEffect(() => {
    if (isPointerLocked) {
      // 锁定模式下显示精简提示
      setVisible(true);
      setFadeOut(false);
      return;
    }

    setVisible(true);
    setFadeOut(false);
    
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setVisible(false), 300);
    }, 8000);

    return () => clearTimeout(timer);
  }, [isPointerLocked]);

  // 有展品选中时隐藏
  if (selectedExhibit) return null;
  if (!visible) return null;

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '20px',
    left: '20px',
    background: 'rgba(0, 0, 0, 0.75)',
    backdropFilter: 'blur(10px)',
    borderRadius: '12px',
    padding: '16px 20px',
    color: 'white',
    fontSize: '13px',
    lineHeight: 1.6,
    pointerEvents: 'none',
    border: '1px solid rgba(33, 150, 243, 0.3)',
    zIndex: 100,
    opacity: fadeOut ? 0 : 1,
    transition: 'opacity 0.3s ease',
    minWidth: '200px',
  };

  if (isPointerLocked) {
    // 锁定模式提示
    return (
      <div style={containerStyle}>
        <div style={{ 
          fontWeight: 600, 
          marginBottom: '10px',
          color: '#4fc3f7',
          fontSize: '14px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          paddingBottom: '8px',
        }}>
          🎮 精确控制模式
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>WASD</span>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>移动</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>鼠标</span>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>视角控制</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Shift</span>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>加速</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>点击展品</span>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>查看详情</span>
          </div>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '6px',
            marginTop: '4px',
          }}>
            <span>ESC</span>
            <span style={{ color: '#ff5252' }}>退出模式</span>
          </div>
        </div>
      </div>
    );
  }

  // 自由模式提示
  return (
    <div style={containerStyle}>
      <div style={{ 
        fontWeight: 600, 
        marginBottom: '10px',
        color: '#4fc3f7',
        fontSize: '14px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        paddingBottom: '8px',
      }}>
        🎮 操作指南
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>WASD</span>
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>移动</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>鼠标拖动</span>
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>旋转视角</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>滚轮</span>
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>前进/后退</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Shift</span>
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>加速移动</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Space/Ctrl</span>
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>上升/下降</span>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '6px',
          marginTop: '4px',
        }}>
          <span>点击展品</span>
          <span style={{ color: '#4fc3f7' }}>查看详情</span>
        </div>
      </div>
      
      {/* 点击进入提示 */}
      <div style={{
        marginTop: '12px',
        padding: '8px 12px',
        background: 'rgba(33, 150, 243, 0.2)',
        borderRadius: '6px',
        fontSize: '12px',
        color: '#64b5f6',
        textAlign: 'center',
      }}>
        点击空白区域进入精确控制
      </div>
    </div>
  );
}
