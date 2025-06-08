import {
  GetCounselorResRoleTypeEnum,
  SelectCounselSessionListItem,
} from '@/api';
import { DataTable } from '@/components/common/DataTable/data-table';
import tableEmpty from '@/assets/home/table-empty.webp';
import { useAuthContext } from '@/context/AuthContext';
import { useSelectCounselSessionList } from '@/hooks/useCounselSessionListQuery';
import { useHomeDateStore } from '@/pages/Home/hooks/useHomeDateStore';
import { formatDateToHyphen } from '@/utils/formatDateToHyphen';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { createColumns } from './todayScheduleTableColumn';

function TodayScheduleTable() {
  const { user } = useAuthContext();
  const { selectedDate } = useHomeDateStore();
  const navigate = useNavigate();

  const { data: counselList, isLoading: isCounselListLoading } =
    useSelectCounselSessionList({
      baseDate: formatDateToHyphen(selectedDate),
      page: 0,
      size: 100,
    });

  const formattedCounselList: SelectCounselSessionListItem[] | undefined =
    useMemo(() => {
      return counselList?.content?.map((item: SelectCounselSessionListItem) => {
        return {
          ...item,
          id: item.counselSessionId as string,
        };
      });
    }, [counselList]);

  const columns = createColumns({
    userType: user?.roleType as GetCounselorResRoleTypeEnum,
    onCellClick: (counselSessionId: string) => {
      navigate(`/consult/${counselSessionId}`);
    },
  });

  if (isCounselListLoading) {
    return null;
  }

  if (!formattedCounselList || formattedCounselList.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <img src={tableEmpty} alt="table-empty" />
        <span className="text-2xl font-bold">
          오늘은 예정된 상담 일정이 없어요
        </span>
        <span className="text-base text-gray-500">
          상담 내역에서 이전 상담 기록을 볼 수 있습니다
        </span>
      </div>
    );
  }

  return (
    <DataTable
      minWidth={600}
      columns={columns}
      data={formattedCounselList}
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
}

export default TodayScheduleTable;
