import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { Skill } from '../types';
import { SkillFormData } from '../schemas/skill.schema';
import { PaginatedResponse, ApiResponse } from '@/types/api';

export const skillsApi = {
  list: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<Skill>> => {
    const response = await apiClient.get<PaginatedResponse<Skill>>(ENDPOINTS.ADMIN.SKILLS, { params });
    return response.data;
  },

  getById: async (id: string): Promise<Skill> => {
    const response = await apiClient.get<ApiResponse<Skill>>(`${ENDPOINTS.ADMIN.SKILLS}/${id}`);
    return response.data.data;
  },

  create: async (data: SkillFormData): Promise<Skill> => {
    const response = await apiClient.post<ApiResponse<Skill>>(ENDPOINTS.ADMIN.SKILLS, data);
    return response.data.data;
  },

  update: async ({ id, data }: { id: string; data: Partial<SkillFormData> }): Promise<Skill> => {
    const response = await apiClient.patch<ApiResponse<Skill>>(`${ENDPOINTS.ADMIN.SKILLS}/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${ENDPOINTS.ADMIN.SKILLS}/${id}`);
  },

  restore: async (id: string): Promise<Skill> => {
    const response = await apiClient.patch<ApiResponse<Skill>>(`${ENDPOINTS.ADMIN.SKILLS}/${id}/restore`);
    return response.data.data;
  },
};
