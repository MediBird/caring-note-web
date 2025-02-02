import PauseIcon from '@/assets/icon/24/pause.fill.black.svg?react';
import PlayIcon from '@/assets/icon/24/play.fill.black.svg?react';
import StopIcon from '@/assets/icon/24/stop.fill.black.svg?react';
import Spinner from '@/components/common/Spinner';
import { useRecording } from '@/hooks/useRecording';
import { cn } from '@/lib/utils';
import { RecordingStatus } from '@/types/Recording.enum';
import { Circle } from 'lucide-react';
import React from 'react';
import { Button } from './ui/button';

interface RecordingProps {
  className?: string;
}
const Recording: React.FC<RecordingProps> = ({ className }) => {
  const {
    startRecording,
    pauseRecording,
    stopRecording,
    resetRecording,
    submitRecording,
    recordingStatus,
    recordingTime,
  } = useRecording();

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

  const handleClickSaveRecording = async () => {
    // TODO: 저장 버튼 클릭
    // 화자 선택 dialog 띄우기
    // 화자 선택 마무리 후 submitRecording 호출
    submitRecording();
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl gap-1 w-[260px] h-[166px] bg-grayscale-3 border-[1px] border-grayscale-10 shadow',
        className,
      )}>
      {recordingStatus === RecordingStatus.Loading ? (
        <div className="flex flex-col items-center">
          <p
            className="text-body1 font-medium text-grayscale-50"
            onClick={resetRecording}>
            녹음 스크립트 생성 중...
          </p>
          <Spinner />
        </div>
      ) : recordingStatus === RecordingStatus.Completed ? (
        <div>
          <Button onClick={resetRecording}>TODO 성공화면</Button>
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
        <div>
          <p className="text-body1 font-medium text-grayscale-50">
            녹음 중 에러 발생
          </p>
          <Button onClick={resetRecording}>다시 시도</Button>
        </div>
      ) : (
        <>
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
          <div className="flex items-center space-x-2 mt-3">
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
                <Button variant={'secondary'} onClick={resetRecording}>
                  삭제
                </Button>
                <Button onClick={handleClickSaveRecording}>저장</Button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Recording;
