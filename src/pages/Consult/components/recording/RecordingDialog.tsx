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

import recordingDialog from '@/assets/recordingDialog.png';

function RecordingDialog() {
  const { startRecording } = useRecording();
  const [open, setOpen] = useState(true);

  const handleClickSaveRecording = () => {
    startRecording();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[480px]">
        <DialogHeader className="mt-4 items-center justify-center">
          <DialogTitle>
            <p className="text-h3 font-bold center">
              상담 녹음을 시작하시겠어요?
            </p>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription asChild className="flex flex-col items-center m-0">
          <div>
            <img
              className="mb-4 w-[240px] h-[240px]"
              src={recordingDialog}
              alt="recordingDialog"
            />
            <p className="font-medium text-center text-body1 text-grayscale-100">
              상담 녹음 시 모든 내용을 텍스트로 확인할 수 있어요.
              <br />
              목소리를 정확하게 인식할 수 있도록 마이크를 가까이 두세요.
            </p>
          </div>
        </DialogDescription>
        <DialogFooter className="flex w-full items-center justify-center m-0 p-5">
          <DialogClose asChild>
            <Button variant="secondary" size="xl" className="flex-1 m-0 p-0">
              나중에 시작
            </Button>
          </DialogClose>
          <Button
            variant="primary"
            size="xl"
            className="flex-1"
            onClick={handleClickSaveRecording}>
            녹음 시작
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default RecordingDialog;
