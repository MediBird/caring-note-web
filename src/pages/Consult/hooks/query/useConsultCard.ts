import { CommonResSelectCounselCardRes, CounselCardControllerApi } from '@/api';
import useConsultCardStore from '@/pages/Consult/hooks/store/consultCardStore';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useEffect } from 'react';
import { AxiosResponse } from 'axios';

export const useConsultCard = (counselSessionId: string | undefined) => {
  const counselCardControllerApi = useMemo(
    () => new CounselCardControllerApi(),
    [],
  );

  const { setOriginalData, setEditedData, setHttpStatus } =
    useConsultCardStore();

  const { data, isSuccess } = useQuery({
    queryKey: ['consultCard', counselSessionId],
    queryFn: async () => {
      if (!counselSessionId) return null;
      return await counselCardControllerApi.selectCounselCard(counselSessionId);
    },
    enabled: !!counselSessionId,
  });

  useEffect(() => {
    if (isSuccess && data) {
      const response = data as AxiosResponse<CommonResSelectCounselCardRes>;
      const status = response.status || 0;
      const responseData = status === 204 ? {} : response.data?.data || {};

      setHttpStatus(status);
      setOriginalData(responseData);
      setEditedData(responseData);
    }
  }, [isSuccess, data, setHttpStatus, setOriginalData, setEditedData]);

  return {
    consultCardData: data?.data?.data,
    isSuccess,
  };
};
