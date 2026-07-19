import { useMemo } from 'react';
import { Line, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useExhibitionStore } from '../../store/useExhibitionStore';

export function TourPath() {
  const config = useExhibitionStore((s) => s.config);
  const tourMode = useExhibitionStore((s) => s.tourMode);
  const currentTourStep = useExhibitionStore((s) => s.currentTourStep);

  const route = config?.tourRoute ?? [];
  const isActive = tourMode === 'following';

  const points = useMemo(() => {
    return route.map((p) => new THREE.Vector3(...p.position));
  }, [route]);

  // 只在导览模式激活时显示
  if (!isActive || route.length < 2) return null;

  return (
    <group>
      <Line
        points={points}
        color="#00d4ff"
        lineWidth={2}
        dashed={true}
        dashScale={1}
        dashSize={0.3}
        gapSize={0.2}
        transparent
        opacity={0.6}
      />

      {route.map((point, index) => (
        <group key={index} position={point.position}>
          {/* 路点标记 */}
          <mesh>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color={index === currentTourStep ? '#ff5722' : '#00d4ff'}
              emissive={index === currentTourStep ? '#ff5722' : '#00d4ff'}
              emissiveIntensity={index === currentTourStep ? 1 : 0.5}
            />
          </mesh>

          {/* 步骤编号 */}
          <Html
            position={[0, 0.3, 0]}
            center
            distanceFactor={6}
            style={{ pointerEvents: 'none' }}
          >
            <div style={{
              background: index === currentTourStep ? '#ff5722' : 'rgba(0,212,255,0.8)',
              color: 'white',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: 'bold',
            }}>
              {index + 1}
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}
