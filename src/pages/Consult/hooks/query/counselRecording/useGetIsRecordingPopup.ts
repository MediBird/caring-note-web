import { AICounselSummaryControllerApi } from '@/api';
import { useQuery } from '@tanstack/react-query';

const aiCounselSummaryControllerApi = new AICounselSummaryControllerApi();

const selectAICounselSummaryPopUp = async (counselSessionId: string) => {
  const response =
    await aiCounselSummaryControllerApi.selectAICounselSummaryPopUp(
      counselSessionId,
    );

  return response.data.data?.isPopup || false;
};

export const useGetIsRecordingPopup = (
  counselSessionId: string | undefined = '',
) => {
  const { data, isSuccess } = useQuery({
    queryKey: ['selectAICounselSummaryPopUp', counselSessionId],
    queryFn: () => selectAICounselSummaryPopUp(counselSessionId),
    enabled: !!counselSessionId,
  });

  return { data, isSuccess };
};
