import { Opening, Room, Vec2 } from '../../types/models';
import { rotate, translate } from './vector';

type Transform = { rotation_deg: number; translate: Vec2 };

type OpeningReference = {
  wallDirection: Vec2;
  center: Vec2;
  opening: Opening;
};

function findOpening(room: Room, openingId: string): OpeningReference | undefined {
  for (const wall of room.walls) {
    const start = wall.start;
    const end = wall.end;
    const direction = { x: end.x - start.x, y: end.y - start.y };
    const wallLength = Math.hypot(direction.x, direction.y);
    const normalised = { x: direction.x / wallLength, y: direction.y / wallLength };
    for (const opening of wall.openings) {
      if (opening.id === openingId) {
        const centerOffset = opening.position_along_wall_mm + opening.width_mm / 2;
        const center: Vec2 = {
          x: start.x + normalised.x * centerOffset,
          y: start.y + normalised.y * centerOffset
        };
        return { wallDirection: normalised, center, opening };
      }
    }
  }
  return undefined;
}

export function computeTransformFromSharedOpening(
  roomA: Room,
  roomB: Room,
  openingIdA: string,
  openingIdB: string
): Transform {
  const refA = findOpening(roomA, openingIdA);
  const refB = findOpening(roomB, openingIdB);
  if (!refA || !refB) {
    throw new Error('Shared openings not found');
  }
  const angleA = Math.atan2(refA.wallDirection.y, refA.wallDirection.x);
  const angleB = Math.atan2(refB.wallDirection.y, refB.wallDirection.x);
  const rotation = ((angleA - angleB) * 180) / Math.PI;
  const rotatedCenterB = rotate(refB.center, rotation, refB.center);
  const translation = {
    x: refA.center.x - rotatedCenterB.x,
    y: refA.center.y - rotatedCenterB.y
  };
  return { rotation_deg: rotation, translate: translation };
}

export function applyTransformToRoom(room: Room, transform: Transform): Room {
  const rotation = transform.rotation_deg;
  const translateVec = transform.translate;
  return {
    ...room,
    walls: room.walls.map((wall) => ({
      ...wall,
      start: translate(rotate(wall.start, rotation), translateVec),
      end: translate(rotate(wall.end, rotation), translateVec)
    }))
  };
}
