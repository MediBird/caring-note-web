import { CounselSessionControllerApi } from '@/api/api';
import { useQuery } from '@tanstack/react-query';

interface FetchParams {
  baseDate?: string;
  cursor?: string;
  size?: number;
}

const counselSessionControllerApi = new CounselSessionControllerApi();

//상담 일정 목록 조회
const selectCounselSessionList = async (params: FetchParams) => {
  // 상담 일정 목록 조회 API 호출
  const response =
    await counselSessionControllerApi.selectCounselSessionListByBaseDateAndCursorAndSize(
      params.baseDate,
      params.cursor,
      params.size,
    );
  return response.data.data ?? [];
};

// 쿼리키를 상수로 정의
export const COUNSEL_SESSION_KEYS = {
  all: ['counselSession'] as const,
  list: (params: FetchParams) =>
    [...COUNSEL_SESSION_KEYS.all, 'list', params] as const,
} as const;

export const useSelectCounselSessionList = (params: FetchParams) =>
  useQuery({
    queryKey: COUNSEL_SESSION_KEYS.list(params),
    queryFn: () => selectCounselSessionList(params),
    enabled: !!params,
  });

// 이전 상담 내역 조회
const selectPreviousCounselSessionList = async (counselSessionId: string) => {
  const response =
    await counselSessionControllerApi.selectPreviousCounselSessionList(
      counselSessionId,
    );

  return response.data.data ?? [];
};

export const COUNSEL_SESSION_PREVIOUS_KEYS = {
  all: ['previousCounselSession'] as const,
  list: (counselSessionId: string) =>
    [...COUNSEL_SESSION_PREVIOUS_KEYS.all, 'list', counselSessionId] as const,
} as const;

// 이전 상담 내역 조회 쿼리 훅
export const useSelectPreviousCounselSessionList = (
  counselSessionId: string,
) => {
  const { data, isLoading } = useQuery({
    queryKey: COUNSEL_SESSION_PREVIOUS_KEYS.list(counselSessionId),
    queryFn: async () => {
      const data = await selectPreviousCounselSessionList(counselSessionId);

      return data ?? []; // undefined 방지 (빈 배열 반환)
    },
    enabled: !!counselSessionId,
  });

  return { data, isLoading };
};
