import {
  AddCounseleeConsentReq,
  AddCounseleeConsentRes,
  CounseleeConsentControllerApi,
} from '@/api/api';
import { useMutation, useQuery } from '@tanstack/react-query';

const counseleeConsentControllerApi = new CounseleeConsentControllerApi();

//내담자 개인정보 수집 동의 여부 조회
const selectCounseleeConsent = async ({
  paramId,
  queryId,
}: {
  paramId: string;
  queryId: string;
}) => {
  // 내담자 개인정보 수집 동의 여부 조회 API 호출
  const response =
    await counseleeConsentControllerApi.selectCounseleeConsentByCounseleeId(
      paramId,
      queryId || '',
    );
  return response;
};

//실제 사용하는 커스텀 훅
export const useCounseleeConsentQueryId = (
  paramId?: string,
  queryId?: string,
) => {
  return useQuery({
    queryKey: ['details', paramId, queryId],
    queryFn: () =>
      selectCounseleeConsent({
        paramId: paramId || '',
        queryId: queryId || '',
      }),
    enabled: !!paramId,
  });
};

//내담자 개인정보 수집 동의 여부 등록 API 호출
const postCounselAgree = async (body: AddCounseleeConsentReq) => {
  // 내담자 개인정보 수집 동의 여부 등록 API 호출
  const response = await counseleeConsentControllerApi.addCounseleeConsent(
    body,
  );
  return response.data.data as AddCounseleeConsentRes;
};

// 실제 사용하는 커스텀 훅
export const usePostCounselAgree = () => {
  return useMutation({
    mutationFn: postCounselAgree,
  });
};
