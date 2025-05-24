import { SelectCounseleeRes } from '@/api';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Row } from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';
import { useState } from 'react';
import { DeleteCounseleeDialog } from '../dialog/DeleteCounseleeDialog';
import { UpdateCounseleeDialog } from '../dialog/UpdateCounseleeDialog';
import { useDeleteCounseleeInfo } from '../../hooks/query/useCounseleeQuery';

// CounseleeActionsCell 컴포넌트 정의
interface CounseleeActionsCellProps {
  row: Row<SelectCounseleeRes>;
}

const CounseleeActionsCell = ({ row }: CounseleeActionsCellProps) => {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const counselee = row.original;

  const { mutate: deleteCounselee } = useDeleteCounseleeInfo();

  const handleDelete = () => {
    if (counselee.id) {
      deleteCounselee([{ counseleeId: counselee.id }]);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex w-full items-center justify-center">
            <button className="content-center rounded-[4px] p-1 text-center text-grayscale-60 hover:bg-grayscale-5">
              <Ellipsis className="h-4 w-4" />
            </button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="text-body1 font-medium text-grayscale-100">
          <DropdownMenuItem onClick={() => setIsUpdateDialogOpen(true)}>
            수정하기
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
            삭제하기
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {isUpdateDialogOpen && (
        <UpdateCounseleeDialog
          counselee={counselee}
          open={isUpdateDialogOpen}
          onOpenChange={setIsUpdateDialogOpen}
        />
      )}
      {isDeleteDialogOpen && (
        <DeleteCounseleeDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDelete}
          itemName={counselee.name + '님'}
        />
      )}
    </>
  );
};

export default CounseleeActionsCell;
