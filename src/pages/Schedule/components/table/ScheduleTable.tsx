import { SelectCounselSessionListItem } from '@/api/api';
import { DataTable } from '@/components/common/DataTable/data-table';
import { createScheduleColumns } from './scheduleColumns';

interface ScheduleTableProps {
  data: SelectCounselSessionListItem[];
  onDelete: (id: string) => void;
  onEdit: (session: SelectCounselSessionListItem) => void;
}

export function ScheduleTable({ data, onDelete, onEdit }: ScheduleTableProps) {
  return (
    <DataTable
      columns={createScheduleColumns({ onDelete, onEdit })}
      data={data}
    />
  );
}
