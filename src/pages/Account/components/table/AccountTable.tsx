import type { CounselorListItem } from '@/api/models/counselor-list-item';
import { DataTable } from '@/components/common/DataTable/data-table';
import { useState } from 'react';
import { AccountDetailDialog } from '../dialog/AccountDetailDialog';
import { CreateCounselorColumns } from './CounselorColumns';

interface AccountTableProps {
  data: CounselorListItem[];
}

export function AccountTable({ data }: AccountTableProps) {
  // 다이얼로그 열림/닫힘 상태 관리
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // 선택된 상담사 정보 저장
  const [selectedCounselor, setSelectedCounselor] =
    useState<CounselorListItem | null>(null);

  // 행 클릭 핸들러
  const handleRowClick = (counselor: CounselorListItem) => {
    setSelectedCounselor(counselor);
    setIsDialogOpen(true);
  };

  return (
    <>
      <DataTable
        minWidth={600}
        columns={CreateCounselorColumns()}
        data={data}
        onRowClick={handleRowClick}
      />

      <AccountDetailDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        counselor={selectedCounselor}
      />
    </>
  );
}
