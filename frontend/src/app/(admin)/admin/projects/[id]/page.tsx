'use client';

import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { ProjectForm } from '@/features/admin/projects/components/ProjectForm';
import { useProject } from '@/features/admin/projects/api/project.queries';
import { useParams } from 'next/navigation';

export default function EditProjectPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: project, isLoading } = useProject(id);

  if (isLoading) {
    return <PageContainer>Loading project data...</PageContainer>;
  }

  if (!project) {
    return <PageContainer>Project not found.</PageContainer>;
  }

  return (
    <PageContainer>
      <PageHeader 
        title="Edit Project" 
        description={`Editing project: ${project.title}`}
      />
      <ProjectForm initialData={project} />
    </PageContainer>
  );
}
