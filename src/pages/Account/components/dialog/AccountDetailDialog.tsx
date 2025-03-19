import { CounselorListItem, UpdateCounselorReq } from '@/api';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { COUNSELOR_ROLE_TYPE_MAP } from '@/utils/constants';
import { XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  useDeleteCounselor,
  useUpdateCounselor,
} from '../../hooks/queries/useCounselorQuery';
import BasicInfoTab from './BasicInfoTab';
import PasswordChangeTab from './PasswordChangeTab';
import { InfoToast } from '@/components/ui/costom-toast';

interface AccountDetailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  counselor: CounselorListItem | null;
}

export function AccountDetailDialog({
  isOpen,
  onOpenChange,
  counselor,
}: AccountDetailDialogProps) {
  const [editedCounselor, setEditedCounselor] =
    useState<CounselorListItem | null>(counselor);
  const updateCounselorMutation = useUpdateCounselor();
  const deleteCounselorMutation = useDeleteCounselor();

  // counselor가 변경될 때마다 editedCounselor 상태 업데이트
  useEffect(() => {
    if (counselor) {
      setEditedCounselor(counselor);
    }
  }, [counselor]);

  const handleSave = () => {
    if (!editedCounselor) return;

    // roleType이 COUNSELOR_ROLE_TYPE_MAP에 존재하는지 확인
    if (
      editedCounselor.roleType &&
      !COUNSELOR_ROLE_TYPE_MAP[editedCounselor.roleType]
    ) {
      console.warn(`Invalid role type: ${editedCounselor.roleType}`);
    }

    const updateData: UpdateCounselorReq = {
      roleType: editedCounselor.roleType,
      phoneNumber: editedCounselor.phoneNumber,
      description: editedCounselor.description,
    };

    updateCounselorMutation.mutate(
      {
        counselorId: editedCounselor.id || '',
        updateCounselorReq: updateData,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          InfoToast({ message: '계정 정보가 수정되었습니다.' });
        },
      },
    );
  };

  const handleDelete = () => {
    if (!editedCounselor) return;

    deleteCounselorMutation.mutate(editedCounselor.id || '', {
      onSuccess: () => {
        onOpenChange(false);
        InfoToast({ message: '계정 정보가 삭제되었습니다.' });
      },
    });
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="w-full max-w-[504px]">
        <DialogHeader>
          <DialogTitle>계정 정보</DialogTitle>
          <DialogClose
            asChild
            className="!mt-0 h-6 w-6 cursor-pointer border-none bg-transparent !p-0 text-grayscale-100">
            <XIcon />
          </DialogClose>
        </DialogHeader>
        <div className="h-[1px] bg-grayscale-20" />

        {editedCounselor ? (
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="mb-5 flex h-10 w-full justify-start gap-5 px-5">
              <TabsTrigger className="w-fit" value="basic">
                기본 정보
              </TabsTrigger>
              <TabsTrigger className="w-fit" value="password">
                비밀번호 변경
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <BasicInfoTab
                editedCounselor={editedCounselor}
                setEditedCounselor={setEditedCounselor}
                handleSave={handleSave}
                handleDelete={handleDelete}
                handleClose={handleClose}
                isPendingUpdate={updateCounselorMutation.isPending}
                isPendingDelete={deleteCounselorMutation.isPending}
              />
            </TabsContent>

            <TabsContent value="password">
              <PasswordChangeTab
                counselorId={editedCounselor.id || ''}
                onClose={handleClose}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="p-6 text-center">
            데이터를 불러오는 중이거나 선택된 계정 정보가 없습니다.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
export default AccountDetailDialog;
