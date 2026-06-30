import { apiClient } from '@/lib/api/client';
import { PaginatedResponse } from '@/types/api';
import { Project } from '@/features/admin/projects/types';

export interface GetPublicProjectsParams {
  page?: number;
  limit?: number;
  featured?: boolean;
}

export const getPublicProjects = async (params?: GetPublicProjectsParams) => {
  const { data } = await apiClient.get<PaginatedResponse<Project>>('/projects', { params });
  return data;
};

export const getPublicProjectBySlug = async (slug: string) => {
  const { data } = await apiClient.get<Project>(`/projects/${slug}`);
  return data;
};
