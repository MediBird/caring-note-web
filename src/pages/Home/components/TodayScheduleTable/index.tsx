import {
  GetCounselorResRoleTypeEnum,
  SelectCounselSessionListItem,
} from '@/api';
import { DataTable } from '@/components/common/DataTable/data-table';
import { useNavigate } from 'react-router-dom';
import { createColumns } from './todayScheduleTableColumn';

interface TodayScheduleTableProps {
  counselList: SelectCounselSessionListItem[];
  userType: GetCounselorResRoleTypeEnum;
}

const TodayScheduleTable = ({
  counselList,
  userType,
}: TodayScheduleTableProps) => {
  const navigate = useNavigate();

  const columns = createColumns({
    onCellClick: (counselSessionId: string) => {
      navigate(`/consult/${counselSessionId}`);
    },
    userType: userType,
  });

  return (
    <DataTable
      minWidth={600}
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
