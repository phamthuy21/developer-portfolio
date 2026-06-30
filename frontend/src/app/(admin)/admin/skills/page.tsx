'use client';

import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { SkillList } from '@/features/admin/skills/components/SkillList';

export default function AdminSkillsPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Skills" 
        description="Manage your professional skills."
      />
      <SkillList />
    </PageContainer>
  );
}
