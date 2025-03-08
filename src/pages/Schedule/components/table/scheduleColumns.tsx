import {
  SelectCounselSessionListItem,
  SelectCounselSessionListItemStatusEnum,
} from '@/api/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableCell } from '@/components/ui/table-cell';
import { ColumnDef } from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';

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
    id: 'counselSessionId',
    accessorKey: 'counselSessionId',
    header: '상담 회차',
    size: 100,
    cell: ({ row }) => {
      const counselSessionId = row.original.counselSessionId;
      return <TableCell text={counselSessionId ?? ''} />;
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
          statusText = '예약됨';
          break;
        case SelectCounselSessionListItemStatusEnum.Progress:
          statusText = '진행 중';
          break;
        case SelectCounselSessionListItemStatusEnum.Completed:
          statusText = '완료됨';
          break;
        case SelectCounselSessionListItemStatusEnum.Canceled:
          statusText = '취소됨';
          break;
        default:
          statusText = '';
      }

      return <TableCell text={statusText} />;
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
            <DropdownMenuItem
              onClick={() => {
                onEdit(row.original);
              }}>
              수정하기
            </DropdownMenuItem>
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
