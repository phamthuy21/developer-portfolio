import { apiClient } from '@/lib/api/client';
import { Experience } from '@/features/admin/experiences/types';
import { mapExperienceResponse } from '@/lib/utils/map-entities';

export const getPublicExperiences = async (): Promise<Experience[]> => {
  const { data } = await apiClient.get<{ data: unknown[] }>('/experiences');
  return data?.data ? data.data.map(mapExperienceResponse) : [];
};
