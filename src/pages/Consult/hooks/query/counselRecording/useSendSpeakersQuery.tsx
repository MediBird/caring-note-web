import { AICounselSummaryControllerApi, AnalyseTextReq } from '@/api';
import { useMutation } from '@tanstack/react-query';

const aiCounselSummaryControllerApi = new AICounselSummaryControllerApi();

const analyseText = async (counselSessionId: string, speakers?: string[]) => {
  const response = await aiCounselSummaryControllerApi.analyseText({
    counselSessionId,
    speakers,
  });
  return response.data;
};

export const useSendSpeakersQuery = () => {
  const { mutate: sendSpeakers } = useMutation({
    mutationFn: (data: AnalyseTextReq) => {
      return analyseText(data.counselSessionId, data.speakers);
    },
  });

  return { sendSpeakers };
};
