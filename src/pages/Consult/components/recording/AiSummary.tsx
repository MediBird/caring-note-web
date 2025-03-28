import { ScrollArea } from '@/components/ui/scroll-area';
import { useGetAiSummaryQuery } from '@/pages/Consult/hooks/query/counselRecording/useGetAiSummaryQuery';
import { useRecordingStore } from '@/pages/Consult/hooks/store/useRecordingStore';
import React from 'react';
import ReactMarkDown from 'react-markdown';
import { useParams } from 'react-router-dom';

const AiSummary: React.FC = () => {
  const { counselSessionId } = useParams();
  const recordingStatus = useRecordingStore((state) => state.recordingStatus);
  const { data: aiSummary, isSuccess } = useGetAiSummaryQuery(
    counselSessionId,
    recordingStatus,
  );

  return (
    <ScrollArea className="mt-2 h-[802px] rounded-[4px] border-[1px] border-grayscale-30 p-4">
      {isSuccess && (
        <ReactMarkDown className={'prose'}>
          {aiSummary?.analysedText}
        </ReactMarkDown>
      )}
    </ScrollArea>
  );
};

export default AiSummary;
