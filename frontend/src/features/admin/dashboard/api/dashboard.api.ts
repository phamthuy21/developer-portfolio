import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';
import { ApiResponse } from '@/types/api';

export interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  draftProjects: number;
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  totalSkills: number;
  totalExperiences: number;
  totalCertificates: number;
  totalMessages: number;
  unreadMessages: number;
}

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<ApiResponse<DashboardStats>>(`${ENDPOINTS.ADMIN.DASHBOARD}/stats`);
    // TransformInterceptor wraps the response in { data: ... }
    return response.data.data;
  },
};

