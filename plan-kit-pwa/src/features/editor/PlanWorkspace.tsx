import { useEffect, useMemo, useState } from 'react';
import { NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { useProjectsStore } from '../../store/useProjectsStore';
import { ImportRoomPanel } from '../import/ImportRoomPanel';
import { StitchAssistant } from '../stitch/StitchAssistant';
import { CanvasWorkspace } from './canvas/CanvasWorkspace';
import { ExportPanel } from '../export/ExportPanel';

export function PlanWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, loadProjects, currentPlan, setCurrentPlan } = useProjectsStore();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function ensureProject() {
      if (!projects.length) {
        await loadProjects();
      }
      const plan = projects.find((p) => p.id === id);
      if (plan) {
        setCurrentPlan(plan);
        setReady(true);
      } else {
        navigate('/');
      }
    }
    ensureProject();
  }, [projects, loadProjects, id, navigate, setCurrentPlan]);

  const tabs = useMemo(
    () => [
      { to: '', label: 'Import', element: <ImportRoomPanel />, index: true },
      { to: 'stitch', label: 'Stitch', element: <StitchAssistant /> },
      { to: 'edit', label: 'Edit', element: <CanvasWorkspace /> },
      { to: 'export', label: 'Export', element: <ExportPanel /> }
    ],
    []
  );

  if (!ready || !currentPlan) {
    return <p>Loading plan…</p>;
  }

  return (
    <div className="workspace">
      <header className="workspace-header">
        <h1>{currentPlan.label}</h1>
        <p className="workspace-meta">
          Updated {new Date(currentPlan.meta.updatedAt).toLocaleString()}
        </p>
      </header>
      <nav className="workspace-tabs">
        {tabs.map((tab) => (
          <NavLink
            key={tab.label}
            to={tab.to}
            end={tab.to === ''}
            className={({ isActive }) => (isActive ? 'active' : undefined)}
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
      <div className="workspace-content">
        <Routes>
          {tabs.map((tab) =>
            tab.index ? (
              <Route key={tab.label} index element={tab.element} />
            ) : (
              <Route key={tab.label} path={tab.to} element={tab.element} />
            )
          )}
        </Routes>
      </div>
    </div>
  );
}
