import { AICounselSummaryControllerApi } from '@/api';
import { RecordingStatus } from '@/pages/Consult/types/Recording.enum';
import { useQuery } from '@tanstack/react-query';

const aiCounselSummaryControllerApi = new AICounselSummaryControllerApi();

const selectSpeakerList = async (counselSessionId: string) => {
  const response = await aiCounselSummaryControllerApi.selectSpeakerList(
    counselSessionId,
  );

  return response.data.data || [];
};

export const useGetRecordingSpeakersQuery = (
  counselSessionId: string | undefined = '',
  recordingStatus: RecordingStatus,
) => {
  const { data, isSuccess } = useQuery({
    queryKey: ['selectSpeakerList', counselSessionId],
    queryFn: () => selectSpeakerList(counselSessionId),
    enabled:
      !!counselSessionId && recordingStatus === RecordingStatus.STTCompleted,
  });

  return { data, isSuccess };
};
