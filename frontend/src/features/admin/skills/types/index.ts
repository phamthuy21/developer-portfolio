export interface Skill {
  id: string;
  name: string;
  slug: string;
  category: string;
  iconUrl: string | null | undefined;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

