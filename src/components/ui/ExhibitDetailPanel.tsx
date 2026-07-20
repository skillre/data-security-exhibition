import { useEffect, useRef, useState } from 'react';
import { useExhibitionStore } from '../../store/useExhibitionStore';
import type { ExhibitItem } from '../../types/exhibit';

interface ExhibitDetailPanelProps {
  exhibit: ExhibitItem;
}

export function ExhibitDetailPanel({ exhibit }: ExhibitDetailPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const selectExhibit = useExhibitionStore((s) => s.selectExhibit);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // 入场动画
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  // 关闭窗口
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      selectExhibit(null);
    }, 300);
  };

  // ESC 或 Q 关闭面板
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' || e.code === 'KeyQ') {
        handleClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 点击窗口外关闭
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        handleClose();
      }
    }
    // 延迟添加，避免立即触发
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 类型配置
  const typeConfig = {
    image: { icon: '🖼️', label: '图片展品', color: '#4fc3f7', gradient: 'linear-gradient(135deg, #0d47a1, #1565c0)' },
    video: { icon: '🎬', label: '视频展品', color: '#e91e63', gradient: 'linear-gradient(135deg, #880e4f, #ad1457)' },
    document: { icon: '📄', label: '文档展品', color: '#ff9800', gradient: 'linear-gradient(135deg, #e65100, #ef6c00)' },
  };

  const config = typeConfig[exhibit.type];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      pointerEvents: 'auto',
    }}>
      {/* 背景遮罩 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)',
        opacity: isVisible && !isClosing ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }} />

      {/* 详情窗口 */}
      <div
        ref={panelRef}
        style={{
          position: 'relative',
          width: '600px',
          maxHeight: '80vh',
          background: 'linear-gradient(180deg, rgba(10, 20, 40, 0.95) 0%, rgba(15, 30, 60, 0.95) 100%)',
          borderRadius: '12px',
          border: `2px solid ${config.color}40`,
          boxShadow: `0 0 30px ${config.color}30, 0 0 60px ${config.color}20, inset 0 0 30px ${config.color}10`,
          overflow: 'hidden',
          transform: isVisible && !isClosing ? 'scale(1)' : 'scale(0.8)',
          opacity: isVisible && !isClosing ? 1 : 0,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* 扫描线动画 */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${config.color}, transparent)`,
          animation: 'scanline 3s linear infinite',
          zIndex: 10,
        }} />

        {/* 边角装饰 */}
        <div style={{ position: 'absolute', top: '8px', left: '8px', width: '20px', height: '20px', borderTop: `2px solid ${config.color}`, borderLeft: `2px solid ${config.color}`, zIndex: 10 }} />
        <div style={{ position: 'absolute', top: '8px', right: '8px', width: '20px', height: '20px', borderTop: `2px solid ${config.color}`, borderRight: `2px solid ${config.color}`, zIndex: 10 }} />
        <div style={{ position: 'absolute', bottom: '8px', left: '8px', width: '20px', height: '20px', borderBottom: `2px solid ${config.color}`, borderLeft: `2px solid ${config.color}`, zIndex: 10 }} />
        <div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '20px', height: '20px', borderBottom: `2px solid ${config.color}`, borderRight: `2px solid ${config.color}`, zIndex: 10 }} />

        {/* 顶部类型标签 */}
        <div style={{
          padding: '16px 24px',
          background: config.gradient,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${config.color}40`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>{config.icon}</span>
            <span style={{
              fontSize: '14px',
              padding: '4px 12px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.15)',
              color: 'white',
              fontWeight: 500,
            }}>
              {config.label}
            </span>
          </div>
          
          <button
            onClick={handleClose}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              fontSize: '14px',
              cursor: 'pointer',
              borderRadius: '8px',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            }}
          >
            ✕ 关闭 <span style={{ fontSize: '11px', opacity: 0.7 }}>(Q)</span>
          </button>
        </div>

        {/* 内容区域 */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          maxHeight: 'calc(80vh - 80px)',
        }}>
          {/* 媒体内容区 */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '24px',
            border: `1px solid ${config.color}30`,
          }}>
            {exhibit.type === 'image' && (
              <div style={{ padding: '16px', textAlign: 'center' }}>
                <img
                  src={exhibit.mediaSrc}
                  alt={exhibit.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: '6px',
                    border: `1px solid ${config.color}40`,
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div style={{
                  padding: '20px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '14px',
                  fontStyle: 'italic',
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
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${config.color}, ${config.color}80)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '36px',
                    marginBottom: '16px',
                    boxShadow: `0 0 30px ${config.color}60`,
                    cursor: 'pointer',
                  }}>
                    ▶️
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px', fontWeight: 500 }}>
                    点击播放视频
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '13px', marginTop: '8px' }}>
                    {exhibit.title}
                  </div>
                </div>
              </div>
            )}

            {exhibit.type === 'document' && (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  margin: '0 auto 20px',
                  background: `linear-gradient(135deg, ${config.color}20, ${config.color}40)`,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  border: `2px dashed ${config.color}40`,
                }}>
                  📄
                </div>
                <div style={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  fontSize: '18px',
                  fontWeight: 500,
                  marginBottom: '8px',
                }}>
                  {exhibit.title}
                </div>
                <div style={{ 
                  color: 'rgba(255, 255, 255, 0.4)', 
                  fontSize: '13px',
                }}>
                  点击下方按钮下载文档
                </div>
              </div>
            )}
          </div>

          {/* 标题 */}
          <h2 style={{
            fontSize: '24px',
            fontWeight: 600,
            margin: '0 0 16px 0',
            lineHeight: 1.3,
            color: '#ffffff',
          }}>
            {exhibit.title}
          </h2>

          {/* 描述 */}
          <p style={{
            fontSize: '15px',
            color: 'rgba(255, 255, 255, 0.7)',
            marginBottom: '24px',
            lineHeight: 1.7,
          }}>
            {exhibit.description}
          </p>

          {/* 分隔线 */}
          <div style={{
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${config.color}40, transparent)`,
            margin: '24px 0',
          }} />

          {/* 详细介绍 */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 500,
              marginBottom: '16px',
              color: config.color,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <span style={{
                display: 'inline-block',
                width: '4px',
                height: '16px',
                background: config.color,
                borderRadius: '2px',
              }} />
              详细介绍
            </h3>
            <p style={{
              fontSize: '14px',
              lineHeight: 1.8,
              color: 'rgba(255, 255, 255, 0.8)',
              paddingLeft: '14px',
              borderLeft: `2px solid ${config.color}20`,
            }}>
              {exhibit.detailContent}
            </p>
          </div>

          {/* 分隔线 */}
          <div style={{
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${config.color}40, transparent)`,
            margin: '24px 0',
          }} />

          {/* 操作按钮 */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
          }}>
            {exhibit.type === 'image' && (
              <button
                onClick={() => window.open(exhibit.mediaSrc, '_blank')}
                style={{
                  padding: '12px 28px',
                  background: `linear-gradient(135deg, ${config.color}, ${config.color}cc)`,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: `0 4px 15px ${config.color}40`,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 6px 20px ${config.color}60`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 4px 15px ${config.color}40`;
                }}
              >
                🖼️ 查看原图
              </button>
            )}

            {exhibit.type === 'video' && (
              <button
                onClick={() => window.open(exhibit.mediaSrc, '_blank')}
                style={{
                  padding: '12px 28px',
                  background: `linear-gradient(135deg, ${config.color}, ${config.color}cc)`,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: `0 4px 15px ${config.color}40`,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 6px 20px ${config.color}60`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 4px 15px ${config.color}40`;
                }}
              >
                ▶️ 播放视频
              </button>
            )}

            {exhibit.type === 'document' && (
              <button
                onClick={() => window.open(exhibit.mediaSrc, '_blank')}
                style={{
                  padding: '12px 28px',
                  background: `linear-gradient(135deg, ${config.color}, ${config.color}cc)`,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: `0 4px 15px ${config.color}40`,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 6px 20px ${config.color}60`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = `0 4px 15px ${config.color}40`;
                }}
              >
                📥 下载文档
              </button>
            )}

            <button
              onClick={handleClose}
              style={{
                padding: '12px 28px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              ↩️ 关闭
            </button>
          </div>

          {/* 底部提示 */}
          <div style={{
            marginTop: '20px',
            textAlign: 'center',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.3)',
          }}>
            按 Q 或 ESC 关闭窗口 · 点击窗口外关闭
          </div>
        </div>
      </div>

      {/* CSS 动画 */}
      <style>{`
        @keyframes scanline {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
}
