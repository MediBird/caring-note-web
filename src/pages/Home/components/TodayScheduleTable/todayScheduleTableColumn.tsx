import {
  CounselCardBaseInformationResCardRecordStatusEnum,
  GetCounselorResRoleTypeEnum,
  SelectCounselSessionListItem,
  SelectCounselSessionListItemStatusEnum,
} from '@/api';
import CounselStatusCell from '@/components/common/DataTable/counsel-status-cell';
import Tooltip from '@/components/common/Tooltip';
import AssignDialog from '@/pages/Home/components/AssignDialog';
import SurveyDialog from '@/pages/Home/components/SurveyDialog';
import { formatDisplayText } from '@/utils/formatDisplayText';
import { ColumnDef } from '@tanstack/react-table';

interface TodayScheduleTableColumnProps {
  onCellClick: (counselSessionId: string) => void;
  userType?: GetCounselorResRoleTypeEnum;
}

export const createColumns = ({
  onCellClick,
  userType = GetCounselorResRoleTypeEnum.None,
}: TodayScheduleTableColumnProps): ColumnDef<SelectCounselSessionListItem>[] => {
  const allColumns: ColumnDef<SelectCounselSessionListItem>[] = [
    {
      id: 'scheduledTime',
      accessorKey: 'scheduledTime',
      header: '예약 시각',
      size: 92,
      cell: ({ row }) => {
        const counselSessionId = row.original.counselSessionId;
        return (
          <span
            className="inline-block h-full cursor-pointer content-center px-3"
            onClick={() => {
              onCellClick(counselSessionId ?? '');
            }}>
            {row.original.scheduledTime}
          </span>
        );
      },
    },
    {
      id: 'scheduledDate',
      accessorKey: 'scheduledDate',
      header: '상담 일자',
      enableSorting: true,
      size: 124,
      cell: ({ row }) => {
        const scheduledDate = row.original.scheduledDate ?? '-';
        return (
          <span className="w-full min-w-[145px] px-3">{scheduledDate}</span>
        );
      },
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: '상담 진행',
      size: 92,
      cell: ({ row }) => {
        const status = row.original.status ?? '-';
        return (
          <CounselStatusCell
            status={status as SelectCounselSessionListItemStatusEnum}
          />
        );
      },
    },
    {
      id: 'counseleeName',
      accessorKey: 'counseleeName',
      header: '내담자',
      size: 102,
      cell: ({ row }) => {
        const counseleeName = row.original.counseleeName ?? '-';
        return <span className="px-3">{counseleeName}</span>;
      },
    },
    {
      id: 'counselorName',
      accessorKey: 'counselorName',
      header: '담당약사',
      size: 102,
      cell: ({ row }) => {
        const counselorName = formatDisplayText(row.original.counselorName);
        return <span className="px-3">{counselorName}</span>;
      },
    },
    {
      id: 'counselorAssign',
      accessorKey: 'counselorAssign',
      size: 116,
      header: () => {
        return (
          <div className="relative flex items-center gap-1">
            상담 할당
            <Tooltip
              className="text-grayscale-40"
              id="counselorAssign"
              text="'나에게 할당' 버튼 클릭 시 담당 약사로 지정됩니다."
              place="top"
              eventType="hover"
            />
          </div>
        );
      },
      cell: ({ row }) => {
        const counselSessionId = row.original.counselSessionId ?? '';
        const counselorId = row.original.counselorId ?? '';
        return (
          <div className="px-3">
            <AssignDialog
              counselSessionId={counselSessionId}
              counselorId={counselorId}
            />
          </div>
        );
      },
    },
    {
      id: 'cardRecordStatus',
      accessorKey: 'cardRecordStatus',
      header: '기초 설문',
      size: 116,
      cell: ({ row }) => {
        const counselSessionId = row.original.counselSessionId ?? '';
        const counseleeId = row.original.counseleeId ?? '';
        const dialogState = row.original.cardRecordStatus ?? '';
        return (
          <div className="px-3">
            <SurveyDialog
              counselSessionId={counselSessionId}
              counseleeId={counseleeId}
              dialogState={
                dialogState as CounselCardBaseInformationResCardRecordStatusEnum
              }
            />
          </div>
        );
      },
    },
  ];

  return filterColumnsByUserType(allColumns, userType);
};

const filterColumnsByUserType = (
  columns: ColumnDef<SelectCounselSessionListItem>[],
  userType: GetCounselorResRoleTypeEnum,
): ColumnDef<SelectCounselSessionListItem>[] => {
  if (userType === GetCounselorResRoleTypeEnum.Admin) {
    return columns;
  } else if (userType === GetCounselorResRoleTypeEnum.Assistant) {
    return columns.filter(
      (column) =>
        column.id !== 'counselorAssign' && column.id !== 'counselorName',
    );
  } else if (userType === GetCounselorResRoleTypeEnum.User) {
    return columns.filter((column) => column.id !== 'cardRecordStatus');
  }

  return [];
};
