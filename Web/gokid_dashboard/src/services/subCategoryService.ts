import { axiosInstance } from '../lib/axios';
import { SubCategory, CreateSubCategoryDto, UpdateSubCategoryDto, ApiResponse } from '../types/category';
import { toFormData } from '../lib/utils';


const BASE_PATH = '/TaskSubCategory';

export const subCategoryService = {
  getAll: async () => {
    const { data } = await axiosInstance.get<ApiResponse<SubCategory[]>>(BASE_PATH);
    return data.data;
  },

  getById: async (id: string) => {
    const { data } = await axiosInstance.get<ApiResponse<SubCategory>>(`${BASE_PATH}/${id}`);
    return data.data;
  },

  create: async (subCategoryData: CreateSubCategoryDto) => {
    const formData = toFormData(subCategoryData);
    const { data } = await axiosInstance.post<ApiResponse<SubCategory>>(BASE_PATH, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data.data;
  },

  update: async (id: string, subCategoryData: UpdateSubCategoryDto) => {
    const formData = toFormData(subCategoryData);
    const { data } = await axiosInstance.put<ApiResponse<SubCategory>>(`${BASE_PATH}/${id}`, formData, {
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
