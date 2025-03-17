import {
  SelectCounselSessionListItemStatusEnum,
  SelectCounselSessionRes,
} from '@/api';
import { TableCell } from '@/components/common/DataTable/table-cell';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDisplayText } from '@/utils/formatDisplayText';
import { ColumnDef } from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';
import { EditReservationDialog } from '../dialog/EditReservationDialog';

export const createScheduleColumns = ({
  onDelete,
}: {
  onDelete: (id: string) => void;
}): ColumnDef<SelectCounselSessionRes>[] => [
  {
    id: 'counseleeName',
    accessorKey: 'counseleeName',
    header: '내담자',
    size: 150,
    cell: ({ row }) => {
      const counseleeName = row.original.counseleeName;
      return <TableCell text={counseleeName ?? ''} />;
    },
  },
  {
    id: 'sessionCount',
    accessorKey: 'sessionCount',
    header: '상담 회차',
    size: 100,
    cell: ({ row }) => {
      const sessionCount = row.original.sessionNumber;
      return <TableCell text={sessionCount?.toString() + '회차'} />;
    },
  },
  {
    id: 'counselorName',
    accessorKey: 'counselorName',
    header: '담당 약사',
    size: 150,
    cell: ({ row }) => {
      const counselorName = row.original.counselorName;
      return <TableCell text={formatDisplayText(counselorName)} />;
    },
  },
  {
    id: 'scheduledDate',
    accessorKey: 'scheduledDate',
    header: '상담 일자',
    size: 150,
    cell: ({ row }) => {
      const scheduledDate = row.original.scheduledDate;
      return <TableCell text={scheduledDate ?? ''} />;
    },
  },
  {
    id: 'scheduledTime',
    accessorKey: 'scheduledTime',
    header: '예약 시각',
    size: 150,
    cell: ({ row }) => {
      const scheduledTime = row.original.scheduledTime;
      return <TableCell text={scheduledTime ?? ''} />;
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: '상담 상태',
    size: 150,
    cell: ({ row }) => {
      const status = row.original.status;
      let statusText = '';

      switch (status) {
        case SelectCounselSessionListItemStatusEnum.Scheduled:
          statusText = '예정';
          break;
        case SelectCounselSessionListItemStatusEnum.InProgress:
          statusText = '진행';
          break;
        case SelectCounselSessionListItemStatusEnum.Completed:
          statusText = '완료';
          break;
        case SelectCounselSessionListItemStatusEnum.Canceled:
          statusText = '취소';
          break;
        default:
          statusText = '';
      }

      return (
        <TableCell
          text={statusText}
          textColor={`${
            status === SelectCounselSessionListItemStatusEnum.Scheduled
              ? 'text-grayscale-50'
              : status === SelectCounselSessionListItemStatusEnum.InProgress
                ? 'text-primary-50'
                : status === SelectCounselSessionListItemStatusEnum.Completed
                  ? 'text-grayscale-100'
                  : 'text-error-50'
          }`}
        />
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex w-full items-center justify-center">
              <button className="content-center rounded-[4px] p-1 text-center text-grayscale-60 hover:bg-grayscale-5">
                <Ellipsis className="h-4 w-4" />
              </button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <EditReservationDialog
              session={row.original}
              triggerComponent={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  수정하기
                </DropdownMenuItem>
              }
            />
            <DropdownMenuItem
              onClick={() => {
                onDelete(row.original.counselSessionId as string);
              }}>
              삭제하기
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 30,
  },
];