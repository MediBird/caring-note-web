import {
  AddCounselSessionReq,
  CounselSessionControllerApi,
  SelectCounselSessionRes,
  UpdateCounselSessionReq,
} from '@/api/api';
import { handleApiError } from '@/api/errorHandler';
import { useMutation, useQuery } from '@tanstack/react-query';

// 상담 세션 관련 API 선언
const counselSessionControllerApi = new CounselSessionControllerApi();

interface FetchParams {
  page: number;
  size: number;
  title?: string;
  dateRange?: string[];
  types?: string[];
  counseleeId?: string;
  counselorId?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * 상담 세션 목록 조회 쿼리 훅
 */
export const useSelectCounselSessionList = (params: FetchParams) => {
  return useQuery({
    queryKey: ['counselSessionList', params],
    queryFn: async () => {
      try {
        const {
          page,
          size,
          title,
          dateRange,
          types,
          counseleeId,
          counselorId,
          startDate,
          endDate,
        } = params;

        const response =
          await counselSessionControllerApi.selectCounselSessionList(
            page,
            size,
            title,
            counseleeId,
            counselorId,
            startDate,
            endDate,
            types?.join(','),
          );

        return response.data.data;
      } catch (error: any) {
        handleApiError(error);
        throw error;
      }
    },
  });
};

/**
 * 상담 세션 상세 조회 쿼리 훅
 */
export const useSelectCounselSessionDetail = (sessionId: string) => {
  return useQuery({
    queryKey: ['counselSessionDetail', sessionId],
    queryFn: async () => {
      try {
        if (!sessionId) return null;

        const response = await counselSessionControllerApi.selectCounselSession(
          sessionId,
        );
        return response.data.data as SelectCounselSessionRes;
      } catch (error: any) {
        handleApiError(error);
        throw error;
      }
    },
    enabled: !!sessionId,
  });
};

/**
 * 상담 세션 생성 뮤테이션 훅
 */
export const useCreateCounselSession = () => {
  return useMutation({
    mutationFn: async (sessionData: AddCounselSessionReq) => {
      try {
        const response = await counselSessionControllerApi.addCounselSession(
          sessionData,
        );
        return response.data.data;
      } catch (error: any) {
        handleApiError(error);
        throw error;
      }
    },
  });
};

/**
 * 상담 세션 수정 뮤테이션 훅
 */
export const useUpdateCounselSession = () => {
  return useMutation({
    mutationFn: async (sessionData: UpdateCounselSessionReq) => {
      try {
        const response = await counselSessionControllerApi.updateCounselSession(
          sessionData,
        );
        return response.data.data;
      } catch (error: any) {
        handleApiError(error);
        throw error;
      }
    },
  });
};

/**
 * 상담 세션 삭제 뮤테이션 훅
 */
export const useDeleteCounselSession = () => {
  return useMutation({
    mutationFn: async (sessionId: string) => {
      try {
        const response = await counselSessionControllerApi.deleteCounselSession(
          sessionId,
        );
        return response.data.data;
      } catch (error: any) {
        handleApiError(error);
        throw error;
      }
    },
  });
};

/**
 * 상담사 변경 뮤테이션 훅
 */
export const useUpdateCounselorInSession = () => {
  return useMutation({
    mutationFn: async ({
      counselSessionId,
      counselorId,
    }: {
      counselSessionId: string;
      counselorId: string;
    }) => {
      try {
        const response =
          await counselSessionControllerApi.updateCounselorInCounselSession({
            counselSessionId,
            counselorId,
          });
        return response.data.data;
      } catch (error: any) {
        handleApiError(error);
        throw error;
      }
    },
  });
};

/**
 * 상담 세션 상태 변경 뮤테이션 훅
 */
export const useUpdateSessionStatus = () => {
  return useMutation({
    mutationFn: async ({
      counselSessionId,
      status,
    }: {
      counselSessionId: string;
      status: string;
    }) => {
      try {
        const response =
          await counselSessionControllerApi.updateStatusInCounselSession({
            counselSessionId,
            status,
          });
        return response.data.data;
      } catch (error: any) {
        handleApiError(error);
        throw error;
      }
    },
  });
};
