import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { Experience } from '../types';
import { ExperienceFormData } from '../schemas/experience.schema';
import { PaginatedResponse, ApiResponse } from '@/types/api';

export const experiencesApi = {
  list: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<Experience>> => {
    const response = await apiClient.get<PaginatedResponse<Experience>>(ENDPOINTS.ADMIN.EXPERIENCES, { params });
    return response.data;
  },

  getById: async (id: string): Promise<Experience> => {
    const response = await apiClient.get<ApiResponse<Experience>>(`${ENDPOINTS.ADMIN.EXPERIENCES}/${id}`);
    return response.data.data;
  },

  create: async (data: ExperienceFormData): Promise<Experience> => {
    const response = await apiClient.post<ApiResponse<Experience>>(ENDPOINTS.ADMIN.EXPERIENCES, data);
    return response.data.data;
  },

  update: async ({ id, data }: { id: string; data: Partial<ExperienceFormData> }): Promise<Experience> => {
    const response = await apiClient.patch<ApiResponse<Experience>>(`${ENDPOINTS.ADMIN.EXPERIENCES}/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${ENDPOINTS.ADMIN.EXPERIENCES}/${id}`);
  },

  restore: async (id: string): Promise<Experience> => {
    const response = await apiClient.patch<ApiResponse<Experience>>(`${ENDPOINTS.ADMIN.EXPERIENCES}/${id}/restore`);
    return response.data.data;
  },
};
