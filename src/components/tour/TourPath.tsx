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

  if (route.length < 2) return null;

  return (
    <group>
      <Line
        points={points}
        color={isActive ? '#4fc3f7' : '#666666'}
        lineWidth={3}
        dashed={true}
        dashScale={2}
        dashSize={0.5}
        gapSize={0.3}
      />

      {route.map((point, index) => (
        <group key={index} position={point.position}>
          <mesh>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial
              color={index === currentTourStep ? '#ff5722' : '#4fc3f7'}
              emissive={index === currentTourStep ? '#ff5722' : '#4fc3f7'}
              emissiveIntensity={index === currentTourStep ? 0.8 : 0.3}
              transparent
              opacity={isActive ? 1 : 0.3}
            />
          </mesh>

          {isActive && (
            <Html
              position={[0, 0.4, 0]}
              center
              distanceFactor={6}
              style={{ pointerEvents: 'none' }}
            >
              <div style={{
                background: index === currentTourStep ? '#ff5722' : 'rgba(79,195,247,0.8)',
                color: 'white',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
              }}>
                {index + 1}
              </div>
            </Html>
          )}
        </group>
      ))}

      {route.slice(0, -1).map((point, index) => {
        const start = new THREE.Vector3(...point.position);
        const end = new THREE.Vector3(...route[index + 1].position);
        const mid = start.clone().lerp(end, 0.5);
        const direction = end.clone().sub(start).normalize();
        const angle = Math.atan2(direction.x, direction.z);

        return (
          <group key={`arrow-${index}`} position={mid.toArray()} rotation={[0, angle, 0]}>
            <mesh>
              <coneGeometry args={[0.08, 0.2, 8]} />
              <meshStandardMaterial
                color={isActive ? '#4fc3f7' : '#666'}
                emissive={isActive ? '#4fc3f7' : '#333'}
                emissiveIntensity={0.3}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
