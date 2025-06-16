import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import RecordFillIcon from '@/assets/icon/24/record.fill.black.svg?react';
import PauseFillIcon from '@/assets/icon/24/pause.fill.black.svg?react';
import StopFillIcon from '@/assets/icon/24/stop.fill.black.svg?react';
import PlayFillIcon from '@/assets/icon/24/play.fill.black.svg?react';
import { RecordingStatus } from '../../types/recording.types';
import useConsultTabStore, { ConsultTab } from '@/store/consultTabStore';
import { toast } from 'sonner';

interface RecordingControlsProps {
  status: RecordingStatus;
  duration: number;
  hasBlob: boolean;
  canSave: boolean;
  isUploading: boolean;
  onStart: () => Promise<void>;
  onPause: () => void;
  onResume: () => void;
  onStop: () => Promise<void>;
  onSave: () => Promise<void>;
  onDelete: () => Promise<void>;
}

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

const RecordingStatusDisplay: React.FC<{
  status: RecordingStatus;
  duration: number;
}> = ({ status, duration }) => {
  const statusConfig = useMemo(() => {
    switch (status) {
      case 'idle':
        return {
          text: '녹음 시작하기',
          textColor: 'text-grayscale-80',
          durationColor: 'text-grayscale-30',
          showPulse: false,
        };
      case 'recording':
        return {
          text: '녹음 중',
          textColor: 'text-grayscale-80',
          durationColor: 'text-grayscale-70',
          showPulse: true,
        };
      case 'paused':
        return {
          text: '녹음 일시정지',
          textColor: 'text-grayscale-80',
          durationColor: 'text-grayscale-30',
          showPulse: false,
        };
      case 'stopped':
        return {
          text: '녹음 종료',
          textColor: 'text-grayscale-80',
          durationColor: 'text-grayscale-60',
          showPulse: false,
        };
      case 'uploading':
        return {
          text: '녹음 저장 중...',
          textColor: 'text-grayscale-80',
          durationColor: 'text-grayscale-50',
          showPulse: false,
        };
      case 'processing':
        return {
          text: 'AI 요약 처리 중...',
          textColor: 'text-grayscale-80',
          durationColor: 'text-grayscale-50',
          showPulse: false,
        };
      case 'completed':
        return {
          text: '녹음 저장 완료!',
          textColor: 'text-primary-60',
          durationColor: 'text-grayscale-50',
          showPulse: false,
        };
      default:
        return {
          text: '알 수 없는 상태',
          textColor: 'text-grayscale-50',
          durationColor: 'text-grayscale-30',
          showPulse: false,
        };
    }
  }, [status]);

  return (
    <div className="flex items-center gap-2">
      <span
        className={`whitespace-nowrap text-body1 font-bold ${statusConfig.textColor}`}>
        {statusConfig.text}
      </span>
      {status !== 'completed' && (
        <span
          className={`text-body1 font-medium ${statusConfig.durationColor}`}>
          {formatDuration(duration)}
        </span>
      )}
      {statusConfig.showPulse && (
        <div className="h-2 w-2 animate-pulse rounded-full bg-error-50"></div>
      )}
    </div>
  );
};

const LoadingSpinner: React.FC = () => (
  <div className="h-5 w-5 animate-spin rounded-full border-2 border-grayscale-30 border-t-primary-60"></div>
);

const RecordingControlButtons: React.FC<{
  status: RecordingStatus;
  hasBlob: boolean;
  canSave: boolean;
  isUploading: boolean;
  onStart: () => Promise<void>;
  onPause: () => void;
  onResume: () => void;
  onStop: () => Promise<void>;
  onSave: () => Promise<void>;
  onDelete: () => Promise<void>;
}> = ({
  status,
  hasBlob,
  canSave,
  isUploading,
  onStart,
  onPause,
  onResume,
  onStop,
  onSave,
  onDelete,
}) => {
  const { setActiveTab } = useConsultTabStore();

  const handleGoToNoteTab = () => {
    setActiveTab(ConsultTab.consultNote);
    toast.info('AI 요약 탭으로 이동합니다.');
  };

  const commonButtonProps = {
    size: 'icon' as const,
    className:
      'h-7 w-7 rounded-full border border-grayscale-10 bg-white hover:bg-grayscale-10',
  };
  const iconClass = 'h-4 w-4';

  switch (status) {
    case 'idle':
      return (
        <Button
          {...commonButtonProps}
          onClick={onStart}
          aria-label="녹음 시작"
          disabled={isUploading}>
          <RecordFillIcon className={iconClass} />
        </Button>
      );

    case 'recording':
      return (
        <div className="flex gap-2">
          <Button
            {...commonButtonProps}
            onClick={onPause}
            variant="outline"
            aria-label="일시정지"
            disabled={isUploading}>
            <PauseFillIcon className={iconClass} />
          </Button>
          <Button
            {...commonButtonProps}
            onClick={onStop}
            variant="primary"
            aria-label="녹음 중지"
            disabled={isUploading}>
            <StopFillIcon className={iconClass} />
          </Button>
        </div>
      );

    case 'paused':
      return (
        <div className="flex gap-2">
          <Button
            {...commonButtonProps}
            onClick={onResume}
            variant="outline"
            aria-label="녹음 재개"
            disabled={isUploading}>
            <PlayFillIcon className={iconClass} />
          </Button>
          <Button
            {...commonButtonProps}
            onClick={onStop}
            variant="primary"
            aria-label="녹음 중지"
            disabled={isUploading}>
            <StopFillIcon className={iconClass} />
          </Button>
        </div>
      );

    case 'stopped':
      return (
        <div className="flex gap-2">
          <Button
            onClick={onDelete}
            variant="secondary"
            size="sm"
            aria-label="녹음 삭제"
            disabled={isUploading}>
            삭제
          </Button>
          <Button
            onClick={onSave}
            variant="primary"
            size="sm"
            disabled={!hasBlob || !canSave || isUploading}
            aria-label="녹음 저장">
            저장
          </Button>
        </div>
      );

    case 'uploading':
    case 'processing':
      return (
        <div className="flex items-center gap-2">
          <LoadingSpinner />
        </div>
      );

    case 'completed':
      return (
        <Button
          size="sm"
          onClick={handleGoToNoteTab}
          variant="primary"
          aria-label="내용 확인">
          내용 확인
        </Button>
      );

    default:
      return null;
  }
};

export const RecordingControls: React.FC<RecordingControlsProps> = ({
  status,
  duration,
  hasBlob,
  canSave,
  isUploading,
  onStart,
  onPause,
  onResume,
  onStop,
  onSave,
  onDelete,
}) => {
  return (
    <>
      <RecordingStatusDisplay status={status} duration={duration} />
      <RecordingControlButtons
        status={status}
        hasBlob={hasBlob}
        canSave={canSave}
        isUploading={isUploading}
        onStart={onStart}
        onPause={onPause}
        onResume={onResume}
        onStop={onStop}
        onSave={onSave}
        onDelete={onDelete}
      />
    </>
  );
};
