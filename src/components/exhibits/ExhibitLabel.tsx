import { Html } from '@react-three/drei';

interface ExhibitLabelProps {
  title: string;
  description: string;
  distanceFactor?: number;
}

export function ExhibitLabel({
  title,
  description,
  distanceFactor = 10,
}: ExhibitLabelProps) {
  return (
    <Html
      position={[0, -1.2, 0]}
      center
      distanceFactor={distanceFactor}
      style={{
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <div style={{
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        color: 'white',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '14px',
        fontFamily: '"Noto Sans SC", sans-serif',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{ fontWeight: 600, marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 11, opacity: 0.7 }}>{description}</div>
      </div>
    </Html>
  );
}
