import { CommonResListLocalDate, CounselSessionControllerApi } from '@/api';
import { useQuery } from '@tanstack/react-query';

const counselSessionControllerApi = new CounselSessionControllerApi();

interface CounselActiveDateQueryKeys {
  year: number;
  month: number;
}

const getCounselActiveDates = async ({
  year,
  month,
}: CounselActiveDateQueryKeys): Promise<CommonResListLocalDate> => {
  try {
    const prevDate = {
      year: month === 1 ? year - 1 : year,
      month: month === 1 ? 12 : month - 1,
    };
    const nextDate = {
      year: month === 12 ? year + 1 : year,
      month: month === 12 ? 1 : month + 1,
    };

    // 3개의 API 요청을 동시에 실행
    const [prevResponse, currentResponse, nextResponse] = await Promise.all([
      counselSessionControllerApi.getSessionDatesByYearAndMonth(
        prevDate.year,
        prevDate.month,
      ),
      counselSessionControllerApi.getSessionDatesByYearAndMonth(year, month),
      counselSessionControllerApi.getSessionDatesByYearAndMonth(
        nextDate.year,
        nextDate.month,
      ),
    ]);

    return {
      data: [
        ...(prevResponse.data.data || []),
        ...(currentResponse.data.data || []),
        ...(nextResponse.data.data || []),
      ],
    };
  } catch (error) {
    console.error('상담 가능 날짜 조회 중 오류 발생:', error);
    return { data: [] };
  }
};

export const useCounselActiveDate = ({
  year,
  month,
}: CounselActiveDateQueryKeys) => {
  const { data, isLoading } = useQuery({
    queryKey: ['counselActiveDate', year, month],
    queryFn: () => getCounselActiveDates({ year, month }),
  });

  return { data: data?.data ?? [], isLoading };
};
