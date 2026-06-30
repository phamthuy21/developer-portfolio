'use client';

import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { BlogForm } from '@/features/admin/blogs/components/BlogForm';

export default function CreateBlogPage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Create Blog Post" 
        description="Write a new article for your portfolio."
      />
      <BlogForm />
    </PageContainer>
  );
}
