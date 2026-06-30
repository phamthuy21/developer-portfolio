'use client';

import { PageContainer } from '@/components/common/PageContainer';
import { PageHeader } from '@/components/common/PageHeader';
import { BlogForm } from '@/features/admin/blogs/components/BlogForm';
import { useBlog } from '@/features/admin/blogs/api/blog.queries';
import { useParams } from 'next/navigation';

export default function EditBlogPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: blog, isLoading } = useBlog(id);

  if (isLoading) {
    return <PageContainer>Loading blog data...</PageContainer>;
  }

  if (!blog) {
    return <PageContainer>Blog post not found.</PageContainer>;
  }

  return (
    <PageContainer>
      <PageHeader 
        title="Edit Blog Post" 
        description={`Editing: ${blog.title}`}
      />
      <BlogForm initialData={blog} />
    </PageContainer>
  );
}
