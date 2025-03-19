import { SelectCounselSessionRes } from '@/api';
import { DataTable } from '@/components/common/DataTable/data-table';
import { createScheduleColumns } from './CounselSessionColumns';
interface ScheduleTableProps {
  data: SelectCounselSessionRes[];
  onDelete: (id: string) => void;
  highlightedSession: string | null;
}

export function CounselSessionTable({
  data,
  onDelete,
  highlightedSession,
}: ScheduleTableProps) {
  return (
    <DataTable
      minWidth={600}
      columns={createScheduleColumns({ onDelete })}
      data={data}
      highlightedRowId={highlightedSession}
    />
  );
}
