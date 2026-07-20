import { memo, useState } from 'react';
import { ImageExhibit } from './ImageExhibit';
import { VideoExhibit } from './VideoExhibit';
import { DocumentExhibit } from './DocumentExhibit';
import { ExhibitLabel } from './ExhibitLabel';
import type { ExhibitItem } from '../../types/exhibit';

interface ExhibitRendererProps {
  exhibit: ExhibitItem;
  onClick?: (exhibit: ExhibitItem) => void;
  onHover?: (exhibit: ExhibitItem | null) => void;
}

function ExhibitRendererInner({ exhibit, onClick, onHover }: ExhibitRendererProps) {
  const [isHovered, setIsHovered] = useState(false);

  const Component = (() => {
    switch (exhibit.type) {
      case 'image':    return ImageExhibit;
      case 'video':    return VideoExhibit;
      case 'document': return DocumentExhibit;
      default:         return ImageExhibit;
    }
  })();

  // 类型图标
  const typeIcon = {
    image: '🖼️',
    video: '🎬',
    document: '📄',
  }[exhibit.type] || '📋';

  return (
    <group position={exhibit.position} rotation={exhibit.rotation}>
      <Component
        exhibit={exhibit}
        onClick={(e: any) => {
          e.stopPropagation();
          onClick?.(exhibit);
        }}
        onPointerOver={(e: any) => {
          e.stopPropagation();
          setIsHovered(true);
          onHover?.(exhibit);
        }}
        onPointerOut={() => {
          setIsHovered(false);
          onHover?.(null);
        }}
      />
      <ExhibitLabel
        title={exhibit.title}
        subtitle={exhibit.subtitle}
        icon={typeIcon}
        isHovered={isHovered}
      />
    </group>
  );
}

export const ExhibitRenderer = memo(ExhibitRendererInner);
