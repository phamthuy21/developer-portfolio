'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blogSchema, BlogFormData } from '../schemas/blog.schema';
import { useCreateBlog, useUpdateBlog } from '../api/blog.queries';
import { Blog } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { toast } from 'sonner';

interface BlogFormProps {
  initialData?: Blog;
}

export function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const createMutation = useCreateBlog();
  const updateMutation = useUpdateBlog();

  const isEditing = !!initialData;

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      excerpt: initialData.excerpt,
      content: initialData.content,
      thumbnail: initialData.thumbnail,
      isPublished: initialData.isPublished,
    } : {
      title: '',
      excerpt: '',
      content: '',
      thumbnail: null,
      isPublished: false,
    },
  });

  const onSubmit = async (data: BlogFormData) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: initialData.id, data });
        toast.success('Blog updated successfully');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Blog created successfully');
      }
      router.push(ROUTES.ADMIN.BLOGS);
    } catch (error) {
      toast.error((error as Error).message || 'Failed to save blog');
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" {...form.register('title')} />
          {form.formState.errors.title && <p className="text-red-500 text-xs">{form.formState.errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Input id="excerpt" {...form.register('excerpt')} />
          {form.formState.errors.excerpt && <p className="text-red-500 text-xs">{form.formState.errors.excerpt.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content (Markdown)</Label>
          <textarea
            id="content"
            {...form.register('content')}
            className="w-full min-h-[300px] p-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-transparent"
          />
          {form.formState.errors.content && <p className="text-red-500 text-xs">{form.formState.errors.content.message}</p>}
        </div>



        <div className="flex items-center space-x-2">
          <Checkbox
            id="isPublished"
            checked={form.watch('isPublished') ?? false}
            onCheckedChange={(checked) => form.setValue('isPublished', checked as boolean)}
          />
          <Label htmlFor="isPublished">Published</Label>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : 'Save Blog Post'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
