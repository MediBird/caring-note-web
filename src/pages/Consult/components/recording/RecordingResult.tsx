import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRecording } from '@/hooks/useRecording';
import { cn } from '@/lib/utils';
import { RecordingStatus } from '@/pages/Consult/types/Recording.enum';
import React from 'react';
import AiSummary from './AiSummary';
import TotalRecordings from './TotalRecordings';

const RecordingResultTabLists = () => {
  return (
    <TabsList className="w-full flex justify-start gap-5">
      <TabsTrigger
        value="aiSummary"
        className="h-[30px] text-subtitle2 font-bold">
        AI 요약
      </TabsTrigger>
      <TabsTrigger
        value="totalRecordings"
        className="h-[30px] text-subtitle2 font-bold">
        전체 녹음
      </TabsTrigger>
    </TabsList>
  );
};

interface RecordingResultProps {
  className?: string;
}

const RecordingResult: React.FC<RecordingResultProps> = ({ className }) => {
  const { recordingStatus } = useRecording();

  return (
    <>
      {recordingStatus === RecordingStatus.AICompleted && (
        <div className={cn('', className)}>
          <Tabs defaultValue="aiSummary">
            <RecordingResultTabLists />
            <TabsContent value="aiSummary" className="!m-0 !p-0">
              <AiSummary />
            </TabsContent>
            <TabsContent value="totalRecordings" className="!m-0 !p-0">
              <TotalRecordings />
            </TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
};

export default RecordingResult;
