import {
  CounselSessionControllerApi,
  SelectPreviousCounselSessionDetailRes,
} from '@/api';
import { useQuery } from '@tanstack/react-query';

const counselSessionControllerApi = new CounselSessionControllerApi();

const selectPreviousCounselSessionDetailList = async (
  counselSessionId: string,
  page: number = 0,
  size: number = 10,
): Promise<SelectPreviousCounselSessionDetailRes[]> => {
  const response =
    await counselSessionControllerApi.selectPreviousCounselSessionDetailList(
      counselSessionId,
      page,
      size,
    );

  return response.data.content ?? [];
};

export const usePrevCounselSessionDetailList = (
  counselSessionId: string,
  page: number = 0,
  size: number = 10,
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['prevCounselSessionDetailList', counselSessionId, page, size],
    queryFn: () =>
      selectPreviousCounselSessionDetailList(counselSessionId, page, size),
    enabled: !!counselSessionId,
  });

  return {
    prevCounselSessionDetailList: data ?? [],
    isLoading,
    error,
  };
};
