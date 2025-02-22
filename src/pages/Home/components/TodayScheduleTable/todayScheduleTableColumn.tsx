import AssignDialog from '@/pages/Home/components/AssignDialog';
import SurveyDialog from '@/pages/Home/components/SurveyDialog';
import {
  AddCounselCardReqCardRecordStatusEnum,
  AddCounselSessionReqStatusEnum,
  SelectCounselSessionListItem,
} from '@/api/api';
import { ColumnDef } from '@tanstack/react-table';
import Tooltip from '@/components/Tooltip';
import CounselStatusCell from '@/components/common/DataTable/counsel-status-cell';

interface TodayScheduleTableColumnProps {
  onCellClick: (counselSessionId: string) => void;
}

export const createColumns = ({
  onCellClick,
}: TodayScheduleTableColumnProps): ColumnDef<SelectCounselSessionListItem>[] => [
  {
    id: 'scheduledTime',
    accessorKey: 'scheduledTime',
    header: '예약 시각',
    cell: ({ row }) => {
      const counselSessionId = row.original.counselSessionId;
      return (
        <span
          className="cursor-pointer w-full h-full inline-block content-center px-3"
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
    cell: ({ row }) => {
      const scheduledDate = row.original.scheduledDate ?? '-';
      return <span className="px-3">{scheduledDate}</span>;
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: '상담 진행',
    cell: ({ row }) => {
      const status = row.original.status ?? '-';
      return (
        <CounselStatusCell status={status as AddCounselSessionReqStatusEnum} />
      );
    },
  },
  {
    id: 'counseleeName',
    accessorKey: 'counseleeName',
    header: '내담자',
    cell: ({ row }) => {
      const counseleeName = row.original.counseleeName ?? '-';
      return <span className="px-3">{counseleeName}</span>;
    },
  },
  {
    id: 'counselorName',
    accessorKey: 'counselorName',
    header: '담당약사',
    cell: ({ row }) => {
      const counselorName = row.original.counselorName ?? '-';
      return <span className="px-3">{counselorName}</span>;
    },
  },
  {
    id: 'counselorAssign',
    accessorKey: 'counselorAssign',
    header: () => {
      return (
        <div className="flex items-center gap-1 relative">
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
    cell: ({ row }) => {
      const counselSessionId = row.original.counselSessionId ?? '';
      const counseleeId = row.original.counseleeId ?? '';
      const dialogState = row.original.cardRecordStatus ?? '';
      return (
        <div className="px-3">
          <SurveyDialog
            counselSessionId={counselSessionId}
            counseleeId={counseleeId}
            dialogState={dialogState as AddCounselCardReqCardRecordStatusEnum}
          />
        </div>
      );
    },
  },
];
