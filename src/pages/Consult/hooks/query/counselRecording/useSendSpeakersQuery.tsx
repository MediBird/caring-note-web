import { AICounselSummaryControllerApi, AnalyseTextReq } from '@/api';
import { useMutation } from '@tanstack/react-query';

const aiCounselSummaryControllerApi = new AICounselSummaryControllerApi();

const analyseText = async (counselSessionId: string) => {
  const response = await aiCounselSummaryControllerApi.analyseText({
    counselSessionId,
  });
  return response.data;
};

export const useSendSpeakersQuery = () => {
  const { mutate: sendSpeakers } = useMutation({
    mutationFn: (data: AnalyseTextReq) => {
      return analyseText(data.counselSessionId);
    },
  });

  return { sendSpeakers };
};
