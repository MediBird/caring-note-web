import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRecording } from '@/hooks/useRecording';
import { useEffect, useState } from 'react';

function RecordingDialog() {
  const { startRecording } = useRecording();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // TODO : 오늘 일정에 상담일정 있음 && 기존 등록된 녹음 없는 경우
    setOpen(true);
  }, []);

  const handleClickLater = () => {
    setOpen(false);
  };

  const handleClickSaveRecording = () => {
    startRecording();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[480px]">
        <DialogHeader className="m-6">
          <DialogTitle>
            <p className="text-h3 font-bold">상담 녹음을 시작하시겠어요?</p>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="flex flex-col items-center m-0">
          <div className="w-[240px] h-[240px] bg-grayscale-10 mb-6" />
          <p className="text-body1 font-medium text-grayscale-100 text-center">
            상담 녹음 시 모든 내용을 빠짐없이 기록 가능합니다. <br />
            목소리를 정확하게 인식할 수 있도록 마이크를 가까이 두세요.
          </p>
        </DialogDescription>
        <DialogFooter className="flex w-full items-center justify-center m-0 p-5">
          {/* 놀랍게도 <DialogClose asChild> 버그로 인해 Button component 를 못가져옴 */}
          {/* <DialogClose asChild> */}
          <Button
            variant="secondary"
            size="xl"
            className="flex-1"
            onClick={handleClickLater}>
            나중에 시작
          </Button>
          {/* </DialogClose> */}
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
