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
import { useRecording } from '@/hooks/useRecording';
import { useState } from 'react';

import recordingDialog from '@/assets/recording/recordingDialog.webp';

function RecordingDialog() {
  const { startRecording } = useRecording();
  const [open, setOpen] = useState(true);

  const setDialogClosed = () => {
    sessionStorage.setItem('isRecordingDialogClosed', 'true');
  };

  const handleClickSaveRecording = () => {
    setDialogClosed();
    startRecording();
    setOpen(false);
  };

  const handleCloseDialog = () => {
    setDialogClosed();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent className="w-[480px]">
        <DialogHeader className="mt-4 items-center justify-center">
          <DialogTitle>
            <p className="center text-h3 font-bold">
              상담 녹음을 시작하시겠어요?
            </p>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription asChild className="m-0 flex flex-col items-center">
          <div>
            <img
              className="mb-4 h-[240px] w-[240px]"
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
            onClick={handleClickSaveRecording}>
            녹음 시작
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RecordingDialog;
