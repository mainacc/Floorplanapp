import Dexie, { Table } from 'dexie';
import { FloorPlan, Room } from '../types/models';

type ProjectRecord = {
  id: string;
  label?: string;
  plan: FloorPlan;
  updatedAt: string;
};

type RoomRecord = {
  id: string;
  room: Room;
  planId: string;
  updatedAt: string;
};

class PlanKitDatabase extends Dexie {
  projects!: Table<ProjectRecord>;
  rooms!: Table<RoomRecord>;

  constructor() {
    super('PlanKitDB');
    this.version(1).stores({
      projects: '&id, updatedAt',
      rooms: '&id, planId, updatedAt'
    });
  }
}

export const db = new PlanKitDatabase();

export async function saveFloorPlan(plan: FloorPlan) {
  const updatedAt = new Date().toISOString();
  const nextPlan = { ...plan, meta: { ...plan.meta, updatedAt } };
  await db.projects.put({ id: plan.id, label: plan.label, plan: nextPlan, updatedAt });
  return nextPlan;
}

export async function listProjects() {
  return db.projects.orderBy('updatedAt').reverse().toArray();
}

export async function deleteProject(id: string) {
  await db.projects.delete(id);
  const rooms = await db.rooms.where({ planId: id }).primaryKeys();
  if (rooms.length) {
    await db.rooms.bulkDelete(rooms);
  }
}
