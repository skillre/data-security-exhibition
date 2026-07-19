import { useLoadingStore } from '../../store/useLoadingStore';
import { useExhibitionStore } from '../../store/useExhibitionStore';

export function LoadingScreen() {
  const progress = useLoadingStore((s) => s.progress);
  const isSceneReady = useExhibitionStore((s) => s.isSceneReady);

  if (isSceneReady) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%)',
      zIndex: 9999,
      fontFamily: '"Noto Sans SC", sans-serif',
    }}>
      <h1 style={{
        color: '#fff',
        fontSize: '32px',
        fontWeight: 600,
        marginBottom: '32px',
      }}>
        数据安全评估服务展厅
      </h1>
      
      <div style={{
        width: '300px',
        height: '4px',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '2px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
          borderRadius: '2px',
          transition: 'width 0.3s ease-out',
        }} />
      </div>
      
      <p style={{
        color: 'rgba(255,255,255,0.5)',
        marginTop: '16px',
        fontSize: '14px',
      }}>
        加载中... {Math.round(progress)}%
      </p>
    </div>
  );
}
