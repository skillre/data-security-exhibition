import { useExhibition } from '../store/useExhibition';
import config from '../config/exhibition.json';
import type { ExhibitionConfig } from '../types/exhibition';

const exhibitionConfig = config as unknown as ExhibitionConfig;

export function Minimap() {
  const showMinimap = useExhibition((s) => s.showMinimap);
  const currentWaypointIndex = useExhibition((s) => s.currentWaypointIndex);
  const goToWaypoint = useExhibition((s) => s.goToWaypoint);
  const setCameraMode = useExhibition((s) => s.setCameraMode);

  if (!showMinimap) return null;

  const waypoints = exhibitionConfig.tour.waypoints;
  const mapSize = 160;
  const scale = 3;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 50
    }}>
      <div style={{
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '12px',
        padding: '12px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ color: 'rgba(147, 197, 253, 0.6)', fontSize: '12px', marginBottom: '8px', textAlign: 'center' }}>展厅地图</div>
        <svg width={mapSize} height={mapSize} viewBox={`-80 -80 ${mapSize} ${mapSize}`}>
          {/* 背景 */}
          <rect x="-80" y="-80" width={mapSize} height={mapSize} fill="#0a0e1a" rx="8" />

          {/* 连接线 */}
          {waypoints.map((wp, i) => {
            if (i === 0) return null;
            const prev = waypoints[i - 1];
            return (
              <line
                key={`line-${i}`}
                x1={prev.position[0] / scale}
                y1={-prev.position[2] / scale}
                x2={wp.position[0] / scale}
                y2={-wp.position[2] / scale}
                stroke="#4488ff"
                strokeWidth="1"
                strokeOpacity="0.3"
              />
            );
          })}

          {/* 展区标记 */}
          {waypoints.map((wp, index) => {
            const x = wp.position[0] / scale;
            const y = -wp.position[2] / scale;
            const isActive = currentWaypointIndex === index;

            return (
              <g
                key={wp.zoneId}
                onClick={() => {
                  goToWaypoint(index);
                  setCameraMode('guided');
                }}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? 8 : 5}
                  fill={isActive ? '#4488ff' : '#1a2a4a'}
                  stroke="#4488ff"
                  strokeWidth={isActive ? 2 : 1}
                  strokeOpacity={isActive ? 1 : 0.5}
                />
                {isActive && (
                  <circle
                    cx={x}
                    cy={y}
                    r={12}
                    fill="none"
                    stroke="#4488ff"
                    strokeWidth="1"
                    strokeOpacity="0.3"
                  >
                    <animate attributeName="r" from="8" to="16" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="stroke-opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
                <text
                  x={x}
                  y={y + 18}
                  textAnchor="middle"
                  fill={isActive ? '#ffffff' : '#8888aa'}
                  fontSize="8"
                >
                  {wp.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
