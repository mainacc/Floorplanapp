import { applyTransformToRoom } from '../geometry/transforms';
import { FloorPlan } from '../../types/models';

export async function exportAsSvg(plan: FloorPlan) {
  const rooms = plan.rooms.map((room) => {
    const transform = plan.transforms[room.id];
    return transform ? applyTransformToRoom(room, transform) : room;
  });
  const paths = rooms
    .map((room) => {
      const d = room.walls
        .map((wall, index) => `${index === 0 ? 'M' : 'L'} ${wall.start.x} ${wall.start.y}`)
        .join(' ');
      return `<path d="${d} Z" fill="none" stroke="#111827" stroke-width="${room.walls[0]?.thickness_mm ?? 120}" />`;
    })
    .join('\n');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8000 6000">${paths}</svg>`;
  return new Blob([svg], { type: 'image/svg+xml' });
}
