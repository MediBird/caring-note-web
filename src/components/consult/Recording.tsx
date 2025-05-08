import PauseIcon from '@/assets/icon/24/pause.fill.black.svg?react';
import PlayIcon from '@/assets/icon/24/record.fill.red.svg?react';
import StopIcon from '@/assets/icon/24/stop.fill.black.svg?react';
import recording from '@/assets/recording/recording.webp';
import recordingComplete from '@/assets/recording/recordingComplete.webp';
import recordingWaiting from '@/assets/recording/recordingWaiting.webp';
import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/button';
import { useRecording } from '@/hooks/useRecording';
import { cn } from '@/lib/utils';
import DeleteRecordingDialog from '@/pages/Consult/components/recording/DeleteRecordingDialog';
import { useRecordingStore } from '@/pages/Consult/hooks/store/useRecordingStore';
import { RecordingStatus } from '@/pages/Consult/types/Recording.enum';
import useConsultTabStore, { ConsultTab } from '@/store/consultTabStore';
import useRightNavigationStore from '@/store/navigationStore';
import { Circle } from 'lucide-react';
import React from 'react';
import { useParams } from 'react-router-dom';

interface RecordingProps {
  className?: string;
}
const Recording: React.FC<RecordingProps> = ({ className }) => {
  const { counselSessionId } = useParams();
  const {
    startRecording,
    pauseRecording,
    stopRecording,
    resetRecording,
    submitRecording,
  } = useRecording(counselSessionId);
  const recordingStatus = useRecordingStore((state) => state.recordingStatus);
  const recordingTime = useRecordingStore((state) => state.recordingTime);

  const setActiveTab = useConsultTabStore((state) => state.setActiveTab);
  const closeRightNav = useRightNavigationStore((state) => state.closeRightNav);

  const circleColorClass =
    recordingStatus === RecordingStatus.Recording
      ? 'text-error-50'
      : 'text-grayscale-50';

  const recordingIconClass =
    'w-11 h-11 bg-white rounded-[100px] p-2 cursor-pointer border border-grayscale-10';

  const playIcon = (
    <PlayIcon
      className={recordingIconClass}
      onClick={
        recordingStatus === RecordingStatus.Ready
          ? startRecording // 최초 녹음시작
          : pauseRecording // 일시정지 후 재시작
      }
    />
  );

  const pauseIcon = (
    <PauseIcon className={recordingIconClass} onClick={pauseRecording} />
  );

  const stopIcon = (
    <StopIcon className={recordingIconClass} onClick={stopRecording} />
  );

  // 녹음시간 포맷팅(mm:ss)
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(
      2,
      '0',
    )}`;
  };

  const getRecordingImage = () => {
    if (
      recordingStatus === RecordingStatus.Ready ||
      recordingStatus === RecordingStatus.Paused
    ) {
      return (
        <img className="w-24" src={recordingWaiting} alt="recordingWaiting" />
      );
    } else if (recordingStatus === RecordingStatus.Recording) {
      return <img className="w-24" src={recording} alt="recording" />;
    } else if (recordingStatus === RecordingStatus.Stopped) {
      return (
        <img className="w-24" src={recordingComplete} alt="recordingComplete" />
      );
    }

    return null;
  };

  const showAiSummaryView = () => {
    closeRightNav();
    setActiveTab(ConsultTab.consultNote);
  };

  console.log(recordingStatus);

  return (
    <>
      {
        <div
          className={cn(
            'flex h-[166px] w-[348px] flex-col items-center justify-center gap-1 rounded-xl border border-grayscale-10 bg-grayscale-3',
            className,
          )}>
          {recordingStatus === RecordingStatus.STTLoading ||
          recordingStatus === RecordingStatus.STTCompleted ||
          recordingStatus === RecordingStatus.AILoading ? (
            <div className="flex flex-col items-center">
              <p className="text-body1 font-medium text-grayscale-50">
                녹음 저장 중...
              </p>
              <Spinner />
              <p className="font-refular mt-6 text-caption1 text-grayscale-50">
                평균 1분 내 저장됩니다. 조금만 기다려 주세요.
              </p>
            </div>
          ) : recordingStatus === RecordingStatus.AICompleted ? (
            <div className="flex flex-col items-center gap-4">
              <p className="text-body1 font-bold text-grayscale-80">
                녹음 저장 완료!
              </p>
              <Button onClick={showAiSummaryView} variant={'primary'} size="md">
                내용 확인
              </Button>
            </div>
          ) : recordingStatus === RecordingStatus.PermissionDenied ? (
            <div className="flex flex-col items-center gap-4">
              <p className="text-body1 font-medium text-grayscale-50">
                마이크 권한이 필요합니다
              </p>
              <Button onClick={startRecording} variant={'secondary'} size="md">
                다시 시도
              </Button>
            </div>
          ) : recordingStatus === RecordingStatus.Error ? (
            <div className="flex flex-col items-center gap-4">
              <p className="text-body1 font-medium text-grayscale-50">
                녹음 중 에러 발생
              </p>
              <Button onClick={resetRecording}>다시 시도</Button>
            </div>
          ) : (
            <>
              <div className="flex w-full flex-row items-center justify-between pl-8 pr-4">
                <div className="flex flex-col items-start justify-center space-y-1">
                  <p className="text-body1 font-medium">{recordingStatus}</p>
                  <div className="flex items-center space-x-2">
                    {recordingStatus !== RecordingStatus.Stopped && (
                      <Circle
                        className={`h-2 w-2 ${circleColorClass}`}
                        fill="currentColor"
                      />
                    )}
                    <span className="text-subtitle1 font-medium text-grayscale-80">
                      {formatTime(recordingTime)}
                    </span>
                  </div>
                </div>
                {getRecordingImage()}
              </div>

              <div className="flex items-center space-x-3">
                {recordingStatus === RecordingStatus.Ready && <>{playIcon}</>}
                {recordingStatus === RecordingStatus.Recording && (
                  <>
                    {pauseIcon}
                    {stopIcon}
                  </>
                )}
                {recordingStatus === RecordingStatus.Paused && (
                  <>
                    {playIcon}
                    {stopIcon}
                  </>
                )}
                {recordingStatus === RecordingStatus.Stopped && (
                  <>
                    <DeleteRecordingDialog />
                    <Button onClick={submitRecording}>저장</Button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      }
    </>
  );
};

export default Recording;
