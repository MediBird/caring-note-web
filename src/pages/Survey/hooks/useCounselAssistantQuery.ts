import {
  CounselCardControllerApi,
  AddCounselCardReq,
  AddCounselCardRes,
  UpdateCounselCardReq,
  SelectCounselCardRes,
  UpdateCounselCardRes,
} from '@/api/api';
import { useMutation, useQuery } from '@tanstack/react-query';

// 상담 카드 관련 API 선언
const counselCardControllerApi = new CounselCardControllerApi();

// 상담 카드 조회
const selectCounselCard = async (counselSessionId: string) => {
  // 상담 카드 조회 API 호출
  const response = await counselCardControllerApi.selectCounselCard(
    counselSessionId,
  );
  return response || ({} as SelectCounselCardRes);
};
// 실제 사용하는 커스텀 훅
export const useSelectCounselCard = (counselSessionId: string) => {
  return useQuery({
    queryKey: ['counselcard', counselSessionId],
    queryFn: () => selectCounselCard(counselSessionId),
    enabled: !!counselSessionId,
  });
};

// 상담 카드 설문 등록
const addCounselSurvey = async (counselSurvey: AddCounselCardReq) => {
  // 상담 카드 설문 등록 API 호출
  const response = await counselCardControllerApi.addCounselCard(counselSurvey);
  return response.data.data as AddCounselCardRes;
};

// 실제 사용하는 커스텀 훅
export const usePostCounselSurvey = () => {
  return useMutation({
    mutationFn: addCounselSurvey,
  });
};

// 상담 카드 설문 수정
const updateCounselSurvey = async (counselSurvey: UpdateCounselCardReq) => {
  // 상담 카드 설문 수정 API 호출
  const response = await counselCardControllerApi.updateCounselCard(
    counselSurvey,
  );
  return response.data.data as UpdateCounselCardRes;
};

// 실제 사용하는 커스텀 훅
export const useUpdateCounselSurvey = () => {
  return useMutation({
    mutationFn: updateCounselSurvey,
  });
};
