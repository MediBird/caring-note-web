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
import { useLeaveOutDialogStore } from '@/pages/Consult/hooks/store/useLeaveOutDialogStore';
import { useRecordingStore } from '@/pages/Consult/hooks/store/useRecordingStore';
import { RecordingStatus } from '@/pages/Consult/types/Recording.enum';
import { XIcon } from 'lucide-react';

interface CheckLeaveOutDialogProps {
  onConfirm: () => void;
}

const CheckLeaveOutDialog = ({ onConfirm }: CheckLeaveOutDialogProps) => {
  const recordingStatus = useRecordingStore((state) => state.recordingStatus);
  const { isOpen, closeDialog } = useLeaveOutDialogStore();

  const isRecording =
    recordingStatus !== RecordingStatus.Ready &&
    recordingStatus !== RecordingStatus.STTCompleted &&
    recordingStatus !== RecordingStatus.AICompleted;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={closeDialog}>
        <DialogContent className="min-w-[400px]">
          <DialogHeader className="">
            <DialogTitle>상담 작성이 완료되지 않았어요.</DialogTitle>
            <DialogClose
              asChild
              className="!mt-0 h-6 w-6 cursor-pointer border-none bg-transparent !p-0 text-grayscale-100">
              <XIcon />
            </DialogClose>
          </DialogHeader>
          <div className="h-[1px] bg-grayscale-20" />
          <DialogDescription asChild className="m-0 px-5 pt-2">
            <p className="text-body1 font-medium text-grayscale-100">
              {isRecording ? (
                <>
                  아직 녹음과 상담이 완료되지 않았습니다. <br />
                  지금까지 녹음된 내용만 저장됩니다. <br />
                  수정한 내용을 저장하고 나가시겠어요?
                </>
              ) : (
                <>
                  여기서 나가시겠어요? <br />
                  나중에 이어서 작성을 완료할 수 있어요.
                </>
              )}
            </p>
          </DialogDescription>
          <DialogFooter className="m-0 flex w-full items-center justify-end p-5">
            <DialogClose asChild>
              <Button variant="secondary" size="md" className="!m-0 w-16 !p-0">
                취소
              </Button>
            </DialogClose>
            <Button
              variant="primary"
              size="md"
              className="w-16"
              onClick={onConfirm}>
              나가기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CheckLeaveOutDialog;
