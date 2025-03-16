import {
  CounselorControllerApi,
  type CounselorPageRes,
  type ResetPasswordReq,
  type UpdateCounselorReq,
} from '@/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CounselorFetchParams } from '../store/useCounselorStore';

// 상담사 관련 API 객체 생성
const counselorControllerApi = new CounselorControllerApi();

// 쿼리 키 관리
export const COUNSELOR_KEYS = {
  all: ['counselors'] as const,
  lists: () => [...COUNSELOR_KEYS.all, 'list'] as const,
  list: (filters: CounselorFetchParams) => [...COUNSELOR_KEYS.lists(), filters] as const,
  details: () => [...COUNSELOR_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...COUNSELOR_KEYS.details(), id] as const,
};

// 상담사 목록 페이지네이션 조회 훅
export const useGetCounselorsByPage = (params: CounselorFetchParams) => {
  return useQuery({
    queryKey: COUNSELOR_KEYS.list(params),
    queryFn: async () => {
      const response = await counselorControllerApi.getCounselorsByPage(
        params.page,
        params.size
      );
      return response.data as CounselorPageRes;
    },
    enabled: params.page !== undefined && params.size !== undefined,
  });
};

// 상담사 정보 업데이트 훅
export const useUpdateCounselor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      counselorId,
      updateCounselorReq
    }: { 
      counselorId: string, 
      updateCounselorReq: UpdateCounselorReq 
    }) => {
      const response = await counselorControllerApi.updateCounselor(
        counselorId,
        updateCounselorReq
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      // 상담사 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: COUNSELOR_KEYS.lists() });
      // 상담사 상세 정보 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: COUNSELOR_KEYS.detail(variables.counselorId) });
    },
  });
};

// 상담사 삭제 훅
export const useDeleteCounselor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (counselorId: string) => {
      const response = await counselorControllerApi.deleteCounselor(counselorId);
      return response.data;
    },
    onSuccess: () => {
      // 상담사 목록 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: COUNSELOR_KEYS.lists() });
    },
  });
};

// 상담사 비밀번호 초기화 훅
export const useResetPassword = () => {
  return useMutation({
    mutationFn: async ({
      counselorId,
      resetPasswordReq
    }: {
      counselorId: string,
      resetPasswordReq: ResetPasswordReq
    }) => {
      const response = await counselorControllerApi.resetPassword(
        counselorId,
        resetPasswordReq
      );
      return response.data;
    },
  });
}; 