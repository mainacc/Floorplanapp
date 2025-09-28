import { useMemo, useState } from 'react';
import { computeTransformFromSharedOpening } from '../../lib/geometry/transforms';
import { useProjectsStore } from '../../store/useProjectsStore';

export function StitchAssistant() {
  const { currentPlan, updatePlan } = useProjectsStore();
  const [roomAId, setRoomAId] = useState<string>();
  const [roomBId, setRoomBId] = useState<string>();
  const [openingAId, setOpeningAId] = useState<string>();
  const [openingBId, setOpeningBId] = useState<string>();
  const [status, setStatus] = useState('Select rooms and openings to align.');

  const rooms = currentPlan?.rooms ?? [];

  const roomOpenings = useMemo(() => {
    return rooms.reduce<Record<string, { id: string; label: string }[]>>((acc, room) => {
      acc[room.id] = room.walls.flatMap((wall) =>
        wall.openings.map((opening) => ({
          id: opening.id,
          label: `${opening.type} · ${Math.round(opening.width_mm)} mm`
        }))
      );
      return acc;
    }, {});
  }, [rooms]);

  async function handleCompute() {
    if (!currentPlan || !roomAId || !roomBId || !openingAId || !openingBId) {
      setStatus('Please select two rooms and openings.');
      return;
    }
    const roomA = rooms.find((room) => room.id === roomAId);
    const roomB = rooms.find((room) => room.id === roomBId);
    if (!roomA || !roomB) {
      setStatus('Rooms not found.');
      return;
    }
    try {
      const transform = computeTransformFromSharedOpening(roomA, roomB, openingAId, openingBId);
      const next = {
        ...currentPlan,
        transforms: {
          ...currentPlan.transforms,
          [roomB.id]: transform
        },
        meta: { ...currentPlan.meta, updatedAt: new Date().toISOString() }
      };
      await updatePlan(next);
      setStatus(`Aligned rooms. Rotation ${transform.rotation_deg.toFixed(1)}°, translation ${Math.round(transform.translate.x)} × ${Math.round(transform.translate.y)} mm.`);
    } catch (error) {
      console.error(error);
      setStatus('Failed to compute transform.');
    }
  }

  if (!currentPlan) {
    return <p>No project selected.</p>;
  }

  if (!rooms.length) {
    return <p>Import rooms first.</p>;
  }

  return (
    <section className="card stitch-assistant">
      <h2>Stitch Rooms</h2>
      <div className="grid-2">
        <div>
          <h3>Room A</h3>
          <select value={roomAId ?? ''} onChange={(e) => setRoomAId(e.target.value)}>
            <option value="">Select room</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name ?? `Room ${room.id.slice(0, 4)}`}
              </option>
            ))}
          </select>
          <select value={openingAId ?? ''} onChange={(e) => setOpeningAId(e.target.value)}>
            <option value="">Select opening</option>
            {(roomAId && roomOpenings[roomAId])?.map((opening) => (
              <option key={opening.id} value={opening.id}>
                {opening.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h3>Room B</h3>
          <select value={roomBId ?? ''} onChange={(e) => setRoomBId(e.target.value)}>
            <option value="">Select room</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name ?? `Room ${room.id.slice(0, 4)}`}
              </option>
            ))}
          </select>
          <select value={openingBId ?? ''} onChange={(e) => setOpeningBId(e.target.value)}>
            <option value="">Select opening</option>
            {(roomBId && roomOpenings[roomBId])?.map((opening) => (
              <option key={opening.id} value={opening.id}>
                {opening.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button className="primary" onClick={handleCompute}>
        Compute Transform
      </button>
      <p className="status">{status}</p>
    </section>
  );
}
