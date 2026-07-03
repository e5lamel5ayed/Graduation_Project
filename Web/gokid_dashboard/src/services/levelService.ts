import { axiosInstance } from '../lib/axios';
import { toFormData } from '../lib/utils';
import { ApiResponse, CreateLevelDto, Level, UpdateLevelDto } from '../types/level';

export const levelService = {
  getAll: async () => {
    const { data } = await axiosInstance.get<ApiResponse<Level[]>>('/levels');
    return data.data || [];
  },

  getById: async (levelId: string) => {
    const { data } = await axiosInstance.get<ApiResponse<Level>>(`/levels/${levelId}`);
    return data.data;
  },

  create: async (payload: CreateLevelDto) => {
    const formData = toFormData(payload);
    const { data } = await axiosInstance.post<ApiResponse<Level>>('/levels', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data.data;
  },

  update: async (levelId: string, payload: UpdateLevelDto) => {
    const formData = toFormData(payload);
    const { data } = await axiosInstance.put<ApiResponse<Level>>(`/levels/${levelId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data.data;
  },

  delete: async (levelId: string) => {
    const { data } = await axiosInstance.delete<ApiResponse<void>>(`/levels/${levelId}`);
    return data;
  },
};
