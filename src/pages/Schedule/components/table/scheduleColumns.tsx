import {
  SelectCounselSessionListItem,
  SelectCounselSessionListItemStatusEnum,
} from '@/api/api';
import { TableCell } from '@/components/common/DataTable/table-cell';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';
import { EditReservationDialog } from '../dialog/EditReservationDialog';

export const createScheduleColumns = ({
  onDelete,
  onEdit,
}: {
  onDelete: (id: string) => void;
  onEdit: (session: SelectCounselSessionListItem) => void;
}): ColumnDef<SelectCounselSessionListItem>[] => [
  {
    id: 'counseleeName',
    accessorKey: 'counseleeName',
    header: '내담자',
    size: 100,
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
      const sessionCount = 1;
      return <TableCell text={sessionCount.toString() + '회차'} />;
    },
  },
  {
    id: 'counselorName',
    accessorKey: 'counselorName',
    header: '담당 약사',
    size: 120,
    cell: ({ row }) => {
      const counselorName = row.original.counselorName;
      return <TableCell text={counselorName ?? ''} />;
    },
  },
  {
    id: 'scheduledDate',
    accessorKey: 'scheduledDate',
    header: '상담 일자',
    size: 120,
    cell: ({ row }) => {
      const scheduledDate = row.original.scheduledDate;
      return <TableCell text={scheduledDate ?? ''} />;
    },
  },
  {
    id: 'scheduledTime',
    accessorKey: 'scheduledTime',
    header: '예약 시각',
    size: 100,
    cell: ({ row }) => {
      const scheduledTime = row.original.scheduledTime;
      return <TableCell text={scheduledTime ?? ''} />;
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: '상담 상태',
    size: 120,
    cell: ({ row }) => {
      const status = row.original.status;
      let statusText = '';

      switch (status) {
        case SelectCounselSessionListItemStatusEnum.Scheduled:
          statusText = '예정';
          break;
        case SelectCounselSessionListItemStatusEnum.Progress:
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
              : status === SelectCounselSessionListItemStatusEnum.Progress
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
            <div className="flex justify-center items-center w-full">
              <button className="hover:bg-grayscale-5 text-center content-center rounded-[4px] text-grayscale-60 p-1">
                <Ellipsis className="w-4 h-4" />
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
