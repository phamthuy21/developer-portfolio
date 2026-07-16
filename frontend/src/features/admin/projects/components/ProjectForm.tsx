'use client';

import React from 'react';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
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
import { useSkills } from '../../skills/api/skill.queries';
import { Badge } from '@/components/ui/badge';

interface ProjectFormProps {
  initialData?: Project;
}

export function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();

  const isEditing = !!initialData;

  const { data: skillsData } = useSkills({ limit: 100 });
  const allSkills = skillsData?.data || [];

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData ? {
      title: initialData.title,
      description: initialData.description,
      content: initialData.content,
      thumbnail: initialData.thumbnail || '',
      skillIds: initialData.skills?.map(s => s.id) || [],
      repositoryUrl: initialData.repositoryUrl || '',
      liveUrl: initialData.liveUrl || '',
      isPublished: initialData.isPublished,
      isFeatured: initialData.isFeatured,
    } : {
      title: '',
      description: '',
      content: '',
      thumbnail: '',
      skillIds: [],
      repositoryUrl: '',
      liveUrl: '',
      isPublished: false,
      isFeatured: false,
    },
  });

  const currentSkills = useWatch({ control: form.control, name: 'skillIds' }) || [];
  const thumbnail = useWatch({ control: form.control, name: 'thumbnail' });
  const isPublished = useWatch({ control: form.control, name: 'isPublished' });
  const isFeatured = useWatch({ control: form.control, name: 'isFeatured' });

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

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="thumbnail">Image URL</Label>
            <Input id="thumbnail" placeholder="https://example.com/image.jpg" {...form.register('thumbnail')} />
            {form.formState.errors.thumbnail && <p className="text-red-500 text-xs">{form.formState.errors.thumbnail.message}</p>}
          </div>
          
          <div className="relative w-full max-w-sm aspect-video bg-muted rounded-md overflow-hidden border">
            {thumbnail ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={thumbnail as string}
                alt="Preview"
                className="object-cover w-full h-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" fill="none" stroke="%23999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>';
                  (e.target as HTMLImageElement).classList.add('p-8');
                }}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-muted-foreground text-sm">
                No image provided
              </div>
            )}
          </div>
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
          <Label>Skills</Label>
          <div className="flex flex-wrap gap-2 p-4 border rounded-md min-h-[100px] bg-background">
            {allSkills.length === 0 ? (
              <p className="text-sm text-muted-foreground">No skills found. Please add skills in the Admin panel.</p>
            ) : (
              allSkills.map(skill => {
                const isSelected = currentSkills.includes(skill.id);
                return (
                  <Badge
                    key={skill.id}
                    variant={isSelected ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      if (isSelected) {
                        form.setValue('skillIds', currentSkills.filter(id => id !== skill.id), { shouldValidate: true });
                      } else {
                        form.setValue('skillIds', [...currentSkills, skill.id], { shouldValidate: true });
                      }
                    }}
                  >
                    {skill.name}
                  </Badge>
                );
              })
            )}
          </div>
          {form.formState.errors.skillIds && <p className="text-red-500 text-xs">{form.formState.errors.skillIds.message}</p>}
        </div>

        <div className="flex space-x-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPublished"
              checked={isPublished ?? false}
              onCheckedChange={(checked) => form.setValue('isPublished', checked as boolean)}
            />
            <Label htmlFor="isPublished">Published</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isFeatured"
              checked={isFeatured ?? false}
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
