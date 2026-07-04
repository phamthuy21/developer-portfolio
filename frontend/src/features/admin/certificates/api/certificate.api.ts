import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { Certificate } from '../types';
import { CertificateFormData } from '../schemas/certificate.schema';
import { PaginatedResponse, ApiResponse } from '@/types/api';
import { mapCertificateResponse } from '@/lib/utils/map-entities';

export const certificatesApi = {
  list: async (params?: { page?: number; limit?: number; search?: string }): Promise<PaginatedResponse<Certificate>> => {
    const response = await apiClient.get<PaginatedResponse<any>>(ENDPOINTS.ADMIN.CERTIFICATES, { params });
    return {
      ...response.data,
      data: response.data.data.map(mapCertificateResponse),
    };
  },

  getById: async (id: string): Promise<Certificate> => {
    const response = await apiClient.get<ApiResponse<any>>(`${ENDPOINTS.ADMIN.CERTIFICATES}/${id}`);
    return mapCertificateResponse(response.data.data);
  },

  create: async (data: CertificateFormData): Promise<Certificate> => {
    const payload = {
      name: data.name,
      issuer: data.issuer,
      issueDate: new Date(data.issueDate).toISOString(),
      credentialUrl: data.credentialUrl || undefined,
      imageUrl: data.thumbnail || undefined,
    };
    const response = await apiClient.post<ApiResponse<any>>(ENDPOINTS.ADMIN.CERTIFICATES, payload);
    return mapCertificateResponse(response.data.data);
  },

  update: async ({ id, data }: { id: string; data: Partial<CertificateFormData> }): Promise<Certificate> => {
    const payload: any = { ...data };
    if (data.issueDate) payload.issueDate = new Date(data.issueDate).toISOString();
    if (data.thumbnail !== undefined) {
      payload.imageUrl = data.thumbnail || undefined;
      delete payload.thumbnail;
    }
    const response = await apiClient.patch<ApiResponse<any>>(`${ENDPOINTS.ADMIN.CERTIFICATES}/${id}`, payload);
    return mapCertificateResponse(response.data.data);
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`${ENDPOINTS.ADMIN.CERTIFICATES}/${id}`);
  },

  restore: async (id: string): Promise<void> => {
    await apiClient.patch(`${ENDPOINTS.ADMIN.CERTIFICATES}/${id}/restore`);
  },
};
