import PauseIcon from '@/assets/icon/24/pause.fill.black.svg?react';
import PlayIcon from '@/assets/icon/24/play.fill.black.svg?react';
import StopIcon from '@/assets/icon/24/stop.fill.black.svg?react';
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
    recordingStatus,
    recordingTime,
    resetRecordingTime,
  } = useRecording();

  const circleColorClass =
    recordingStatus === RecordingStatus.Recording
      ? 'text-error-50'
      : 'text-grayscale-50';

  const playIcon = (
    <PlayIcon
      className="w-8 h-8 bg-white rounded-[100px] p-1 cursor-pointer"
      onClick={startRecording}
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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(
      2,
      '0',
    )}`;
  };

  const handleClickDeleteRecording = () => {
    resetRecordingTime();
  };

  const handleClickSaveRecording = () => {
    resetRecordingTime();
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl gap-1 w-[260px] h-[166px] bg-grayscale-3 border-[1px] border-grayscale-10 shadow',
        className,
      )}>
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
            {playIcon}
            <Button variant={'secondary'} onClick={handleClickDeleteRecording}>
              삭제
            </Button>
            <Button onClick={handleClickSaveRecording}>저장</Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Recording;
