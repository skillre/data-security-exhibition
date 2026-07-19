import { useExhibition } from '../store/useExhibition';

export function LoadingScreen() {
  const isLoaded = useExhibition((s) => s.isLoaded);
  const loadProgress = useExhibition((s) => s.loadProgress);

  if (isLoaded) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      background: '#0a0e1a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Logo */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: 'rgba(59, 130, 246, 0.2)',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#60a5fa">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h1 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', textAlign: 'center', margin: 0 }}>数据安全评估服务成果展</h1>
        <p style={{ color: 'rgba(147, 197, 253, 0.6)', fontSize: '14px', textAlign: 'center', marginTop: '8px', margin: 0 }}>守护数据安全，赋能数字未来</p>
      </div>

      {/* 进度条 */}
      <div style={{ width: '256px' }}>
        <div style={{
          height: '4px',
          background: 'rgba(30, 41, 59, 0.8)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(to right, #2563eb, #60a5fa)',
            borderRadius: '4px',
            transition: 'width 0.3s ease',
            width: `${loadProgress}%`
          }} />
        </div>
        <p style={{
          color: '#64748b',
          fontSize: '12px',
          textAlign: 'center',
          marginTop: '12px',
          margin: 0
        }}>
          {loadProgress < 100 ? `正在加载... ${Math.round(loadProgress)}%` : '准备就绪'}
        </p>
      </div>
    </div>
  );
}
