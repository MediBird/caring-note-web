import { CounselSessionControllerApi } from '@/api/api';
import { useQuery } from '@tanstack/react-query';

interface FetchParams {
  baseDate?: string;
  cursor?: string;
  size: number;
}

const counselSessionControllerApi = new CounselSessionControllerApi();

//상담 일정 목록 조회
const selectCounselSessionList = async (params: FetchParams) => {
  // 상담 일정 목록 조회 API 호출
  const response =
    await counselSessionControllerApi.selectCounselSessionListByBaseDateAndCursorAndSize(
      params.baseDate,
      params.cursor,
      params.size,
    );
  return response.data.data;
};

//실제 사용하는 커스텀 훅
export const useSelectCounselSessionList = (params: FetchParams) =>
  useQuery({
    queryKey: ['dataItems', params],
    queryFn: () => selectCounselSessionList(params),
    enabled: !!params,
  });
