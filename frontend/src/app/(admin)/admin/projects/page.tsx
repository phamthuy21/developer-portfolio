'use client';

import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { ProjectList } from '@/features/admin/projects/components/ProjectList';

export default function AdminProjectsPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Projects" 
        description="Manage your portfolio projects."
      />
      <ProjectList />
    </PageContainer>
  );
}
