import { apiClient } from '@/lib/api/client';
import { Skill } from '@/features/admin/skills/types';
import { mapSkillResponse } from '@/lib/utils/map-entities';

export interface SkillCategoryGroup {
  category: string;
  skills: Skill[];
}

export const getPublicSkills = async (): Promise<SkillCategoryGroup[]> => {
  const response = await apiClient.get<{ data: Record<string, any[]> }>('/skills');
  const grouped: Record<string, any[]> = response.data.data;

  if (!grouped || typeof grouped !== 'object' || Array.isArray(grouped)) {
    console.error('[getPublicSkills] Unexpected response shape:', grouped);
    return [];
  }

  return Object.entries(grouped).map(([category, skills]) => ({
    category,
    skills: skills.map(mapSkillResponse),
  }));
};
