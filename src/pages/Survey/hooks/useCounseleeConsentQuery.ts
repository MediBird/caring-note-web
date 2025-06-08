import { CounseleeConsentControllerApi } from '@/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useCounseleeConsentStore } from './counseleeConsentStore';

const counseleeConsentApi = new CounseleeConsentControllerApi();

export const useAcceptCounseleeConsentMutation = () => {
  const queryClient = useQueryClient();
  const { setLoading, setError } = useCounseleeConsentStore();

  return useMutation({
    mutationFn: async (params: { counselSessionId: string }) => {
      setLoading(true);
      try {
        const response = await counseleeConsentApi.acceptCounseleeConsent(
          params.counselSessionId,
        );
        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message ||
            '내담자 동의 처리 중 오류가 발생했습니다.';
          setError(errorMessage);
        } else {
          setError('내담자 동의 처리 중 알 수 없는 오류가 발생했습니다.');
        }
        throw error;
      } finally {
        setLoading(false);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['counseleeConsent', variables.counselSessionId],
      });
    },
  });
};
export const useDeleteCounseleeConsentMutation = () => {
  const queryClient = useQueryClient();
  const { clearConsentData, setLoading, setError } = useCounseleeConsentStore();

  return useMutation({
    mutationFn: async (params: { counselSessionId: string }) => {
      setLoading(true);
      try {
        const response = await counseleeConsentApi.deleteCounseleeConsent(
          params.counselSessionId,
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
      queryClient.invalidateQueries({
        queryKey: ['counseleeConsent', variables.counselSessionId],
      });
    },
  });
};
