import { useEffect, useRef } from 'react';
import { useExhibitionStore } from '../../store/useExhibitionStore';
import type { ExhibitItem } from '../../types/exhibit';

interface ExhibitDetailPanelProps {
  exhibit: ExhibitItem;
}

export function ExhibitDetailPanel({ exhibit }: ExhibitDetailPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const selectExhibit = useExhibitionStore((s) => s.selectExhibit);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        selectExhibit(null);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectExhibit]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const stopPropagation = (e: Event) => e.stopPropagation();
    const events = ['pointerdown', 'pointerup', 'pointermove', 'wheel'];
    events.forEach((event) => panel.addEventListener(event, stopPropagation));

    return () => {
      events.forEach((event) => panel.removeEventListener(event, stopPropagation));
    };
  }, []);

  const typeLabel = {
    image: '🖼️ 图片展品',
    video: '🎬 视频展品',
    document: '📄 文档展品',
  };

  return (
    <div
      ref={panelRef}
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: '420px',
        height: '100vh',
        background: 'linear-gradient(135deg, rgba(15,15,30,0.97), rgba(25,25,50,0.97))',
        backdropFilter: 'blur(20px)',
        borderLeft: '1px solid rgba(255,255,255,0.1)',
        color: 'white',
        fontFamily: '"Noto Sans SC", sans-serif',
        padding: '32px',
        overflowY: 'auto',
        zIndex: 1000,
        boxShadow: '-10px 0 40px rgba(0,0,0,0.5)',
      }}
    >
      <button
        onClick={() => selectExhibit(null)}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'rgba(255,255,255,0.1)',
          border: 'none',
          color: 'white',
          fontSize: '20px',
          cursor: 'pointer',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ✕
      </button>

      <div style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '20px',
        background: exhibit.type === 'video'
          ? 'rgba(79,195,247,0.2)'
          : exhibit.type === 'document'
            ? 'rgba(255,183,77,0.2)'
            : 'rgba(129,199,132,0.2)',
        color: exhibit.type === 'video'
          ? '#4fc3f7'
          : exhibit.type === 'document'
            ? '#ffb74d'
            : '#81c784',
        fontSize: '12px',
        marginBottom: '16px',
      }}>
        {typeLabel[exhibit.type]}
      </div>

      <h2 style={{
        fontSize: '24px',
        fontWeight: 600,
        margin: '12px 0 8px 0',
        lineHeight: 1.3,
      }}>
        {exhibit.title}
      </h2>

      <p style={{
        fontSize: '14px',
        color: 'rgba(255,255,255,0.6)',
        marginBottom: '24px',
      }}>
        {exhibit.description}
      </p>

      <div style={{
        height: '1px',
        background: 'rgba(255,255,255,0.1)',
        margin: '24px 0',
      }} />

      {exhibit.type === 'image' && (
        <img
          src={exhibit.mediaSrc}
          alt={exhibit.title}
          style={{
            width: '100%',
            borderRadius: '8px',
            marginBottom: '24px',
          }}
        />
      )}

      {exhibit.type === 'video' && (
        <video
          src={exhibit.mediaSrc}
          controls
          poster={exhibit.previewImage}
          style={{
            width: '100%',
            borderRadius: '8px',
            marginBottom: '24px',
          }}
        />
      )}

      {exhibit.type === 'document' && (
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          textAlign: 'center',
        }}>
          <img
            src={exhibit.previewImage}
            alt={exhibit.title}
            style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '4px' }}
          />
          <a
            href={exhibit.mediaSrc}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              marginTop: '12px',
              padding: '8px 20px',
              background: '#ff9800',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          >
            📥 下载文档
          </a>
        </div>
      )}

      <h3 style={{ fontSize: '16px', fontWeight: 500, marginBottom: '12px' }}>
        详细介绍
      </h3>
      <p style={{
        fontSize: '14px',
        lineHeight: 1.8,
        color: 'rgba(255,255,255,0.85)',
      }}>
        {exhibit.detailContent}
      </p>
    </div>
  );
}
