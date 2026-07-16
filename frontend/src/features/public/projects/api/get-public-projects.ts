import { apiClient } from '@/lib/api/client';
import { PaginatedResponse, ApiResponse } from '@/types/api';
import { mapProjectResponse } from '@/lib/utils/map-project';

export interface GetPublicProjectsParams {
  page?: number;
  limit?: number;
  featured?: boolean;
}

export const getPublicProjects = async (params?: GetPublicProjectsParams) => {
  const { data } = await apiClient.get<PaginatedResponse<unknown>>('/projects', { params });
  return {
    ...data,
    data: data.data.map(mapProjectResponse),
  };
};

export const getPublicProjectBySlug = async (slug: string) => {
  const { data } = await apiClient.get<ApiResponse<unknown>>(`/projects/${slug}`);
  return data?.data ? mapProjectResponse(data.data) : null;
};
