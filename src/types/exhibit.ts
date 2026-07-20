export type ExhibitType = 'image' | 'video' | 'document';

export type ExhibitCategory = 'report' | 'video' | 'document' | 'achievement';

export interface ExhibitItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  detailContent: string;
  type: ExhibitType;
  mediaSrc: string;
  previewImage?: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  category: ExhibitCategory;
  order: number;
  tags?: string[];
}

export interface TourPoint {
  position: [number, number, number];
  lookAt: [number, number, number];
  duration?: number;
  exhibitId?: string;
}

export interface ExhibitionConfig {
  exhibition: {
    title: string;
    subtitle: string;
    description: string;
  };
  scene: {
    backgroundColor: string;
    floorSize: [number, number];
    wallHeight: number;
  };
  exhibits: ExhibitItem[];
  tourRoute: TourPoint[];
  cameraStart: {
    position: [number, number, number];
    lookAt: [number, number, number];
  };
}
