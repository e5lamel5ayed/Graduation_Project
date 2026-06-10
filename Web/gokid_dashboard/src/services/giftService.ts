import { axiosInstance } from '../lib/axios';
import { Gift, CreateGiftDto, UpdateGiftDto, ApiResponse } from '../types/gift';
import { toFormData } from '../lib/utils';

export const giftService = {
  // Get all gifts
  getAll: async () => {
    const { data } = await axiosInstance.get<ApiResponse<Gift[]>>('/Gifts');
    // Handle both array and object with items property
    return Array.isArray(data.data) ? data.data : (data.data?.items || []);
  },

  // Get single gift
  getById: async (id: string) => {
    const { data } = await axiosInstance.get<ApiResponse<Gift>>(`/Gifts/${id}`);
    return data.data;
  },

  // Create gift
  create: async (giftData: CreateGiftDto) => {
    const formData = toFormData(giftData);
    const { data } = await axiosInstance.post<ApiResponse<Gift>>('/Gifts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.data;
  },

  // Update gift
  update: async (id: string, giftData: UpdateGiftDto) => {
    const formData = toFormData(giftData);
    const { data } = await axiosInstance.put<ApiResponse<Gift>>(`/Gifts/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.data;
  },

  // Delete gift
  delete: async (id: string) => {
    const { data } = await axiosInstance.delete<ApiResponse<void>>(`/Gifts/${id}`);
    return data;
  },
};
