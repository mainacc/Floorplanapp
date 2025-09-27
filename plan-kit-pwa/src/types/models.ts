export type ID = string;
export type Vec2 = { x: number; y: number };

export type OpeningType = 'door' | 'window';

export type Opening = {
  id: ID;
  type: OpeningType;
  width_mm: number;
  height_mm?: number;
  sill_height_mm?: number;
  position_along_wall_mm: number;
  swing?: 'L' | 'R' | 'slider' | 'fixed';
};

export type Wall = {
  id: ID;
  start: Vec2;
  end: Vec2;
  thickness_mm: number;
  openings: Opening[];
};

export type Room = {
  id: ID;
  name?: string;
  walls: Wall[];
  height_mm?: number;
  source?: { roomplan?: unknown };
};

export type FloorPlan = {
  id: ID;
  label?: string;
  rooms: Room[];
  transforms: Record<ID, { rotation_deg: number; translate: Vec2 }>;
  meta: { createdAt: string; updatedAt: string; address?: string };
};
