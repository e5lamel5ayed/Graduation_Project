import { axiosInstance } from '../lib/axios';
import { LoginDto, LoginResponse, ApiResponse } from '../types/auth';

export const authService = {
  // Login
  login: async (loginData: LoginDto) => {
    const { data } = await axiosInstance.post<ApiResponse<LoginResponse>>(
      '/Account/login',
      loginData
    );
    return data.data;
  },

  // Logout (if you have logout endpoint)
  logout: async () => {
    const { data } = await axiosInstance.post<ApiResponse<void>>('/Account/logout');
    return data;
  },

  // Refresh token (if you have refresh endpoint)
  refreshToken: async (refreshToken: string) => {
    const { data } = await axiosInstance.post<ApiResponse<LoginResponse>>(
      '/Account/refresh-token',
      { refreshToken }
    );
    return data.data;
  },
};
