import { CounselSessionControllerApi } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { SelectPreviousCounselSessionListRes } from '@/api/api';

export interface PrevCounselSessionListDTO
  extends SelectPreviousCounselSessionListRes {
  id: string | undefined;
}

const counselSessionControllerApi = new CounselSessionControllerApi();

const getPrevCounselSessionList = async (
  counselSessionId: string | undefined,
) => {
  if (!counselSessionId) return;

  const response =
    await counselSessionControllerApi.selectPreviousCounselSessionList(
      counselSessionId,
    );

  return response.data;
};

export const usePrevCounselSessionList = (
  counselSessionId: string | undefined,
) => {
  const { data, isLoading } = useQuery({
    queryKey: ['prevCounselSessionList', counselSessionId],
    queryFn: () => getPrevCounselSessionList(counselSessionId),
    enabled: !!counselSessionId,
    select: (data) => {
      return data?.data?.map((item) => ({
        ...item,
        id: item.counselSessionId,
      }));
    },
  });

  return {
    prevCounselSessionList: data ?? [],
    isLoading,
  };
};
