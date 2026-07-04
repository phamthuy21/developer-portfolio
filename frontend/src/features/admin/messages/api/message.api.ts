import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { Message } from '../types';
import { PaginatedResponse, ApiResponse } from '@/types/api';

export const messagesApi = {
  list: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<Message>> => {
    const response = await apiClient.get<PaginatedResponse<Message>>(ENDPOINTS.ADMIN.MESSAGES, { params });
    return response.data;
  },

  getById: async (id: string): Promise<Message> => {
    const response = await apiClient.get<ApiResponse<Message>>(`${ENDPOINTS.ADMIN.MESSAGES}/${id}`);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${ENDPOINTS.ADMIN.MESSAGES}/${id}`);
  },

  restore: async (id: string): Promise<void> => {
    await apiClient.patch(`${ENDPOINTS.ADMIN.MESSAGES}/${id}/restore`);
  },

  updateStatus: async (id: string, isRead: boolean): Promise<Message> => {
    const response = await apiClient.patch<ApiResponse<Message>>(`${ENDPOINTS.ADMIN.MESSAGES}/${id}/status`, { isRead });
    return response.data.data;
  },
};
