import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { Certificate } from '../types';
import { CertificateFormData } from '../schemas/certificate.schema';
import { PaginatedResponse, ApiResponse } from '@/types/api';

export const certificatesApi = {
  list: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<Certificate>> => {
    const response = await apiClient.get<PaginatedResponse<Certificate>>(ENDPOINTS.ADMIN.CERTIFICATES, { params });
    return response.data;
  },

  getById: async (id: string): Promise<Certificate> => {
    const response = await apiClient.get<ApiResponse<Certificate>>(`${ENDPOINTS.ADMIN.CERTIFICATES}/${id}`);
    return response.data.data;
  },

  create: async (data: CertificateFormData): Promise<Certificate> => {
    const response = await apiClient.post<ApiResponse<Certificate>>(ENDPOINTS.ADMIN.CERTIFICATES, data);
    return response.data.data;
  },

  update: async ({ id, data }: { id: string; data: Partial<CertificateFormData> }): Promise<Certificate> => {
    const response = await apiClient.patch<ApiResponse<Certificate>>(`${ENDPOINTS.ADMIN.CERTIFICATES}/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${ENDPOINTS.ADMIN.CERTIFICATES}/${id}`);
  },

  restore: async (id: string): Promise<Certificate> => {
    const response = await apiClient.patch<ApiResponse<Certificate>>(`${ENDPOINTS.ADMIN.CERTIFICATES}/${id}/restore`);
    return response.data.data;
  },
};
