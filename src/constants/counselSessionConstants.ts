import { SearchCounselSessionsStatusesEnum } from '@/api';

/**
 * API에서 사용하는 상담 세션 상태 Enum입니다.
 * 필터 및 테이블 컬럼 정의 시 사용됩니다.
 */
export { SearchCounselSessionsStatusesEnum };

/**
 * 상담 세션 상태에 대한 한글 라벨 매핑입니다.
 */
export const COUNSEL_SESSION_STATUS_LABELS: Record<
  SearchCounselSessionsStatusesEnum,
  string
> = {
  [SearchCounselSessionsStatusesEnum.Scheduled]: '예정',
  [SearchCounselSessionsStatusesEnum.InProgress]: '진행',
  [SearchCounselSessionsStatusesEnum.Completed]: '완료',
  [SearchCounselSessionsStatusesEnum.Canceled]: '취소',
};
