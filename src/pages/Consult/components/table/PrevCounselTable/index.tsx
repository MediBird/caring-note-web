import { DataTable } from '@/components/common/DataTable/data-table';
import { createColumns } from '@/pages/Consult/components/table/PrevCounselTable/prevCounselTableColunm';
import { usePrevCounselSessionList } from '@/pages/Consult/hooks/query/usePrevCounselSessionList';
import { useParams } from 'react-router-dom';

function PrevCounselTable() {
  const { counselSessionId } = useParams();

  const { prevCounselSessionList, isLoading } = usePrevCounselSessionList(
    counselSessionId ?? '',
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const columns = createColumns();

  return <DataTable columns={columns} data={prevCounselSessionList} />;
}

export default PrevCounselTable;
