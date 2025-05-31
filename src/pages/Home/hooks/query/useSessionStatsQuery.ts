import { useQuery } from '@tanstack/react-query';
import { CounselSessionControllerApi } from '@/api/api';
import { useSessionStatsStore } from '../useSessionStatsStore';

const api = new CounselSessionControllerApi();

export const useSessionStatsQuery = () => {
  const { setData, setLoading, setError } = useSessionStatsStore();

  return useQuery({
    queryKey: ['sessionStats'],
    queryFn: async () => {
      setLoading(true);
      try {
        const response = await api.getSessionStats();
        const statsData = response.data.data;
        if (statsData) {
          setData(statsData);
        }
        return statsData;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : '통계 데이터를 불러오는데 실패했습니다.';
        setError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    staleTime: 5 * 60 * 1000, // 5분간 데이터를 신선하게 유지
    refetchOnWindowFocus: false,
  });
};
