import { SelectCounseleeRes } from '@/api/api';
import { DataTable } from '@/components/common/DataTable/data-table';
import { createCounseleeColumns } from './counseleeColumns';

interface CounseleeTableProps {
  data: SelectCounseleeRes[];
  onDelete: (id: string) => void;
  onEdit: (counselee: SelectCounseleeRes) => void;
}

export function CounseleeTable({
  data,
  onDelete,
  onEdit,
}: CounseleeTableProps) {
  return (
    <DataTable
      columns={createCounseleeColumns({ onDelete, onEdit })}
      data={data}
    />
  );
}
