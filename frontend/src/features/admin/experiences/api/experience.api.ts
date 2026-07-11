import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { Experience } from '../types';
import { ExperienceFormData } from '../schemas/experience.schema';
import { PaginatedResponse, ApiResponse } from '@/types/api';
import { mapExperienceResponse } from '@/lib/utils/map-entities';

export const experiencesApi = {
  list: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<Experience>> => {
    const response = await apiClient.get<PaginatedResponse<any>>(ENDPOINTS.ADMIN.EXPERIENCES, { params });
    return {
      ...response.data,
      data: response.data.data.map(mapExperienceResponse),
    };
  },

  getById: async (id: string): Promise<Experience> => {
    const response = await apiClient.get<ApiResponse<any>>(`${ENDPOINTS.ADMIN.EXPERIENCES}/${id}`);
    return mapExperienceResponse(response.data.data);
  },

  create: async (data: ExperienceFormData): Promise<Experience> => {
    const payload = {
      position: data.position,
      company: data.company,
      location: data.location || undefined,
      startDate: new Date(data.startDate).toISOString(),
      endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
      current: data.isCurrent,
      description: data.description,
    };
    const response = await apiClient.post<ApiResponse<any>>(ENDPOINTS.ADMIN.EXPERIENCES, payload);
    return mapExperienceResponse(response.data.data);
  },

  update: async ({ id, data }: { id: string; data: Partial<ExperienceFormData> }): Promise<Experience> => {
    const payload: any = { ...data };
    if (data.isCurrent !== undefined) payload.current = data.isCurrent;
    if (data.startDate) payload.startDate = new Date(data.startDate).toISOString();
    if (data.endDate) payload.endDate = new Date(data.endDate).toISOString();
    delete payload.isCurrent;

    const response = await apiClient.patch<ApiResponse<any>>(`${ENDPOINTS.ADMIN.EXPERIENCES}/${id}`, payload);
    return mapExperienceResponse(response.data.data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${ENDPOINTS.ADMIN.EXPERIENCES}/${id}`);
  },

  restore: async (id: string): Promise<void> => {
    await apiClient.patch(`${ENDPOINTS.ADMIN.EXPERIENCES}/${id}/restore`);
  },
};
