import { SelectCounselSessionRes } from '@/api/api';
import { DataTable } from '@/components/common/DataTable/data-table';
import { createScheduleColumns } from './ScheduleColumns';
interface ScheduleTableProps {
  data: SelectCounselSessionRes[];
  onDelete: (id: string) => void;
}

export function ScheduleTable({ data, onDelete }: ScheduleTableProps) {
  return (
    <DataTable columns={createScheduleColumns({ onDelete })} data={data} />
  );
}
