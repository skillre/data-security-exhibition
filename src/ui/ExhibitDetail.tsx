import { useExhibition } from '../store/useExhibition';

export function ExhibitDetail() {
  const selectedExhibit = useExhibition((s) => s.selectedExhibit);
  const selectExhibit = useExhibition((s) => s.selectExhibit);

  if (!selectedExhibit) return null;

  const handleClose = () => {
    selectExhibit(null);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      {/* 背景遮罩 */}
      <div
        onClick={handleClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)'
        }}
      />

      {/* 内容面板 */}
      <div style={{
        position: 'relative',
        background: 'rgba(15, 23, 42, 0.95)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '16px',
        maxWidth: '672px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.1)'
      }}>
        {/* 头部 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid rgba(59, 130, 246, 0.2)'
        }}>
          <div>
            <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px', margin: 0 }}>{selectedExhibit.title}</h2>
            <p style={{ color: 'rgba(147, 197, 253, 0.6)', fontSize: '14px', marginTop: '4px', margin: 0 }}>
              {selectedExhibit.type === 'poster' && '海报'}
              {selectedExhibit.type === 'document' && '文档'}
              {selectedExhibit.type === 'video' && '视频'}
              {selectedExhibit.type === 'dataviz' && '数据看板'}
            </p>
          </div>
          <button
            onClick={handleClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(30, 41, 59, 0.8)',
              color: '#94a3b8',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px'
            }}
          >
            ✕
          </button>
        </div>

        {/* 内容区域 */}
        <div style={{ padding: '24px', overflowY: 'auto', maxHeight: 'calc(80vh - 80px)' }}>
          {/* 视频类型 - 嵌入播放器 */}
          {selectedExhibit.type === 'video' && selectedExhibit.videoUrl && (
            <div style={{
              position: 'relative',
              paddingBottom: '56.25%',
              borderRadius: '8px',
              overflow: 'hidden',
              background: 'black',
              marginBottom: '16px'
            }}>
              <iframe
                src={selectedExhibit.videoUrl}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* 海报/文档类型 - 图片展示 */}
          {(selectedExhibit.type === 'poster' || selectedExhibit.type === 'document') && selectedExhibit.imageUrl && (
            <div style={{
              borderRadius: '8px',
              overflow: 'hidden',
              background: 'rgba(30, 41, 59, 0.8)',
              marginBottom: '16px'
            }}>
              <img
                src={selectedExhibit.imageUrl}
                alt={selectedExhibit.title}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          )}

          {/* 描述 */}
          <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
            {selectedExhibit.description}
          </p>
        </div>
      </div>
    </div>
  );
}
