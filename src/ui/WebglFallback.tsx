export function WebglFallback() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 300,
      background: '#0a0e1a',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px'
    }}>
      <div style={{ maxWidth: '448px', textAlign: 'center' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#f87171">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h1 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', margin: 0 }}>浏览器不支持 WebGL</h1>
        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '24px', margin: 0 }}>
          您的浏览器或设备不支持 WebGL 3D 渲染。请尝试以下方案：
        </p>
        <ul style={{
          color: '#94a3b8',
          fontSize: '14px',
          textAlign: 'left',
          listStyle: 'none',
          padding: 0,
          marginBottom: '32px'
        }}>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
            <span style={{ color: '#60a5fa', marginTop: '2px' }}>•</span>
            <span>使用最新版本的 Chrome、Firefox、Safari 或 Edge 浏览器</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
            <span style={{ color: '#60a5fa', marginTop: '2px' }}>•</span>
            <span>确保浏览器已启用硬件加速</span>
          </li>
          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
            <span style={{ color: '#60a5fa', marginTop: '2px' }}>•</span>
            <span>尝试在桌面设备上访问以获得最佳体验</span>
          </li>
        </ul>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '8px 24px',
            background: 'rgba(59, 130, 246, 0.2)',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            borderRadius: '8px',
            color: '#93c5fd',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          刷新重试
        </button>
      </div>
    </div>
  );
}
