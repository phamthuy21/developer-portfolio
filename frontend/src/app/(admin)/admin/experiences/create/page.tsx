'use client';

import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { ExperienceForm } from '@/features/admin/experiences/components/ExperienceForm';

export default function CreateExperiencePage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Add Experience" 
        description="Add a new role to your timeline."
      />
      <ExperienceForm />
    </PageContainer>
  );
}
