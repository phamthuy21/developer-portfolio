'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, ProjectFormData } from '../schemas/project.schema';
import { useCreateProject, useUpdateProject } from '../api/project.queries';
import { Project } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { toast } from 'sonner';

interface ProjectFormProps {
  initialData?: Project;
}

export function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();

  const isEditing = !!initialData;

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      description: initialData.description,
      content: initialData.content,
      thumbnail: initialData.thumbnail,
      images: initialData.images || [],
      technologies: initialData.technologies || [],
      repositoryUrl: initialData.repositoryUrl || '',
      liveUrl: initialData.liveUrl || '',
      isPublished: initialData.isPublished,
      isFeatured: initialData.isFeatured,
    } : {
      title: '',
      description: '',
      content: '',
      thumbnail: null,
      images: [],
      technologies: [],
      repositoryUrl: '',
      liveUrl: '',
      isPublished: false,
      isFeatured: false,
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id: initialData.id, data });
        toast.success('Project updated successfully');
      } else {
        await createMutation.mutateAsync(data);
        toast.success('Project created successfully');
      }
      router.push(ROUTES.ADMIN.PROJECTS);
    } catch (error) {
      toast.error((error as Error).message || 'Failed to save project');
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
          <Label htmlFor="description">Description</Label>
          <Input id="description" {...form.register('description')} />
          {form.formState.errors.description && <p className="text-red-500 text-xs">{form.formState.errors.description.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content (Markdown)</Label>
          <textarea
            id="content"
            {...form.register('content')}
            className="w-full min-h-[200px] p-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-transparent"
          />
          {form.formState.errors.content && <p className="text-red-500 text-xs">{form.formState.errors.content.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="repositoryUrl">Repository URL</Label>
            <Input id="repositoryUrl" {...form.register('repositoryUrl')} />
            {form.formState.errors.repositoryUrl && <p className="text-red-500 text-xs">{form.formState.errors.repositoryUrl.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="liveUrl">Live URL</Label>
            <Input id="liveUrl" {...form.register('liveUrl')} />
            {form.formState.errors.liveUrl && <p className="text-red-500 text-xs">{form.formState.errors.liveUrl.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="technologies">Technologies (comma separated)</Label>
          <Input 
            id="technologies" 
            placeholder="React, NestJS, Postgres"
            onChange={(e) => {
              const val = e.target.value;
              form.setValue('technologies', val.split(',').map(s => s.trim()).filter(Boolean));
            }}
            defaultValue={form.getValues('technologies')?.join(', ')}
          />
          {form.formState.errors.technologies && <p className="text-red-500 text-xs">{form.formState.errors.technologies.message}</p>}
        </div>

        <div className="flex space-x-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPublished"
              checked={form.watch('isPublished')}
              onCheckedChange={(checked) => form.setValue('isPublished', checked as boolean)}
            />
            <Label htmlFor="isPublished">Published</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isFeatured"
              checked={form.watch('isFeatured')}
              onCheckedChange={(checked) => form.setValue('isFeatured', checked as boolean)}
            />
            <Label htmlFor="isFeatured">Featured</Label>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : 'Save Project'}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
