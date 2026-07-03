import { axiosInstance } from '../lib/axios';
import { toFormData } from '../lib/utils';
import {
  ApiResponse,
  CreateInstitutionDto,
  InstitutionDetails,
  InstitutionListResponse,
  InstitutionQueryParams,
  InstitutionSupervisorProfile,
  UpdateInstitutionDto,
} from '../types/institution';

export const institutionService = {
  getAll: async (params: InstitutionQueryParams = {}) => {
    const { data } = await axiosInstance.get<ApiResponse<InstitutionListResponse>>('/institutions', {
      params: {
        pageNumber: params.pageNumber || 1,
        pageSize: params.pageSize || 8,
        search: params.search || undefined,
      },
    });

    return data.data;
  },

  getById: async (institutionId: string) => {
    const { data } = await axiosInstance.get<ApiResponse<InstitutionDetails>>(`/institutions/${institutionId}`);
    return data.data;
  },

  create: async (payload: CreateInstitutionDto) => {
    const formData = toFormData(payload);
    const { data } = await axiosInstance.post<ApiResponse<InstitutionDetails>>('/institutions', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data.data;
  },

  update: async (institutionId: string, payload: UpdateInstitutionDto) => {
    const formData = toFormData(payload);
    const { data } = await axiosInstance.put<ApiResponse<InstitutionDetails>>(`/institutions/${institutionId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data.data;
  },

  delete: async (institutionId: string) => {
    const { data } = await axiosInstance.delete<ApiResponse<void>>(`/institutions/${institutionId}`);
    return data;
  },

  getSupervisorProfile: async (institutionId: string, supervisorId: string) => {
    const { data } = await axiosInstance.get<ApiResponse<InstitutionSupervisorProfile>>(
      `/institutions/${institutionId}/supervisors/${supervisorId}`
    );
    return data.data;
  },
};