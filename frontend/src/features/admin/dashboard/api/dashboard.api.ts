import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/endpoints';

export interface DashboardStats {
  totalProjects: number;
  totalBlogs: number;
  totalSkills: number;
  totalExperiences: number;
  totalCertificates: number;
  unreadMessages: number;
}

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const params = { limit: 1 };
    
    const [
      projectsRes,
      blogsRes,
      skillsRes,
      experiencesRes,
      certificatesRes,
      messagesRes,
    ] = await Promise.all([
      apiClient.get(ENDPOINTS.ADMIN.PROJECTS, { params }),
      apiClient.get(ENDPOINTS.ADMIN.BLOGS, { params }),
      apiClient.get(ENDPOINTS.ADMIN.SKILLS, { params }),
      apiClient.get(ENDPOINTS.ADMIN.EXPERIENCES, { params }),
      apiClient.get(ENDPOINTS.ADMIN.CERTIFICATES, { params }),
      apiClient.get(ENDPOINTS.ADMIN.MESSAGES, { params: { limit: 1, status: 'UNREAD' } }),
    ]);

    return {
      totalProjects: projectsRes.data.meta?.totalItems || 0,
      totalBlogs: blogsRes.data.meta?.totalItems || 0,
      totalSkills: skillsRes.data.meta?.totalItems || 0,
      totalExperiences: experiencesRes.data.meta?.totalItems || 0,
      totalCertificates: certificatesRes.data.meta?.totalItems || 0,
      unreadMessages: messagesRes.data.meta?.totalItems || 0,
    };
  },
};
