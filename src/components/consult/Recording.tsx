import PauseIcon from '@/assets/icon/24/pause.fill.black.svg?react';
import PlayIcon from '@/assets/icon/24/play.fill.black.svg?react';
import StopIcon from '@/assets/icon/24/stop.fill.black.svg?react';
import recording from '@/assets/recording/recording.webp';
import recordingComplete from '@/assets/recording/recordingComplete.webp';
import recordingWaiting from '@/assets/recording/recordingWaiting.webp';
import Spinner from '@/components/common/Spinner';
import { Button } from '@/components/ui/button';
import { useRecording } from '@/hooks/useRecording';
import { cn } from '@/lib/utils';
import DeleteRecordingDialog from '@/pages/Consult/components/recording/DeleteRecordingDialog';
import SelectSpeakerDialog from '@/pages/Consult/components/recording/SelectSpeakerDialog';
import { RecordingStatus } from '@/types/Recording.enum';
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
    recordingStatus,
    recordingTime,
  } = useRecording(counselSessionId);

  const circleColorClass =
    recordingStatus === RecordingStatus.Recording
      ? 'text-error-50'
      : 'text-grayscale-50';

  const playIcon = (
    <PlayIcon
      className="w-8 h-8 bg-white rounded-[100px] p-1 cursor-pointer"
      onClick={
        recordingStatus === RecordingStatus.Ready
          ? startRecording // 최초 녹음시작
          : pauseRecording // 일시정지 후 재시작
      }
    />
  );

  const pauseIcon = (
    <PauseIcon
      className="w-8 h-8 bg-white rounded-[100px] p-1 cursor-pointer"
      onClick={pauseRecording}
    />
  );

  const stopIcon = (
    <StopIcon
      className="w-8 h-8 bg-white rounded-[100px] p-1 cursor-pointer"
      onClick={stopRecording}
    />
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

  return (
    <>
      {recordingStatus !== RecordingStatus.AICompleted && (
        <div
          className={cn(
            'flex flex-col items-center justify-center rounded-xl gap-1 w-[260px] h-[166px] bg-grayscale-3 border-[1px] border-grayscale-10 shadow',
            className,
          )}>
          {recordingStatus === RecordingStatus.STTLoading ? (
            <div className="flex flex-col items-center">
              <p
                className="text-body1 font-medium text-grayscale-50"
                onClick={resetRecording}>
                녹음 저장 중...
              </p>
              <Spinner />
              <p className="text-caption1 font-refular text-grayscale-50 mt-6">
                평균 1분 내 저장됩니다. 조금만 기다려 주세요.
              </p>
            </div>
          ) : recordingStatus === RecordingStatus.STTCompleted ? (
            <div className="flex flex-col items-center gap-4">
              <p className="text-body1 font-bold text-grayscale-80">
                녹음 저장 완료!
              </p>
              <SelectSpeakerDialog />
            </div>
          ) : recordingStatus === RecordingStatus.AILoading ? (
            <div className="flex flex-col items-center">
              <p
                className="text-body1 font-medium text-grayscale-50"
                onClick={resetRecording}>
                녹음 스크립트 생성 중...
              </p>
              <Spinner />
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
              <div className="flex flex-row items-center justify-between w-full pl-8 pr-4">
                <div className="flex flex-col items-start justify-center space-y-1">
                  <p className="text-body1 font-medium">{recordingStatus}</p>
                  <div className="flex items-center space-x-2">
                    {recordingStatus !== RecordingStatus.Stopped && (
                      <Circle
                        className={`w-2 h-2 ${circleColorClass}`}
                        fill="currentColor"
                      />
                    )}
                    <span className="text-subtitle1 font-medium text-grayscale-50">
                      {formatTime(recordingTime)}
                    </span>
                  </div>
                </div>
                {getRecordingImage()}
              </div>

              <div className="flex items-center space-x-2">
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
      )}
    </>
  );
};

export default Recording;
