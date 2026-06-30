import { apiClient } from '@/lib/api/client';
import { Experience } from '@/features/admin/experiences/types';

export const getPublicExperiences = async () => {
  const { data } = await apiClient.get<Experience[]>('/experiences');
  return data;
};
