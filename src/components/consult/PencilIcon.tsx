import PencilBlackIcon from '@/assets/icon/24/create.filled.black.svg?react';
import PencilBlueIcon from '@/assets/icon/24/create.filled.blue.svg?react';
import { useRecording } from '@/hooks/useRecording';
import { cn } from '@/lib/utils';
import { RecordingStatus } from '@/types/Recording.enum';
import React from 'react';

const PencilIcon: React.FC = () => {
  const { recordingStatus } = useRecording();

  return (
    <>
      {/* 연필 아이콘 및 Dot */}
      <div className={cn('relative w-7')}>
        {recordingStatus === RecordingStatus.Recording ? (
          <>
            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-error-50 rounded-full" />
            <PencilBlueIcon width={24} height={24} className="my-1" />
          </>
        ) : recordingStatus === RecordingStatus.Paused ? (
          <>
            <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-grayscale-50 rounded-full" />
            <PencilBlackIcon width={24} height={24} className="my-1" />
          </>
        ) : recordingStatus === RecordingStatus.STTCompleted ? (
          <>
            <PencilBlueIcon width={24} height={24} className="my-1" />
          </>
        ) : (
          <PencilBlackIcon width={24} height={24} className="my-1" />
        )}
      </div>

      {/* 하단 텍스트 */}
      {recordingStatus === RecordingStatus.STTCompleted && (
        <span className="text-caption1 text-primary-50 font-bold">
          저장 완료
        </span>
      )}
    </>
  );
};

export default PencilIcon;
