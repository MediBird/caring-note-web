import { SelectCounselSessionRes } from '@/api';
import { DataTable } from '@/components/common/DataTable/data-table';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const onRowClick = (row: SelectCounselSessionRes) => {
    if (row.counselSessionId) {
      navigate(`/consult/${row.counselSessionId}`);
    }
  };
  return (
    <DataTable
      minWidth={600}
      columns={createScheduleColumns({ onDelete })}
      data={data}
      highlightedRowId={highlightedSession}
      onRowClick={onRowClick}
    />
  );
}
