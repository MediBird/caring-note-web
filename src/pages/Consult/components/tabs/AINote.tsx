import { SelectAICounselSummaryStatusResAiCounselSummaryStatusEnum } from '@/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useAISummaryStatus,
  useAnalysedText,
  useSpeechToText,
} from '@/pages/Consult/hooks/query/useAISummaryQuery';
import { cn } from '@/lib/utils';
import { LoaderIcon, AlertCircleIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import React, { useMemo } from 'react';
import {
  SPEAKER_COLOR_LIST,
  STATUS_MESSAGES,
  RECORDING_SCROLL_HEIGHT,
  EMPTY_MESSAGES,
} from '@/pages/Consult/constants/aiNote';

// 타입 정의
interface StatusMessageProps {
  status?: SelectAICounselSummaryStatusResAiCounselSummaryStatusEnum;
  message: string | null;
  isInProgress: boolean;
  isFailed: boolean;
}

interface SpeechTextData {
  name?: string;
  text?: string;
  startTime?: string;
}

// 커스텀 훅: AI 요약 상태 관리
const useAISummaryState = (counselSessionId: string) => {
  const { data: summaryStatus } = useAISummaryStatus(counselSessionId);

  const statusMessage = summaryStatus?.aiCounselSummaryStatus
    ? STATUS_MESSAGES[summaryStatus.aiCounselSummaryStatus]
    : null;

  const isInProgress =
    summaryStatus?.aiCounselSummaryStatus ===
      SelectAICounselSummaryStatusResAiCounselSummaryStatusEnum.SttProgress ||
    summaryStatus?.aiCounselSummaryStatus ===
      SelectAICounselSummaryStatusResAiCounselSummaryStatusEnum.GptProgress;

  const isFailed =
    summaryStatus?.aiCounselSummaryStatus ===
      SelectAICounselSummaryStatusResAiCounselSummaryStatusEnum.SttFailed ||
    summaryStatus?.aiCounselSummaryStatus ===
      SelectAICounselSummaryStatusResAiCounselSummaryStatusEnum.GptFailed;

  return {
    status: summaryStatus?.aiCounselSummaryStatus,
    message: statusMessage,
    isInProgress,
    isFailed,
  };
};

// 공통 로딩 컴포넌트
const LoadingContent = React.memo(() => (
  <div className="p-6">
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  </div>
));
LoadingContent.displayName = 'LoadingContent';

// 상태 메시지 컴포넌트
const StatusMessage = React.memo<StatusMessageProps>(
  ({ message, isInProgress, isFailed }) => {
    if (!message) return null;

    const Icon = isInProgress ? LoaderIcon : AlertCircleIcon;
    const textColor = isFailed ? 'text-error-60' : 'text-primary-60';
    const iconClass = isInProgress ? 'animate-spin' : '';

    return (
      <div className="p-6">
        <div className={cn('flex items-center gap-2', textColor)}>
          <Icon className={cn('h-4 w-4', iconClass)} />
          <span className="text-body1">{message}</span>
        </div>
      </div>
    );
  },
);
StatusMessage.displayName = 'StatusMessage';

// 빈 콘텐츠 메시지 컴포넌트
const EmptyContent = React.memo<{ message: string }>(({ message }) => (
  <p className="text-center text-body1 text-grayscale-50">{message}</p>
));
EmptyContent.displayName = 'EmptyContent';

// AI 요약 섹션 컴포넌트
const AISummarySection: React.FC<{
  analysedText?: { analysedText?: string };
  isLoading: boolean;
  statusProps: StatusMessageProps;
}> = ({ analysedText, isLoading, statusProps }) => {
  const renderContent = () => {
    if (isLoading) return <LoadingContent />;

    if (statusProps.isInProgress || statusProps.isFailed) {
      return <StatusMessage {...statusProps} />;
    }

    return (
      <ScrollArea
        className="rounded-[4px] border-[1px] border-grayscale-30 p-4"
        style={{ height: `${RECORDING_SCROLL_HEIGHT}px` }}>
        {analysedText?.analysedText ? (
          <ReactMarkdown className="prose">
            {analysedText.analysedText}
          </ReactMarkdown>
        ) : (
          <EmptyContent message={EMPTY_MESSAGES.AI_SUMMARY} />
        )}
      </ScrollArea>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI 요약</CardTitle>
      </CardHeader>
      <CardContent className="p-0">{renderContent()}</CardContent>
    </Card>
  );
};

// 녹음 텍스트 아이템 컴포넌트
const RecordingTextItem = React.memo<{
  data: SpeechTextData;
  colorClass: string;
}>(({ data, colorClass }) => (
  <div
    className={cn(
      'flex flex-row items-center justify-between rounded-sm border-l-[6px] pl-2',
      colorClass,
    )}>
    <div className="flex flex-row items-center gap-3">
      <p className="max-w-[340px] break-words text-body1 text-grayscale-90">
        {data.text}
      </p>
    </div>
    <p className="ml-2 text-body2 text-grayscale-30">{data.startTime}</p>
  </div>
));
RecordingTextItem.displayName = 'RecordingTextItem';

// 전체 녹음 섹션 컴포넌트
const RecordingSection: React.FC<{
  speechToTextList?: SpeechTextData[];
  isLoading: boolean;
}> = ({ speechToTextList, isLoading }) => {
  // 화자 목록을 메모이제이션
  const speakers = useMemo(() => {
    if (!speechToTextList) return [];
    return [...new Set(speechToTextList.map((data) => data.name))];
  }, [speechToTextList]);

  // 화자별로 색상 인덱스를 가져오는 함수
  const getColorForSpeaker = (speaker?: string): string => {
    if (!speechToTextList) return SPEAKER_COLOR_LIST[0];

    const speakerIndex = speakers.indexOf(speaker);
    return SPEAKER_COLOR_LIST[speakerIndex % SPEAKER_COLOR_LIST.length];
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <ScrollArea
        variant="mini"
        className="rounded-[4px] border-[1px] border-grayscale-30 px-3 py-4"
        style={{ height: `${RECORDING_SCROLL_HEIGHT}px` }}>
        <div className="flex flex-col gap-3">
          {speechToTextList && speechToTextList.length > 0 ? (
            speechToTextList.map((data, index) => (
              <RecordingTextItem
                key={index}
                data={data}
                colorClass={getColorForSpeaker(data.name)}
              />
            ))
          ) : (
            <EmptyContent message={EMPTY_MESSAGES.RECORDING} />
          )}
        </div>
      </ScrollArea>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>전체 녹음</CardTitle>
      </CardHeader>
      <CardContent className="p-0">{renderContent()}</CardContent>
    </Card>
  );
};

// 메인 컴포넌트
const AINote: React.FC = () => {
  const { counselSessionId } = useParams<{ counselSessionId: string }>();
  const sessionId = counselSessionId || '';

  // 데이터 및 상태 관리
  const statusProps = useAISummaryState(sessionId);
  const { data: analysedText, isLoading: isAnalysedTextLoading } =
    useAnalysedText(sessionId);
  const { data: speechToTextList, isLoading: isSpeechToTextLoading } =
    useSpeechToText(sessionId);

  return (
    <div className="grid grid-cols-2 gap-6">
      <AISummarySection
        analysedText={analysedText}
        isLoading={isAnalysedTextLoading}
        statusProps={statusProps}
      />
      <RecordingSection
        speechToTextList={speechToTextList}
        isLoading={isSpeechToTextLoading}
      />
    </div>
  );
};

export default AINote;
