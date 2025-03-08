import {
  CounselSessionControllerApi,
  CreateCounselReservationReq,
  DeleteCounselSessionReq,
  ModifyCounselReservationReq,
} from '@/api/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

// 상담 세션 생성 mutation
export const useCreateCounselSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newSession: CreateCounselReservationReq) => {
      return counselSessionControllerApi.createCounselReservation(newSession);
    },
    onSuccess: () => {
      // 상담 세션 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: COUNSEL_SESSION_KEYS.all });
      // 검색 쿼리도 함께 무효화 (Schedule 페이지에서 사용하는 쿼리)
      queryClient.invalidateQueries({
        queryKey: ['counselSession', 'search'],
      });
    },
  });
};

// 상담 세션 수정 mutation
export const useUpdateCounselSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updateParams: ModifyCounselReservationReq) => {
      return counselSessionControllerApi.modifyCounselReservation(updateParams);
    },
    onSuccess: () => {
      // 상담 세션 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: COUNSEL_SESSION_KEYS.all });
      // 검색 쿼리도 함께 무효화 (Schedule 페이지에서 사용하는 쿼리)
      queryClient.invalidateQueries({
        queryKey: ['counselSession', 'search'],
      });
    },
  });
};

// 상담 세션 삭제 mutation
export const useDeleteCounselSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: DeleteCounselSessionReq) => {
      return counselSessionControllerApi.deleteCounselSession(params);
    },
    onSuccess: () => {
      // 상담 세션 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: COUNSEL_SESSION_KEYS.all });
      // 검색 쿼리도 함께 무효화 (Schedule 페이지에서 사용하는 쿼리)
      queryClient.invalidateQueries({
        queryKey: ['counselSession', 'search'],
      });
    },
  });
};

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
