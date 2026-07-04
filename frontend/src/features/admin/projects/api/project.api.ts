import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { Project } from '../types';
import { ProjectFormData } from '../schemas/project.schema';
import { PaginatedResponse, ApiResponse } from '@/types/api';
import { mapProjectResponse } from '@/lib/utils/map-project';

export const projectsApi = {
  list: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<Project>> => {
    const response = await apiClient.get<PaginatedResponse<any>>(ENDPOINTS.ADMIN.PROJECTS, { params });
    return {
      ...response.data,
      data: response.data.data.map(mapProjectResponse),
    };
  },

  getById: async (id: string): Promise<Project> => {
    const response = await apiClient.get<ApiResponse<any>>(`${ENDPOINTS.ADMIN.PROJECTS}/${id}`);
    return mapProjectResponse(response.data.data);
  },

  create: async (data: ProjectFormData): Promise<Project> => {
    const payload = {
      title: data.title,
      description: data.description,
      content: data.content,
      githubUrl: data.repositoryUrl || undefined,
      liveUrl: data.liveUrl || undefined,
      imageUrl: data.thumbnail || undefined,
      featured: data.isFeatured,
      published: data.isPublished,
      technologies: data.technologies,
    };
    const response = await apiClient.post<ApiResponse<any>>(ENDPOINTS.ADMIN.PROJECTS, payload);
    return mapProjectResponse(response.data.data);
  },

  update: async ({ id, data }: { id: string; data: Partial<ProjectFormData> }): Promise<Project> => {
    const payload = {
      title: data.title,
      description: data.description,
      content: data.content,
      githubUrl: data.repositoryUrl || undefined,
      liveUrl: data.liveUrl || undefined,
      imageUrl: data.thumbnail || undefined,
      featured: data.isFeatured,
      published: data.isPublished,
      technologies: data.technologies,
    };
    const response = await apiClient.patch<ApiResponse<any>>(`${ENDPOINTS.ADMIN.PROJECTS}/${id}`, payload);
    return mapProjectResponse(response.data.data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${ENDPOINTS.ADMIN.PROJECTS}/${id}`);
  },

  restore: async (id: string): Promise<void> => {
    await apiClient.patch(`${ENDPOINTS.ADMIN.PROJECTS}/${id}/restore`);
  },

  publish: async (id: string): Promise<Project> => {
    const response = await apiClient.patch<ApiResponse<any>>(`${ENDPOINTS.ADMIN.PROJECTS}/${id}/publish`);
    return mapProjectResponse(response.data.data);
  },

  unpublish: async (id: string): Promise<Project> => {
    const response = await apiClient.patch<ApiResponse<any>>(`${ENDPOINTS.ADMIN.PROJECTS}/${id}/unpublish`);
    return mapProjectResponse(response.data.data);
  },

  feature: async (id: string): Promise<Project> => {
    const response = await apiClient.patch<ApiResponse<any>>(`${ENDPOINTS.ADMIN.PROJECTS}/${id}/feature`);
    return mapProjectResponse(response.data.data);
  },

  unfeature: async (id: string): Promise<Project> => {
    const response = await apiClient.patch<ApiResponse<any>>(`${ENDPOINTS.ADMIN.PROJECTS}/${id}/unfeature`);
    return mapProjectResponse(response.data.data);
  },
};
