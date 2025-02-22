import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/common/DataTable/DataTable';
import { SelectCounseleeRes } from '@/api/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Ellipsis } from 'lucide-react';

const TableCell = ({ text }: { text: string }) => (
  <div className="text-body-2 font-medium text-grayscale-90 ml-3">{text}</div>
);
export const createColumns = ({
  onDelete,
}: {
  onDelete: (id: string) => void;
}): ColumnDef<SelectCounseleeRes>[] => [
  {
    id: 'name',
    accessorKey: 'name',
    header: '이름',
    size: 100,
    cell: ({ row }) => {
      const name = row.original.name;
      return <TableCell text={name ?? ''} />;
    },
  },
  {
    id: 'disability',
    accessorKey: 'disability',
    header: '장애여부',
    size: 100,
    cell: ({ row }) => {
      const disability = row.getValue('disability');
      return <TableCell text={disability ? '있음' : '없음'} />;
    },
  },
  {
    id: 'dateOfBirth',
    accessorKey: 'dateOfBirth',
    header: '생년월일',
    size: 120,
    cell: ({ row }) => {
      const date = new Date(row.getValue('dateOfBirth'));
      return <TableCell text={date.toISOString().split('T')[0]} />;
    },
  },
  {
    id: 'phoneNumber',
    accessorKey: 'phoneNumber',
    header: '연락처',
    size: 150,
    cell: ({ row }) => {
      const phoneNumber = row.getValue('phoneNumber') as string;
      return <TableCell text={phoneNumber ?? ''} />;
    },
  },
  {
    id: 'affiliatedWelfareInstitution',
    accessorKey: 'affiliatedWelfareInstitution',
    header: '연계 기관',
    size: 150,
    cell: ({ row }) => {
      const affiliatedWelfareInstitution = row.getValue(
        'affiliatedWelfareInstitution',
      ) as string;
      return <TableCell text={affiliatedWelfareInstitution ?? ''} />;
    },
  },
  {
    id: 'address',
    accessorKey: 'address',
    header: '행정동',
    size: 100,
    cell: ({ row }) => {
      const address = row.getValue('address') as string;
      return <TableCell text={address ?? ''} />;
    },
  },
  {
    id: 'careManagerName',
    accessorKey: 'careManagerName',
    header: '생활지원사',
    size: 100,
    cell: ({ row }) => {
      const careManagerName = row.getValue('careManagerName') as string;
      return <TableCell text={careManagerName ?? ''} />;
    },
  },
  {
    id: 'note',
    accessorKey: 'note',
    header: '비고',
    size: 250,
    cell: ({ row }) => {
      const note = row.getValue('note') as string;
      return <TableCell text={note ?? ''} />;
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
                onDelete(row.original.id as string);
              }}>
              삭제하기
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 20,
  },
];

interface CounseleeTableProps {
  data: SelectCounseleeRes[];
  onDelete: (id: string) => void;
}

export function CounseleeTable({ data, onDelete }: CounseleeTableProps) {
  return <DataTable columns={createColumns({ onDelete })} data={data} />;
}
