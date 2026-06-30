import { z } from 'zod';

export const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  thumbnail: z.string().nullable().optional(),
  tags: z.array(z.string()).min(1, 'At least one tag is required'),
  isPublished: z.boolean(),
});

export type BlogFormData = z.infer<typeof blogSchema>;
