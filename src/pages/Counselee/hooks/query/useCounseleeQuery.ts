import {
  AddCounseleeReq,
  CounseleeControllerApi,
  DeleteCounseleeBatchReq,
  DeleteCounseleeBatchRes,
  SelectCounseleeRes,
  UpdateCounseleeReq,
} from '@/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

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
  return response.data;
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
  const response =
    await counseleeInfoControllerApi.selectCounselee(counseleeId);
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCounseleeInfo,
    onSuccess: () => {
      toast.info('내담자가 등록되었습니다.');
      queryClient.invalidateQueries({ queryKey: COUNSEL_SESSION_KEYS.all });
    },
  });
};

const updateCounseleeInfo = async (counseleeInfo: UpdateCounseleeReq) => {
  const response =
    await counseleeInfoControllerApi.updateCounselee(counseleeInfo);
  return response.data.data as string;
};

export const useUpdateCounseleeInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCounseleeInfo,
    onSuccess: () => {
      toast.info('내담자 정보가 수정되었습니다.');
      queryClient.invalidateQueries({ queryKey: COUNSEL_SESSION_KEYS.all });
    },
  });
};

const deleteCounseleeInfo = async (counseleeIds: DeleteCounseleeBatchReq[]) => {
  const response =
    await counseleeInfoControllerApi.deleteCounseleeBatch(counseleeIds);
  return response.data as DeleteCounseleeBatchRes;
};

export const useDeleteCounseleeInfo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCounseleeInfo,
    onSuccess: () => {
      toast.info('내담자 정보가 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: COUNSEL_SESSION_KEYS.all });
    },
  });
};
