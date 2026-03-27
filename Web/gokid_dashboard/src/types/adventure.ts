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
  status?: string;
}

export interface AdventureDay {
  id: string;
  dayNumber: number;
  task: TaskTemplate | null;
}

export interface AdventureTaskAssignmentDto {
  dayNumber: number;
  taskTemplateId: string;
}

export interface AdventureUpsertDto {
  title: string;
  description: string;
  weekDuration?: number;
  bonusPoints?: number;
  descriptionVoiceFile?: File | null;
  tasks: AdventureTaskAssignmentDto[];
}

export type CreateAdventureDto = AdventureUpsertDto;
export type UpdateAdventureDto = AdventureUpsertDto;

export interface AdventureQueryParams {
  searchTitle?: string;
  status?: string;
}

export interface AdventureApiTask {
  dayNumber?: number;
  taskTemplateId?: string;
  taskTemplateID?: string;
  taskId?: string;
  templateId?: string;
  id?: string;
  titleEn?: string;
  titleAr?: string;
  title?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  basePoints?: number;
  templateType?: string;
  iconUrl?: string;
}

export interface AdventureApiModel {
  id: string;
  title?: string;
  titleEn?: string;
  titleAr?: string;
  description?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  weekDuration?: number;
  bonusPoints?: number;
  createdAt?: string;
  status?: string;
  tasks?: AdventureApiTask[];
}

export interface AdventureBuilderData {
  id: string;
  title: string;
  description: string;
  weekDuration: number;
  bonusPoints: number;
  tasks: AdventureTaskAssignmentDto[];
  rawTasks: AdventureApiTask[];
}

export interface AssignAdventureToClassDto {
  adventureId: string;
  classId: string;
  startDate: string;
}

export interface ApiResponse<T> {
  statusCode: string;
  succeeded: boolean;
  message: string;
  errors: unknown[] | null;
  data: T;
}
