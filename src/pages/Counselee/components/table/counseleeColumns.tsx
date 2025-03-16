import { SelectCounseleeRes } from '@/api';
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

export const createCounseleeColumns = ({
  onDelete,
  onEdit,
}: {
  onDelete: (id: string) => void;
  onEdit: (counselee: SelectCounseleeRes) => void;
}): ColumnDef<SelectCounseleeRes>[] => [
  {
    id: 'name',
    accessorKey: 'name',
    header: '이름',
    size: 100,
    cell: ({ row }) => {
      const name = row.original.name;
      return <TableCell text={formatDisplayText(name)} />;
    },
  },
  {
    id: 'disability',
    accessorKey: 'disability',
    header: '장애여부',
    size: 120,
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
      const formattedDate = date
        .toISOString()
        .split('T')[0]
        .replace(
          /^(\d{4})-(\d{2})-(\d{2})$/,
          (_, year, month, day) => `${year.slice(2)}${month}${day}`,
        );
      return <TableCell text={formattedDate} />;
    },
  },
  {
    id: 'phoneNumber',
    accessorKey: 'phoneNumber',
    header: '연락처',
    size: 150,
    cell: ({ row }) => {
      const phoneNumber = row.getValue('phoneNumber') as string;
      return <TableCell text={formatDisplayText(phoneNumber)} />;
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
      return (
        <TableCell text={formatDisplayText(affiliatedWelfareInstitution)} />
      );
    },
  },
  {
    id: 'address',
    accessorKey: 'address',
    header: '행정동',
    size: 100,
    cell: ({ row }) => {
      const address = row.getValue('address') as string;
      return <TableCell text={formatDisplayText(address)} />;
    },
  },
  {
    id: 'careManagerName',
    accessorKey: 'careManagerName',
    header: '생활지원사',
    size: 100,
    cell: ({ row }) => {
      const careManagerName = row.getValue('careManagerName') as string;
      return <TableCell text={formatDisplayText(careManagerName)} />;
    },
  },
  {
    id: 'note',
    accessorKey: 'note',
    header: '비고',
    size: 200,
    cell: ({ row }) => {
      const note = row.getValue('note') as string;
      return <TableCell text={formatDisplayText(note)} />;
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
            <DropdownMenuItem
              onClick={() => {
                onEdit(row.original);
              }}>
              수정하기
            </DropdownMenuItem>
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
    size: 30,
  },
];
