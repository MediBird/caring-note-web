import type {
  CounselorListItem,
  CounselorListItemRoleTypeEnum,
} from '@/api/models/counselor-list-item';
import { TableCell } from '@/components/common/DataTable/table-cell';
import { COUNSELOR_ROLE_TYPE_MAP } from '@/utils/constants';
import { formatDisplayText } from '@/utils/formatDisplayText';
import { ColumnDef } from '@tanstack/react-table';

export const CreateCounselorColumns = (): ColumnDef<CounselorListItem>[] => [
  {
    id: 'name',
    accessorKey: 'name',
    header: '이름',
    size: 120,
    cell: ({ row }) => {
      const name = row.original.name;
      return <TableCell text={name ?? ''} />;
    },
  },
  {
    id: 'roleType',
    accessorKey: 'roleType',
    header: '권한',
    size: 120,
    cell: ({ row }) => {
      const roleType = row.original.roleType as CounselorListItemRoleTypeEnum;
      const roleInfo = COUNSELOR_ROLE_TYPE_MAP[roleType] || {
        label: '',
        textColor: '',
      };

      return <TableCell text={roleInfo.label} textColor={roleInfo.textColor} />;
    },
  },
  {
    id: 'username',
    accessorKey: 'username',
    header: '사용자 ID',
    size: 150,
    cell: ({ row }) => {
      const username = row.original.username;
      return <TableCell text={formatDisplayText(username)} />;
    },
  },
  {
    id: 'phoneNumber',
    accessorKey: 'phoneNumber',
    header: '연락처',
    size: 150,
    cell: ({ row }) => {
      const phoneNumber = row.original.phoneNumber;
      return <TableCell text={formatDisplayText(phoneNumber)} />;
    },
  },
  {
    id: 'registrationDate',
    accessorKey: 'registrationDate',
    header: '등록일',
    size: 150,
    cell: ({ row }) => {
      const registrationDate = row.original.registrationDate;
      return <TableCell text={formatDisplayText(registrationDate)} />;
    },
  },
  {
    id: 'description',
    accessorKey: 'description',
    header: '비고',
    size: 200,
    cell: ({ row }) => {
      const description = row.original.description;
      return <TableCell text={formatDisplayText(description)} />;
    },
  },
];
