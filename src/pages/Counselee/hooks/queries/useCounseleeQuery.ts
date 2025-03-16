import {
  AddCounseleeReq,
  CounseleeControllerApi,
  DeleteCounseleeBatchReq,
  DeleteCounseleeBatchRes,
  SelectCounseleeRes,
  UpdateCounseleeReq,
} from '@/api';
import { useMutation, useQuery } from '@tanstack/react-query';

const counseleeInfoControllerApi = new CounseleeControllerApi();

export interface FetchParams {
  page: number;
  size: number;
  name?: string;
  birthDates?: string[];
  affiliatedWelfareInstitutions?: string[];
}

const selectCounseleeList = async (params: FetchParams) => {
  const response = await counseleeInfoControllerApi.selectCounselees(
    params.page,
    params.size,
    params.name,
    params.birthDates,
    params.affiliatedWelfareInstitutions,
  );
  return {
    content: response.data.data?.content as SelectCounseleeRes[],
    pagination: {
      totalPages: response.data.data?.pageInfo?.totalPages,
      totalElements: response.data.data?.pageInfo?.totalElements,
      currentPage: response.data.data?.pageInfo?.currentPage,
      hasNext: response.data.data?.pageInfo?.hasNext,
      hasPrevious: response.data.data?.pageInfo?.hasPrevious,
    },
  };
};

export const COUNSEL_SESSION_KEYS = {
  all: ['counseleeList'] as const,
  list: (params: FetchParams) =>
    [...COUNSEL_SESSION_KEYS.all, 'list', params] as const,
} as const;

export const useSelectCounseleeList = (params: FetchParams) => {
  return useQuery({
    queryKey: ['counseleeList', params],
    queryFn: () => selectCounseleeList(params),
    enabled: true,
  });
};

const selectCounseleeInfo = async (counseleeId: string) => {
  const response = await counseleeInfoControllerApi.selectCounselee(
    counseleeId,
  );
  return response.data.data as SelectCounseleeRes;
};

export const useSelectCounseleeDetailInfo = (counseleeId: string) => {
  return useQuery({
    queryKey: ['counseleeInfo', counseleeId],
    queryFn: () => selectCounseleeInfo(counseleeId),
    enabled: !!counseleeId,
  });
};

const createCounseleeInfo = async (counseleeInfo: AddCounseleeReq) => {
  const response = await counseleeInfoControllerApi.addCounselee(counseleeInfo);
  return response.data.data as string;
};

export const useCreateCounseleeInfo = () => {
  return useMutation({
    mutationFn: createCounseleeInfo,
  });
};

const updateCounseleeInfo = async (counseleeInfo: UpdateCounseleeReq) => {
  const response = await counseleeInfoControllerApi.updateCounselee(
    counseleeInfo,
  );
  return response.data.data as string;
};

export const useUpdateCounseleeInfo = () => {
  return useMutation({
    mutationFn: updateCounseleeInfo,
  });
};

const deleteCounseleeInfo = async (counseleeIds: DeleteCounseleeBatchReq[]) => {
  const response = await counseleeInfoControllerApi.deleteCounseleeBatch(
    counseleeIds,
  );
  return response.data as DeleteCounseleeBatchRes;
};

export const useDeleteCounseleeInfo = () => {
  return useMutation({
    mutationFn: deleteCounseleeInfo,
  });
};
