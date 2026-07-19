import { useEffect, useRef } from 'react';
import { useExhibitionStore } from '../../store/useExhibitionStore';
import type { ExhibitItem } from '../../types/exhibit';

interface ExhibitDetailPanelProps {
  exhibit: ExhibitItem;
}

export function ExhibitDetailPanel({ exhibit }: ExhibitDetailPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const selectExhibit = useExhibitionStore((s) => s.selectExhibit);

  // ESC 关闭面板
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        selectExhibit(null);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectExhibit]);

  // 防止事件穿透到3D场景
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const stopPropagation = (e: Event) => e.stopPropagation();
    const events = ['pointerdown', 'pointerup', 'pointermove', 'wheel', 'click'];
    events.forEach((event) => panel.addEventListener(event, stopPropagation));

    return () => {
      events.forEach((event) => panel.removeEventListener(event, stopPropagation));
    };
  }, []);

  // 关闭面板
  const handleClose = () => {
    selectExhibit(null);
  };

  // 类型标签
  const typeConfig = {
    image: { icon: '🖼️', label: '图片展品', color: '#4fc3f7', bgColor: 'rgba(79,195,247,0.15)' },
    video: { icon: '🎬', label: '视频展品', color: '#e91e63', bgColor: 'rgba(233,30,99,0.15)' },
    document: { icon: '📄', label: '文档展品', color: '#ff9800', bgColor: 'rgba(255,152,0,0.15)' },
  };

  const config = typeConfig[exhibit.type];

  return (
    <div
      ref={panelRef}
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '440px',
        height: '100vh',
        background: 'linear-gradient(180deg, #0a1628 0%, #0d2137 100%)',
        borderLeft: '2px solid rgba(33, 150, 243, 0.3)',
        color: 'white',
        fontFamily: '"Noto Sans SC", sans-serif',
        overflowY: 'auto',
        zIndex: 1000,
        boxShadow: '-10px 0 40px rgba(0,0,0,0.5)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 顶部栏 */}
      <div style={{
        padding: '16px 20px',
        background: 'rgba(0,0,0,0.3)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <span style={{ fontSize: '18px' }}>{config.icon}</span>
          <span style={{
            fontSize: '12px',
            padding: '4px 10px',
            borderRadius: '12px',
            background: config.bgColor,
            color: config.color,
            border: `1px solid ${config.color}40`,
          }}>
            {config.label}
          </span>
        </div>
        
        <button
          onClick={handleClose}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            fontSize: '14px',
            cursor: 'pointer',
            borderRadius: '6px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
          }}
        >
          ✕ 关闭 <span style={{ fontSize: '11px', opacity: 0.6 }}>(ESC)</span>
        </button>
      </div>

      {/* 内容区域 */}
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        {/* 媒体内容区 */}
        <div style={{
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '8px',
          overflow: 'hidden',
          marginBottom: '20px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          {exhibit.type === 'image' && (
            <div style={{ padding: '10px' }}>
              <img
                src={exhibit.mediaSrc}
                alt={exhibit.title}
                style={{
                  width: '100%',
                  borderRadius: '6px',
                  maxHeight: '300px',
                  objectFit: 'contain',
                  background: '#000',
                }}
                onError={(e) => {
                  // 图片加载失败时显示占位
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div style={{
                textAlign: 'center',
                padding: '20px',
                color: 'rgba(255,255,255,0.5)',
                fontSize: '13px',
              }}>
                🖼️ {exhibit.title}
              </div>
            </div>
          )}

          {exhibit.type === 'video' && (
            <div style={{ position: 'relative', paddingTop: '56.25%' }}>
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1a0a2a, #0a1a3a)',
              }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>▶️</div>
                <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>
                  点击播放视频
                </div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '5px' }}>
                  {exhibit.title}
                </div>
              </div>
            </div>
          )}

          {exhibit.type === 'document' && (
            <div style={{ padding: '30px', textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '15px' }}>📄</div>
              <div style={{ 
                color: 'rgba(255,255,255,0.7)', 
                fontSize: '16px',
                marginBottom: '20px',
              }}>
                {exhibit.title}
              </div>
              <button
                onClick={() => window.open(exhibit.mediaSrc, '_blank')}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #ff9800, #f57c00)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                📥 下载文档
              </button>
            </div>
          )}
        </div>

        {/* 标题 */}
        <h2 style={{
          fontSize: '22px',
          fontWeight: 600,
          margin: '0 0 12px 0',
          lineHeight: 1.3,
          color: '#ffffff',
        }}>
          {exhibit.title}
        </h2>

        {/* 描述 */}
        <p style={{
          fontSize: '14px',
          color: 'rgba(255,255,255,0.6)',
          marginBottom: '20px',
          lineHeight: 1.6,
        }}>
          {exhibit.description}
        </p>

        {/* 分隔线 */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(33,150,243,0.3), transparent)',
          margin: '20px 0',
        }} />

        {/* 详细介绍 */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{
            fontSize: '15px',
            fontWeight: 500,
            marginBottom: '12px',
            color: '#4fc3f7',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            📝 详细介绍
          </h3>
          <p style={{
            fontSize: '14px',
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.8)',
          }}>
            {exhibit.detailContent}
          </p>
        </div>

        {/* 分隔线 */}
        <div style={{
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(33,150,243,0.3), transparent)',
          margin: '20px 0',
        }} />

        {/* 操作按钮 */}
        <div style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
        }}>
          {exhibit.type === 'document' && (
            <button
              onClick={() => window.open(exhibit.mediaSrc, '_blank')}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #ff9800, #f57c00)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              📥 下载文档
            </button>
          )}
          
          {exhibit.type === 'image' && (
            <button
              onClick={() => window.open(exhibit.mediaSrc, '_blank')}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: 'linear-gradient(135deg, #4fc3f7, #0288d1)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              🖼️ 查看原图
            </button>
          )}

          <button
            onClick={handleClose}
            style={{
              flex: 1,
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '6px',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            ↩️ 返回展厅
          </button>
        </div>
      </div>

      {/* 底部提示 */}
      <div style={{
        padding: '12px 20px',
        background: 'rgba(0,0,0,0.3)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        textAlign: 'center',
        fontSize: '12px',
        color: 'rgba(255,255,255,0.4)',
      }}>
        按 ESC 关闭面板
      </div>
    </div>
  );
}
