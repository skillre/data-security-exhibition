import { useMemo } from 'react';
import { Html, Text } from '@react-three/drei';
import type { ExhibitConfig } from '../../types/exhibition';

interface DataVizExhibitProps {
  config: ExhibitConfig;
}

export function DataVizExhibit({ config }: DataVizExhibitProps) {
  const data = config.data || [];
  const maxValue = useMemo(() => Math.max(...data.map((d) => d.value), 1), [data]);

  const bars = useMemo(() => {
    const barWidth = 0.6;
    const gap = 0.2;
    const totalWidth = data.length * (barWidth + gap) - gap;
    const startX = -totalWidth / 2 + barWidth / 2;

    return data.map((item, index) => ({
      ...item,
      x: startX + index * (barWidth + gap),
      height: (item.value / maxValue) * 3,
      width: barWidth,
    }));
  }, [data, maxValue]);

  return (
    <group position={config.position}>
      {/* 背景板 */}
      <mesh position={[0, 1.5, -0.05]}>
        <planeGeometry args={[5, 4]} />
        <meshStandardMaterial color="#0a0e1a" roughness={0.8} />
      </mesh>

      {/* 标题 */}
      <Text
        position={[0, 3.8, 0]}
        fontSize={0.25}
        color="#4488ff"
        anchorX="center"
        anchorY="middle"
      >
        {config.title}
      </Text>

      {/* 柱状图 */}
      {bars.map((bar, index) => (
        <group key={index} position={[bar.x, 0, 0]}>
          {/* 柱子 */}
          <mesh position={[0, bar.height / 2, 0]}>
            <boxGeometry args={[bar.width, bar.height, 0.3]} />
            <meshStandardMaterial
              color={bar.color}
              emissive={bar.color}
              emissiveIntensity={0.3}
              roughness={0.3}
              metalness={0.7}
            />
          </mesh>

          {/* 数值标签 */}
          <Text
            position={[0, bar.height + 0.2, 0]}
            fontSize={0.18}
            color="#ffffff"
            anchorX="center"
            anchorY="bottom"
          >
            {`${bar.value}%`}
          </Text>

          {/* 类别标签 */}
          <Text
            position={[0, -0.2, 0]}
            fontSize={0.15}
            color="#8888aa"
            anchorX="center"
            anchorY="top"
          >
            {bar.label}
          </Text>
        </group>
      ))}

      {/* 描述 */}
      <Html position={[0, -0.6, 0.3]} center>
        <div style={{ color: '#94a3b8', fontSize: '12px', textAlign: 'center', maxWidth: '300px' }}>
          {config.description}
        </div>
      </Html>
    </group>
  );
}
