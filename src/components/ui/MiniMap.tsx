import { useExhibitionStore } from '../../store/useExhibitionStore';
import { useControlsStore } from '../../store/useControlsStore';

export function MiniMap() {
  const exhibits = useExhibitionStore((s) => s.exhibits);
  const selectedExhibit = useExhibitionStore((s) => s.selectedExhibit);
  const isPointerLocked = useControlsStore((s) => s.isPointerLocked);

  // 只在锁定模式时显示小地图
  if (!isPointerLocked) return null;

  const mapSize = 150;
  const scale = mapSize / 20;
  const center = mapSize / 2;

  // 玩家位置固定在小地图中心（因为我们不知道相机位置）
  const playerX = center;
  const playerZ = center;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: `${mapSize}px`,
      height: `${mapSize}px`,
      background: 'rgba(0, 0, 0, 0.7)',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid rgba(79, 195, 247, 0.3)',
      pointerEvents: 'auto',
      backdropFilter: 'blur(5px)',
    }}>
      {/* 标题 */}
      <div style={{
        position: 'absolute',
        top: '4px',
        left: '4px',
        fontSize: '10px',
        color: 'rgba(255, 255, 255, 0.5)',
        fontFamily: '"Noto Sans SC", sans-serif',
      }}>
        小地图
      </div>
      
      <svg width={mapSize} height={mapSize} viewBox={`0 0 ${mapSize} ${mapSize}`}>
        {/* 背景 */}
        <rect
          x={0}
          y={0}
          width={mapSize}
          height={mapSize}
          fill="rgba(10, 10, 30, 0.8)"
        />
        
        {/* 网格 */}
        {Array.from({ length: 11 }, (_, i) => i * 15).map((pos) => (
          <g key={pos}>
            <line
              x1={pos}
              y1={0}
              x2={pos}
              y2={mapSize}
              stroke="rgba(79, 195, 247, 0.1)"
              strokeWidth={0.5}
            />
            <line
              x1={0}
              y1={pos}
              x2={mapSize}
              y2={pos}
              stroke="rgba(79, 195, 247, 0.1)"
              strokeWidth={0.5}
            />
          </g>
        ))}
        
        {/* 房间边界 */}
        <rect
          x={5}
          y={5}
          width={mapSize - 10}
          height={mapSize - 10}
          fill="none"
          stroke="rgba(79, 195, 247, 0.4)"
          strokeWidth={1}
        />

        {/* 展品 */}
        {exhibits.map((exhibit) => {
          const x = center + exhibit.position[0] * scale;
          const z = center + exhibit.position[2] * scale;
          const isSelected = exhibit.id === selectedExhibit;

          return (
            <g key={exhibit.id}>
              {/* 展品光晕 */}
              <circle
                cx={x}
                cy={z}
                r={isSelected ? 10 : 6}
                fill={isSelected ? 'rgba(255, 87, 34, 0.3)' : 'rgba(79, 195, 247, 0.2)'}
              />
              {/* 展品点 */}
              <circle
                cx={x}
                cy={z}
                r={isSelected ? 5 : 3}
                fill={isSelected ? '#ff5722' : '#4fc3f7'}
                stroke={isSelected ? '#ff8a65' : '#81d4fa'}
                strokeWidth={1}
              />
            </g>
          );
        })}

        {/* 玩家位置 */}
        <circle
          cx={playerX}
          cy={playerZ}
          r={8}
          fill="rgba(76, 175, 80, 0.3)"
        />
        <circle
          cx={playerX}
          cy={playerZ}
          r={4}
          fill="#4caf50"
          stroke="#81c784"
          strokeWidth={1.5}
        />
        
        {/* 玩家方向指示（简化） */}
        <line
          x1={playerX}
          y1={playerZ}
          x2={playerX}
          y2={playerZ - 12}
          stroke="#4caf50"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
