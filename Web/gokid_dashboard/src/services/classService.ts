import { axiosInstance } from '../lib/axios';
import { Class, ApiResponse, CreateClassDto, UpdateClassDto } from '../types/class';

export const classService = {
    getAll: async () => {
        const { data } = await axiosInstance.get<ApiResponse<{ items: Class[] }>>('/Class');
        return data.data.items;
    },

    getById: async (id: string) => {
        const { data } = await axiosInstance.get<ApiResponse<Class>>(`/Class/${id}`);
        return data.data;
    },
    
    create: async (classData: CreateClassDto) => {
        const { data } = await axiosInstance.post<ApiResponse<Class>>('/Class', classData);
        return data.data;
    },

    update: async (id: string, classData: UpdateClassDto) => {
        const { data } = await axiosInstance.put<ApiResponse<Class>>(`/Class/${id}`, classData);
        return data.data;
    },

    delete: async (id: string) => {
        const { data } = await axiosInstance.delete<ApiResponse<void>>(`/Class/${id}`);
        return data;
    },
};
