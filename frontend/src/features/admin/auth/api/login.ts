import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { LoginFormData } from '../schemas/login.schema';
import { AuthSession } from '@/types/auth';
import { ApiResponse } from '@/types/api';

export const loginApi = async (data: LoginFormData): Promise<AuthSession> => {
  const response = await apiClient.post<ApiResponse<AuthSession>>(ENDPOINTS.AUTH.LOGIN, data);
  return response.data.data;
};
