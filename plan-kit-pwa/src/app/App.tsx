import { Route, Routes } from 'react-router-dom';
import { ProjectsList } from '../features/import/ProjectsList';
import { PlanWorkspace } from '../features/editor/PlanWorkspace';
import { AppShell } from './AppShell';

export function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<ProjectsList />} />
        <Route path="/plan/:id/*" element={<PlanWorkspace />} />
      </Routes>
    </AppShell>
  );
}
