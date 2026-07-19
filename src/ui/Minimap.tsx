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
  const mapSize = 200;
  const padding = 30;

  // 计算展区的实际坐标范围
  const positions = waypoints.map(wp => ({ x: wp.position[0], z: wp.position[2] }));
  const minX = Math.min(...positions.map(p => p.x));
  const maxX = Math.max(...positions.map(p => p.x));
  const minZ = Math.min(...positions.map(p => p.z));
  const maxZ = Math.max(...positions.map(p => p.z));

  const rangeX = maxX - minX || 1;
  const rangeZ = maxZ - minZ || 1;

  // 将3D坐标映射到小地图坐标
  const mapX = (x: number) => padding + ((x - minX) / rangeX) * (mapSize - 2 * padding);
  const mapZ = (z: number) => padding + ((z - minZ) / rangeZ) * (mapSize - 2 * padding);

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 50
    }}>
      <div style={{
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(59, 130, 246, 0.4)',
        borderRadius: '16px',
        padding: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ color: '#93c5fd', fontSize: '13px', fontWeight: 'bold', marginBottom: '12px', textAlign: 'center' }}>
          🗺️ 展厅地图
        </div>
        <svg width={mapSize} height={mapSize} viewBox={`0 0 ${mapSize} ${mapSize}`}>
          {/* 背景 */}
          <rect x="0" y="0" width={mapSize} height={mapSize} fill="#0f172a" rx="8" />

          {/* 网格线 */}
          {[0.25, 0.5, 0.75].map(ratio => (
            <g key={ratio}>
              <line x1={mapSize * ratio} y1="0" x2={mapSize * ratio} y2={mapSize} stroke="#1e293b" strokeWidth="0.5" />
              <line x1="0" y1={mapSize * ratio} x2={mapSize} y2={mapSize * ratio} stroke="#1e293b" strokeWidth="0.5" />
            </g>
          ))}

          {/* 连接线 */}
          {waypoints.map((wp, i) => {
            if (i === 0) return null;
            const prev = waypoints[i - 1];
            return (
              <line
                key={`line-${i}`}
                x1={mapX(prev.position[0])}
                y1={mapZ(prev.position[2])}
                x2={mapX(wp.position[0])}
                y2={mapZ(wp.position[2])}
                stroke="#3b82f6"
                strokeWidth="2"
                strokeOpacity="0.5"
                strokeDasharray="4,4"
              />
            );
          })}

          {/* 展区标记 */}
          {waypoints.map((wp, index) => {
            const x = mapX(wp.position[0]);
            const y = mapZ(wp.position[2]);
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
                {/* 活跃状态的外圈动画 */}
                {isActive && (
                  <>
                    <circle cx={x} cy={y} r="16" fill="none" stroke="#3b82f6" strokeWidth="2" strokeOpacity="0.3">
                      <animate attributeName="r" from="12" to="20" dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="stroke-opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={x} cy={y} r="12" fill="none" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.5">
                      <animate attributeName="r" from="10" to="16" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="stroke-opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </>
                )}

                {/* 主圆点 */}
                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? 10 : 7}
                  fill={isActive ? '#3b82f6' : '#1e3a5f'}
                  stroke={isActive ? '#60a5fa' : '#3b82f6'}
                  strokeWidth={isActive ? 3 : 2}
                />

                {/* 内部亮点 */}
                <circle
                  cx={x}
                  cy={y}
                  r={isActive ? 4 : 3}
                  fill={isActive ? '#ffffff' : '#60a5fa'}
                  opacity={isActive ? 1 : 0.7}
                />

                {/* 标签 - 使用foreignObject支持中文换行 */}
                <foreignObject x={x - 35} y={y + 14} width="70" height="30">
                  <div style={{
                    fontSize: '10px',
                    color: isActive ? '#ffffff' : '#94a3b8',
                    textAlign: 'center',
                    fontWeight: isActive ? 'bold' : 'normal',
                    lineHeight: '1.2'
                  }}>
                    {wp.label}
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
