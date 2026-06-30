'use client';

import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { SkillForm } from '@/features/admin/skills/components/SkillForm';

export default function CreateSkillPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Add Skill" 
        description="Add a new skill to your portfolio."
      />
      <SkillForm />
    </PageContainer>
  );
}
