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

import recordingDialog from '@/assets/illusts/recordingDialog.webp';

interface RecordingDialogProps {
  open: boolean;
  onClose: () => void;
  onStartRecording: () => void;
}

function RecordingDialog({
  open,
  onClose,
  onStartRecording,
}: RecordingDialogProps) {
  const handleClickStartRecording = () => {
    onStartRecording();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[480px]">
        <DialogHeader className="mt-4 h-[80px] items-center justify-center">
          <DialogTitle>
            <p className="text-center text-h3 font-bold">
              상담 녹음을 시작하시겠어요?
            </p>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription asChild className="m-0 flex flex-col items-center">
          <div>
            <img
              className="mt-4 h-[240px] w-[240px]"
              src={recordingDialog}
              alt="recordingDialog"
            />
            <p className="text-center text-body1 font-medium text-grayscale-100">
              상담 녹음 시 모든 내용을 텍스트로 확인할 수 있어요.
              <br />
              목소리를 정확하게 인식할 수 있도록 마이크를 가까이 두세요.
            </p>
          </div>
        </DialogDescription>
        <DialogFooter className="m-0 flex w-full items-center justify-center p-5">
          <DialogClose asChild>
            <Button variant="secondary" size="xl" className="m-0 w-1/2 p-0">
              나중에 시작
            </Button>
          </DialogClose>
          <Button
            variant="primary"
            size="xl"
            className="w-1/2"
            onClick={handleClickStartRecording}>
            녹음 시작
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RecordingDialog;
