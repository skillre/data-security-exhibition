import type { ExhibitConfig } from '../../types/exhibition';
import { PosterExhibit } from './PosterExhibit';
import { DocumentExhibit } from './DocumentExhibit';
import { VideoExhibit } from './VideoExhibit';
import { DataVizExhibit } from './DataVizExhibit';

interface ExhibitRouterProps {
  config: ExhibitConfig;
}

export function ExhibitRouter({ config }: ExhibitRouterProps) {
  switch (config.type) {
    case 'poster':
      return <PosterExhibit config={config} />;
    case 'document':
      return <DocumentExhibit config={config} />;
    case 'video':
      return <VideoExhibit config={config} />;
    case 'dataviz':
      return <DataVizExhibit config={config} />;
    default:
      return null;
  }
}
