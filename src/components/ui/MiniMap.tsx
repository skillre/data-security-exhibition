import { useThree } from '@react-three/fiber';
import { useExhibitionStore } from '../../store/useExhibitionStore';
import { useControlsStore } from '../../store/useControlsStore';

export function MiniMap() {
  const exhibits = useExhibitionStore((s) => s.exhibits);
  const selectedExhibit = useExhibitionStore((s) => s.selectedExhibit);
  const isPointerLocked = useControlsStore((s) => s.isPointerLocked);
  const camera = useThree((state) => state.camera);

  if (!isPointerLocked) return null;

  const mapSize = 150;
  const scale = mapSize / 20;
  const center = mapSize / 2;

  // 计算玩家在小地图上的位置
  const playerX = center + (camera.position.x / 10) * (mapSize / 2);
  const playerZ = center + (camera.position.z / 10) * (mapSize / 2);

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: `${mapSize}px`,
      height: `${mapSize}px`,
      background: 'rgba(0,0,0,0.6)',
      borderRadius: '8px',
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.2)',
      pointerEvents: 'auto',
    }}>
      <svg width={mapSize} height={mapSize} viewBox={`0 0 ${mapSize} ${mapSize}`}>
        {/* Room outline */}
        <rect
          x={5}
          y={5}
          width={mapSize - 10}
          height={mapSize - 10}
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
        />

        {/* Exhibits */}
        {exhibits.map((exhibit) => {
          const x = center + exhibit.position[0] * scale;
          const z = center + exhibit.position[2] * scale;
          const isSelected = exhibit.id === selectedExhibit;

          return (
            <circle
              key={exhibit.id}
              cx={x}
              cy={z}
              r={isSelected ? 6 : 4}
              fill={isSelected ? '#ff5722' : '#4fc3f7'}
              opacity={isSelected ? 1 : 0.7}
            />
          );
        })}

        {/* Player position */}
        <circle
          cx={playerX}
          cy={playerZ}
          r={5}
          fill="#4caf50"
          stroke="white"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
