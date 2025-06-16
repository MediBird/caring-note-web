import {
  useCallback,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useRef,
  memo,
} from 'react';
import { toast } from 'sonner';
import {
  useRecordingStore,
  recordingSelectors,
} from '../../hooks/store/useRecordingStore';
import { useMediaRecorder } from '../../hooks/useMediaRecorder';
import { useRecordingTimer } from '../../hooks/useRecordingTimer';
import { useTusUpload } from '../../hooks/query/useTusUpload';
import { RecordingError, RECORDING_CONFIG } from '../../types/recording.types';
import { cn } from '@/lib/utils';
import { RecordingControls } from './RecordingControls';

export interface RecordingControllerRef {
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  saveRecording: () => Promise<void>;
}

interface RecordingControllerProps {
  counselSessionId: string;
  className?: string;
  onRecordingReady?: (controls: {
    startRecording: () => Promise<void>;
  }) => void;
}

const RecordingControllerComponent = forwardRef<
  RecordingControllerRef,
  RecordingControllerProps
>(({ counselSessionId, className, onRecordingReady }, ref) => {
  const streamRef = useRef<MediaStream | null>(null);

  // 스토어 상태 - 선택적 구독으로 최적화
  const session = useRecordingStore(recordingSelectors.session);
  const timer = useRecordingStore(recordingSelectors.timer);
  const file = useRecordingStore(recordingSelectors.file);
  const canSave = useRecordingStore(recordingSelectors.canSave);
  const displayDuration = useRecordingStore(recordingSelectors.displayDuration);

  // 스토어 액션
  const {
    setFile,
    setUpload,
    loadSession,
    resetSession,
    saveToStorage,
    incrementDuration,
    startRecording: startRecordingAction,
    pauseRecording: pauseRecordingAction,
    resumeRecording: resumeRecordingAction,
    stopRecording: stopRecordingAction,
    startUploading,
    startProcessing,
  } = useRecordingStore();

  // TUS 업로드
  const { uploadRecording, handleMerge, abortUpload, isUploading } =
    useTusUpload({
      counselSessionId,
    });

  // 에러 처리
  const handleRecordingError = useCallback(
    (error: RecordingError) => {
      console.error('녹음 에러:', error);
      setUpload({ error: error.message });
      toast.error(error.message);
    },
    [setUpload],
  );

  // MediaRecorder 훅
  const mediaRecorder = useMediaRecorder({
    onStart: () => {
      startRecordingAction();
      toast.info('녹음이 시작되었습니다.');
    },
    onStop: (blob: Blob) => {
      setFile({ blob });
      stopRecordingAction();
    },
    onError: handleRecordingError,
  });

  // 자동 저장 로직
  const handleAutoSave = useCallback(async () => {
    if (
      file.blob &&
      session.currentSessionId &&
      (session.status === 'recording' || session.status === 'paused')
    ) {
      try {
        await saveToStorage(
          session.currentSessionId,
          file.blob,
          timer.totalDuration + timer.currentSessionDuration,
        );
      } catch (error) {
        console.warn('자동 저장 실패:', error);
      }
    }
  }, [
    file.blob,
    session.currentSessionId,
    session.status,
    saveToStorage,
    timer,
  ]);

  // 타이머 훅
  const recordingTimer = useRecordingTimer({
    onTick: () => {
      console.log('타이머 틱 - 현재 상태:', session.status);
      incrementDuration();
    },
    onAutoSave: handleAutoSave,
  });

  // 세션 초기화
  useEffect(() => {
    if (counselSessionId) {
      loadSession(counselSessionId);
    }

    return () => {
      abortUpload();
      mediaRecorder.cleanup();
      recordingTimer.cleanup();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counselSessionId]);

  // 브라우저 이탈 시 자동 저장
  useEffect(() => {
    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      if (session.status === 'recording' || session.status === 'paused') {
        event.preventDefault();
        return '녹음이 진행 중입니다. 정말 페이지를 떠나시겠습니까?';
      }

      if (file.blob && session.currentSessionId && timer.totalDuration > 0) {
        try {
          await saveToStorage(
            session.currentSessionId,
            file.blob,
            timer.totalDuration,
          );
        } catch (error) {
          console.error('브라우저 이탈 시 저장 실패:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [session, file, timer, saveToStorage]);

  // 복원 알림
  useEffect(() => {
    if (file.isFromStorage && timer.totalDuration > 0) {
      const timeoutId = setTimeout(() => {
        toast.info(
          `이전 녹음이 복원되었습니다. (${formatDuration(timer.totalDuration)})`,
        );
        setFile({ isFromStorage: false });
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [file.isFromStorage, timer.totalDuration, setFile]);

  // 녹음 시작
  const handleStartRecording = useCallback(async () => {
    console.log('녹음 시작 시도...');
    try {
      // 마이크 권한 요청
      console.log('마이크 권한 요청 중...');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      streamRef.current = stream;
      console.log('마이크 권한 획득 성공');

      // 녹음 시작
      console.log('MediaRecorder 시작 중...');
      await mediaRecorder.startRecording(stream);
      console.log('타이머 시작 중...');
      recordingTimer.startDurationTimer();
      recordingTimer.startAutoSaveTimer();
      console.log('녹음 시작 완료');
    } catch (error) {
      console.error('녹음 시작 실패:', error);
      toast.error('마이크 접근이 거부되었습니다.');

      // 정리
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      mediaRecorder.cleanup();
      recordingTimer.cleanup();
    }
  }, [mediaRecorder, recordingTimer]);

  // 일시정지
  const handlePauseRecording = useCallback(() => {
    mediaRecorder.pauseRecording();
    pauseRecordingAction();
    recordingTimer.stopDurationTimer();
    recordingTimer.stopAutoSaveTimer();
  }, [mediaRecorder, pauseRecordingAction, recordingTimer]);

  // 재개
  const handleResumeRecording = useCallback(() => {
    mediaRecorder.resumeRecording();
    resumeRecordingAction();
    recordingTimer.startDurationTimer();
    recordingTimer.startAutoSaveTimer();
  }, [mediaRecorder, resumeRecordingAction, recordingTimer]);

  // 정지
  const handleStopRecording = useCallback(async () => {
    recordingTimer.stopDurationTimer();
    recordingTimer.stopAutoSaveTimer();

    try {
      const blob = await mediaRecorder.stopRecording();

      // 스트림 정리
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      // 자동 저장
      if (blob && counselSessionId && timer.totalDuration > 0) {
        await saveToStorage(counselSessionId, blob, timer.totalDuration);
      }

      toast.info('녹음이 정지되었습니다. 저장 버튼을 눌러 업로드하세요.');
    } catch (error) {
      console.error('녹음 정지 실패:', error);
      toast.error('녹음 정지에 실패했습니다.');
    }
  }, [
    recordingTimer,
    mediaRecorder,
    counselSessionId,
    timer.totalDuration,
    saveToStorage,
  ]);

  // 삭제
  const handleDeleteRecording = useCallback(async () => {
    try {
      abortUpload();
      mediaRecorder.cleanup();
      recordingTimer.cleanup();
      await resetSession(counselSessionId);
      toast.info('녹음이 삭제되었습니다.');
    } catch (error) {
      console.error('삭제 실패:', error);
      toast.error('녹음 삭제에 실패했습니다.');
    }
  }, [
    abortUpload,
    mediaRecorder,
    recordingTimer,
    resetSession,
    counselSessionId,
  ]);

  // 저장
  const handleSaveRecording = useCallback(async () => {
    if (!canSave) {
      toast.error(
        `녹음 시간이 너무 짧습니다. 최소 ${RECORDING_CONFIG.MIN_RECORDING_DURATION}초 이상 녹음해주세요.`,
      );
      return;
    }

    if (!file.blob) {
      toast.error('저장할 녹음 데이터가 없습니다.');
      return;
    }

    try {
      startUploading();
      await uploadRecording();
      startProcessing();
      await handleMerge(counselSessionId);
    } catch (error) {
      console.error('녹음 저장 실패:', error);
      toast.error('녹음 저장에 실패했습니다.');
      setUpload({ error: '저장에 실패했습니다.' });
    }
  }, [
    canSave,
    file.blob,
    counselSessionId,
    startUploading,
    uploadRecording,
    startProcessing,
    handleMerge,
    setUpload,
  ]);

  // ref 메서드 노출
  useImperativeHandle(
    ref,
    () => ({
      startRecording: handleStartRecording,
      stopRecording: handleStopRecording,
      saveRecording: handleSaveRecording,
    }),
    [handleStartRecording, handleStopRecording, handleSaveRecording],
  );

  // 부모에게 제어 함수 전달
  useEffect(() => {
    if (onRecordingReady) {
      onRecordingReady({
        startRecording: handleStartRecording,
      });
    }
  }, [onRecordingReady, handleStartRecording]);

  const containerClasses = cn(
    'h-[48px] w-auto min-w-[284px] rounded-lg px-4 py-2',
    'flex items-center justify-between gap-4 bg-grayscale-3',
    className,
  );

  return (
    <div className={containerClasses}>
      <RecordingControls
        status={session.status}
        duration={displayDuration}
        hasBlob={!!file.blob}
        canSave={!!canSave}
        isUploading={isUploading}
        onStart={handleStartRecording}
        onPause={handlePauseRecording}
        onResume={handleResumeRecording}
        onStop={handleStopRecording}
        onSave={handleSaveRecording}
        onDelete={handleDeleteRecording}
      />
    </div>
  );
});

RecordingControllerComponent.displayName = 'RecordingController';

export const RecordingController = memo(RecordingControllerComponent);

// 유틸리티 함수
const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};
