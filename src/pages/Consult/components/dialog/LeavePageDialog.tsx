import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { XIcon } from 'lucide-react';

interface LeavePageDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isRecording?: boolean;
  hasUnsavedChanges?: boolean;
}

const LeavePageDialog: React.FC<LeavePageDialogProps> = ({
  open,
  onClose,
  onConfirm,
  isRecording = false,
  hasUnsavedChanges = false,
}) => {
  const getDialogContent = () => {
    if (isRecording) {
      return {
        title: '녹음이 진행 중입니다',
        description: (
          <>
            현재 녹음이 진행 중입니다. 페이지를 나가면 녹음이 중단되고 저장되지
            않을 수 있습니다.
            <br />
            정말 나가시겠어요?
          </>
        ),
        confirmText: '녹음 중단하고 나가기',
        confirmVariant: 'primaryError' as const,
      };
    }

    if (hasUnsavedChanges) {
      return {
        title: '상담 작성이 완료되지 않았어요',
        description: (
          <>
            여기서 나가시겠어요?
            <br />
            나중에 이어서 작성을 완료할 수 있어요.
          </>
        ),
        confirmText: '나가기',
        confirmVariant: 'primary' as const,
      };
    }

    return {
      title: '페이지를 나가시겠어요?',
      description: '변경사항이 저장되지 않을 수 있습니다.',
      confirmText: '나가기',
      confirmVariant: 'secondary' as const,
    };
  };

  const content = getDialogContent();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{content.title}</DialogTitle>
          <DialogClose
            asChild
            className="!mt-0 h-6 w-6 cursor-pointer border-none bg-transparent !p-0 text-grayscale-100">
            <XIcon />
          </DialogClose>
        </DialogHeader>
        <div className="h-[1px] bg-grayscale-20" />
        <DialogDescription className="sm:justify-start">
          {content.description}
        </DialogDescription>
        <DialogFooter className="sm:justify-end">
          <div className="flex items-center gap-2">
            <DialogClose asChild>
              <Button variant={isRecording ? 'secondaryError' : 'secondary'}>
                취소
              </Button>
            </DialogClose>
            <Button variant={content.confirmVariant} onClick={onConfirm}>
              {content.confirmText}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeavePageDialog;
