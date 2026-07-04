import { axiosInstance } from '../lib/axios';
import type { ApiResponse, PlatformDashboardData } from '../types/platform-dashboard';

export const platformDashboardService = {
  getDashboard: async () => {
    const { data } = await axiosInstance.get<ApiResponse<PlatformDashboardData>>('/platform/dashboard');
    return data.data;
  },
};