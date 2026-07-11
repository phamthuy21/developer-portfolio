import { Project } from '@/features/admin/projects/types';

export const mapProjectResponse = (p: any): Project => ({
  id: p.id,
  title: p.title,
  slug: p.slug,
  description: p.description,
  content: p.content,
  thumbnail: p.imageUrl || null,
  images: [],
  technologies: p.skills?.map((s: any) => s.name || s.skill?.name) || [],
  skills: p.skills?.map((s: any) => ({
    id: s.id || s.skill?.id,
    name: s.name || s.skill?.name,
  })) || [],
  repositoryUrl: p.githubUrl || null,
  liveUrl: p.liveUrl || null,
  isPublished: !!p.published,
  isFeatured: !!p.featured,
  createdAt: p.createdAt,
  updatedAt: p.updatedAt,
  deletedAt: p.deletedAt || null,
});
