import { useMemo, useState } from 'react';
import { Layer, Line, Stage } from 'react-konva';
import Konva from 'konva';
import { applyTransformToRoom } from '../../../lib/geometry/transforms';
import { lineLength } from '../../../lib/geometry/vector';
import { useProjectsStore } from '../../../store/useProjectsStore';

const GRID_SPACING = 500;

export function CanvasWorkspace() {
  const { currentPlan } = useProjectsStore();
  const [scale, setScale] = useState(0.05); // 1 mm = 0.05 px => 1 m = 50 px

  const rooms = useMemo(() => {
    if (!currentPlan) return [];
    return currentPlan.rooms.map((room) => {
      const transform = currentPlan.transforms[room.id];
      return transform ? applyTransformToRoom(room, transform) : room;
    });
  }, [currentPlan]);

  if (!currentPlan) {
    return <p>Select a project to edit.</p>;
  }

  function handleWheel(event: Konva.KonvaEventObject<WheelEvent>) {
    event.evt.preventDefault();
    const delta = event.evt.deltaY;
    setScale((prev) => Math.min(0.2, Math.max(0.02, prev - delta * 0.0005)));
  }

  const width = 1200;
  const height = 800;

  const gridLines = [] as JSX.Element[];
  for (let x = 0; x < width; x += GRID_SPACING * scale) {
    gridLines.push(
      <Line
        key={`vx-${x}`}
        points={[x, 0, x, height]}
        stroke="#e2e8f0"
        strokeWidth={1}
      />
    );
  }
  for (let y = 0; y < height; y += GRID_SPACING * scale) {
    gridLines.push(
      <Line
        key={`hz-${y}`}
        points={[0, y, width, y]}
        stroke="#e2e8f0"
        strokeWidth={1}
      />
    );
  }

  return (
    <div className="canvas-workspace">
      <div className="toolbar card">
        <strong>Scale:</strong> {(scale * 1000).toFixed(0)} px / m
      </div>
      <Stage width={width} height={height} scaleX={scale} scaleY={scale} onWheel={handleWheel}>
        <Layer>{gridLines}</Layer>
        <Layer>
          {rooms.map((room) => (
            <Line
              key={room.id}
              points={room.walls.flatMap((wall) => [wall.start.x, wall.start.y, wall.end.x, wall.end.y])}
              stroke="#1f2937"
              strokeWidth={room.walls[0]?.thickness_mm ?? 120}
              lineCap="round"
              lineJoin="round"
              closed
            />
          ))}
        </Layer>
      </Stage>
      <aside className="card room-metrics">
        <h3>Metrics</h3>
        <ul>
          {rooms.map((room) => {
            const perimeter = room.walls.reduce((sum, wall) => sum + lineLength(wall.start, wall.end), 0);
            return (
              <li key={room.id}>
                {room.name ?? 'Room'} – {Math.round(perimeter)} mm perimeter
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}
