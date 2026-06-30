'use client';

import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { ExperienceList } from '@/features/admin/experiences/components/ExperienceList';

export default function AdminExperiencesPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Experiences" 
        description="Manage your professional experience timeline."
      />
      <ExperienceList />
    </PageContainer>
  );
}
