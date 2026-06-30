'use client';

import React, { useState } from 'react';
import { useProjects, useProjectActions, useDeleteProject } from '../api/project.queries';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/common/SearchInput';
import { Pagination } from '@/components/common/Pagination';
import { DeleteDialog } from '@/components/common/DeleteDialog';
import { Project } from '../types';
import Link from 'next/link';
import { Edit, Trash2, Star, Globe } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { toast } from 'sonner';

export function ProjectList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useProjects({ page, limit: 10, search });
  const { publish, unpublish, feature, unfeature, restore } = useProjectActions();
  const deleteMutation = useDeleteProject();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success('Project deleted successfully');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to delete project');
    } finally {
      setDeleteId(null);
    }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { 
      key: 'status', 
      label: 'Status', 
      render: (p: Project) => (
        <div className="flex gap-2">
          <StatusBadge status={p.isPublished ? 'Published' : 'Draft'} type={p.isPublished ? 'success' : 'default'} />
          {p.isFeatured && <StatusBadge status="Featured" type="info" />}
          {p.deletedAt && <StatusBadge status="Deleted" type="danger" />}
        </div>
      ) 
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (p: Project) => (
        <div className="flex items-center space-x-2">
          <Link href={`${ROUTES.ADMIN.PROJECTS}/${p.id}`}>
            <Button variant="ghost" size="sm" title="Edit"><Edit className="w-4 h-4" /></Button>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => p.isPublished ? unpublish.mutate(p.id) : publish.mutate(p.id)} title={p.isPublished ? 'Unpublish' : 'Publish'}>
            <Globe className={`w-4 h-4 ${p.isPublished ? 'text-blue-500' : 'text-neutral-400'}`} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => p.isFeatured ? unfeature.mutate(p.id) : feature.mutate(p.id)} title={p.isFeatured ? 'Unfeature' : 'Feature'}>
            <Star className={`w-4 h-4 ${p.isFeatured ? 'text-yellow-500' : 'text-neutral-400'}`} />
          </Button>
          {p.deletedAt ? (
            <Button variant="ghost" size="sm" onClick={() => restore.mutate(p.id)} title="Restore">Restore</Button>
          ) : (
            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setDeleteId(p.id)} title="Delete"><Trash2 className="w-4 h-4" /></Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <SearchInput className="w-64" placeholder="Search projects..." onSearch={setSearch} />
        <Link href={`${ROUTES.ADMIN.PROJECTS}/create`}>
          <Button>Create Project</Button>
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
