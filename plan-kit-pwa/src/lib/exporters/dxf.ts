import DXFWriter, { Colors } from 'dxf-writer';
import { applyTransformToRoom } from '../geometry/transforms';
import { FloorPlan } from '../../types/models';

export async function exportAsDxf(plan: FloorPlan) {
  const writer = new DXFWriter();
  writer.addLayer('WALLS', Colors.White, 'CONTINUOUS');
  writer.addLayer('DOORS', Colors.Green, 'CONTINUOUS');
  writer.addLayer('WINDOWS', Colors.Cyan, 'CONTINUOUS');

  plan.rooms.forEach((room) => {
    const transformed = plan.transforms[room.id] ? applyTransformToRoom(room, plan.transforms[room.id]) : room;
    transformed.walls.forEach((wall) => {
      writer.setCurrentLayer('WALLS');
      writer.drawLine(wall.start.x, wall.start.y, 0, wall.end.x, wall.end.y, 0);
      wall.openings.forEach((opening) => {
        const layer = opening.type === 'door' ? 'DOORS' : 'WINDOWS';
        writer.setCurrentLayer(layer);
        writer.drawCircle(wall.start.x, wall.start.y, 0, opening.position_along_wall_mm + opening.width_mm / 2);
      });
    });
  });

  const dxf = writer.stringify();
  return new Blob([dxf], { type: 'application/dxf' });
}
