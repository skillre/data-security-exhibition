import { useExhibition } from '../store/useExhibition';
import config from '../config/exhibition.json';
import type { ExhibitionConfig } from '../types/exhibition';

const exhibitionConfig = config as unknown as ExhibitionConfig;

export function Navigation() {
  const cameraMode = useExhibition((s) => s.cameraMode);
  const setCameraMode = useExhibition((s) => s.setCameraMode);
  const currentWaypointIndex = useExhibition((s) => s.currentWaypointIndex);
  const nextWaypoint = useExhibition((s) => s.nextWaypoint);
  const prevWaypoint = useExhibition((s) => s.prevWaypoint);
  const goToWaypoint = useExhibition((s) => s.goToWaypoint);
  const selectedExhibit = useExhibition((s) => s.selectedExhibit);
  const selectExhibit = useExhibition((s) => s.selectExhibit);

  const waypoints = exhibitionConfig.tour.waypoints;

  const handleBackToTour = () => {
    selectExhibit(null);
    setCameraMode('guided');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      pointerEvents: 'none'
    }}>
      {/* 顶部导航栏 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        pointerEvents: 'auto'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(59, 130, 246, 0.2)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#60a5fa">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 style={{ color: 'white', fontWeight: 'bold', fontSize: '14px', margin: 0 }}>{exhibitionConfig.exhibition.title}</h1>
            <p style={{ color: 'rgba(147, 197, 253, 0.6)', fontSize: '12px', margin: 0 }}>{exhibitionConfig.exhibition.subtitle}</p>
          </div>
        </div>

        {/* 模式切换 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setCameraMode('guided')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: cameraMode === 'guided' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(30, 41, 59, 0.5)',
              color: cameraMode === 'guided' ? '#93c5fd' : '#94a3b8',
              border: cameraMode === 'guided' ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(51, 65, 85, 0.5)'
            }}
          >
            引导参观
          </button>
          <button
            onClick={() => setCameraMode('free')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: cameraMode === 'free' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(30, 41, 59, 0.5)',
              color: cameraMode === 'free' ? '#93c5fd' : '#94a3b8',
              border: cameraMode === 'free' ? '1px solid rgba(59, 130, 246, 0.5)' : '1px solid rgba(51, 65, 85, 0.5)'
            }}
          >
            自由漫游
          </button>
          {selectedExhibit && (
            <button
              onClick={handleBackToTour}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                background: 'rgba(30, 41, 59, 0.5)',
                color: '#94a3b8',
                border: '1px solid rgba(51, 65, 85, 0.5)'
              }}
            >
              返回参观
            </button>
          )}
        </div>
      </div>

      {/* 展区快速导航 */}
      {cameraMode === 'guided' && (
        <div style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          top: '64px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          pointerEvents: 'auto'
        }}>
          <button
            onClick={prevWaypoint}
            disabled={currentWaypointIndex === 0}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(30, 41, 59, 0.7)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: currentWaypointIndex === 0 ? 'not-allowed' : 'pointer',
              opacity: currentWaypointIndex === 0 ? 0.3 : 1,
              border: 'none'
            }}
          >
            ←
          </button>
          {waypoints.map((wp, index) => (
            <button
              key={wp.zoneId}
              onClick={() => goToWaypoint(index)}
              style={{
                padding: '6px 12px',
                borderRadius: '50px',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: currentWaypointIndex === index ? 'rgba(59, 130, 246, 0.4)' : 'rgba(30, 41, 59, 0.5)',
                color: currentWaypointIndex === index ? '#bfdbfe' : '#64748b',
                border: currentWaypointIndex === index ? '1px solid rgba(96, 165, 250, 0.5)' : '1px solid rgba(51, 65, 85, 0.3)'
              }}
            >
              {wp.label}
            </button>
          ))}
          <button
            onClick={nextWaypoint}
            disabled={currentWaypointIndex === waypoints.length - 1}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(30, 41, 59, 0.7)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: currentWaypointIndex === waypoints.length - 1 ? 'not-allowed' : 'pointer',
              opacity: currentWaypointIndex === waypoints.length - 1 ? 0.3 : 1,
              border: 'none'
            }}
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
