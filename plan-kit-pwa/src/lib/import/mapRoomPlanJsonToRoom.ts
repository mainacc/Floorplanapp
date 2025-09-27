import { nanoid } from '../utils/nanoid';
import { Opening, Room, Wall } from '../../types/models';

type RoomPlanOpening = {
  type: 'door' | 'window';
  width_mm: number;
  height_mm?: number;
  sill_height_mm?: number;
  position_along_wall_mm: number;
  swing?: 'L' | 'R' | 'slider' | 'fixed';
};

type RoomPlanWall = {
  start: { x: number; y: number };
  end: { x: number; y: number };
  thickness_mm: number;
  openings: RoomPlanOpening[];
};

type RoomPlanRoom = {
  name?: string;
  height_m?: number;
  walls: RoomPlanWall[];
};

type RoomPlanPayload = {
  room: RoomPlanRoom;
};

function asMillimetres(value: number) {
  return Math.round(value);
}

export function mapRoomPlanJsonToRoom(json: unknown): Room {
  const payload = json as RoomPlanPayload;
  if (!payload?.room?.walls) {
    throw new Error('Invalid RoomPlan payload');
  }

  const walls: Wall[] = payload.room.walls.map((wall) => ({
    id: nanoid(),
    start: { x: asMillimetres(wall.start.x), y: asMillimetres(wall.start.y) },
    end: { x: asMillimetres(wall.end.x), y: asMillimetres(wall.end.y) },
    thickness_mm: wall.thickness_mm,
    openings: (wall.openings ?? []).map((opening): Opening => ({
      id: nanoid(),
      type: opening.type,
      width_mm: opening.width_mm,
      height_mm: opening.height_mm,
      sill_height_mm: opening.sill_height_mm,
      position_along_wall_mm: opening.position_along_wall_mm,
      swing: opening.swing
    }))
  }));

  const room: Room = {
    id: nanoid(),
    name: payload.room.name,
    height_mm: payload.room.height_m ? payload.room.height_m * 1000 : undefined,
    walls,
    source: { roomplan: payload }
  };

  return room;
}
