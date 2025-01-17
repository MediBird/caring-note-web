import {
  CounselCardControllerApi,
  AddCounselCardReq,
  AddCounselCardRes,
  UpdateCounselCardReq,
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
  return response.data.data;
};
// 실제 사용하는 커스텀 훅
export const useSelectCounselCard = (counselSessionId: string) => {
  return useQuery({
    queryKey: ['counselcard', counselSessionId],
    queryFn: () => selectCounselCard(counselSessionId),
    enabled: !!counselSessionId,
  });
};

// 상담 카드 등록
const addCounselAssistant = async (counselAssistant: AddCounselCardReq) => {
  // 상담 카드 등록 API 호출
  const response = await counselCardControllerApi.addCounselCard(
    counselAssistant,
  );
  return response.data.data as AddCounselCardRes;
};

// 실제 사용하는 커스텀 훅
export const usePostCounselAssistant = () => {
  return useMutation({
    mutationFn: addCounselAssistant,
  });
};

// 상담 카드 수정
const updateCounselAssistant = async (
  counselAssistant: UpdateCounselCardReq,
) => {
  // 상담 카드 수정 API 호출
  const response = await counselCardControllerApi.updateCounselCard(
    counselAssistant,
  );
  return response.data.data as AddCounselCardRes;
};

// 실제 사용하는 커스텀 훅
export const useUpdateCounselAssistant = () => {
  return useMutation({
    mutationFn: updateCounselAssistant,
  });
};
