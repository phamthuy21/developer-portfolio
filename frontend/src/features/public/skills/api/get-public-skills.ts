import { apiClient } from '@/lib/api/client';
import { Skill } from '@/features/admin/skills/types';

export interface SkillCategoryGroup {
  category: string;
  skills: Skill[];
}

export const getPublicSkills = async () => {
  const { data } = await apiClient.get<SkillCategoryGroup[]>('/skills');
  return data;
};
