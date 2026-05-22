import { axiosInstance } from '../lib/axios';
import { ApiResponse } from '../types/shared';
import {
  ClassListResponse,
  ClassQueryParams,
  ClassDetailResponse,
  CreateClassDto,
  UpdateClassDto,
  AssignSupervisorDto,
} from '../types/class';

export const classService = {
  getAll: async (params: ClassQueryParams = {}) => {
    const { data } = await axiosInstance.get<ApiResponse<ClassListResponse>>('/Class', {
      params: {
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 8,
        SearchName: params.SearchName || undefined,
      },
    });

    return data.data;
  },

  getAllForSupervisor: async (params: ClassQueryParams = {}) => {
    const { data } = await axiosInstance.get<ApiResponse<ClassListResponse>>('/supervisor/classes', {
      params: {
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 8,
        SearchName: params.SearchName || undefined,
      },
    });

    return data.data;
  },

  getById: async (classId: string) => {
    const { data } = await axiosInstance.get<ApiResponse<ClassDetailResponse>>(`/Class/${classId}`);
    return data.data;
  },

  create: async (payload: CreateClassDto) => {
    const { data } = await axiosInstance.post<ApiResponse<ClassDetailResponse>>('/Class', payload);
    return data.data;
  },

  update: async (classId: string, payload: UpdateClassDto) => {
    const { data } = await axiosInstance.put<ApiResponse<ClassDetailResponse>>(`/Class/${classId}`, payload);
    return data.data;
  },

  delete: async (classId: string) => {
    const { data } = await axiosInstance.delete<ApiResponse<void>>(`/Class/${classId}`);
    return data;
  },

  assignSupervisor: async (classId: string, payload: AssignSupervisorDto) => {
    const { data } = await axiosInstance.post<ApiResponse<void>>(
      `/Class/assign-supervisor/${classId}`,
      payload
    );
    return data;
  },

  unassignSupervisor: async (classId: string, supervisorId: string) => {
    const { data } = await axiosInstance.delete<ApiResponse<void>>(
      `/Class/${classId}/supervisors/${supervisorId}`
    );
    return data;
  },
};