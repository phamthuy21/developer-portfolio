export interface Skill {
  id: string;
  name: string;
  category: string;
  icon: string | null;
  proficiency: number;
  order: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
