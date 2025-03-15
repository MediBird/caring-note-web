import { ScrollArea } from '@/components/ui/scroll-area';
import { useRecording } from '@/hooks/useRecording';
import { useGetAiSummaryQuery } from '@/pages/Consult/hooks/query/counselRecording/useGetAiSummaryQuery';
import React from 'react';
import ReactMarkDown from 'react-markdown';
import { useParams } from 'react-router-dom';

const AiSummary: React.FC = () => {
  const { counselSessionId } = useParams();
  const { recordingStatus } = useRecording(counselSessionId);
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
