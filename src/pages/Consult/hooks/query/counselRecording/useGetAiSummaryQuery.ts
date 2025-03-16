import { AICounselSummaryControllerApi } from '@/api';
import { RecordingStatus } from '@/pages/Consult/types/Recording.enum';
import { useQuery } from '@tanstack/react-query';

const aiCounselSummaryControllerApi = new AICounselSummaryControllerApi();

const selectAnalysedText = async (counselSessionId: string) => {
  const response = await aiCounselSummaryControllerApi.selectAnalysedText(
    counselSessionId,
  );

  return response.data.data || {};
};

export const useGetAiSummaryQuery = (
  counselSessionId: string | undefined = '',
  recordingStatus: RecordingStatus,
) => {
  const { data, isSuccess } = useQuery({
    queryKey: ['selectAnalysedText', counselSessionId],
    queryFn: () => selectAnalysedText(counselSessionId),
    enabled:
      !!counselSessionId && recordingStatus === RecordingStatus.AICompleted,
  });

  return { data, isSuccess };
};
