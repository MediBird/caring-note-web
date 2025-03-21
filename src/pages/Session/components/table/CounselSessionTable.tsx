import { SelectCounselSessionRes } from '@/api';
import { DataTable } from '@/components/common/DataTable/data-table';
import { createScheduleColumns } from './CounselSessionColumns';
interface ScheduleTableProps {
  data: SelectCounselSessionRes[];
  onDelete: (id: string) => void;
  highlightedSession: string | null;
  onRowChange?: (id: string) => void;
}

export function CounselSessionTable({
  data,
  onDelete,
  highlightedSession,
  onRowChange,
}: ScheduleTableProps) {
  return (
    <DataTable
      minWidth={600}
      columns={createScheduleColumns({ onDelete })}
      data={data}
      highlightedRowId={highlightedSession}
      onRowClick={
        onRowChange
          ? (row) => onRowChange(row.counselSessionId as string)
          : undefined
      }
    />
  );
}
