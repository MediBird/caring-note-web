import { Button } from '@/components/ui/button';
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
import { XIcon } from 'lucide-react';
import { useState } from 'react';

function DeleteRecordingDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'secondary'}>삭제</Button>
      </DialogTrigger>
      <DialogContent className="min-w-[400px]">
        <DialogHeader>
          <DialogTitle>음성 녹음을 삭제하시겠어요?</DialogTitle>
          <DialogClose
            asChild
            className="!mt-0 h-6 w-6 cursor-pointer border-none bg-transparent !p-0 text-grayscale-100">
            <XIcon />
          </DialogClose>
        </DialogHeader>
        <div className="h-[1px] bg-grayscale-20" />
        <DialogDescription className="sm:justify-start">
          지금까지 기록된 녹음이 삭제됩니다
        </DialogDescription>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <>
              <Button variant="secondaryError" onClick={() => setOpen(false)}>
                취소
              </Button>
            </>
          </DialogClose>
          <Button variant="primaryError" onClick={() => setOpen(false)}>
            삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteRecordingDialog;
