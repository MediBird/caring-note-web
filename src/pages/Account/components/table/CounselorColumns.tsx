import { CounselorListItem, CounselorListItemRoleTypeEnum } from '@/api';
import { TableCell } from '@/components/common/DataTable/table-cell';
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
      const roleType = row.original.roleType;
      let roleText = '';
      let textColor = '';

      switch (roleType) {
        case CounselorListItemRoleTypeEnum.Admin:
          roleText = '관리자';
          textColor = 'text-grayscale-100';
          break;
        case CounselorListItemRoleTypeEnum.User:
          roleText = '상담약사';
          textColor = 'text-grayscale-100';
          break;
        case CounselorListItemRoleTypeEnum.Assistant:
          roleText = '기초상담사';
          textColor = 'text-primary-60';
          break;
        case CounselorListItemRoleTypeEnum.None:
          roleText = '권한미등록';
          textColor = 'text-error-60';
          break;
        default:
          roleText = '';
          break;
      }

      return <TableCell text={roleText} textColor={textColor} />;
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
