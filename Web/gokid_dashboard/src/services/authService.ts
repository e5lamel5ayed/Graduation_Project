import { axiosInstance } from '../lib/axios';
import { LoginCredentials, LoginResponse, SignupCredentials } from '../types/auth';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const { data } = await axiosInstance.post<LoginResponse>('/Account/login', credentials);
    return data;
  },

  signup: async (credentials: SignupCredentials) => {
    const { data } = await axiosInstance.post('/Account/signup', credentials);
    return data;
  },

  logout: async () => {
    const { data } = await axiosInstance.post('/Account/logout');
    return data;
  },

  refreshToken: async (refreshToken: string) => {
    const { data } = await axiosInstance.post('/Account/refresh-token', { refreshToken });
    return data;
  },
};
