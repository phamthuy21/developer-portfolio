import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { Project } from '../types';
import { ProjectFormData } from '../schemas/project.schema';
import { PaginatedResponse, ApiResponse } from '@/types/api';

export const projectsApi = {
  list: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<Project>> => {
    const response = await apiClient.get<PaginatedResponse<Project>>(ENDPOINTS.ADMIN.PROJECTS, { params });
    return response.data;
  },

  getById: async (id: string): Promise<Project> => {
    const response = await apiClient.get<ApiResponse<Project>>(`${ENDPOINTS.ADMIN.PROJECTS}/${id}`);
    return response.data.data;
  },

  create: async (data: ProjectFormData): Promise<Project> => {
    const response = await apiClient.post<ApiResponse<Project>>(ENDPOINTS.ADMIN.PROJECTS, data);
    return response.data.data;
  },

  update: async ({ id, data }: { id: string; data: Partial<ProjectFormData> }): Promise<Project> => {
    const response = await apiClient.patch<ApiResponse<Project>>(`${ENDPOINTS.ADMIN.PROJECTS}/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${ENDPOINTS.ADMIN.PROJECTS}/${id}`);
  },

  restore: async (id: string): Promise<Project> => {
    const response = await apiClient.patch<ApiResponse<Project>>(`${ENDPOINTS.ADMIN.PROJECTS}/${id}/restore`);
    return response.data.data;
  },

  publish: async (id: string): Promise<Project> => {
    const response = await apiClient.patch<ApiResponse<Project>>(`${ENDPOINTS.ADMIN.PROJECTS}/${id}/publish`);
    return response.data.data;
  },

  unpublish: async (id: string): Promise<Project> => {
    const response = await apiClient.patch<ApiResponse<Project>>(`${ENDPOINTS.ADMIN.PROJECTS}/${id}/unpublish`);
    return response.data.data;
  },

  feature: async (id: string): Promise<Project> => {
    const response = await apiClient.patch<ApiResponse<Project>>(`${ENDPOINTS.ADMIN.PROJECTS}/${id}/feature`);
    return response.data.data;
  },

  unfeature: async (id: string): Promise<Project> => {
    const response = await apiClient.patch<ApiResponse<Project>>(`${ENDPOINTS.ADMIN.PROJECTS}/${id}/unfeature`);
    return response.data.data;
  },
};
