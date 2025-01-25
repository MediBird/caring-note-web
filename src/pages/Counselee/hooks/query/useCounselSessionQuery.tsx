import { AddCounselSessionReq, CounselSessionControllerApi } from '@/api/api';
import { useMutation } from '@tanstack/react-query';

// 상담 세션 관련 API 선언
const counselSessionControlerrApi = new CounselSessionControllerApi();

// 상담 세션 추가
const addCounselSession = async (counselSessionReq: AddCounselSessionReq) => {
  // 상담 세션 추가 API 호출
  const response = await counselSessionControlerrApi.addCounselSession(
    counselSessionReq,
  );
  return response.data.data as string;
};

// 실제 사용하는 커스텀 훅
export const useAddCounselSession = () => {
  return useMutation({
    mutationFn: addCounselSession,
  });
};
