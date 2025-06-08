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
import CompleteConsultDialog from '@/pages/Consult/components/dialog/CompleteConsultDialog';
import { useRecordingStore } from '@/pages/Consult/hooks/store/useRecordingStore';
import { useTusUpload } from '@/pages/Consult/hooks/query/useTusUpload';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';

interface FinishConsultDialogProps {
  name?: string;
  onComplete: () => void;
  isSuccessSaveConsult: boolean;
}

const FinishConsultDialog = ({
  name = '',
  onComplete,
  isSuccessSaveConsult,
}: FinishConsultDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isCompleteConsultDialogOpen, setIsCompleteConsultDialogOpen] =
    useState(false);
  const [isProcessingRecording, setIsProcessingRecording] = useState(false);
  const navigate = useNavigate();
  const { counselSessionId } = useParams();

  // 녹음 상태 가져오기
  const recordedBlob = useRecordingStore((state) => state.recordedBlob);
  const recordingStatus = useRecordingStore((state) => state.recordingStatus);
  const recordedDuration = useRecordingStore((state) => state.recordedDuration);

  // TUS 업로드 훅
  const { uploadRecording, handleMerge } = useTusUpload({
    counselSessionId: counselSessionId ?? '',
  });

  // 녹음 파일이 있고 저장되지 않은 상태인지 확인
  const hasUnsavedRecording = recordedBlob && recordingStatus === 'stopped';

  // 상담 완료 처리 함수
  const handleCompleteConsult = async () => {
    setIsProcessingRecording(true);

    try {
      // 녹음 파일이 있고 저장되지 않은 경우 업로드 및 STT 요청
      if (hasUnsavedRecording && counselSessionId) {
        // 녹음 시간 체크
        if (recordedDuration < 3) {
          toast.error('녹음 시간이 너무 짧습니다. 최소 3초 이상 녹음해주세요.');
          setIsProcessingRecording(false);
          return;
        }

        toast.info('녹음 파일을 업로드하고 있습니다...');

        // 1단계: 녹음 파일 업로드
        await uploadRecording();

        // 2단계: STT 요청
        await handleMerge(counselSessionId);

        toast.info('녹음이 저장되었습니다.');
      }

      // 기존 상담 완료 처리
      setOpen(false);
      setIsCompleteConsultDialogOpen(true);
      onComplete();
    } catch (error) {
      console.error('녹음 처리 실패:', error);
      toast.error('녹음 저장에 실패했습니다.');
    } finally {
      setIsProcessingRecording(false);
    }
  };

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
                {hasUnsavedRecording ? (
                  <>녹음을 저장하고 상담을 완료하시겠어요?</>
                ) : (
                  <>상담을 완료하시겠어요?</>
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
                {hasUnsavedRecording ? (
                  <>
                    녹음 파일이 업로드되고 상담이 완료됩니다.
                    <br />
                    상담 내역에서 기록하신 내용을 확인할 수 있습니다.
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
              <Button
                variant="secondary"
                size="xl"
                className="m-0 w-1/2 p-0"
                disabled={isProcessingRecording}>
                취소
              </Button>
            </DialogClose>
            <Button
              variant="primary"
              size="xl"
              className="w-1/2"
              onClick={handleCompleteConsult}
              disabled={isProcessingRecording}>
              {isProcessingRecording ? '처리 중...' : '상담 완료'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CompleteConsultDialog
        name={name}
        open={isCompleteConsultDialogOpen && isSuccessSaveConsult}
        onClose={() => {
          setIsCompleteConsultDialogOpen(false);
          navigate('/');
        }}
      />
    </>
  );
};

export default FinishConsultDialog;
