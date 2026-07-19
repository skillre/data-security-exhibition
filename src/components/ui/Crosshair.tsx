import { useControlsStore } from '../../store/useControlsStore';
import { useExhibitionStore } from '../../store/useExhibitionStore';

export function Crosshair() {
  const isPointerLocked = useControlsStore((s) => s.isPointerLocked);
  const selectedExhibit = useExhibitionStore((s) => s.selectedExhibit);

  console.log('Crosshair render:', { isPointerLocked, selectedExhibit });

  // 始终显示调试信息
  return (
    <>
      {/* 调试信息 */}
      <div style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.9)',
        color: 'white',
        padding: '10px 15px',
        borderRadius: '6px',
        fontSize: '13px',
        fontFamily: 'monospace',
        zIndex: 1000,
        pointerEvents: 'none',
        border: '1px solid rgba(79, 195, 247, 0.5)',
      }}>
        <div style={{ marginBottom: '4px' }}>🔧 Debug Info</div>
        <div>Locked: {isPointerLocked ? '✅ Yes' : '❌ No'}</div>
        <div>Exhibit: {selectedExhibit || 'None'}</div>
      </div>

      {/* 准心 - 始终显示，但在锁定模式下更明显 */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 100,
        pointerEvents: 'none',
        opacity: isPointerLocked ? 1 : 0.3,
        transition: 'opacity 0.2s',
      }}>
        {/* 外圈 */}
        <div style={{
          width: '40px',
          height: '40px',
          border: `2px solid ${isPointerLocked ? 'rgba(79, 195, 247, 0.8)' : 'rgba(255, 255, 255, 0.3)'}`,
          borderRadius: '50%',
          position: 'relative',
          boxShadow: isPointerLocked ? '0 0 15px rgba(79, 195, 247, 0.5)' : 'none',
        }}>
          {/* 中心点 */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '8px',
            height: '8px',
            background: isPointerLocked ? '#4fc3f7' : '#666',
            borderRadius: '50%',
            boxShadow: isPointerLocked ? '0 0 10px #4fc3f7' : 'none',
          }} />
          
          {/* 十字线 */}
          <div style={{
            position: 'absolute',
            top: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '2px',
            height: '14px',
            background: isPointerLocked ? 'rgba(79, 195, 247, 0.8)' : 'rgba(255, 255, 255, 0.3)',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-12px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '2px',
            height: '14px',
            background: isPointerLocked ? 'rgba(79, 195, 247, 0.8)' : 'rgba(255, 255, 255, 0.3)',
          }} />
          <div style={{
            position: 'absolute',
            left: '-12px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '14px',
            height: '2px',
            background: isPointerLocked ? 'rgba(79, 195, 247, 0.8)' : 'rgba(255, 255, 255, 0.3)',
          }} />
          <div style={{
            position: 'absolute',
            right: '-12px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '14px',
            height: '2px',
            background: isPointerLocked ? 'rgba(79, 195, 247, 0.8)' : 'rgba(255, 255, 255, 0.3)',
          }} />
        </div>
        
        {/* 提示文字 */}
        {isPointerLocked && (
          <div style={{
            position: 'absolute',
            top: '35px',
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            color: '#4fc3f7',
            fontSize: '12px',
            fontFamily: '"Noto Sans SC", sans-serif',
            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
            background: 'rgba(0,0,0,0.7)',
            padding: '5px 10px',
            borderRadius: '4px',
            border: '1px solid rgba(79, 195, 247, 0.3)',
          }}>
            点击展品查看详情
          </div>
        )}
      </div>
    </>
  );
}
