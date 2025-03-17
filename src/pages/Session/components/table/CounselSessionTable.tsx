import { SelectCounselSessionRes } from '@/api';
import { DataTable } from '@/components/common/DataTable/data-table';
import { createScheduleColumns } from './CounselSessionColumns';
interface ScheduleTableProps {
  data: SelectCounselSessionRes[];
  onDelete: (id: string) => void;
}

export function CounselSessionTable({ data, onDelete }: ScheduleTableProps) {
  return (
    <DataTable
      minWidth={600}
      columns={createScheduleColumns({ onDelete })}
      data={data}
    />
  );
}
