import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';

interface DeleteCounseleeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  itemName?: string; // 삭제 대상의 이름을 표시하기 위한 옵셔널 prop
}

export const DeleteCounseleeDialog = ({
  open,
  onOpenChange,
  onConfirm,
  itemName = '상담 내역',
}: DeleteCounseleeDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="pt-5">
        <DialogHeader className="flex h-full items-center justify-between pt-0">
          <DialogTitle className="flex items-center justify-between pt-0">
            {itemName}을 정말 삭제하시겠습니까?
          </DialogTitle>
          <DialogClose
            asChild
            className="!mt-0 h-6 w-6 cursor-pointer border-none bg-transparent !p-0 text-grayscale-100">
            <XIcon />
          </DialogClose>
        </DialogHeader>
        <div className="h-[1px] bg-grayscale-20" />
        <DialogDescription>
          삭제된 데이터는 복구하기 어렵습니다.
        </DialogDescription>
        <DialogFooter className="mt-4 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="secondary">취소</Button>
          </DialogClose>
          <Button
            variant="primary"
            onClick={() => {
              onConfirm();
              onOpenChange(false); // 성공 시 다이얼로그 닫기
            }}>
            삭제하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
