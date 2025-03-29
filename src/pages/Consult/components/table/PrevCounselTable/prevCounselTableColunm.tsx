import { PrevCounselSessionListDTO } from '@/pages/Consult/hooks/query/usePrevCounselSessionList';
import { ColumnDef } from '@tanstack/react-table';

export const createColumns = (): ColumnDef<PrevCounselSessionListDTO>[] => {
  return [
    {
      header: '상담횟수',
      accessorKey: 'CounselSessionOrder',
      cell: ({ row }) => {
        return (
          <span className="px-3">{row.original.CounselSessionOrder}회차</span>
        );
      },
    },
    {
      header: '상담일자',
      accessorKey: 'counselSessionDate',
      cell: ({ row }) => {
        return <span className="px-3">{row.original.counselSessionDate}</span>;
      },
    },
    {
      header: '담당약사',
      accessorKey: 'counselorName',
      cell: ({ row }) => {
        return <span className="px-3">{row.original.counselorName}</span>;
      },
    },
    {
      header: '케어링메세지',
      accessorKey: 'isShardCaringMessage',
      cell: ({ row }) => {
        return (
          <span className="px-3">
            {row.original.isShardCaringMessage ? '공유완료' : '공유대기'}
          </span>
        );
      },
    },
  ];
};
