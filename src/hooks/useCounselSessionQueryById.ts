import { CounselSessionControllerApi } from '@/api/api/counsel-session-controller-api';
import { useQuery } from '@tanstack/react-query';

const counselSessionControllerApi = new CounselSessionControllerApi();

const getCounselSessionById = async (counselSessionId: string) => {
  const response =
    await counselSessionControllerApi.selectCounselSession(counselSessionId);
  return response.data.data;
};

const useCounselSessionQueryById = (counselSessionId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['counselSession', counselSessionId],
    queryFn: () => getCounselSessionById(counselSessionId),
    enabled: !!counselSessionId,
  });

  return { data, isLoading };
};

export default useCounselSessionQueryById;
