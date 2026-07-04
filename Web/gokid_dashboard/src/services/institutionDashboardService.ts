import { axiosInstance } from '@/src/lib/axios';
import type { InstitutionDashboardData } from '@/src/types/institution-dashboard';

export const institutionDashboardService = {
  async getDashboard(): Promise<InstitutionDashboardData> {
    const response = await axiosInstance.get('/institution/dashboard');
    return response.data.data as InstitutionDashboardData;
  },
};