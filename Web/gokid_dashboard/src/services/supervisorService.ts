import { axiosInstance } from '../lib/axios';
import { Supervisor, ApiResponse, CreateSupervisorDto, UpdateSupervisorDto } from '../types/supervisor';
import { toFormData } from '../lib/utils';


export const supervisorService = {
    getAll: async (classId?: string) => {
        const { data } = await axiosInstance.get<ApiResponse<{ items: Supervisor[] }>>('/InstitutionSupervisor/supervisors', {
            params: classId ? { classId } : undefined,
        });
        return data.data.items;
    },

    getById: async (id: string) => {
        const { data } = await axiosInstance.get<ApiResponse<Supervisor>>(`/InstitutionSupervisor/${id}`);
        return data.data;
    },

    create: async (supervisorData: CreateSupervisorDto) => {
        const formData = toFormData(supervisorData);
        const { data } = await axiosInstance.post<ApiResponse<Supervisor>>('/InstitutionSupervisor', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data.data;
    },

    update: async (id: string, supervisorData: UpdateSupervisorDto) => {
        const formData = toFormData(supervisorData);
        const { data } = await axiosInstance.put<ApiResponse<Supervisor>>(`/InstitutionSupervisor/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return data.data;
    },

    delete: async (id: string) => {
        const { data } = await axiosInstance.delete<ApiResponse<void>>(`/InstitutionSupervisor/${id}`);
        return data;
    },
};
