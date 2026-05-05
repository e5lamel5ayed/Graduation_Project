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
  titleEn: string;
  titleAr: string;
  description: string;
  descriptionEn: string;
  descriptionAr: string;
  goalEn: string;
  goalAr: string;
  bannerImage?: File | null;
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

export interface SupervisorAdventureApiModel {
  weeklyAdventureId: string;
  adventureId: string;
  titleEn: string;
  titleAr: string;
  className: string;
  classId: string;
  startDate: string;
  endDate: string;
  totalChildren: number;
  pendingReviewsCount: number;
}

export interface SupervisorAdventure {
  weeklyAdventureId: string;
  adventureId: string;
  title: string;
  titleEn: string;
  titleAr: string;
  className: string;
  classId: string;
  startDate: string;
  endDate: string;
  totalChildren: number;
  pendingReviewsCount: number;
}

export interface SupervisorAdventureClass {
  classId: string;
  className: string;
  childrenCount: number;
  startDate: string;
  endDate: string;
}

export interface SupervisorAdventureChild {
  childId: string;
  childName: string;
  childAvatarUrl?: string | null;
  age: number;
  submittedTasksCount: number;
  completedTasksCount: number;
  totalTasksCount: number;
  earnedStars: number;
  earnedPoints: number;
  isAdventureCompleted: boolean;
}

export interface SupervisorChildTaskHistoryItem {
  childAdventureTaskId: string;
  dayNumber: number;
  taskTitleEn?: string | null;
  taskTitleAr?: string | null;
  taskImageUrl?: string | null;
  storyText?: string | null;
  storyVoiceUrl?: string | null;
  status: string;
  evidenceUrl?: string | null;
  earnedStars: number;
  isApproved?: boolean;
  reviewedBy?: string | null;
  submittedAt?: string | null;
  completedAt?: string | null;
}

export interface SupervisorChildHistory {
  childId: string;
  childName: string;
  childAvatarUrl?: string | null;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  missedTasks: number;
  earnedStars: number;
  earnedPoints: number;
  isAdventureCompleted: boolean;
  tasks: SupervisorChildTaskHistoryItem[];
}

export interface AdventureBuilderData {
  id: string;
  title: string;
  titleEn: string;
  titleAr: string;
  description: string;
  descriptionEn: string;
  descriptionAr: string;
  goalEn: string;
  goalAr: string;
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
