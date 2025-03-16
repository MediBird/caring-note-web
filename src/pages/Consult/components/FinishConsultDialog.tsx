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
import { useRecording } from '@/hooks/useRecording';
import CompleteConsultDialog from '@/pages/Consult/components/CompleteConsultDialog';
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
  const { recordingStatus } = useRecording();
  const [open, setOpen] = useState(false);
  const [isCompleteConsultDialogOpen, setIsCompleteConsultDialogOpen] =
    useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={'primary'} size={'xl'}>
            설문 완료
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[480px]">
          <DialogHeader className="mt-4 h-[80px] items-center justify-center">
            <DialogTitle>
              <p className="center text-center text-h3 font-bold">
                {recordingStatus === RecordingStatus.AICompleted ? (
                  `${name}님, 상담을 완료하시겠어요?`
                ) : (
                  <>
                    녹음을 저장하지 않은 채로
                    <br />
                    상담을 완료하시겠어요?
                  </>
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
                {recordingStatus === RecordingStatus.AICompleted ? (
                  <>
                    상담 완료 후, 상담 내역에서 기록하신 내용을 확인할 수
                    있습니다.
                  </>
                ) : (
                  <>
                    이대로 상담을 완료하면 녹음 중인 내용이 다 사라져요. <br />
                    녹음 저장을 원하시면 녹음 저장을 마저 완료해주세요. <br />
                    <br />
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
