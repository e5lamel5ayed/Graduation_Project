import { axiosInstance } from '../lib/axios';
import { ApiResponse } from '../types/category';
import {
  ChildsListResponse,
  ChildDetailsResponse,
  ChildQueryParams,
  EnrollChildDto,
  DeleteChildDto,
} from '../types/children';

export const childrenService = {
  getAll: async (params: ChildQueryParams = {}) => {
    const { data } = await axiosInstance.get<ApiResponse<ChildsListResponse>>('/Class/institution/children', {
      params: {
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 12,
        classId: params.classId || undefined,
        searchName: params.searchName || undefined,
      },
    });

    return data.data;
  },

  getById: async (childId: string) => {
    const { data } = await axiosInstance.get<ApiResponse<ChildDetailsResponse>>(`/Children/${childId}`);
    return data.data;
  },

  enrollChild: async ({ classId, registrationcode }: EnrollChildDto) => {
    const { data } = await axiosInstance.post<ApiResponse<{ success: boolean }>>(
      `/Class/${classId}/enroll-child`,
      { registrationcode }
    );
    return data;
  },

  deleteChild: async ({ classId, childId }: DeleteChildDto) => {
    const { data } = await axiosInstance.delete<ApiResponse<{ success: boolean }>>(`/Class/${classId}/children/${childId}`);
    return data;
  },

  deleteChildFromInstitution: async (childId: string) => {
    const { data } = await axiosInstance.delete<ApiResponse<{ success: boolean }>>(`/Class/institution/children/${childId}`);
    return data;
  },
};
