import { AICounselSummaryControllerApi } from '@/api';
import { useQuery } from '@tanstack/react-query';
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
        return response.data.data;
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
        return response.data.data;
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
        return response.data.data;
      } catch (error) {
        toast.error('녹음 내용 조회에 실패했습니다.');
        throw error;
      }
    },
    enabled: !!counselSessionId,
  });
};
