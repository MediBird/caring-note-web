import { AICounselSummaryControllerApi } from '@/api';
import { RecordingStatus } from '@/pages/Consult/types/Recording.enum';
import { useQuery } from '@tanstack/react-query';

const aiCounselSummaryControllerApi = new AICounselSummaryControllerApi();

const selectSpeechToText = async (counselSessionId: string) => {
  const response = await aiCounselSummaryControllerApi.selectSpeechToText(
    counselSessionId,
  );

  return response.data.data || [];
};

export const useGetSpeechToTextQuery = (
  counselSessionId: string | undefined = '',
  recordingStatus: RecordingStatus,
) => {
  const { data, isSuccess } = useQuery({
    queryKey: ['selectSpeechToText', counselSessionId],
    queryFn: () => selectSpeechToText(counselSessionId),
    enabled:
      !!counselSessionId && recordingStatus === RecordingStatus.AICompleted,
  });

  return { data, isSuccess };
};
