import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectsStore } from '../../store/useProjectsStore';

export function ProjectsList() {
  const navigate = useNavigate();
  const { projects, loadProjects, createProject, removeProject } = useProjectsStore();
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  async function handleCreate() {
    setCreating(true);
    const plan = await createProject('New Floor Plan');
    setCreating(false);
    navigate(`/plan/${plan.id}`);
  }

  return (
    <div className="projects-list">
      <div className="list-header">
        <h1>Projects</h1>
        <button className="primary" onClick={handleCreate} disabled={creating}>
          {creating ? 'Creating…' : 'New Project'}
        </button>
      </div>
      <div className="grid">
        {projects.map((project) => (
          <article key={project.id} className="card">
            <header>
              <h2>{project.label ?? 'Untitled Project'}</h2>
              <span className="timestamp">
                Updated {new Date(project.meta.updatedAt).toLocaleString()}
              </span>
            </header>
            <footer>
              <button className="primary" onClick={() => navigate(`/plan/${project.id}`)}>
                Open
              </button>
              <button className="secondary" onClick={() => removeProject(project.id)}>
                Delete
              </button>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}
