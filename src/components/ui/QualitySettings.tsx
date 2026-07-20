import { useSettingsStore, type QualityLevel } from '../../store/useSettingsStore';

const OPTIONS: { value: QualityLevel; label: string }[] = [
  { value: 'high', label: '高' },
  { value: 'medium', label: '中' },
  { value: 'low', label: '低' },
];

export function QualitySettings() {
  const quality = useSettingsStore((s) => s.quality);
  const setQuality = useSettingsStore((s) => s.setQuality);

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 12px',
        background: 'rgba(10,16,32,0.55)',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '24px',
        backdropFilter: 'blur(8px)',
        zIndex: 500,
        pointerEvents: 'auto',
      }}
    >
      <span
        style={{
          color: 'rgba(255,255,255,0.65)',
          fontSize: '12px',
          userSelect: 'none',
        }}
      >
        画质
      </span>
      <div style={{ display: 'flex', gap: '4px' }}>
        {OPTIONS.map((opt) => {
          const active = quality === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setQuality(opt.value)}
              style={{
                width: '32px',
                height: '28px',
                background: active
                  ? 'linear-gradient(135deg, #4fc3f7, #2196f3)'
                  : 'rgba(255,255,255,0.08)',
                color: active ? '#fff' : 'rgba(255,255,255,0.7)',
                border: active
                  ? 'none'
                  : '1px solid rgba(255,255,255,0.15)',
                borderRadius: '14px',
                fontSize: '13px',
                fontWeight: active ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
