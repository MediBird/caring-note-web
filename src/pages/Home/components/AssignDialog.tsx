/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogFooter,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { XIcon } from 'lucide-react';

interface AssignDialogProps {
  counselSessionId: string;
  counselorId: string;
  title: string;
  description: string;
}

// TODO: counselorId 활용 상담 담당 약사 할당 다이얼로그 구현 필요

function AssignDialog({
  counselSessionId,
  counselorId,
  title,
  description,
}: AssignDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="secondary">
          할당 완료
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md ">
        <DialogHeader className="flex justify-between items-center pb-2">
          <DialogTitle className="pb-0">{title}</DialogTitle>
          <DialogClose
            asChild
            className="cursor-pointer border-none bg-transparent text-grayscale-100 !mt-0 !p-0 w-6 h-6 ">
            <XIcon />
          </DialogClose>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogDescription>
            상담 담당 약사를 할당하여 상담을 진행해주세요.
          </DialogDescription>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AssignDialog;
