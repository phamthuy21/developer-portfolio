'use client';

import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { BlogList } from '@/features/admin/blogs/components/BlogList';

export default function AdminBlogsPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Blogs" 
        description="Manage your portfolio blog posts."
      />
      <BlogList />
    </PageContainer>
  );
}
