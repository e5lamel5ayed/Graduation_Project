
import type { PaginatedResponse } from './task';

export interface ClassFormData {
  id?: string;
  name: string;
  teacher: string;
  maxStudents: number | string;
  schedule: string;
  activeAdventuresCount?: number;
  createdAt?: string;
}

export interface Class extends ClassFormData {
  id: string;
  childrenCount: number;
  activeAdventuresCount: number;
  createdAt: string;
}

export interface ClassApiItem {
  id: string;
  name: string;
  childrenCount: number;
  supervisorsCount: number;
  activeAdventuresCount?: number;
  createdAt: string;
}

export interface ClassCardItem extends ClassFormData {
  id: string;
  childrenCount: number;
  activeAdventuresCount: number;
  createdAt: string;
}

export interface ClassQueryParams {
  pageNumber?: number;
  pageSize?: number;
  SearchName?: string;
}

export type ClassListResponse = PaginatedResponse<ClassApiItem>;

export interface CreateClassDto {
  name: string;
}

export interface UpdateClassDto {
  name: string;
}

export interface AssignSupervisorDto {
  supervisorId: string;
}

export interface ClassDetailResponse {
  id: string;
  name: string;
  childrenCount: number;
  supervisorsCount: number;
  createdAt: string;
}
