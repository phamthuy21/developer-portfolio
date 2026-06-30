'use client';

import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { ProjectForm } from '@/features/admin/projects/components/ProjectForm';

export default function CreateProjectPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Create Project" 
        description="Add a new project to your portfolio."
      />
      <ProjectForm />
    </PageContainer>
  );
}
