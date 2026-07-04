import { z } from 'zod';

export const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  thumbnail: z.string().nullable().optional(),
  isPublished: z.boolean(),
});

export type BlogFormData = z.infer<typeof blogSchema>;
