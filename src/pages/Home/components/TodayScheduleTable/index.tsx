import { DataTable } from '@/components/common/DataTable/DataTable';
import { createColumns } from './todayScheduleTableColumn';
import { SelectCounselSessionListItem } from '@/api/api';
import { useNavigate } from 'react-router-dom';

interface TodayScheduleTableProps {
  counselList: SelectCounselSessionListItem[];
}

const TodayScheduleTable = ({ counselList }: TodayScheduleTableProps) => {
  const navigate = useNavigate();

  const columns = createColumns({
    onCellClick: (counselSessionId: string) => {
      navigate(`/consult/${counselSessionId}`);
    },
  });

  return (
    <DataTable
      columns={columns}
      data={counselList}
      sorting={[{ id: 'scheduledDate', desc: false }]}
      SortingFns={{
        scheduledTime: (rowA, rowB, columnId) => {
          const a = rowA.getValue(columnId) as string;
          const b = rowB.getValue(columnId) as string;
          return new Date(a).getTime() - new Date(b).getTime();
        },
      }}
    />
  );
};

export default TodayScheduleTable;
