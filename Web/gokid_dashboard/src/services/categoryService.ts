/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from '../lib/axios';
import { Category, CreateCategoryDto, UpdateCategoryDto, ApiResponse } from '../types/category';

// Helper function to convert object to FormData
const toFormData = (obj: Record<string, any>): FormData => {
  const formData = new FormData();
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    if (value !== null && value !== undefined) {
      // Handle File objects
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== '') {
        formData.append(key, value);
      }
    }
  });
  return formData;
};

export const categoryService = {
  // Get all categories
  getAll: async () => {
    const { data } = await axiosInstance.get<ApiResponse<Category[]>>('/Category');
    return data.data;
  },

  // Get single category
  getById: async (id: string) => {
    const { data } = await axiosInstance.get<ApiResponse<Category>>(`/Category/${id}`);
    return data.data;
  },

  // Create category
  create: async (categoryData: CreateCategoryDto) => {
    const formData = toFormData(categoryData);
    const { data } = await axiosInstance.post<ApiResponse<Category>>('/Category', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.data;
  },

  // Update category
  update: async (id: string, categoryData: UpdateCategoryDto) => {
    const formData = toFormData(categoryData);
    const { data } = await axiosInstance.put<ApiResponse<Category>>(`/Category/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.data;
  },

  // Delete category
  delete: async (id: string) => {
    const { data } = await axiosInstance.delete<ApiResponse<void>>(`/Category/${id}`);
    return data;
  },
};
