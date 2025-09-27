import { Vec2 } from '../../types/models';

export function lineLength(start: Vec2, end: Vec2) {
  return Math.hypot(end.x - start.x, end.y - start.y);
}

export function angleBetween(a: Vec2, b: Vec2) {
  const dot = a.x * b.x + a.y * b.y;
  const det = a.x * b.y - a.y * b.x;
  return (Math.atan2(det, dot) * 180) / Math.PI;
}

export function rotate(point: Vec2, degrees: number, origin: Vec2 = { x: 0, y: 0 }): Vec2 {
  const rad = (degrees * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const translated = { x: point.x - origin.x, y: point.y - origin.y };
  return {
    x: translated.x * cos - translated.y * sin + origin.x,
    y: translated.x * sin + translated.y * cos + origin.y
  };
}

export function translate(point: Vec2, vec: Vec2): Vec2 {
  return { x: point.x + vec.x, y: point.y + vec.y };
}
