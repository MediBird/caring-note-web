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
import CompleteConsultDialog from './CompleteConsultDialog';
import {
  useRecordingStore,
  recordingSelectors,
} from '../../hooks/store/useRecordingStore';
import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { RecordingControllerRef } from '../recording/RecordingController';
import { RECORDING_CONFIG } from '../../types/recording.types';
import React from 'react';

interface FinishConsultDialogProps {
  name?: string;
  onComplete: () => void;
  isSuccessSaveConsult: boolean;
  recordingControlRef?: React.RefObject<RecordingControllerRef>;
}

interface RecordingState {
  hasRecording: boolean;
  isRecording: boolean;
  isPaused: boolean;
  hasUnsavedRecording: boolean;
  duration: number;
  canSave: boolean;
}

const FinishConsultDialog: React.FC<FinishConsultDialogProps> = ({
  name = '',
  onComplete,
  isSuccessSaveConsult,
  recordingControlRef,
}) => {
  const [open, setOpen] = useState(false);
  const [isCompleteConsultDialogOpen, setIsCompleteConsultDialogOpen] =
    useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const navigate = useNavigate();
  const { counselSessionId } = useParams();

  // 녹음 상태 가져오기 (선택자 사용으로 성능 최적화)
  const session = useRecordingStore(recordingSelectors.session);
  const file = useRecordingStore(recordingSelectors.file);
  const displayDuration = useRecordingStore(recordingSelectors.displayDuration);
  const hasUnsavedRecording = useRecordingStore(
    recordingSelectors.hasUnsavedRecording,
  );
  const canSave = useRecordingStore(recordingSelectors.canSave);

  // 녹음 상태 계산
  const recordingState: RecordingState = useMemo(
    () => ({
      hasRecording: !!file.blob || displayDuration > 0,
      isRecording: session.status === 'recording',
      isPaused: session.status === 'paused',
      hasUnsavedRecording: !!hasUnsavedRecording,
      duration: displayDuration,
      canSave: !!canSave,
    }),
    [file.blob, displayDuration, session.status, hasUnsavedRecording, canSave],
  );

  // 녹음 처리 로직
  const handleRecordingProcess = useCallback(async (): Promise<void> => {
    if (!counselSessionId || !recordingControlRef?.current) {
      return;
    }

    // 최소 녹음 시간 확인
    if (recordingState.duration < RECORDING_CONFIG.MIN_RECORDING_DURATION) {
      throw new Error(
        `녹음 시간이 너무 짧습니다. 최소 ${RECORDING_CONFIG.MIN_RECORDING_DURATION}초 이상 녹음해주세요.`,
      );
    }

    try {
      // 녹음 중이거나 일시정지 상태인 경우 먼저 중지
      if (recordingState.isRecording || recordingState.isPaused) {
        await recordingControlRef.current.stopRecording();
      }

      // 녹음이 있는 경우 항상 저장 처리 (canSave 체크는 saveRecording 내부에서 수행)
      if (recordingState.hasRecording) {
        await recordingControlRef.current.saveRecording();
      }
    } catch (error) {
      console.error('녹음 처리 실패:', error);
      throw error;
    }
  }, [recordingState, counselSessionId, recordingControlRef]);

  // 상담 완료 처리
  const handleCompleteConsult = useCallback(async () => {
    setIsProcessing(true);

    try {
      // 녹음 처리
      await handleRecordingProcess();

      // 상담 완료 처리
      onComplete();
      setOpen(false);
      setIsCompleteConsultDialogOpen(true);
    } catch (error) {
      console.error('상담 완료 처리 실패:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : '상담 완료 처리에 실패했습니다.';
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, [handleRecordingProcess, onComplete]);

  // 처리 중 상태 확인
  const isDisabled =
    isProcessing ||
    session.status === 'uploading' ||
    session.status === 'processing';

  // 다이얼로그 제목과 설명 생성
  const getDialogContent = () => {
    if (recordingState.hasRecording) {
      return {
        title: (
          <>
            녹음을 저장하고
            <br />
            상담을 완료하시겠어요?
          </>
        ),
        description: (
          <>
            녹음 파일이 업로드되고 상담이 완료됩니다.
            <br />
            상담 내역에서 기록하신 내용을 확인할 수 있습니다.
          </>
        ),
      };
    }

    return {
      title: '상담을 완료하시겠어요?',
      description: (
        <>상담 완료 후, 상담 내역에서 기록하신 내용을 확인할 수 있습니다.</>
      ),
    };
  };

  const dialogContent = getDialogContent();

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="primary" size="xl">
            상담 완료
          </Button>
        </DialogTrigger>

        <DialogContent className="w-[480px]">
          <DialogHeader className="mt-4 h-[80px] items-center justify-center">
            <DialogTitle>
              <p className="center text-center text-h3 font-bold">
                {dialogContent.title}
              </p>
            </DialogTitle>
          </DialogHeader>

          <DialogDescription asChild className="m-0 flex flex-col items-center">
            <div>
              <img
                className="my-4 h-[240px] w-[240px]"
                src={finishConsult}
                alt="상담 완료"
              />
              <p className="text-center text-body1 font-medium text-grayscale-100">
                {dialogContent.description}
              </p>
            </div>
          </DialogDescription>

          <DialogFooter className="m-0 flex w-full items-center justify-center p-5">
            <DialogClose asChild>
              <Button
                variant="secondary"
                size="xl"
                className="m-0 w-1/2 p-0"
                disabled={isDisabled}>
                취소
              </Button>
            </DialogClose>

            <Button
              variant="primary"
              size="xl"
              className="w-1/2"
              onClick={handleCompleteConsult}
              disabled={isDisabled}>
              {isDisabled ? '처리 중...' : '상담 완료'}
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
