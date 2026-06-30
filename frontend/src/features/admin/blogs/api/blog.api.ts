import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { Blog } from '../types';
import { BlogFormData } from '../schemas/blog.schema';
import { PaginatedResponse, ApiResponse } from '@/types/api';

export const blogsApi = {
  list: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<Blog>> => {
    const response = await apiClient.get<PaginatedResponse<Blog>>(ENDPOINTS.ADMIN.BLOGS, { params });
    return response.data;
  },

  getById: async (id: string): Promise<Blog> => {
    const response = await apiClient.get<ApiResponse<Blog>>(`${ENDPOINTS.ADMIN.BLOGS}/${id}`);
    return response.data.data;
  },

  create: async (data: BlogFormData): Promise<Blog> => {
    const response = await apiClient.post<ApiResponse<Blog>>(ENDPOINTS.ADMIN.BLOGS, data);
    return response.data.data;
  },

  update: async ({ id, data }: { id: string; data: Partial<BlogFormData> }): Promise<Blog> => {
    const response = await apiClient.patch<ApiResponse<Blog>>(`${ENDPOINTS.ADMIN.BLOGS}/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${ENDPOINTS.ADMIN.BLOGS}/${id}`);
  },

  restore: async (id: string): Promise<Blog> => {
    const response = await apiClient.patch<ApiResponse<Blog>>(`${ENDPOINTS.ADMIN.BLOGS}/${id}/restore`);
    return response.data.data;
  },

  publish: async (id: string): Promise<Blog> => {
    const response = await apiClient.patch<ApiResponse<Blog>>(`${ENDPOINTS.ADMIN.BLOGS}/${id}/publish`);
    return response.data.data;
  },

  unpublish: async (id: string): Promise<Blog> => {
    const response = await apiClient.patch<ApiResponse<Blog>>(`${ENDPOINTS.ADMIN.BLOGS}/${id}/unpublish`);
    return response.data.data;
  },
};
