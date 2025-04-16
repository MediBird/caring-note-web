import {
  CounselSessionControllerApi,
  CreateCounselReservationReq,
  DeleteCounselSessionReq,
  ModifyCounselReservationReq,
} from '@/api';
import { InfoToast } from '@/components/ui/costom-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface FetchParams {
  baseDate?: string;
  cursor?: string;
  size?: number;
}

const HIGHLIGHT_DURATION = 2000;

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
    onSuccess: (response) => {
      // 새로 생성된 세션의 ID 가져오기
      const newSessionId = response.data.data?.id;

      // 상담 세션 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: COUNSEL_SESSION_KEYS.all });
      // 검색 쿼리도 함께 무효화 (Schedule 페이지에서 사용하는 쿼리)
      queryClient.invalidateQueries({
        queryKey: ['counselSession', 'search'],
      });

      // 새로 생성된 세션 ID를 캐시에 저장
      if (newSessionId) {
        queryClient.setQueryData(['highlightedSession'], newSessionId);

        // 일정 시간 후 하이라이트 제거
        setTimeout(() => {
          queryClient.setQueryData(['highlightedSession'], null);
        }, HIGHLIGHT_DURATION); // 3초 후 하이라이트 제거
      }

      InfoToast({ message: '상담 일정이 생성되었습니다.' });
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
    onSuccess: (_response, variables) => {
      // 수정된 세션의 ID 가져오기
      const updatedSessionId = variables.counselSessionId;

      // 상담 세션 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: COUNSEL_SESSION_KEYS.all });
      // 검색 쿼리도 함께 무효화 (Schedule 페이지에서 사용하는 쿼리)
      queryClient.invalidateQueries({
        queryKey: ['counselSession', 'search'],
      });

      // 수정된 세션 ID를 캐시에 저장
      if (updatedSessionId) {
        queryClient.setQueryData(['highlightedSession'], updatedSessionId);

        // 일정 시간 후 하이라이트 제거
        setTimeout(() => {
          queryClient.setQueryData(['highlightedSession'], null);
        }, HIGHLIGHT_DURATION); // 3초 후 하이라이트 제거
      }

      InfoToast({ message: '상담 일정이 수정되었습니다.' });
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
      InfoToast({ message: '상담 일정이 삭제되었습니다.' });
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

// 하이라이트된 세션 ID를 가져오는 훅
export const useHighlightedSession = () => {
  return useQuery({
    queryKey: ['highlightedSession'],
    queryFn: () => null,
    initialData: null,
  });
};
