import { useRecording } from '@/hooks/useRecording';
import { cn } from '@/lib/utils';
import { useGetSpeechToTextQuery } from '@/pages/Consult/hooks/query/counselRecording/useGetSpeechToTextQuery';
import { SPEAKER_COLOR_LIST } from '@/types/Recording.enum';
import React from 'react';
import { useParams } from 'react-router-dom';

const TotalRecordings: React.FC = () => {
  const { counselSessionId } = useParams();
  const { recordingStatus } = useRecording(counselSessionId);
  const { data: speechToTextList, isSuccess } = useGetSpeechToTextQuery(
    counselSessionId,
    recordingStatus,
  );

  const getColorForSpeaker = (speaker?: string) => {
    const speakerIndex = [
      ...new Set(speechToTextList?.map((data) => data.name)),
    ].indexOf(speaker);
    return SPEAKER_COLOR_LIST[speakerIndex % SPEAKER_COLOR_LIST.length];
  };

  return (
    <div className="flex flex-col gap-4 px-3 py-4 mt-2 max-h-[600px] border-[1px] border-grayscale-30 rounded-[4px] overflow-y-auto ">
      {isSuccess &&
        speechToTextList?.map((data, index) => (
          <div
            key={index}
            className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-3">
              <div
                className={cn(
                  'flex items-center justify-center text-sm font-medium min-w-[24px] min-h-[24px] rounded-full',
                  getColorForSpeaker(data.name),
                )}>
                {data.name}
              </div>
              <p className="text-body1 text-grayscale-90">{data.text}</p>
            </div>
            <p className="text-body2 text-grayscale-30 ml-2">
              {data.startTime}
            </p>
          </div>
        ))}
    </div>
  );
};

export default TotalRecordings;
