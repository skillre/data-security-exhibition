import { useExhibitionStore } from '../../store/useExhibitionStore';

export function TourControls() {
  const tourMode = useExhibitionStore((s) => s.tourMode);
  const currentTourStep = useExhibitionStore((s) => s.currentTourStep);
  const startTour = useExhibitionStore((s) => s.startTour);
  const stopTour = useExhibitionStore((s) => s.stopTour);
  const nextTourStep = useExhibitionStore((s) => s.nextTourStep);
  const selectExhibit = useExhibitionStore((s) => s.selectExhibit);
  const config = useExhibitionStore((s) => s.config);

  const isFollowing = tourMode === 'following';
  const totalSteps = config?.tourRoute.length ?? 0;

  const handleReturnStart = () => {
    stopTour();
    selectExhibit(null);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '12px',
      zIndex: 500,
      pointerEvents: 'auto',
    }}>
      {!isFollowing ? (
        <button
          onClick={startTour}
          style={{
            padding: '12px 28px',
            background: 'linear-gradient(135deg, #4fc3f7, #2196f3)',
            color: 'white',
            border: 'none',
            borderRadius: '28px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(33,150,243,0.4)',
          }}
        >
          🗺️ 开始导览
        </button>
      ) : (
        <>
          <button
            onClick={nextTourStep}
            style={{
              padding: '10px 20px',
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '24px',
              fontSize: '13px',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
            }}
          >
            下一站 ({currentTourStep + 1}/{totalSteps})
          </button>

          <button
            onClick={stopTour}
            style={{
              padding: '10px 20px',
              background: 'rgba(244,67,54,0.2)',
              color: '#ef5350',
              border: '1px solid rgba(244,67,54,0.3)',
              borderRadius: '24px',
              fontSize: '13px',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
            }}
          >
            ⏹ 结束导览
          </button>
        </>
      )}

      <button
        onClick={handleReturnStart}
        style={{
          padding: '10px 20px',
          background: 'rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.8)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '24px',
          fontSize: '13px',
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
        }}
      >
        🏠 返回起点
      </button>
    </div>
  );
}
