import { PrevCounselSessionListDTO } from '@/pages/Consult/hooks/query/usePrevCounselSessionList';
import { ColumnDef } from '@tanstack/react-table';

export const createColumns = (): ColumnDef<PrevCounselSessionListDTO>[] => {
  return [
    {
      header: '상담횟수',
      accessorKey: 'CounselSessionOrder',
      cell: ({ row }) => {
        return `${row.original.CounselSessionOrder}회차`;
      },
    },
    {
      header: '상담일자',
      accessorKey: 'counselSessionDate',
    },
    {
      header: '담당약사',
      accessorKey: 'counselorName',
    },
    {
      header: '케어링메세지',
      accessorKey: 'isShardCaringMessage',
      cell: ({ row }) => {
        return row.original.isShardCaringMessage ? '공유완료' : '공유대기';
      },
    },
  ];
};
