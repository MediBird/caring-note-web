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
import { useRecording } from '@/hooks/useRecording';
import { RecordingStatus } from '@/pages/Consult/types/Recording.enum';
import { XIcon } from 'lucide-react';
import { useState } from 'react';

interface TemporarySaveDialogProps {
  onSave: () => void;
}

const TemporarySaveDialog = ({ onSave }: TemporarySaveDialogProps) => {
  const [open, setOpen] = useState(false);
  const { recordingStatus } = useRecording();

  const handleClickConfirm = () => {
    onSave();
    setOpen(false);
  };

  return (
    <>
      {recordingStatus !== RecordingStatus.Ready &&
      recordingStatus !== RecordingStatus.STTCompleted &&
      recordingStatus !== RecordingStatus.AICompleted ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant={'tertiary'} size={'xl'}>
              임시 저장
            </Button>
          </DialogTrigger>
          <DialogContent className="min-w-[400px]">
            <DialogHeader className="">
              <DialogTitle>임시 저장하시겠어요?</DialogTitle>
              <DialogClose
                asChild
                className="!mt-0 h-6 w-6 cursor-pointer border-none bg-transparent !p-0 text-grayscale-100">
                <XIcon />
              </DialogClose>
            </DialogHeader>
            <div className="h-[1px] bg-grayscale-20" />
            <DialogDescription asChild className="m-0 px-5 pt-2">
              <p className="text-body1 font-medium text-grayscale-100">
                아직 녹음이 저장되지 않았습니다. <br />
                녹음 저장을 원하시면 녹음 저장 버튼을 먼저 눌러주세요. <br />
                텍스트만 임시 저장하시겠어요?
              </p>
            </DialogDescription>
            <DialogFooter className="m-0 flex w-full items-center justify-end p-5">
              <DialogClose asChild>
                <Button
                  variant="secondary"
                  size="md"
                  className="!m-0 w-16 !p-0">
                  취소
                </Button>
              </DialogClose>
              <Button
                variant="primary"
                size="md"
                className="w-16"
                onClick={handleClickConfirm}>
                확인
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Button variant="tertiary" size="xl" onClick={onSave}>
          임시 저장
        </Button>
      )}
    </>
  );
};

export default TemporarySaveDialog;
