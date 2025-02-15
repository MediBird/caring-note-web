import { AICounselSummaryControllerApi } from '@/api';
import { RecordingStatus } from '@/types/Recording.enum';
import { useQuery } from '@tanstack/react-query';

const aiCounselSummaryControllerApi = new AICounselSummaryControllerApi();

const selectAICounselSummaryStatus = async (counselSessionId: string) => {
  const response =
    await aiCounselSummaryControllerApi.selectAICounselSummaryStatus(
      counselSessionId,
    );

  return response.data.data;
};

export const useGetRecordingStatusQuery = (
  counselSessionId: string | undefined = '',
  recordingStatus: RecordingStatus,
) => {
  const { data, isSuccess } = useQuery({
    queryKey: ['selectAICounselSummaryStatus', counselSessionId],
    queryFn: () => selectAICounselSummaryStatus(counselSessionId),
    enabled:
      recordingStatus ===
      (RecordingStatus.STTLoading || RecordingStatus.AILoading),
    refetchInterval: 1000,
  });

  return { data, isSuccess };
};
