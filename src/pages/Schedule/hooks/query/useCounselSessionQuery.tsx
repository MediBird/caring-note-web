import {
  AddCounselSessionReq,
  CounselorControllerApiFactory,
  CounselSessionControllerApiFactory,
  DefaultApiFactory,
  DeleteCounselSessionReq,
  UpdateCounselSessionReq,
} from '@/api/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// 상담 세션 생성
export const useAddCounselSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newCounselSession: AddCounselSessionReq) => {
      return DefaultApiFactory().addCounselSession(newCounselSession);
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
    mutationFn: (updateParams: UpdateCounselSessionReq) => {
      return DefaultApiFactory().updateCounselSession(updateParams);
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

// 상담 세션 검색
export const useSearchCounselSessions = (
  page: number,
  size: number,
  counseleeNameKeyword?: string,
  counselorNames?: string[],
  scheduledDates?: string[],
  enabled = true,
) => {
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
    enabled: enabled,
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
