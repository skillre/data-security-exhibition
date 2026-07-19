import { useControlsStore } from '../../store/useControlsStore';
import { useExhibitionStore } from '../../store/useExhibitionStore';

export function Crosshair() {
  const isPointerLocked = useControlsStore((s) => s.isPointerLocked);
  const selectedExhibit = useExhibitionStore((s) => s.selectedExhibit);

  // 调试信息 - 始终显示一个小型指示器
  const debugInfo = (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '4px',
      fontSize: '12px',
      fontFamily: 'monospace',
      zIndex: 1000,
      pointerEvents: 'none',
    }}>
      <div>Locked: {isPointerLocked ? '✅ Yes' : '❌ No'}</div>
      <div>Exhibit: {selectedExhibit || 'None'}</div>
    </div>
  );

  // 只在锁定模式且没有展品选中时显示准心
  if (!isPointerLocked || selectedExhibit) {
    return debugInfo;
  }

  return (
    <>
      {debugInfo}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 100,
        pointerEvents: 'none',
      }}>
        {/* 外圈 */}
        <div style={{
          width: '40px',
          height: '40px',
          border: '2px solid rgba(255, 255, 255, 0.6)',
          borderRadius: '50%',
          position: 'relative',
          boxShadow: '0 0 10px rgba(79, 195, 247, 0.3)',
        }}>
          {/* 中心点 */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '8px',
            height: '8px',
            background: '#4fc3f7',
            borderRadius: '50%',
            boxShadow: '0 0 15px #4fc3f7, 0 0 30px #4fc3f7',
          }} />
          
          {/* 上线 */}
          <div style={{
            position: 'absolute',
            top: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '2px',
            height: '12px',
            background: 'rgba(255, 255, 255, 0.6)',
          }} />
          
          {/* 下线 */}
          <div style={{
            position: 'absolute',
            bottom: '-10px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '2px',
            height: '12px',
            background: 'rgba(255, 255, 255, 0.6)',
          }} />
          
          {/* 左线 */}
          <div style={{
            position: 'absolute',
            left: '-10px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '12px',
            height: '2px',
            background: 'rgba(255, 255, 255, 0.6)',
          }} />
          
          {/* 右线 */}
          <div style={{
            position: 'absolute',
            right: '-10px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '12px',
            height: '2px',
            background: 'rgba(255, 255, 255, 0.6)',
          }} />
        </div>
        
        {/* 提示文字 */}
        <div style={{
          position: 'absolute',
          top: '35px',
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '12px',
          fontFamily: '"Noto Sans SC", sans-serif',
          textShadow: '0 2px 4px rgba(0,0,0,0.8)',
          background: 'rgba(0,0,0,0.5)',
          padding: '4px 8px',
          borderRadius: '4px',
        }}>
          点击展品查看详情
        </div>
      </div>
    </>
  );
}
