import { SelectCounselSessionRes } from '@/api';
import { DataTable } from '@/components/common/DataTable/data-table';
import { useNavigate } from 'react-router-dom';
import { createScheduleColumns } from './CounselSessionColumns';
import { usePDFDownload } from '@/hooks/usePDFDownload';

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
  const { downloadSessionPDF } = usePDFDownload();

  const onRowClick = (row: SelectCounselSessionRes) => {
    if (row.counselSessionId) {
      navigate(`/consult/${row.counselSessionId}`);
    }
  };

  const handleDownloadPDF = (session: SelectCounselSessionRes) => {
    downloadSessionPDF(session);
  };

  return (
    <DataTable
      minWidth={600}
      columns={createScheduleColumns({
        onDelete,
        onDownloadPDF: handleDownloadPDF,
      })}
      data={data}
      highlightedRowId={highlightedSession}
      onRowClick={onRowClick}
    />
  );
}
