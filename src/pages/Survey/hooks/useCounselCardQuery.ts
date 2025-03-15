import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  AddCounselCardReq,
  CounselCardControllerApi,
  UpdateCounselCardReq,
} from '../../../api/api';
import {
  getAddCounselCardReq,
  getUpdateCounselCardReq,
  useCounselCardStore,
} from './counselCardStore';

const counselCardApi = new CounselCardControllerApi();

export const useCounselCardQuery = (counselSessionId: string) => {
  const { setCounselCardData, setLoading, setError } = useCounselCardStore();

  return useQuery({
    queryKey: ['counselCard', counselSessionId],
    queryFn: async () => {
      setLoading(true);
      try {
        const response =
          await counselCardApi.selectCounselCard(counselSessionId);
        setCounselCardData(response.data.data || {});
        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message ||
            '상담 카드 조회 중 오류가 발생했습니다.';
          setError(errorMessage);
        } else {
          setError('상담 카드 조회 중 알 수 없는 오류가 발생했습니다.');
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled: !!counselSessionId,
  });
};

export const useLastRecordedCounselCardQuery = (counseleeId: string) => {
  const { setCounselCardData, setLoading, setError } = useCounselCardStore();

  return useQuery({
    queryKey: ['lastRecordedCounselCard', counseleeId],
    queryFn: async () => {
      setLoading(true);
      try {
        const response =
          await counselCardApi.selectLastRecordedCounselCard(counseleeId);
        setCounselCardData(response.data.data || {});
        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message ||
            '이전 상담 카드 조회 중 오류가 발생했습니다.';
          setError(errorMessage);
        } else {
          setError('이전 상담 카드 조회 중 알 수 없는 오류가 발생했습니다.');
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled: !!counseleeId,
  });
};

export const useCreateCounselCardMutation = () => {
  const queryClient = useQueryClient();
  const { setLoading, setError } = useCounselCardStore();

  return useMutation({
    mutationFn: async (params: {
      counselSessionId: string;
      counselCardData: Partial<AddCounselCardReq>;
    }) => {
      setLoading(true);
      try {
        const request = getAddCounselCardReq(
          params.counselSessionId,
          params.counselCardData,
        );
        const response = await counselCardApi.addCounselCard(request);
        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message ||
            '상담 카드 생성 중 오류가 발생했습니다.';
          setError(errorMessage);
        } else {
          setError('상담 카드 생성 중 알 수 없는 오류가 발생했습니다.');
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (_, variables) => {
      // 쿼리 캐시 갱신
      queryClient.invalidateQueries({
        queryKey: ['counselCard', variables.counselSessionId],
      });
    },
  });
};

export const useUpdateCounselCardMutation = () => {
  const queryClient = useQueryClient();
  const { setLoading, setError } = useCounselCardStore();

  return useMutation({
    mutationFn: async (params: {
      counselSessionId: string;
      counselCardData: Partial<UpdateCounselCardReq>;
    }) => {
      setLoading(true);
      try {
        const request = getUpdateCounselCardReq(
          params.counselSessionId,
          params.counselCardData,
        );
        const response = await counselCardApi.updateCounselCard(request);
        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message ||
            '상담 카드 수정 중 오류가 발생했습니다.';
          setError(errorMessage);
        } else {
          setError('상담 카드 수정 중 알 수 없는 오류가 발생했습니다.');
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (_, variables) => {
      // 쿼리 캐시 갱신
      queryClient.invalidateQueries({
        queryKey: ['counselCard', variables.counselSessionId],
      });
    },
  });
};

export const useDeleteCounselCardMutation = () => {
  const queryClient = useQueryClient();
  const { clearCounselCardData, setLoading, setError } = useCounselCardStore();

  return useMutation({
    mutationFn: async (counselSessionId: string) => {
      setLoading(true);
      try {
        const response =
          await counselCardApi.deleteCounselCard(counselSessionId);
        clearCounselCardData();
        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message ||
            '상담 카드 삭제 중 오류가 발생했습니다.';
          setError(errorMessage);
        } else {
          setError('상담 카드 삭제 중 알 수 없는 오류가 발생했습니다.');
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (_, counselSessionId) => {
      // 쿼리 캐시 갱신
      queryClient.invalidateQueries({
        queryKey: ['counselCard', counselSessionId],
      });
    },
  });
};
