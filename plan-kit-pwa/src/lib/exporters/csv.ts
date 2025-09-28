import { lineLength } from '../geometry/vector';
import { applyTransformToRoom } from '../geometry/transforms';
import { FloorPlan } from '../../types/models';

export async function exportAsCsv(plan: FloorPlan) {
  const rooms = plan.rooms.map((room) => {
    const transform = plan.transforms[room.id];
    return transform ? applyTransformToRoom(room, transform) : room;
  });

  const doorWindowLines = ['room_id,opening_id,type,width_mm,height_mm,position_mm'];
  rooms.forEach((room) => {
    room.walls.forEach((wall) => {
      wall.openings.forEach((opening) => {
        doorWindowLines.push(
          [room.id, opening.id, opening.type, opening.width_mm, opening.height_mm ?? '', opening.position_along_wall_mm].join(',')
        );
      });
    });
  });

  const roomLines = ['room_id,area_mm2,perimeter_mm'];
  rooms.forEach((room) => {
    const perimeter = room.walls.reduce((sum, wall) => sum + lineLength(wall.start, wall.end), 0);
    roomLines.push([room.id, 'TODO_AREA', Math.round(perimeter)].join(','));
  });

  const csv = ['# openings', ...doorWindowLines, '', '# rooms', ...roomLines].join('\n');
  return new Blob([csv], { type: 'text/csv' });
}
