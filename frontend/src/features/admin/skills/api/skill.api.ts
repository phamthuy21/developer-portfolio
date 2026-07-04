import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { Skill } from '../types';
import { SkillFormData } from '../schemas/skill.schema';
import { PaginatedResponse, ApiResponse } from '@/types/api';
import { mapSkillResponse } from '@/lib/utils/map-entities';

export const skillsApi = {
  list: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<Skill>> => {
    const response = await apiClient.get<PaginatedResponse<any>>(ENDPOINTS.ADMIN.SKILLS, { params });
    return {
      ...response.data,
      data: response.data.data.map(mapSkillResponse),
    };
  },

  getById: async (id: string): Promise<Skill> => {
    const response = await apiClient.get<ApiResponse<any>>(`${ENDPOINTS.ADMIN.SKILLS}/${id}`);
    return mapSkillResponse(response.data.data);
  },

  create: async (data: SkillFormData): Promise<Skill> => {
    const payload = {
      name: data.name,
      category: data.category,
      iconUrl: data.icon || undefined,
    };
    const response = await apiClient.post<ApiResponse<any>>(ENDPOINTS.ADMIN.SKILLS, payload);
    return mapSkillResponse(response.data.data);
  },

  update: async ({ id, data }: { id: string; data: Partial<SkillFormData> }): Promise<Skill> => {
    const payload = {
      name: data.name,
      category: data.category,
      iconUrl: data.icon || undefined,
    };
    const response = await apiClient.patch<ApiResponse<any>>(`${ENDPOINTS.ADMIN.SKILLS}/${id}`, payload);
    return mapSkillResponse(response.data.data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${ENDPOINTS.ADMIN.SKILLS}/${id}`);
  },

  restore: async (id: string): Promise<void> => {
    await apiClient.patch(`${ENDPOINTS.ADMIN.SKILLS}/${id}/restore`);
  },
};
