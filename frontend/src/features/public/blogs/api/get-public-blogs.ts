import { apiClient } from '@/lib/api/client';
import { PaginatedResponse } from '@/types/api';
import { Blog } from '@/features/admin/blogs/types';

export interface GetPublicBlogsParams {
  page?: number;
  limit?: number;
}

export const getPublicBlogs = async (params?: GetPublicBlogsParams) => {
  const { data } = await apiClient.get<PaginatedResponse<Blog>>('/blogs', { params });
  return data;
};

export const getPublicBlogBySlug = async (slug: string) => {
  const { data } = await apiClient.get<Blog>(`/blogs/${slug}`);
  return data;
};
