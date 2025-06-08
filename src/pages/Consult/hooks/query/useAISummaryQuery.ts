import { AICounselSummaryControllerApi } from '@/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const aiCounselSummaryApi = new AICounselSummaryControllerApi();

// AI 요약 상태 조회 훅
export const useAISummaryStatus = (counselSessionId: string) => {
  return useQuery({
    queryKey: ['aiSummaryStatus', counselSessionId],
    queryFn: async () => {
      try {
        const response =
          await aiCounselSummaryApi.selectAICounselSummaryStatus(
            counselSessionId,
          );
        return response.data.data || null;
      } catch (error) {
        toast.error('AI 요약 상태 조회에 실패했습니다.');
        throw error;
      }
    },
    enabled: !!counselSessionId,
    refetchInterval: (query) => {
      const data = query.state.data;
      // 진행 중인 상태면 5초마다 재조회
      if (
        data?.aiCounselSummaryStatus === 'STT_PROGRESS' ||
        data?.aiCounselSummaryStatus === 'GPT_PROGRESS'
      ) {
        return 5000;
      }
      return false;
    },
  });
};

// AI 요약 텍스트 조회 훅
export const useAnalysedText = (counselSessionId: string) => {
  return useQuery({
    queryKey: ['analysedText', counselSessionId],
    queryFn: async () => {
      try {
        const response =
          await aiCounselSummaryApi.selectAnalysedText(counselSessionId);
        return response.data.data || null;
      } catch (error) {
        toast.error('AI 요약 조회에 실패했습니다.');
        throw error;
      }
    },
    enabled: !!counselSessionId,
  });
};

// STT 결과 조회 훅
export const useSpeechToText = (counselSessionId: string) => {
  return useQuery({
    queryKey: ['speechToText', counselSessionId],
    queryFn: async () => {
      try {
        const response =
          await aiCounselSummaryApi.selectSpeechToText(counselSessionId);
        return response.data.data || [];
      } catch (error) {
        toast.error('녹음 내용 조회에 실패했습니다.');
        throw error;
      }
    },
    enabled: !!counselSessionId,
  });
};

// Speech to Text 변환 시작 훅 (AI 요약 프로세스 시작)
export const useConvertSpeechToText = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (counselSessionId: string) => {
      try {
        const response =
          await aiCounselSummaryApi.convertSpeechToText(counselSessionId);
        return response.data;
      } catch (error) {
        console.error('Speech to Text 변환 실패:', error);
        throw error;
      }
    },
    onSuccess: (_, counselSessionId) => {
      // AI 요약 상태 쿼리 무효화하여 폴링 시작
      queryClient.invalidateQueries({
        queryKey: ['aiSummaryStatus', counselSessionId],
      });
      toast.success('AI 요약 처리를 시작합니다.');
    },
    onError: (error) => {
      console.error('Speech to Text 변환 실패:', error);
      toast.error('AI 요약 처리 시작에 실패했습니다.');
    },
  });
};
