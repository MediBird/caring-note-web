import {
  AddCounseleeConsentReq,
  AddCounseleeConsentRes,
  CounseleeConsentControllerApi,
  UpdateCounseleeConsentReq,
  UpdateCounseleeConsentRes,
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
  enabled?: boolean,
) =>
  useQuery({
    queryKey: ['details', paramId, queryId],
    queryFn: () =>
      selectCounseleeConsent({
        paramId: paramId || '',
        queryId: queryId || '',
      }),
    enabled,
  });

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

//내담자 개인정보 수집 동의 여부 수정 API 호출
const putCounselAgree = async (body: UpdateCounseleeConsentReq) => {
  // 내담자 개인정보 수집 동의 여부 수정 API 호출
  const response = await counseleeConsentControllerApi.updateCounseleeConsent(
    body,
  );
  return response.data.data as UpdateCounseleeConsentRes;
};

// 실제 사용하는 커스텀 훅
export const usePutCounselAgree = () => {
  return useMutation({
    mutationFn: putCounselAgree,
  });
};
