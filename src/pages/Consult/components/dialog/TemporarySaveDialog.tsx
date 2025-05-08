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
import { useRecordingStore } from '@/pages/Consult/hooks/store/useRecordingStore';
import { RecordingStatus } from '@/pages/Consult/types/Recording.enum';
import { XIcon } from 'lucide-react';
import { useState } from 'react';

interface TemporarySaveDialogProps {
  onSave: () => void;
}

const TemporarySaveDialog = ({ onSave }: TemporarySaveDialogProps) => {
  const [open, setOpen] = useState(false);
  const recordingStatus = useRecordingStore((state) => state.recordingStatus);

  const handleClickConfirm = () => {
    onSave();
    setOpen(false);
  };

  const isRecording =
    recordingStatus !== RecordingStatus.Ready &&
    recordingStatus !== RecordingStatus.AICompleted;

  return (
    <>
      {isRecording ? (
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
                아직 녹음과 상담 내용이 저장되지 않았습니다. <br />
                녹음 파일은 상담 완료 시에 저장됩니다. <br />
                상담 내용만 임시 저장하시겠어요?
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
