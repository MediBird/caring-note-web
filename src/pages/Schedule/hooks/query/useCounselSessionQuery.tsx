import {
  CounselorControllerApiFactory,
  CounselSessionControllerApiFactory,
  CreateCounselReservationReq,
  DefaultApiFactory,
  DeleteCounselSessionReq,
  ModifyCounselReservationReq,
} from '@/api/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 상담 세션 생성
export const useAddCounselSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newCounselSession: CreateCounselReservationReq) => {
      return DefaultApiFactory().createCounselReservation(newCounselSession);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counselSessions'] });
    },
  });
};

// 상담 세션 업데이트
export const useUpdateCounselSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updateParams: ModifyCounselReservationReq) => {
      return DefaultApiFactory().modifyCounselReservation(updateParams);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counselSessions'] });
    },
  });
};

// 상담 세션 삭제
export const useDeleteCounselSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: DeleteCounselSessionReq) => {
      return DefaultApiFactory().deleteCounselSession(params);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['counselSessions'] });
    },
  });
};

// 상담 세션 목록 조회 (페이지네이션)
export const useCounselSessionList = (
  baseDate?: string,
  cursor?: string,
  size?: number,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['counselSessions', baseDate, cursor, size],
    queryFn: () =>
      DefaultApiFactory().selectCounselSessionListByBaseDateAndCursorAndSize(
        baseDate,
        cursor,
        size,
      ),
    enabled: enabled,
    select: (response) => response.data?.data,
  });
};

/**
 * 키워드가 유효한지 검증하는 함수
 * 한글(가~힣)과 영문(a~z, A~Z)으로만 구성된 문자열인지 확인
 */
const isValidKeyword = (keyword?: string): boolean => {
  if (!keyword) return true; // 키워드가 없는 경우 유효함

  // 한글 또는 영문 문자만 허용하는 정규식
  const validPattern = /^[가-힣a-zA-Z]+$/;
  return validPattern.test(keyword);
};

// 상담 세션 검색
export const useSearchCounselSessions = (
  page: number,
  size: number,
  counseleeNameKeyword?: string,
  counselorNames?: string[],
  scheduledDates?: string[],
  enabled = true,
) => {
  // 키워드 유효성 검증
  const isKeywordValid = isValidKeyword(counseleeNameKeyword);

  // 쿼리 활성화 여부 : enabled 파라미터와 키워드 유효성에 따라 결정
  // 키워드가 없거나 유효하면 쿼리 활성화, 키워드가 유효하지 않으면 비활성화
  const shouldEnableQuery = enabled && isKeywordValid;

  return useQuery({
    queryKey: [
      'searchCounselSessions',
      page,
      size,
      counseleeNameKeyword,
      counselorNames,
      scheduledDates,
    ],
    queryFn: () =>
      DefaultApiFactory().searchCounselSessions(
        page,
        size,
        counseleeNameKeyword,
        counselorNames,
        scheduledDates,
      ),
    enabled: shouldEnableQuery,
    select: (response) => response.data?.data,
  });
};

// 상담사 목록 조회
export const useCounselorList = (enabled = true) => {
  return useQuery({
    queryKey: ['counselorNames'],
    queryFn: () => CounselorControllerApiFactory().getCounselorNames(),
    enabled: enabled,
    select: (response) => response.data?.counselorNames,
  });
};

// 월별 상담 세션 날짜 조회
export const useSessionDatesByMonth = (
  year: number,
  month: number,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['sessionDates', year, month],
    queryFn: () =>
      CounselSessionControllerApiFactory().getSessionDatesByYearAndMonth(
        year,
        month,
      ),
    enabled: enabled,
    select: (response) => response.data?.data,
  });
};
