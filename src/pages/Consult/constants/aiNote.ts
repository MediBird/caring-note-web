import { SelectAICounselSummaryStatusResAiCounselSummaryStatusEnum } from '@/api';

// 화자별 색상 매핑 (border 색상)
export const SPEAKER_COLOR_LIST = [
  'border-pfp-1',
  'border-pfp-2',
  'border-pfp-3',
  'border-pfp-4',
  'border-pfp-5',
  'border-pfp-6',
  'border-pfp-7',
] as const;

// 상태별 메시지
export const STATUS_MESSAGES: Record<
  SelectAICounselSummaryStatusResAiCounselSummaryStatusEnum,
  string
> = {
  [SelectAICounselSummaryStatusResAiCounselSummaryStatusEnum.SttProgress]:
    '녹음 내용을 텍스트로 변환하고 있습니다...',
  [SelectAICounselSummaryStatusResAiCounselSummaryStatusEnum.SttFailed]:
    '녹음 변환에 실패했습니다.',
  [SelectAICounselSummaryStatusResAiCounselSummaryStatusEnum.SttComplete]:
    '녹음 변환이 완료되었습니다. AI 요약을 준비중입니다...',
  [SelectAICounselSummaryStatusResAiCounselSummaryStatusEnum.GptProgress]:
    'AI가 대화 내용을 분석하고 있습니다...',
  [SelectAICounselSummaryStatusResAiCounselSummaryStatusEnum.GptComplete]:
    'AI 요약이 완료되었습니다.',
  [SelectAICounselSummaryStatusResAiCounselSummaryStatusEnum.GptFailed]:
    'AI 요약 생성에 실패했습니다.',
};

// UI 관련 상수
export const RECORDING_SCROLL_HEIGHT = 600;
export const EMPTY_MESSAGES = {
  AI_SUMMARY: 'AI 요약이 아직 생성되지 않았습니다.',
  RECORDING: '녹음 내용이 없습니다.',
} as const;
