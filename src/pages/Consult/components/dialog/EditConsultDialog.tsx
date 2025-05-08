import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { XIcon } from 'lucide-react';
import { useState } from 'react';

interface EditConsultDialogProps {
  onEdit: () => void;
}

function EditConsultDialog({ onEdit }: EditConsultDialogProps) {
  const [open, setOpen] = useState(false);

  const handleClickConfirm = () => {
    onEdit();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={'primary'} size={'xl'}>
          수정 완료
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[400px]">
        <DialogHeader className="">
          <DialogTitle>수정하시겠어요?</DialogTitle>
          <DialogClose
            asChild
            className="!mt-0 h-6 w-6 cursor-pointer border-none bg-transparent !p-0 text-grayscale-100">
            <XIcon />
          </DialogClose>
        </DialogHeader>
        <div className="h-[1px] bg-grayscale-20" />
        <DialogDescription asChild className="m-0 px-5 pt-2">
          <p className="text-body1 font-medium text-grayscale-100">
            수정하신 내용으로 교체되어 저장됩니다.
          </p>
        </DialogDescription>
        <DialogFooter className="m-0 flex w-full items-center justify-end p-5">
          <DialogClose asChild>
            <Button variant="secondary" size="md" className="px-2">
              취소
            </Button>
          </DialogClose>
          <Button
            variant="primary"
            size="md"
            onClick={handleClickConfirm}
            className="border-2">
            완료
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default EditConsultDialog;
