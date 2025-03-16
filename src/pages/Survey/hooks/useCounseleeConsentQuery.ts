import { CounseleeConsentControllerApi } from '@/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  getAddCounseleeConsentReq,
  getUpdateCounseleeConsentReq,
  useCounseleeConsentStore,
} from './counseleeConsentStore';

const counseleeConsentApi = new CounseleeConsentControllerApi();

export const useCounseleeConsentQuery = (
  counselSessionId: string,
  counseleeId: string,
) => {
  const { setConsentData, setLoading, setError } = useCounseleeConsentStore();

  return useQuery({
    queryKey: ['counseleeConsent', counselSessionId, counseleeId],
    queryFn: async () => {
      setLoading(true);
      try {
        const response =
          await counseleeConsentApi.selectCounseleeConsentByCounseleeId(
            counselSessionId,
            counseleeId,
          );
        const consentData = response.data.data || {};
        setConsentData(consentData);
        return consentData;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message ||
            '내담자 동의 정보 조회 중 오류가 발생했습니다.';
          setError(errorMessage);
        } else {
          setError('내담자 동의 정보 조회 중 알 수 없는 오류가 발생했습니다.');
        }
        return {};
      } finally {
        setLoading(false);
      }
    },
    enabled: !!counselSessionId && !!counseleeId,
  });
};

export const useCreateCounseleeConsentMutation = () => {
  const queryClient = useQueryClient();
  const { setLoading, setError } = useCounseleeConsentStore();

  return useMutation({
    mutationFn: async (params: {
      counselSessionId: string;
      counseleeId: string;
      consent: boolean;
    }) => {
      setLoading(true);
      try {
        const request = getAddCounseleeConsentReq(
          params.counselSessionId,
          params.counseleeId,
          params.consent,
        );
        const response = await counseleeConsentApi.addCounseleeConsent(request);
        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message ||
            '내담자 동의 생성 중 오류가 발생했습니다.';
          setError(errorMessage);
        } else {
          setError('내담자 동의 생성 중 알 수 없는 오류가 발생했습니다.');
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (_, variables) => {
      // 쿼리 캐시 갱신
      queryClient.invalidateQueries({
        queryKey: [
          'counseleeConsent',
          variables.counselSessionId,
          variables.counseleeId,
        ],
      });
    },
  });
};

export const useUpdateCounseleeConsentMutation = () => {
  const queryClient = useQueryClient();
  const { setLoading, setError } = useCounseleeConsentStore();

  return useMutation({
    mutationFn: async (params: {
      counseleeConsentId: string;
      counselSessionId: string;
      counseleeId: string;
      consent: boolean;
    }) => {
      setLoading(true);
      try {
        const request = getUpdateCounseleeConsentReq(
          params.counseleeConsentId,
          params.consent,
        );
        const response =
          await counseleeConsentApi.updateCounseleeConsent(request);
        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message ||
            '내담자 동의 수정 중 오류가 발생했습니다.';
          setError(errorMessage);
        } else {
          setError('내담자 동의 수정 중 알 수 없는 오류가 발생했습니다.');
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (_, variables) => {
      // 쿼리 캐시 갱신
      queryClient.invalidateQueries({
        queryKey: [
          'counseleeConsent',
          variables.counselSessionId,
          variables.counseleeId,
        ],
      });
    },
  });
};

export const useDeleteCounseleeConsentMutation = () => {
  const queryClient = useQueryClient();
  const { clearConsentData, setLoading, setError } = useCounseleeConsentStore();

  return useMutation({
    mutationFn: async (params: {
      counseleeConsentId: string;
      counselSessionId: string;
      counseleeId: string;
    }) => {
      setLoading(true);
      try {
        const response = await counseleeConsentApi.deleteCounseleeConsent(
          params.counseleeConsentId,
        );
        clearConsentData();
        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message ||
            '내담자 동의 삭제 중 오류가 발생했습니다.';
          setError(errorMessage);
        } else {
          setError('내담자 동의 삭제 중 알 수 없는 오류가 발생했습니다.');
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (_, variables) => {
      // 쿼리 캐시 갱신
      queryClient.invalidateQueries({
        queryKey: [
          'counseleeConsent',
          variables.counselSessionId,
          variables.counseleeId,
        ],
      });
    },
  });
};
