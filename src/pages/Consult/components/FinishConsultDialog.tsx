import finishConsult from '@/assets/home/finish-consult.webp';
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
import CompleteConsultDialog from '@/pages/Consult/components/CompleteConsultDialog';
import { useRecordingStore } from '@/pages/Consult/hooks/store/useRecordingStore';
import { RecordingStatus } from '@/pages/Consult/types/Recording.enum';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface FinishConsultDialogProps {
  name?: string;
  onComplete: () => void;
}

const FinishConsultDialog = ({
  name = '',
  onComplete,
}: FinishConsultDialogProps) => {
  const recordingStatus = useRecordingStore((state) => state.recordingStatus);
  const [open, setOpen] = useState(false);
  const [isCompleteConsultDialogOpen, setIsCompleteConsultDialogOpen] =
    useState(false);
  const navigate = useNavigate();
  const isRecording =
    recordingStatus !== RecordingStatus.Ready &&
    recordingStatus !== RecordingStatus.AICompleted;

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={'primary'} size={'xl'}>
            상담 완료
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[480px]">
          <DialogHeader className="mt-4 h-[80px] items-center justify-center">
            <DialogTitle>
              <p className="center text-center text-h3 font-bold">
                {isRecording ? (
                  <>
                    녹음을 저장하고 <br />
                    상담을 완료하시겠어요?
                  </>
                ) : (
                  <>{name}님, 상담을 완료하시겠어요?</>
                )}
              </p>
            </DialogTitle>
          </DialogHeader>
          <DialogDescription asChild className="m-0 flex flex-col items-center">
            <div>
              <img
                className="my-4 h-[240px] w-[240px]"
                src={finishConsult}
                alt="finishConsult"
              />
              <p className="text-center text-body1 font-medium text-grayscale-100">
                {isRecording ? (
                  <>
                    이대로 상담을 중지하고 녹음중인 내용을 저장합니다. <br />
                    상담 완료 후, 상담 내역에서 기록하신 내용을 확인할 수
                    있습니다.
                  </>
                ) : (
                  <>
                    상담 완료 후, 상담 내역에서 기록하신 내용을 확인할 수
                    있습니다.
                  </>
                )}
              </p>
            </div>
          </DialogDescription>
          <DialogFooter className="m-0 flex w-full items-center justify-center p-5">
            <DialogClose asChild>
              <Button variant="secondary" size="xl" className="m-0 w-1/2 p-0">
                취소
              </Button>
            </DialogClose>
            <Button
              variant="primary"
              size="xl"
              className="w-1/2"
              onClick={() => {
                setOpen(false);
                setIsCompleteConsultDialogOpen(true);
                onComplete();
              }}>
              상담 완료
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CompleteConsultDialog
        name={name}
        open={isCompleteConsultDialogOpen}
        onClose={() => {
          setIsCompleteConsultDialogOpen(false);
          navigate('/');
        }}
      />
    </>
  );
};

export default FinishConsultDialog;
