import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { Blog } from '../types';
import { BlogFormData } from '../schemas/blog.schema';
import { PaginatedResponse, ApiResponse } from '@/types/api';
import { mapBlogResponse } from '@/lib/utils/map-entities';

export const blogsApi = {
  list: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<Blog>> => {
    const response = await apiClient.get<PaginatedResponse<unknown>>(ENDPOINTS.ADMIN.BLOGS, { params });
    return {
      ...response.data,
      data: response.data.data.map(mapBlogResponse),
    };
  },

  getById: async (id: string): Promise<Blog> => {
    const response = await apiClient.get<ApiResponse<unknown>>(`${ENDPOINTS.ADMIN.BLOGS}/${id}`);
    return mapBlogResponse(response.data.data);
  },

  create: async (data: BlogFormData): Promise<Blog> => {
    const payload = {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.thumbnail || undefined,
      published: data.isPublished,
    };
    const response = await apiClient.post<ApiResponse<unknown>>(ENDPOINTS.ADMIN.BLOGS, payload);
    return mapBlogResponse(response.data.data);
  },

  update: async ({ id, data }: { id: string; data: Partial<BlogFormData> }): Promise<Blog> => {
    const payload = {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.thumbnail || undefined,
      published: data.isPublished,
    };
    const response = await apiClient.patch<ApiResponse<unknown>>(`${ENDPOINTS.ADMIN.BLOGS}/${id}`, payload);
    return mapBlogResponse(response.data.data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${ENDPOINTS.ADMIN.BLOGS}/${id}`);
  },

  restore: async (id: string): Promise<void> => {
    await apiClient.patch(`${ENDPOINTS.ADMIN.BLOGS}/${id}/restore`);
  },

  publish: async (id: string): Promise<Blog> => {
    const response = await apiClient.patch<ApiResponse<unknown>>(`${ENDPOINTS.ADMIN.BLOGS}/${id}/publish`);
    return mapBlogResponse(response.data.data);
  },

  unpublish: async (id: string): Promise<Blog> => {
    const response = await apiClient.patch<ApiResponse<unknown>>(`${ENDPOINTS.ADMIN.BLOGS}/${id}/unpublish`);
    return mapBlogResponse(response.data.data);
  },
};
