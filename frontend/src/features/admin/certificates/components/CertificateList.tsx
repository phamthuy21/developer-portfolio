'use client';

import React, { useState } from 'react';
import { useCertificates, useCertificateActions, useDeleteCertificate } from '../api/certificate.queries';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Button } from '@/components/ui/button';
import { SearchInput } from '@/components/common/SearchInput';
import { Pagination } from '@/components/common/Pagination';
import { DeleteDialog } from '@/components/common/DeleteDialog';
import { Certificate } from '../types';
import Link from 'next/link';
import { Edit, Trash2 } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { toast } from 'sonner';

export function CertificateList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isLoading } = useCertificates({ page, limit: 10, search });
  const { restore } = useCertificateActions();
  const deleteMutation = useDeleteCertificate();

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success('Certificate deleted successfully');
    } catch (error) {
      toast.error((error as Error).message || 'Failed to delete certificate');
    } finally {
      setDeleteId(null);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'issuer', label: 'Issuer' },
    { key: 'issueDate', label: 'Issue Date' },
    { 
      key: 'status', 
      label: 'Status', 
      render: (c: Certificate) => (
        <div className="flex gap-2">
          {c.deletedAt && <StatusBadge status="Deleted" type="danger" />}
        </div>
      ) 
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (c: Certificate) => (
        <div className="flex items-center space-x-2">
          <Link href={`${ROUTES.ADMIN.CERTIFICATES}/${c.id}`}>
            <Button variant="ghost" size="sm" title="Edit"><Edit className="w-4 h-4" /></Button>
          </Link>
          {c.deletedAt ? (
            <Button variant="ghost" size="sm" onClick={() => restore.mutate(c.id)} title="Restore">Restore</Button>
          ) : (
            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => setDeleteId(c.id)} title="Delete"><Trash2 className="w-4 h-4" /></Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <SearchInput className="w-64" placeholder="Search certificates..." onSearch={setSearch} />
        <Link href={`${ROUTES.ADMIN.CERTIFICATES}/create`}>
          <Button>Add Certificate</Button>
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
