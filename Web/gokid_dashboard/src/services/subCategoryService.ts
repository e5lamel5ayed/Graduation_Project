/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from '../lib/axios';
import { Category, CreateCategoryDto, UpdateCategoryDto, ApiResponse } from '../types/category';

const toFormData = (obj: Record<string, any>): FormData => {
  const formData = new FormData();
  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value !== null && value !== undefined) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== '') {
        formData.append(key, value);
      }
    }
  });
  return formData;
};

const BASE_PATH = '/TaskSubCategory';

export const subCategoryService = {
  getAll: async () => {
    const { data } = await axiosInstance.get<ApiResponse<Category[]>>(BASE_PATH);
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await axiosInstance.get<ApiResponse<Category>>(`${BASE_PATH}/${id}`);
    return data.data;
  },

  create: async (subCategoryData: CreateCategoryDto) => {
    const formData = toFormData(subCategoryData);
    const { data } = await axiosInstance.post<ApiResponse<Category>>(BASE_PATH, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.data;
  },

  update: async (id: string, subCategoryData: UpdateCategoryDto) => {
    const formData = toFormData(subCategoryData);
    const { data } = await axiosInstance.put<ApiResponse<Category>>(`${BASE_PATH}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.data;
  },

  delete: async (id: string) => {
    const { data } = await axiosInstance.delete<ApiResponse<void>>(`${BASE_PATH}/${id}`);
    return data;
  },
};
