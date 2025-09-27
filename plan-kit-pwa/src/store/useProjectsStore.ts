import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from '../lib/utils/nanoid';
import { FloorPlan } from '../types/models';
import { deleteProject, listProjects, saveFloorPlan } from './db';

type ProjectsState = {
  projects: FloorPlan[];
  loading: boolean;
  currentPlan?: FloorPlan;
  loadProjects: () => Promise<void>;
  createProject: (label?: string) => Promise<FloorPlan>;
  setCurrentPlan: (plan: FloorPlan) => void;
  updatePlan: (plan: FloorPlan) => Promise<void>;
  removeProject: (id: string) => Promise<void>;
};

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set, get) => ({
      projects: [],
      loading: false,
      async loadProjects() {
        set({ loading: true });
        const result = await listProjects();
        set({ projects: result.map((p) => p.plan), loading: false });
      },
      async createProject(label) {
        const now = new Date().toISOString();
        const plan: FloorPlan = {
          id: nanoid(),
          label: label ?? 'Untitled Project',
          rooms: [],
          transforms: {},
          meta: { createdAt: now, updatedAt: now }
        };
        const persisted = await saveFloorPlan(plan);
        set({ projects: [...get().projects, persisted], currentPlan: persisted });
        return persisted;
      },
      setCurrentPlan(plan) {
        set({ currentPlan: plan });
      },
      async updatePlan(plan) {
        const persisted = await saveFloorPlan(plan);
        set({
          projects: get().projects.map((p) => (p.id === persisted.id ? persisted : p)),
          currentPlan: persisted
        });
      },
      async removeProject(id) {
        await deleteProject(id);
        set({ projects: get().projects.filter((p) => p.id !== id) });
      }
    }),
    {
      name: 'plankit-state',
      partialize: (state) => ({ projects: state.projects, currentPlan: state.currentPlan })
    }
  )
);
