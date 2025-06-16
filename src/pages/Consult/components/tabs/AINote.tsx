import { SelectAICounselSummaryStatusResAiCounselSummaryStatusEnum } from '@/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  RECORDING_SCROLL_HEIGHT,
  SPEAKER_COLOR_LIST,
} from '@/pages/Consult/constants/aiNote';
// @/illusts/img_stt_empty.webp 이미지 import 추가
import imgSttEmpty from '@/assets/illusts/img_stt_empty.webp';

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
    message: '',
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

// 빈 콘텐츠 메시지 컴포넌트 (ErrorCommon 스타일로 교체)
const EmptyContent = React.memo(() => (
  <div
    className="flex items-center justify-center p-6"
    style={{ height: `${RECORDING_SCROLL_HEIGHT}px` }}>
    <div className="w-full text-center">
      <div className="flex flex-col items-center justify-center gap-[1.5rem]">
        <img
          src={imgSttEmpty}
          alt="녹음 내용 없음"
          className="h-[280px] w-[456px]"
        />
        <div>
          <p className="mb-2 text-subtitle1 font-bold text-grayscale-70">
            아직 녹음 파일이 존재하지 않아요
          </p>
          <div className="text-subtitle2 font-medium text-grayscale-50">
            <p>녹음을 완료하면 이 곳에 대한 내용과 AI 요약이 저장돼요.</p>
            <p>우측 상단에 있는 녹음 상태를 먼저 확인해주세요.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
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
          <EmptyContent />
        )}
      </ScrollArea>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI 요약</CardTitle>
        <CardDescription>
          <p>상담 요약은 일부 오류나 부정확한 정보가 포함될 수 있습니다.</p>
        </CardDescription>
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
      <p className="break-words text-body1 text-grayscale-90">{data.text}</p>
    </div>
    <p className="ml-2 text-body2 text-grayscale-30">{data.startTime}</p>
  </div>
));
RecordingTextItem.displayName = 'RecordingTextItem';

// 전체 녹음용 빈 콘텐츠 컴포넌트
const EmptyRecordingContent = React.memo<{ message: string }>(({ message }) => (
  <p className="text-center text-body1 text-grayscale-50">{message}</p>
));
EmptyRecordingContent.displayName = 'EmptyRecordingContent';

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
            <EmptyRecordingContent message="녹음 내용이 없습니다." />
          )}
        </div>
      </ScrollArea>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>전체 녹음</CardTitle>
        <CardDescription>
          <p>
            상담 녹음의 전체 발화 기록이며, 각 발화자는 색상으로 구분되어
            표시됩니다.
          </p>
        </CardDescription>
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

  // 로딩 중이 아니고 데이터가 없는 경우 빈 상태만 표시
  const hasNoData =
    !isAnalysedTextLoading &&
    !isSpeechToTextLoading &&
    !analysedText?.analysedText &&
    (!speechToTextList || speechToTextList.length === 0) &&
    !statusProps.isInProgress;

  if (hasNoData) {
    return <EmptyContent />;
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <AISummarySection
        analysedText={analysedText || { analysedText: '' }}
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
