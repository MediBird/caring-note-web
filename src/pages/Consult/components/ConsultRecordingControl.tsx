import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import RecordFillIcon from '@/assets/icon/24/record.fill.black.svg?react';
import PauseFillIcon from '@/assets/icon/24/pause.fill.black.svg?react';
import StopFillIcon from '@/assets/icon/24/stop.fill.black.svg?react';
import PlayFillIcon from '@/assets/icon/24/play.fill.black.svg?react';
import { useRecordingStore } from '../hooks/store/useRecordingStore';
import { useTusUpload } from '../hooks/query/useTusUpload';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import useConsultTabStore, { ConsultTab } from '@/store/consultTabStore';

interface ConsultRecordingControlProps {
  counselSessionId: string;
  className?: string;
}

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(
    remainingSeconds,
  ).padStart(2, '0')}`;
};

const formatDurationWithSession = (
  totalSeconds: number,
  sessionSeconds: number,
): string => {
  if (sessionSeconds === 0 || totalSeconds === sessionSeconds) {
    return formatDuration(totalSeconds);
  }
  return `${formatDuration(totalSeconds)} (이번 세션: ${formatDuration(sessionSeconds)})`;
};

export const ConsultRecordingControl: React.FC<
  ConsultRecordingControlProps
> = ({ counselSessionId, className }) => {
  const {
    recordingStatus,
    recordedDuration,
    totalDuration,
    currentSessionDuration,
    uploadProgress,
    incrementRecordedDuration,
    loadStateForSession,
    setCurrentCounselSessionId,
    resetRecordingState,
    startRecording: storeStartRecording,
    pauseRecording: storePauseRecording,
    resumeRecording: storeResumeRecording,
    stopRecording: storeStopRecording,
    fileId: storedFileIdUrl,
    setUploadProgress,
    setTotalDuration,
    setCurrentSessionDuration,
  } = useRecordingStore();

  const {
    startStreamAndUpload,
    abortUpload,
    handleMerge: tusHandleMerge,
  } = useTusUpload({ counselSessionId });

  const { setActiveTab } = useConsultTabStore();

  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const localMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

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

  const cleanupRecordingResources = useCallback(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Recording] Cleaning up recording resources...');
    }
    if (
      localMediaRecorderRef.current &&
      localMediaRecorderRef.current.state !== 'inactive'
    ) {
      const recorder = localMediaRecorderRef.current;
      recorder.onstart = null;
      recorder.onpause = null;
      recorder.onresume = null;
      recorder.onstop = null;
      recorder.onerror = null;
      recorder.ondataavailable = null;

      if (recorder.state === 'recording' || recorder.state === 'paused') {
        try {
          recorder.stop();
        } catch (e) {
          console.warn(
            '[Recording] Error stopping MediaRecorder during cleanup:',
            e,
          );
        }
      }
      localMediaRecorderRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    stopDurationTimer();
  }, [stopDurationTimer]);

  useEffect(() => {
    if (counselSessionId) {
      loadStateForSession(counselSessionId);
      setCurrentCounselSessionId(counselSessionId);
    }
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
  ]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `[Recording] Status: ${recordingStatus}, Duration: ${recordedDuration}s, Progress: ${uploadProgress}%, FileID: ${storedFileIdUrl}`,
      );
    }
  }, [recordingStatus, recordedDuration, uploadProgress, storedFileIdUrl]);

  const handleStartRecording = useCallback(async () => {
    if (recordingStatus === 'recording' || recordingStatus === 'paused') {
      toast.error('이미 녹음이 진행 중이거나 일시정지 상태입니다.');
      return;
    }
    if (recordingStatus === 'completed' || recordingStatus === 'stopped') {
      toast.error(
        '이미 녹음이 완료되었습니다. 새로운 녹음을 시작하려면 "새 녹음" 버튼을 사용하세요.',
      );
      return;
    }

    storeStartRecording();
    setCurrentSessionDuration(0); // 새 세션 시작 시 세션 시간 초기화
    startDurationTimer();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });
      mediaStreamRef.current = stream;

      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });
      localMediaRecorderRef.current = recorder;

      recorder.onstart = () => {
        if (process.env.NODE_ENV === 'development')
          console.log('[Recording] MediaRecorder event: onstart');
      };

      recorder.onpause = () => {
        if (process.env.NODE_ENV === 'development')
          console.log('[Recording] MediaRecorder event: onpause');
        // MediaRecorder 이벤트에서는 항상 처리 (사용자 버튼 클릭과 별개)
        storePauseRecording();
        stopDurationTimer();
      };

      recorder.onresume = () => {
        if (process.env.NODE_ENV === 'development')
          console.log('[Recording] MediaRecorder event: onresume');
        // MediaRecorder 이벤트에서는 항상 처리 (사용자 버튼 클릭과 별개)
        storeResumeRecording();
        startDurationTimer();
      };

      recorder.onstop = () => {
        if (process.env.NODE_ENV === 'development')
          console.log('[Recording] MediaRecorder event: onstop');
        // MediaRecorder 이벤트에서는 항상 처리 (사용자 버튼 클릭과 별개)
        stopDurationTimer();
        storeStopRecording();
        cleanupRecordingResources();
      };

      recorder.onerror = (event: Event) => {
        const errorEvent = event as ErrorEvent;
        console.error(
          '[Recording] MediaRecorder event: onerror',
          errorEvent.error || event,
        );
        const errorMessage = `녹음 오류: ${errorEvent.error?.message || '알 수 없는 오류'}`;
        toast.error(errorMessage);
        storeStopRecording();
        cleanupRecordingResources();
        resetRecordingState(counselSessionId);
      };

      await startStreamAndUpload(recorder, storedFileIdUrl || undefined);

      // MediaRecorder 상태 확인 후 시작
      if (recorder.state === 'inactive') {
        // 스트리밍 업로드를 위해 더 자주 데이터 수집 (1초마다)
        recorder.start(1000);
      } else {
        console.warn(
          '[Recording] MediaRecorder is not in inactive state:',
          recorder.state,
        );
      }
    } catch (err) {
      console.error('[Recording] Failed to start recording:', err);
      storeStopRecording();
      cleanupRecordingResources();
      resetRecordingState(counselSessionId);

      let errorMessage = '마이크 접근에 실패했거나 지원되지 않는 환경입니다.';
      if (err instanceof Error) {
        switch (err.name) {
          case 'NotAllowedError':
          case 'PermissionDeniedError':
            errorMessage = '마이크 사용 권한이 거부되었습니다.';
            break;
          case 'NotFoundError':
          case 'DevicesNotFoundError':
            errorMessage = '사용 가능한 마이크 장치를 찾을 수 없습니다.';
            break;
          case 'NotSupportedError':
            errorMessage = '현재 브라우저에서 지원하지 않는 기능입니다.';
            break;
          default:
            errorMessage = err.message || errorMessage;
        }
      }
      toast.error(errorMessage);
    }
  }, [
    recordingStatus,
    storeStartRecording,
    startDurationTimer,
    storePauseRecording,
    storeResumeRecording,
    storeStopRecording,
    startStreamAndUpload,
    counselSessionId,
    storedFileIdUrl,
    resetRecordingState,
    cleanupRecordingResources,
    stopDurationTimer,
  ]);

  const handleGoToNoteTab = useCallback(() => {
    if (process.env.NODE_ENV === 'development')
      console.log('[Recording] Action: Go to Note Tab for AI Summary');

    setActiveTab(ConsultTab.consultNote);
    toast.success('AI 요약 탭으로 이동합니다.');
  }, [setActiveTab]);

  const handlePauseRecording = useCallback(() => {
    if (process.env.NODE_ENV === 'development')
      console.log('[Recording] Action: Pause Recording');

    // 즉시 타이머 중지
    stopDurationTimer();
    storePauseRecording();

    if (localMediaRecorderRef.current?.state === 'recording') {
      localMediaRecorderRef.current.pause();
    } else {
      if (process.env.NODE_ENV === 'development')
        console.warn(
          '[Recording] Pause ignored: Not in recording state or no recorder.',
        );
    }
  }, [stopDurationTimer, storePauseRecording]);

  const handleResumeRecording = useCallback(() => {
    if (process.env.NODE_ENV === 'development')
      console.log('[Recording] Action: Resume Recording');
    if (localMediaRecorderRef.current?.state === 'paused') {
      localMediaRecorderRef.current.resume();
    } else if (recordingStatus === 'paused') {
      if (process.env.NODE_ENV === 'development')
        console.log(
          '[Recording] Resuming from paused state by starting new recording flow.',
        );
      handleStartRecording();
    } else {
      if (process.env.NODE_ENV === 'development')
        console.warn(
          '[Recording] Resume ignored: Not in paused state or no recorder.',
        );
    }
  }, [recordingStatus, handleStartRecording]);

  const handleStopRecording = useCallback(() => {
    if (process.env.NODE_ENV === 'development')
      console.log('[Recording] Action: Stop Recording');

    // 즉시 타이머 중지 및 상태 변경
    stopDurationTimer();

    // 현재 세션의 녹음을 총 시간에 반영
    const newTotalDuration = totalDuration + currentSessionDuration;
    setTotalDuration(newTotalDuration);

    storeStopRecording();

    if (
      localMediaRecorderRef.current &&
      (localMediaRecorderRef.current.state === 'recording' ||
        localMediaRecorderRef.current.state === 'paused')
    ) {
      try {
        localMediaRecorderRef.current.stop();
      } catch (e) {
        console.warn('[Recording] Error calling MediaRecorder.stop():', e);
        cleanupRecordingResources();
      }
    } else {
      cleanupRecordingResources();
    }
  }, [
    stopDurationTimer,
    totalDuration,
    currentSessionDuration,
    setTotalDuration,
    storeStopRecording,
    cleanupRecordingResources,
  ]);

  const handleDeleteRecording = useCallback(() => {
    if (process.env.NODE_ENV === 'development')
      console.log('[Recording] Action: Delete Recording');
    abortUpload();
    cleanupRecordingResources();
    resetRecordingState(counselSessionId);
    toast.success('녹음이 삭제되었습니다.');
  }, [
    cleanupRecordingResources,
    resetRecordingState,
    counselSessionId,
    abortUpload,
  ]);

  const handleCompleteRecording = useCallback(async () => {
    if (process.env.NODE_ENV === 'development')
      console.log('[Recording] Action: Complete Recording (Merge)');
    if (!storedFileIdUrl) {
      toast.error('업로드된 파일 정보가 없습니다. 다시 녹음해주세요.');
      return;
    }
    if (recordedDuration < 3) {
      toast.error('녹음 시간이 너무 짧습니다. 최소 3초 이상 녹음해주세요.');
      return;
    }

    setUploadProgress(1);

    try {
      await tusHandleMerge(counselSessionId);
      toast.success('녹음이 성공적으로 저장되었습니다! 🎉');
    } catch (error) {
      console.error('[Recording] Failed to complete (merge) recording:', error);
      setUploadProgress(0);

      let errorMessage = '녹음 저장에 실패했습니다.';
      let shouldResetToStopped = true;

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: { data?: { message?: string }; status?: number };
          message?: string;
        };

        if (axiosError.response?.status === 500) {
          const serverMessage = axiosError.response?.data?.message;
          if (
            serverMessage &&
            serverMessage.includes('머지 과정에서 오류가 발생했습니다')
          ) {
            errorMessage =
              '서버에서 파일 병합 중 오류가 발생했습니다. 업로드된 파일이 정리되었으므로 새로운 녹음을 시작해주세요.';
            // 서버에서 파일이 정리되었으므로 전체 상태를 초기화
            shouldResetToStopped = false;
            cleanupRecordingResources();
            resetRecordingState(counselSessionId);
          } else {
            errorMessage =
              '서버에서 파일 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
          }
        } else if (axiosError.response?.data?.message) {
          errorMessage = `저장 실패: ${axiosError.response.data.message}`;
        } else if (axiosError.message) {
          errorMessage = `네트워크 오류: ${axiosError.message}`;
        }
      } else if (error instanceof Error) {
        errorMessage = `오류: ${error.message}`;
      }

      toast.error(errorMessage, {
        duration: 5000, // 더 길게 표시하여 사용자가 읽을 수 있도록
      });

      // 상태 복구 처리
      if (shouldResetToStopped && recordingStatus === 'completed') {
        console.warn(
          "[Recording] Merge failed, reverting status from 'completed' to 'stopped'.",
        );
        storeStopRecording();
      }
    }
  }, [
    storedFileIdUrl,
    recordedDuration,
    counselSessionId,
    tusHandleMerge,
    setUploadProgress,
    recordingStatus,
    storeStopRecording,
    cleanupRecordingResources,
    resetRecordingState,
  ]);

  const isUploadingOrMerging = useMemo(() => {
    return (uploadProgress > 0 && uploadProgress < 100) || uploadProgress === 1;
  }, [uploadProgress]);

  const renderControls = useCallback(() => {
    const commonButtonProps = {
      size: 'icon' as const,
      disabled: isUploadingOrMerging,
      className:
        'h-7 w-7 rounded-full border border-grayscale-10 bg-white hover:bg-grayscale-10',
    };
    const iconClass = 'h-4 w-4';

    if (process.env.NODE_ENV === 'development') {
      // console.log(`[Recording] Render Controls - Status: ${recordingStatus}, Uploading/Merging: ${isUploadingOrMerging}, FileID: ${storedFileIdUrl}`);
    }

    switch (recordingStatus) {
      case 'idle':
        return (
          <>
            <div className="flex items-center gap-1">
              <span className="whitespace-nowrap text-body1 font-bold text-grayscale-80">
                녹음 시작하기
              </span>
              <span className="text-body1 font-medium text-grayscale-50">
                (
                {formatDurationWithSession(
                  totalDuration || recordedDuration,
                  currentSessionDuration,
                )}
                )
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
            <span className="flex animate-pulse items-center gap-2 whitespace-nowrap text-sm font-medium text-red-600">
              <div className="h-2 w-2 animate-pulse rounded-full bg-red-500"></div>
              녹음 중 (
              {formatDurationWithSession(
                totalDuration || recordedDuration,
                currentSessionDuration,
              )}
              )
            </span>
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
            <span className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-yellow-600">
              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
              일시정지 (
              {formatDurationWithSession(
                totalDuration || recordedDuration,
                currentSessionDuration,
              )}
              )
            </span>
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
            <span className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-blue-600">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
              녹음 완료 (
              {formatDurationWithSession(
                totalDuration || recordedDuration,
                currentSessionDuration,
              )}
              )
            </span>
            <div className="flex gap-2">
              <Button
                onClick={handleDeleteRecording}
                variant="secondary"
                size="sm"
                aria-label="녹음 삭제">
                삭제
              </Button>
              <Button
                onClick={handleCompleteRecording}
                variant="primary"
                size="sm"
                aria-label="녹음 저장">
                저장
              </Button>
            </div>
          </>
        );

      case 'completed':
        return (
          <>
            <div className="flex items-center gap-1">
              <span className="whitespace-nowrap text-body1 font-bold text-grayscale-80">
                녹음 저장 완료!
              </span>
              <span className="text-body1 font-medium text-grayscale-50">
                (
                {formatDurationWithSession(
                  totalDuration || recordedDuration,
                  currentSessionDuration,
                )}
                )
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
        console.warn('[Recording] Unknown recording status:', recordingStatus);
        return <span className="text-sm text-gray-500">알 수 없는 상태</span>;
    }
  }, [
    recordingStatus,
    recordedDuration,
    totalDuration,
    currentSessionDuration,
    isUploadingOrMerging,
    handleStartRecording,
    handleGoToNoteTab,
    handlePauseRecording,
    handleResumeRecording,
    handleStopRecording,
    handleDeleteRecording,
    handleCompleteRecording,
  ]);

  const containerClasses = useMemo(
    () =>
      cn(
        'h-[48px] w-auto min-w-[300px] rounded-lg px-4 py-2',
        'flex items-center justify-between gap-4 border shadow-sm',
        {
          'border-red-200 bg-red-50/50': recordingStatus === 'recording',
          'border-yellow-200 bg-yellow-50/50': recordingStatus === 'paused',
          'border-blue-200 bg-blue-50/50': recordingStatus === 'stopped',
          'border-green-200 bg-grayscale-05': recordingStatus === 'completed',
        },
        className,
      ),
    [recordingStatus, className],
  );

  return <div className={containerClasses}>{renderControls()}</div>;
};
