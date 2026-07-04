import { Blog } from '@/features/admin/blogs/types';
import { Skill } from '@/features/admin/skills/types';
import { Experience } from '@/features/admin/experiences/types';
import { Certificate } from '@/features/admin/certificates/types';

export const mapBlogResponse = (b: any): Blog => ({
  id: b.id,
  title: b.title,
  slug: b.slug,
  excerpt: b.excerpt,
  content: b.content,
  thumbnail: b.coverImage || b.imageUrl || null,
  tags: b.tags || [],
  isPublished: !!b.published,
  publishedAt: b.publishedAt || null,
  createdAt: b.createdAt,
  updatedAt: b.updatedAt,
  deletedAt: b.deletedAt || null,
});

export const mapSkillResponse = (s: any): Skill => ({
  id: s.id,
  name: s.name,
  slug: s.slug,
  iconUrl: s.iconUrl || null,
  category: s.category,
  createdAt: s.createdAt,
  updatedAt: s.updatedAt,
  deletedAt: s.deletedAt || null,
});

export const mapExperienceResponse = (e: any): Experience => ({
  id: e.id,
  title: e.title,
  company: e.company,
  location: e.location || null,
  startDate: e.startDate,
  endDate: e.endDate || null,
  isCurrent: e.current || !e.endDate,
  description: e.description,
  order: e.order || 0,
  createdAt: e.createdAt,
  updatedAt: e.updatedAt,
  deletedAt: e.deletedAt || null,
});

export const mapCertificateResponse = (c: any): Certificate => ({
  id: c.id,
  name: c.name || c.title,
  issuer: c.issuer,
  issueDate: c.issueDate,
  credentialUrl: c.credentialUrl || null,
  credentialId: c.credentialId || null,
  thumbnail: c.imageUrl || null,
  order: c.order || 0,
  createdAt: c.createdAt,
  updatedAt: c.updatedAt,
  deletedAt: c.deletedAt || null,
});
