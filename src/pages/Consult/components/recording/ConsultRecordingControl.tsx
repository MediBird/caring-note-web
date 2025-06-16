import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import RecordFillIcon from '@/assets/icon/24/record.fill.black.svg?react';
import PauseFillIcon from '@/assets/icon/24/pause.fill.black.svg?react';
import StopFillIcon from '@/assets/icon/24/stop.fill.black.svg?react';
import PlayFillIcon from '@/assets/icon/24/play.fill.black.svg?react';
import { useRecordingStore } from '../../hooks/store/useRecordingStore';
import { useTusUpload } from '../../hooks/query/useTusUpload';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import useConsultTabStore, { ConsultTab } from '@/store/consultTabStore';

interface ConsultRecordingControlProps {
  counselSessionId: string;
  className?: string;
  onRecordingControlReady?: (controls: {
    startRecording: () => Promise<void>;
  }) => void;
}

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(
    remainingSeconds,
  ).padStart(2, '0')}`;
};

export const ConsultRecordingControl: React.FC<
  ConsultRecordingControlProps
> = ({ counselSessionId, className, onRecordingControlReady }) => {
  const {
    recordingStatus,
    recordedDuration,
    totalDuration,
    currentSessionDuration,
    incrementRecordedDuration,
    loadStateForSession,
    setCurrentCounselSessionId,
    resetRecordingState,
    setTotalDuration,
    setCurrentSessionDuration,
    aiSummaryStatus,
    recordedBlob,
    saveRecordingToStorage,
    initializeApp,
  } = useRecordingStore();

  const {
    uploadRecording,
    abortUpload,
    handleMerge: tusHandleMerge,
    checkExistingRecording,
  } = useTusUpload({ counselSessionId });

  const { setActiveTab } = useConsultTabStore();

  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const stopDurationTimer = useCallback(() => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
      durationIntervalRef.current = null;
    }
  }, []);

  const startDurationTimer = useCallback(() => {
    stopDurationTimer();
    durationIntervalRef.current = setInterval(() => {
      incrementRecordedDuration();
    }, 1000);
  }, [incrementRecordedDuration, stopDurationTimer]);

  const stopAutoSaveTimer = useCallback(() => {
    if (autoSaveIntervalRef.current) {
      clearInterval(autoSaveIntervalRef.current);
      autoSaveIntervalRef.current = null;
    }
  }, []);

  const startAutoSaveTimer = useCallback(() => {
    stopAutoSaveTimer();

    // 30초마다 자동 저장
    autoSaveIntervalRef.current = setInterval(async () => {
      const state = useRecordingStore.getState();

      if (
        state.recordedBlob &&
        state.currentCounselSessionId &&
        (state.recordingStatus === 'recording' ||
          state.recordingStatus === 'paused')
      ) {
        try {
          await saveRecordingToStorage(
            state.currentCounselSessionId,
            state.recordedBlob,
            state.totalDuration + state.currentSessionDuration,
          );
          console.log('자동 저장 완료');
        } catch (error) {
          console.warn('자동 저장 실패:', error);
        }
      }
    }, 30000); // 30초마다
  }, [stopAutoSaveTimer, saveRecordingToStorage]);

  const cleanupRecordingResources = useCallback(() => {
    // 통합된 MediaRecorder 정리
    const { cleanupMediaRecorder } = useRecordingStore.getState();
    cleanupMediaRecorder();

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    stopDurationTimer();
    stopAutoSaveTimer();
  }, [stopDurationTimer, stopAutoSaveTimer]);

  useEffect(() => {
    const initializeSession = async () => {
      if (counselSessionId) {
        await loadStateForSession(counselSessionId);
        setCurrentCounselSessionId(counselSessionId);

        // 기존 녹음 파일 확인
        checkExistingRecording();
      }
    };

    initializeSession();

    return () => {
      abortUpload();
      cleanupRecordingResources();
    };
  }, [
    counselSessionId,
    loadStateForSession,
    setCurrentCounselSessionId,
    cleanupRecordingResources,
    abortUpload,
    checkExistingRecording,
  ]);

  // 앱 초기화 (최초 1회만)
  useEffect(() => {
    initializeApp();
  }, [initializeApp]);

  // 브라우저 이탈 시 자동 저장
  useEffect(() => {
    const handleBeforeUnload = async () => {
      const state = useRecordingStore.getState();

      if (
        state.recordedBlob &&
        state.currentCounselSessionId &&
        state.totalDuration > 0
      ) {
        try {
          await saveRecordingToStorage(
            state.currentCounselSessionId,
            state.recordedBlob,
            state.totalDuration,
          );
        } catch (error) {
          console.error('브라우저 이탈 시 녹음 저장 실패:', error);
        }
      }
    };

    const handleBeforeUnloadEvent = (event: BeforeUnloadEvent) => {
      // 녹음 중이거나 저장되지 않은 녹음이 있는 경우 경고
      if (
        recordingStatus === 'recording' ||
        recordingStatus === 'paused' ||
        (recordedBlob && recordingStatus === 'stopped')
      ) {
        event.preventDefault();
        return '녹음이 진행 중이거나 저장되지 않은 녹음이 있습니다. 정말 페이지를 떠나시겠습니까?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnloadEvent);
    window.addEventListener('unload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnloadEvent);
      window.removeEventListener('unload', handleBeforeUnload);
    };
  }, [recordingStatus, recordedBlob, saveRecordingToStorage]);

  // 복원된 녹음 알림
  useEffect(() => {
    if (recordedBlob && recordingStatus === 'stopped' && totalDuration > 0) {
      const timer = setTimeout(() => {
        toast.info(
          `이전 녹음이 복원되었습니다. (${formatDuration(totalDuration)})`,
        );
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [recordedBlob, recordingStatus, totalDuration]);

  const handleStartRecording = useCallback(async () => {
    try {
      // 마이크 권한 요청
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // 통합된 MediaRecorder 시작
      const { startMediaRecording } = useRecordingStore.getState();
      await startMediaRecording(stream);

      startDurationTimer();
      startAutoSaveTimer(); // 자동 저장 시작

      toast.info('녹음이 시작되었습니다.');
    } catch (error) {
      console.error('녹음 시작 실패:', error);
      toast.error('마이크 접근이 거부되었습니다.');
      cleanupRecordingResources();
    }
  }, [startDurationTimer, startAutoSaveTimer, cleanupRecordingResources]);

  const handlePauseRecording = useCallback(() => {
    stopDurationTimer();
    stopAutoSaveTimer(); // 자동 저장 중단

    // 통합된 MediaRecorder 일시정지
    const { pauseMediaRecording } = useRecordingStore.getState();
    pauseMediaRecording();
  }, [stopDurationTimer, stopAutoSaveTimer]);

  const handleResumeRecording = useCallback(() => {
    // 통합된 MediaRecorder 재개
    const { resumeMediaRecording } = useRecordingStore.getState();
    resumeMediaRecording();

    startDurationTimer();
    startAutoSaveTimer(); // 자동 저장 재개
  }, [startDurationTimer, startAutoSaveTimer]);

  const handleStopRecording = useCallback(async () => {
    stopDurationTimer();
    stopAutoSaveTimer(); // 자동 저장 중단

    // 현재 세션의 녹음을 총 시간에 반영
    const newTotalDuration = totalDuration + currentSessionDuration;
    setTotalDuration(newTotalDuration);
    setCurrentSessionDuration(0);

    try {
      // 통합된 MediaRecorder 정지 (Blob 생성)
      const { stopMediaRecording } = useRecordingStore.getState();
      const blob = await stopMediaRecording();

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }

      // 녹음 파일을 자동으로 저장소에 저장
      if (blob && newTotalDuration > 0) {
        await saveRecordingToStorage(counselSessionId, blob, newTotalDuration);
        console.log('녹음 파일이 저장소에 저장되었습니다.');
      }

      toast.info('녹음이 정지되었습니다. 저장 버튼을 눌러 업로드하세요.');
    } catch (error) {
      console.error('녹음 정지 실패:', error);
      toast.error('녹음 정지에 실패했습니다.');
    }
  }, [
    stopDurationTimer,
    stopAutoSaveTimer,
    totalDuration,
    currentSessionDuration,
    setTotalDuration,
    setCurrentSessionDuration,
    counselSessionId,
    saveRecordingToStorage,
  ]);

  const handleDeleteRecording = useCallback(async () => {
    try {
      abortUpload();
      cleanupRecordingResources();
      await resetRecordingState(counselSessionId);
      toast.info('녹음이 삭제되었습니다.');
    } catch (error) {
      console.error('삭제 실패:', error);
    }
  }, [
    cleanupRecordingResources,
    resetRecordingState,
    counselSessionId,
    abortUpload,
  ]);

  const handleSaveRecording = useCallback(async () => {
    if (recordedDuration < 3) {
      toast.error('녹음 시간이 너무 짧습니다. 최소 3초 이상 녹음해주세요.');
      return;
    }

    if (!recordedBlob) {
      toast.error('저장할 녹음 데이터가 없습니다.');
      return;
    }

    try {
      // 1단계: 녹음 파일 업로드
      await uploadRecording();

      // 2단계: AI 요약 프로세스 시작
      await tusHandleMerge(counselSessionId);
    } catch (error) {
      console.error('녹음 저장 실패:', error);
      toast.error('녹음 저장에 실패했습니다.');
    }
  }, [
    recordedDuration,
    recordedBlob,
    counselSessionId,
    uploadRecording,
    tusHandleMerge,
  ]);

  const handleGoToNoteTab = useCallback(() => {
    setActiveTab(ConsultTab.consultNote);
    toast.info('AI 요약 탭으로 이동합니다.');
  }, [setActiveTab]);

  const displayDuration = useMemo(() => {
    return totalDuration > 0 ? totalDuration : recordedDuration;
  }, [totalDuration, recordedDuration]);

  const renderControls = useCallback(() => {
    const commonButtonProps = {
      size: 'icon' as const,
      className:
        'h-7 w-7 rounded-full border border-grayscale-10 bg-white hover:bg-grayscale-10',
    };
    const iconClass = 'h-4 w-4';

    switch (recordingStatus) {
      case 'idle':
        return (
          <>
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap text-body1 font-bold text-grayscale-80">
                녹음 시작하기
              </span>
              <span className="text-body1 font-medium text-grayscale-30">
                {formatDuration(displayDuration)}
              </span>
            </div>
            <Button
              {...commonButtonProps}
              onClick={handleStartRecording}
              aria-label="녹음 시작">
              <RecordFillIcon className={iconClass} />
            </Button>
          </>
        );

      case 'recording':
        return (
          <>
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap text-body1 font-bold text-grayscale-80">
                녹음 중
              </span>
              <span className="text-body1 font-medium text-grayscale-70">
                {formatDuration(displayDuration)}
              </span>
              <div className="h-2 w-2 animate-pulse rounded-full bg-error-50"></div>
            </div>
            <div className="flex gap-2">
              <Button
                {...commonButtonProps}
                onClick={handlePauseRecording}
                variant="outline"
                aria-label="일시정지">
                <PauseFillIcon className={iconClass} />
              </Button>
              <Button
                {...commonButtonProps}
                onClick={handleStopRecording}
                variant="primary"
                aria-label="녹음 중지">
                <StopFillIcon className={iconClass} />
              </Button>
            </div>
          </>
        );

      case 'paused':
        return (
          <>
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap text-body1 font-bold text-grayscale-80">
                녹음 일시정지
              </span>
              <span className="text-body1 font-medium text-grayscale-30">
                {formatDuration(displayDuration)}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                {...commonButtonProps}
                onClick={handleResumeRecording}
                variant="outline"
                aria-label="녹음 재개">
                <PlayFillIcon className={iconClass} />
              </Button>
              <Button
                {...commonButtonProps}
                onClick={handleStopRecording}
                variant="primary"
                aria-label="녹음 중지">
                <StopFillIcon className={iconClass} />
              </Button>
            </div>
          </>
        );

      case 'stopped':
        return (
          <>
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap text-body1 font-bold text-grayscale-80">
                녹음 종료
              </span>
              <span className="text-body1 font-medium text-grayscale-60">
                {formatDuration(displayDuration)}
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleDeleteRecording}
                variant="secondary"
                size="sm"
                aria-label="녹음 삭제">
                삭제
              </Button>
              <Button
                onClick={handleSaveRecording}
                variant="primary"
                size="sm"
                disabled={!recordedBlob}
                aria-label="녹음 저장">
                저장
              </Button>
            </div>
          </>
        );

      case 'uploading':
        return (
          <>
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap text-body1 font-bold text-grayscale-80">
                녹음 저장 중...
              </span>
              <span className="text-body1 font-medium text-grayscale-50">
                {formatDuration(displayDuration)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-grayscale-30 border-t-primary-60"></div>
            </div>
          </>
        );

      case 'processing':
        return (
          <>
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap text-body1 font-bold text-grayscale-80">
                AI 요약 처리 중...
              </span>
              <span className="text-body1 font-medium text-grayscale-50">
                {formatDuration(displayDuration)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-grayscale-30 border-t-primary-60"></div>
            </div>
          </>
        );

      case 'completed':
        return (
          <>
            <div className="flex items-center gap-2">
              <span className="whitespace-nowrap text-body1 font-semibold text-primary-60">
                녹음 저장 완료!
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleGoToNoteTab}
                variant="primary"
                aria-label="내용 확인">
                내용 확인
              </Button>
            </div>
          </>
        );

      default:
        return <span className="text-sm text-gray-500">알 수 없는 상태</span>;
    }
  }, [
    recordingStatus,
    displayDuration,
    aiSummaryStatus,
    recordedBlob,
    handleStartRecording,
    handlePauseRecording,
    handleResumeRecording,
    handleStopRecording,
    handleDeleteRecording,
    handleSaveRecording,
    handleGoToNoteTab,
  ]);

  const containerClasses = cn(
    'h-[48px] w-auto min-w-[284px] rounded-lg px-4 py-2',
    'flex items-center justify-between gap-4 bg-grayscale-3',
    className,
  );

  // 부모 컴포넌트에게 녹음 제어 함수 전달
  useEffect(() => {
    if (onRecordingControlReady) {
      onRecordingControlReady({
        startRecording: handleStartRecording,
      });
    }
  }, [onRecordingControlReady, handleStartRecording]);

  return <div className={containerClasses}>{renderControls()}</div>;
};
