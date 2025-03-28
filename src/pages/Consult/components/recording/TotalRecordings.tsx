import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useGetSpeechToTextQuery } from '@/pages/Consult/hooks/query/counselRecording/useGetSpeechToTextQuery';
import { useRecordingStore } from '@/pages/Consult/hooks/store/useRecordingStore';
import { SPEAKER_COLOR_LIST } from '@/pages/Consult/types/Recording.enum';
import React from 'react';
import { useParams } from 'react-router-dom';

const TotalRecordings: React.FC = () => {
  const { counselSessionId } = useParams();
  const recordingStatus = useRecordingStore((state) => state.recordingStatus);
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
    <ScrollArea
      variant="mini"
      className="mt-2 h-[802px] rounded-[4px] border-[1px] border-grayscale-30 px-3 py-4">
      <div className="flex flex-col gap-3">
        {isSuccess &&
          speechToTextList?.map((data, index) => (
            <div
              key={index}
              className={cn(
                'flex flex-row items-center justify-between rounded-sm border-l-[6px] pl-2',
                getColorForSpeaker(data.name),
              )}>
              <div className="flex flex-row items-center gap-3">
                <p className="max-w-[340px] break-words text-body1 text-grayscale-90">
                  {data.text}
                </p>
              </div>
              <p className="ml-2 text-body2 text-grayscale-30">
                {data.startTime}
              </p>
            </div>
          ))}
      </div>
    </ScrollArea>
  );
};

export default TotalRecordings;
