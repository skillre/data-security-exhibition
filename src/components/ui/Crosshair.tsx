import { useControlsStore } from '../../store/useControlsStore';
import { useExhibitionStore } from '../../store/useExhibitionStore';

export function Crosshair() {
  const isPointerLocked = useControlsStore((s) => s.isPointerLocked);
  const selectedExhibit = useExhibitionStore((s) => s.selectedExhibit);

  // 只在锁定模式且没有展品选中时显示
  if (!isPointerLocked || selectedExhibit) return null;

  return (
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
        border: '2px solid rgba(255, 255, 255, 0.5)',
        borderRadius: '50%',
        position: 'relative',
      }}>
        {/* 中心点 */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '6px',
          height: '6px',
          background: '#4fc3f7',
          borderRadius: '50%',
          boxShadow: '0 0 10px #4fc3f7, 0 0 20px #4fc3f7',
        }} />
        
        {/* 上线 */}
        <div style={{
          position: 'absolute',
          top: '-8px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '2px',
          height: '10px',
          background: 'rgba(255, 255, 255, 0.5)',
        }} />
        
        {/* 下线 */}
        <div style={{
          position: 'absolute',
          bottom: '-8px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '2px',
          height: '10px',
          background: 'rgba(255, 255, 255, 0.5)',
        }} />
        
        {/* 左线 */}
        <div style={{
          position: 'absolute',
          left: '-8px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '10px',
          height: '2px',
          background: 'rgba(255, 255, 255, 0.5)',
        }} />
        
        {/* 右线 */}
        <div style={{
          position: 'absolute',
          right: '-8px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '10px',
          height: '2px',
          background: 'rgba(255, 255, 255, 0.5)',
        }} />
      </div>
      
      {/* 提示文字 */}
      <div style={{
        position: 'absolute',
        top: '30px',
        left: '50%',
        transform: 'translateX(-50%)',
        whiteSpace: 'nowrap',
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '11px',
        fontFamily: '"Noto Sans SC", sans-serif',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
      }}>
        点击展品查看详情
      </div>
    </div>
  );
}
