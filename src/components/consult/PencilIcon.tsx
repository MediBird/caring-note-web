import PencilBlackIcon from '@/assets/icon/24/create.filled.black.svg?react';
import PencilBlueIcon from '@/assets/icon/24/create.filled.blue.svg?react';
import { cn } from '@/lib/utils';
import { useRecordingStore } from '@/pages/Consult/hooks/store/useRecordingStore';
import { RecordingStatus } from '@/pages/Consult/types/Recording.enum';
import React from 'react';

const PencilIcon: React.FC = () => {
  const recordingStatus = useRecordingStore((state) => state.recordingStatus);

  return (
    <>
      {/* 연필 아이콘 및 Dot */}
      <div className={cn('relative w-7')}>
        {recordingStatus === RecordingStatus.Recording ? (
          <>
            <span className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-error-50" />
            <PencilBlueIcon width={24} height={24} className="my-1" />
          </>
        ) : recordingStatus === RecordingStatus.Paused ? (
          <>
            <span className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full bg-grayscale-50" />
            <PencilBlackIcon width={24} height={24} className="my-1" />
          </>
        ) : recordingStatus === RecordingStatus.AICompleted ? (
          <>
            <PencilBlueIcon width={24} height={24} className="my-1" />
          </>
        ) : (
          <PencilBlackIcon width={24} height={24} className="my-1" />
        )}
      </div>

      {/* 하단 텍스트 */}
      {recordingStatus === RecordingStatus.AICompleted && (
        <span className="text-caption1 font-bold text-primary-50">
          저장 완료
        </span>
      )}
    </>
  );
};

export default PencilIcon;
