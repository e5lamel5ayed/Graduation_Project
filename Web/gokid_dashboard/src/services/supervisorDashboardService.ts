import { axiosInstance } from '@/src/lib/axios';
import type { SupervisorDashboardData } from '@/src/types/supervisor-dashboard';

export const supervisorDashboardService = {
  async getDashboard(): Promise<SupervisorDashboardData> {
    const response = await axiosInstance.get('/supervisor/dashboard');
    return response.data.data as SupervisorDashboardData;
  },
};