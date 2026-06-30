'use client';

import React, { useState } from 'react';
import { useBlogs, useBlogActions, useDeleteBlog } from '../api/blog.queries';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/common/SearchInput';
import { Pagination } from '@/components/common/Pagination';
import { DeleteDialog } from '@/components/common/DeleteDialog';
import { Blog } from '../types';
import Link from 'next/link';
import { Edit, Trash2, Globe } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { toast } from 'sonner';

export function BlogList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useBlogs({ page, limit: 10, search });
  const { publish, unpublish, restore } = useBlogActions();
  const deleteMutation = useDeleteBlog();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success('Blog post deleted successfully');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to delete blog post');
    } finally {
      setDeleteId(null);
    }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { 
      key: 'status', 
      label: 'Status', 
      render: (b: Blog) => (
        <div className="flex gap-2">
          <StatusBadge status={b.isPublished ? 'Published' : 'Draft'} type={b.isPublished ? 'success' : 'default'} />
          {b.deletedAt && <StatusBadge status="Deleted" type="danger" />}
        </div>
      ) 
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (b: Blog) => (
        <div className="flex items-center space-x-2">
          <Link href={`${ROUTES.ADMIN.BLOGS}/${b.id}`}>
            <Button variant="ghost" size="sm" title="Edit"><Edit className="w-4 h-4" /></Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => b.isPublished ? unpublish.mutate(b.id) : publish.mutate(b.id)} title={b.isPublished ? 'Unpublish' : 'Publish'}>
            <Globe className={`w-4 h-4 ${b.isPublished ? 'text-blue-500' : 'text-neutral-400'}`} />
          </Button>
          {b.deletedAt ? (
            <Button variant="ghost" size="sm" onClick={() => restore.mutate(b.id)} title="Restore">Restore</Button>
          ) : (
            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setDeleteId(b.id)} title="Delete"><Trash2 className="w-4 h-4" /></Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <SearchInput className="w-64" placeholder="Search blogs..." onSearch={setSearch} />
        <Link href={`${ROUTES.ADMIN.BLOGS}/create`}>
          <Button>Create Blog Post</Button>
        </Link>
      </div>

      <DataTable data={data?.data || []} columns={columns} isLoading={isLoading} />
      
      {data?.meta && (
        <Pagination
          currentPage={data.meta.page}
          totalPages={data.meta.totalPages}
          onPageChange={setPage}
          hasNextPage={data.meta.page < data.meta.totalPages}
          hasPreviousPage={data.meta.page > 1}
        />
      )}

      <DeleteDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
