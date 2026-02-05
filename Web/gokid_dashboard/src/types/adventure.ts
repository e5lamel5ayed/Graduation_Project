import { TaskTemplate } from './task';

export interface Adventure {
  id: string;
  title: string;
  description: string;
  days: number;
  taskCount: number;
  goal: string;
  createdAt: string;
  category: string;
  thumbnail?: string;
}

export interface AdventureDay {
  id: string;
  dayNumber: number;
  task: TaskTemplate | null;
}
