import { memo } from 'react';
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
  const Component = (() => {
    switch (exhibit.type) {
      case 'image':    return ImageExhibit;
      case 'video':    return VideoExhibit;
      case 'document': return DocumentExhibit;
      default:         return ImageExhibit;
    }
  })();

  return (
    <group position={exhibit.position} rotation={exhibit.rotation}>
      <Component
        exhibit={exhibit}
        onClick={(e: any) => {
          e.stopPropagation?.();
          onClick?.(exhibit);
        }}
        onPointerOver={(e: any) => {
          e.stopPropagation?.();
          onHover?.(exhibit);
        }}
        onPointerOut={() => onHover?.(null)}
      />
      <ExhibitLabel
        title={exhibit.title}
        description={exhibit.description}
      />
    </group>
  );
}

export const ExhibitRenderer = memo(ExhibitRendererInner);
