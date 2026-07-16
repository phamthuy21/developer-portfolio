import { apiClient } from '@/lib/api/client';
import { PaginatedResponse, ApiResponse } from '@/types/api';
import { mapBlogResponse } from '@/lib/utils/map-entities';

export interface GetPublicBlogsParams {
  page?: number;
  limit?: number;
}

export const getPublicBlogs = async (params?: GetPublicBlogsParams) => {
  const { data } = await apiClient.get<PaginatedResponse<unknown>>('/blogs', { params });
  return {
    ...data,
    data: data.data.map(mapBlogResponse),
  };
};

export const getPublicBlogBySlug = async (slug: string) => {
  const { data } = await apiClient.get<ApiResponse<unknown>>(`/blogs/${slug}`);
  return data?.data ? mapBlogResponse(data.data) : null;
};
