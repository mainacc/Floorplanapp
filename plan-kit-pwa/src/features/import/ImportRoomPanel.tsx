import { ChangeEvent, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { mapRoomPlanJsonToRoom } from '../../lib/import/mapRoomPlanJsonToRoom';
import { useProjectsStore } from '../../store/useProjectsStore';
import { nanoid } from '../../lib/utils/nanoid';

export function ImportRoomPanel() {
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const token = params.get('token');
  const { currentPlan, updatePlan } = useProjectsStore();
  const [status, setStatus] = useState<string>();

  if (!currentPlan) {
    return <p>Select a project first.</p>;
  }

  async function importJson(json: unknown) {
    try {
      const room = mapRoomPlanJsonToRoom(json);
      const next = {
        ...currentPlan,
        rooms: [...currentPlan.rooms, { ...room, id: room.id ?? nanoid() }],
        meta: { ...currentPlan.meta, updatedAt: new Date().toISOString() }
      };
      await updatePlan(next);
      setStatus(`Imported room with ${room.walls.length} walls.`);
    } catch (error) {
      console.error(error);
      setStatus('Failed to import room. Check console for details.');
    }
  }

  async function handleFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    importJson(JSON.parse(text));
  }

  async function handleFetchFromToken() {
    if (!token) {
      setStatus('No token provided.');
      return;
    }
    setStatus('Fetching room payload…');
    try {
      if (!import.meta.env.VITE_USE_BACKEND) {
        const fixture = await import('../../lib/import/fixtures/sample-room.json');
        await importJson(fixture.default);
        setStatus('Backend disabled; loaded sample fixture.');
        return;
      }
      const response = await fetch(`/api/import/${token}`).then((res) => res.json());
      await importJson(response);
    } catch (error) {
      console.error(error);
      setStatus('Failed to fetch token payload.');
    }
  }

  return (
    <section className="card import-panel">
      <h2>Import Room</h2>
      <p>Import JSON exported by the iOS capture helper or use an upload token.</p>
      <div className="actions">
        <label className="secondary">
          <input type="file" accept="application/json" onChange={handleFileUpload} hidden />
          Upload JSON
        </label>
        <button className="secondary" onClick={handleFetchFromToken}>
          Fetch from Token
        </button>
      </div>
      {status && <p className="status">{status}</p>}
    </section>
  );
}
