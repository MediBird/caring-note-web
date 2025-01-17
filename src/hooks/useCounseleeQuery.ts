import {
  CounseleeControllerApi,
  SelectCounseleeBaseInformationByCounseleeIdRes,
} from '@/api/api';
import { useQuery } from '@tanstack/react-query';

const counseleeControllerApi = new CounseleeControllerApi();
//내담자 기본 정보 조회
const selectBaseInformation = async (counselSessionId: string) => {
  // 내담자 기본 정보 조회 API 호출
  const response = await counseleeControllerApi.selectCounseleeBaseInformation(
    counselSessionId,
  );
  return response.data.data as SelectCounseleeBaseInformationByCounseleeIdRes;
};

//실제 사용하는 커스텀 훅
export const useSelectCounseleeInfo = (counselSessionId: string) =>
  useQuery({
    queryKey: ['counseleeInfo', counselSessionId],
    queryFn: () => selectBaseInformation(counselSessionId),
    enabled: !!counselSessionId,
  });
