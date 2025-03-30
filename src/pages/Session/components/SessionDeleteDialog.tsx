import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { XIcon } from 'lucide-react';

const SessionDeleteDialog = ({
  onDelete,
  id,
  triggerComponent,
}: {
  onDelete: (id: string) => void;
  id: string;
  triggerComponent: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerComponent}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle>상담내역을 정말 삭제하시겠습니까?</DialogTitle>
          <DialogClose
            asChild
            className="absolute right-5 top-5 !mt-0 h-6 w-6 cursor-pointer border-none bg-transparent !p-0 text-grayscale-100">
            <XIcon />
          </DialogClose>
        </DialogHeader>
        <div className="h-[1px] bg-grayscale-20" />
        <DialogDescription>
          삭제된 상담내역은 복구할 수 없습니다.
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={() => onDelete(id)}>
            취소
          </Button>
          <Button variant="primary" onClick={() => onDelete(id)}>
            삭제하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionDeleteDialog;
