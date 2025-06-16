import React, { useCallback } from 'react';
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
import {
  useRecordingStore,
  recordingSelectors,
} from '../../hooks/store/useRecordingStore';
import { handleRecordingError } from '../../utils/errorHandling';

interface RecordingDialogProps {
  open: boolean;
  onClose: () => void;
  onStartRecording: () => Promise<void>;
}

export const RecordingDialog: React.FC<RecordingDialogProps> = ({
  open,
  onClose,
  onStartRecording,
}) => {
  // 스토어에서 상태 확인
  const session = useRecordingStore(recordingSelectors.session);
  const isDisabled = session.status !== 'idle' || session.isLoading;

  const handleStartRecording = useCallback(async () => {
    try {
      await onStartRecording();
      onClose();
    } catch (error) {
      handleRecordingError(
        error as Error,
        'RecordingDialog.handleStartRecording',
        true,
        { sessionId: session.currentSessionId },
      );
    }
  }, [onStartRecording, onClose, session.currentSessionId]);

  const handleClose = useCallback(() => {
    // 녹음 중이 아닐 때만 닫기 허용
    if (!isDisabled) {
      onClose();
    }
  }, [onClose, isDisabled]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
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
              alt="상담 녹음 시작 일러스트"
            />
            <div className="mt-4 space-y-2">
              <p className="text-center text-body1 font-medium text-grayscale-100">
                상담 녹음 시 모든 내용을 텍스트로 확인할 수 있어요.
              </p>
              <p className="text-center text-body2 font-normal text-grayscale-60">
                목소리를 정확하게 인식할 수 있도록 마이크를 가까이 두세요.
              </p>
              {session.isLoading && (
                <p className="text-center text-body2 font-normal text-primary-60">
                  세션을 준비하고 있습니다...
                </p>
              )}
            </div>
          </div>
        </DialogDescription>

        <DialogFooter className="m-0 flex w-full items-center justify-center p-5">
          <DialogClose asChild>
            <Button
              variant="secondary"
              size="xl"
              className="m-0 w-1/2 p-0"
              disabled={isDisabled}>
              나중에 시작
            </Button>
          </DialogClose>
          <Button
            variant="primary"
            size="xl"
            className="w-1/2"
            onClick={handleStartRecording}
            disabled={isDisabled}>
            {session.isLoading ? '준비 중...' : '녹음 시작'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecordingDialog;
