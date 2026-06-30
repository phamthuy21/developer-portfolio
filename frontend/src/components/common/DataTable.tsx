import React from 'react';

interface DataTableProps<T> {
  data: T[];
  columns: { key: string; label: string; render?: (item: T) => React.ReactNode }[];
  isLoading?: boolean;
}

export function DataTable<T extends { id: string }>({ data, columns, isLoading }: DataTableProps<T>) {
  if (isLoading) {
    return <div>Loading data...</div>;
  }

  if (data.length === 0) {
    return <div>No records found.</div>;
  }

  return (
    <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-800 rounded-lg">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-neutral-700 uppercase bg-neutral-50 dark:bg-neutral-900 dark:text-neutral-400">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-3">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="bg-white border-b dark:bg-neutral-950 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900">
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4">
                  {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
