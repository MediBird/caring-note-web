import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useRecordingStore } from '../hooks/store/useRecordingStore';
import { useTusUpload } from '../hooks/query/useTusUpload'; // 경로 확인 필요
import { cn } from '@/lib/utils'; // Shadcn UI 유틸리티

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

export const ConsultRecordingControl: React.FC<
  ConsultRecordingControlProps
> = ({ counselSessionId, className }) => {
  const {
    recordingStatus,
    recordedDuration,
    uploadProgress,
    error,
    incrementRecordedDuration,
    loadStateForSession,
    setCurrentCounselSessionId,
    resetRecordingState,
    startRecording: storeStartRecording,
    pauseRecording: storePauseRecording,
    resumeRecording: storeResumeRecording,
    stopRecording: storeStopRecording,
    setError: setStoreError,
    fileId: storedFileIdUrl, // TUS URL (이어하기용)
  } = useRecordingStore();

  const {
    startStreamAndUpload,
    abortUpload,
    handleMerge: tusHandleMerge,
  } = useTusUpload({ counselSessionId });
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const localMediaRecorderRef = useRef<MediaRecorder | null>(null); // 컴포넌트 내 레코더 참조
  const mediaStreamRef = useRef<MediaStream | null>(null); // MediaStream 참조

  useEffect(() => {
    if (counselSessionId) {
      loadStateForSession(counselSessionId);
      setCurrentCounselSessionId(counselSessionId);
    }

    return () => {
      if (
        localMediaRecorderRef.current &&
        localMediaRecorderRef.current.state !== 'inactive'
      ) {
        localMediaRecorderRef.current.stop();
      }
      localMediaRecorderRef.current = null;
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, [counselSessionId, loadStateForSession, setCurrentCounselSessionId]);

  const handleStartRecording = async () => {
    if (recordingStatus === 'recording' || recordingStatus === 'paused') {
      setStoreError('이미 녹음이 진행 중이거나 일시정지 상태입니다.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream; // 스트림 저장
      const newMediaRecorder = new MediaRecorder(mediaStreamRef.current, {
        mimeType: 'audio/webm',
      });
      localMediaRecorderRef.current = newMediaRecorder;

      newMediaRecorder.onstart = () => {
        storeStartRecording();
        if (durationIntervalRef.current)
          clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = setInterval(() => {
          incrementRecordedDuration();
        }, 1000);
      };

      newMediaRecorder.onpause = () => {
        storePauseRecording();
        if (durationIntervalRef.current)
          clearInterval(durationIntervalRef.current);
      };

      newMediaRecorder.onresume = () => {
        storeResumeRecording();
        if (durationIntervalRef.current)
          clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = setInterval(() => {
          incrementRecordedDuration();
        }, 1000);
      };

      newMediaRecorder.onerror = (event: Event) => {
        const errorEvent = event as ErrorEvent;
        console.error(
          'MediaRecorder error in Control:',
          errorEvent.error || event,
        );
        setStoreError(
          `녹음 오류: ${errorEvent.error?.message || '알 수 없는 오류'}`,
        );
        if (durationIntervalRef.current)
          clearInterval(durationIntervalRef.current);
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        }
      };

      newMediaRecorder.start(1000);

      await startStreamAndUpload(
        newMediaRecorder,
        counselSessionId,
        storedFileIdUrl || undefined,
      );
    } catch (err) {
      console.error('Failed to start recording:', err);
      let errorMessage = '마이크 접근에 실패했거나 지원되지 않는 환경입니다.';
      if (err instanceof Error) {
        if (
          err.name === 'NotAllowedError' ||
          err.name === 'PermissionDeniedError'
        ) {
          errorMessage =
            '마이크 사용 권한이 거부되었습니다. 브라우저 설정에서 마이크 접근을 허용해주세요.';
        } else if (
          err.name === 'NotFoundError' ||
          err.name === 'DevicesNotFoundError'
        ) {
          errorMessage =
            '사용 가능한 마이크 장치를 찾을 수 없습니다. 마이크가 연결되어 있는지 확인해주세요.';
        } else {
          errorMessage = `마이크 시작 오류: ${err.message}`;
        }
      }
      setStoreError(errorMessage);
    }
  };

  const handlePauseRecording = () => {
    if (
      localMediaRecorderRef.current &&
      localMediaRecorderRef.current.state === 'recording'
    ) {
      localMediaRecorderRef.current.pause();
    }
  };

  const handleResumeRecording = () => {
    if (
      localMediaRecorderRef.current &&
      localMediaRecorderRef.current.state === 'paused'
    ) {
      localMediaRecorderRef.current.resume();
    } else if (recordingStatus === 'paused') {
      handleStartRecording();
    }
  };

  const handleStopRecording = () => {
    if (
      localMediaRecorderRef.current &&
      (localMediaRecorderRef.current.state === 'recording' ||
        localMediaRecorderRef.current.state === 'paused')
    ) {
      localMediaRecorderRef.current.stop();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    }
    storeStopRecording();
  };

  const handleDeleteRecording = () => {
    if (
      localMediaRecorderRef.current &&
      localMediaRecorderRef.current.state !== 'inactive'
    ) {
      localMediaRecorderRef.current.stop();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    }
    localMediaRecorderRef.current = null;
    abortUpload();
    resetRecordingState(counselSessionId);
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
    }
  };

  const handleCompleteRecording = async () => {
    setStoreError(null);
    if (!storedFileIdUrl) {
      setStoreError('업로드된 파일 정보가 없습니다. 다시 녹음해주세요.');
      console.error(
        '[ConsultRecordingControl] No storedFileIdUrl found to complete recording.',
      );
      return;
    }
    console.log(
      `[ConsultRecordingControl] Triggering merge for session: ${counselSessionId} with fileId (URL): ${storedFileIdUrl}`,
    );
    await tusHandleMerge(counselSessionId);
  };

  const renderControls = () => {
    switch (recordingStatus) {
      case 'idle':
        return (
          <>
            <span className="text-sm">
              녹음 시작하기 ({formatDuration(recordedDuration)})
            </span>
            <Button onClick={handleStartRecording} size="sm">
              녹음
            </Button>
          </>
        );
      case 'recording':
        return (
          <>
            <span className="animate-pulse text-sm text-red-600">
              녹음 중 ({formatDuration(recordedDuration)})
            </span>
            <Button onClick={handlePauseRecording} variant="outline" size="sm">
              일시정지
            </Button>
            <Button onClick={handleStopRecording} variant="primary" size="sm">
              정지
            </Button>
          </>
        );
      case 'paused':
        return (
          <>
            <span className="text-sm text-yellow-600">
              녹음 일시정지 ({formatDuration(recordedDuration)})
            </span>
            <Button onClick={handleResumeRecording} size="sm">
              재개
            </Button>
            <Button onClick={handleStopRecording} variant="primary" size="sm">
              정지
            </Button>
          </>
        );
      case 'stopped':
        return (
          <>
            <span className="text-sm">
              녹음 종료 ({formatDuration(recordedDuration)})
            </span>
            <Button onClick={handleDeleteRecording} variant="ghost" size="sm">
              삭제
            </Button>
            <Button
              onClick={handleCompleteRecording}
              size="sm"
              disabled={uploadProgress > 0 && uploadProgress < 100}>
              {uploadProgress > 0 && uploadProgress < 100
                ? `업로드 중... ${uploadProgress.toFixed(0)}%`
                : '완료 및 업로드'}
            </Button>
          </>
        );
      case 'completed':
        return (
          <>
            <span className="text-sm text-green-600">
              녹음 저장 완료! ({formatDuration(recordedDuration)})
            </span>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-md border bg-gray-50 p-2',
        className,
      )}>
      {renderControls()}
      {error && <p className="ml-2 text-xs text-red-500">오류: {error}</p>}
    </div>
  );
};
