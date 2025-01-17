import {
  CounselSessionControllerApi,
  UpdateCounselorInCounselSessionReq,
} from '@/api/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// 상담 담당 약사 할당
const counselSessionControllerApi = new CounselSessionControllerApi();

const updateCounselorInCounselSession = async (
  counselSessionId: string,
  counselorId?: string,
) => {
  const response =
    await counselSessionControllerApi.updateCounselorInCounselSession({
      counselSessionId,
      counselorId,
    });
  return response;
};

export const useCounselAssign = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: ({
      counselSessionId,
      counselorId,
    }: UpdateCounselorInCounselSessionReq) =>
      updateCounselorInCounselSession(counselSessionId, counselorId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['SelectCounselSessionList'],
      });
    },
    onError: (error) => {
      console.error('Error updating counselor in counsel session:', error);
    },
  });

  return {
    mutate,
  };
};
