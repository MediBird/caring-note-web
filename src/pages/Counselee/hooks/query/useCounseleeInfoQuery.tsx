import {
  AddCounseleeReq,
  CounseleeControllerApi,
  DeleteCounseleeBatchReq,
  DeleteCounseleeBatchRes,
  SelectCounseleeRes,
} from '@/api/api';
import { useMutation, useQuery } from '@tanstack/react-query';

// 내담자 관련 API 선언
const counseleeInfoControllerApi = new CounseleeControllerApi();

interface FetchParams {
  page: number;
  size: number;
}
// 내담자 목록 조회
const selectCounseleeList = async (params: FetchParams) => {
  // 내담자 목록 조회 API 호출
  const response = await counseleeInfoControllerApi.selectCounselees(
    params.page,
    params.size,
  );
  return {
    content: response.data.data?.content as SelectCounseleeRes[],
    pagination: {
      totalPages: response.data.data?.totalPages,
      totalElements: response.data.data?.totalElements,
      currentPage: response.data.data?.currentPage,
      hasNext: response.data.data?.hasNext,
      hasPrevious: response.data.data?.hasPrevious,
    },
  };
};

// 쿼리키를 상수로 정의
export const COUNSEL_SESSION_KEYS = {
  all: ['counseleeList'] as const,
  list: (params: FetchParams) =>
    [...COUNSEL_SESSION_KEYS.all, 'list', params] as const,
} as const;

// 실제 사용하는 커스텀 훅
export const useSelectCounseleeList = (params: FetchParams) => {
  return useQuery({
    queryKey: COUNSEL_SESSION_KEYS.list(params),
    queryFn: () => selectCounseleeList(params),
    enabled: !!params,
  });
};

// 내담자 상세 정보 조회
const selectCounseleeInfo = async (counseleeId: string) => {
  // 내담자 상세 정보 조회 API 호출
  const response = await counseleeInfoControllerApi.selectCounselee(
    counseleeId,
  );
  return response.data.data as SelectCounseleeRes;
};
// 실제 사용하는 커스텀 훅
export const useSelectCounseleedetailInfo = (counseleeId: string) => {
  return useQuery({
    queryKey: ['counseleeInfo', counseleeId],
    queryFn: () => selectCounseleeInfo(counseleeId),
    enabled: !!counseleeId,
  });
};

// 내담자 기본 정보 생성
const createCounseleeInfo = async (counseleeInfo: AddCounseleeReq) => {
  // 내담자 기본 정보 생성 API 호출
  const response = await counseleeInfoControllerApi.addCounselee(counseleeInfo);
  return response.data.data as string;
};
// 실제 사용하는 커스텀 훅
export const useCreateCounseleeInfo = () => {
  return useMutation({
    mutationFn: createCounseleeInfo,
  });
};

// 내담자 기본 정보 삭제 (batch)
const deleteCounseleeInfo = async (counseleeIds: DeleteCounseleeBatchReq[]) => {
  // 내담자 기본 정보 삭제 API 호출
  const response = await counseleeInfoControllerApi.deleteCounseleeBatch(
    counseleeIds,
  );
  return response.data as DeleteCounseleeBatchRes;
};
// 실제 사용하는 커스텀 훅
export const useDeleteCounseleeInfo = () => {
  return useMutation({
    mutationFn: deleteCounseleeInfo,
  });
};
