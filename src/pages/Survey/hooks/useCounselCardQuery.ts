import {
  CounselCardControllerApi,
  UpdateBaseInformationReq,
  UpdateCounselCardStatusReqStatusEnum,
  UpdateHealthInformationReq,
  UpdateIndependentLifeInformationReq,
  UpdateLivingInformationReq,
} from '@/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { useCounselCardStore } from './counselCardStore';

const counselCardApi = new CounselCardControllerApi();

// 기본 정보 쿼리 훅
export const useCounselCardBaseInfoQuery = (counselSessionId: string) => {
  const { setBaseInfo, setLoading, isDirty } = useCounselCardStore();

  return useQuery({
    queryKey: ['counselCardBaseInfo', counselSessionId],
    queryFn: async () => {
      setLoading('base', true);
      const response =
        await counselCardApi.selectCounselCardBaseInformation(counselSessionId);
      // 로컬에서 수정된 데이터가 없을 때만 서버 데이터로 업데이트
      if (!isDirty.base) {
        setBaseInfo(response.data.data || {});
      }
      return response.data.data;
    },
    enabled: !!counselSessionId,
  });
};

// 건강 정보 쿼리 훅
export const useCounselCardHealthInfoQuery = (counselSessionId: string) => {
  const { setHealthInfo, setLoading, isDirty } = useCounselCardStore();

  return useQuery({
    queryKey: ['counselCardHealthInfo', counselSessionId],
    queryFn: async () => {
      setLoading('health', true);
      const response =
        await counselCardApi.selectCounselCardHealthInformation(
          counselSessionId,
        );
      // 로컬에서 수정된 데이터가 없을 때만 서버 데이터로 업데이트
      if (!isDirty.health) {
        setHealthInfo(response.data.data || {});
      }
      return response.data.data;
    },
    enabled: !!counselSessionId,
  });
};

// 독립생활 평가 쿼리 훅
export const useCounselCardIndependentLifeInfoQuery = (
  counselSessionId: string,
) => {
  const { setIndependentLifeInfo, setLoading, setError, isDirty } =
    useCounselCardStore();

  return useQuery({
    queryKey: ['counselCardIndependentLifeInfo', counselSessionId],
    queryFn: async () => {
      setLoading('independentLife', true);
      try {
        const response =
          await counselCardApi.selectCounselCardIndependentLifeInformation(
            counselSessionId,
          );
        // 로컬에서 수정된 데이터가 없을 때만 서버 데이터로 업데이트
        if (!isDirty.independentLife) {
          setIndependentLifeInfo(response.data.data || {});
        }
        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message ||
            '독립생활 평가 정보 조회 중 오류가 발생했습니다.';
          setError('independentLife', errorMessage);
        } else {
          setError(
            'independentLife',
            '독립생활 평가 정보 조회 중 알 수 없는 오류가 발생했습니다.',
          );
        }
        throw error;
      } finally {
        setLoading('independentLife', false);
      }
    },
    enabled: !!counselSessionId,
  });
};

// 생활 정보 쿼리 훅
export const useCounselCardLivingInfoQuery = (counselSessionId: string) => {
  const { setLivingInfo, setLoading, setError, isDirty } =
    useCounselCardStore();

  return useQuery({
    queryKey: ['counselCardLivingInfo', counselSessionId],
    queryFn: async () => {
      setLoading('living', true);
      try {
        const response =
          await counselCardApi.selectCounselCardLivingInformation(
            counselSessionId,
          );
        // 로컬에서 수정된 데이터가 없을 때만 서버 데이터로 업데이트
        if (!isDirty.living) {
          setLivingInfo(response.data.data || {});
        }
        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message ||
            '생활 정보 조회 중 오류가 발생했습니다.';
          setError('living', errorMessage);
        } else {
          setError(
            'living',
            '생활 정보 조회 중 알 수 없는 오류가 발생했습니다.',
          );
        }
        throw error;
      } finally {
        setLoading('living', false);
      }
    },
    enabled: !!counselSessionId,
  });
};

// 각 탭별 업데이트 뮤테이션 훅
export const useCounselCardBaseInfoMutation = () => {
  const queryClient = useQueryClient();
  const { setLoading } = useCounselCardStore();

  return useMutation({
    mutationFn: async ({
      counselSessionId,
      data,
    }: {
      counselSessionId: string;
      data: UpdateBaseInformationReq;
    }) => {
      setLoading('base', true);
      try {
        const response = await counselCardApi.updateCounselCardBaseInformation(
          counselSessionId,
          data,
        );
        return response.data.data;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error('기본 정보 업데이트 중 오류가 발생했습니다.');
      } finally {
        setLoading('base', false);
      }
    },
    onSuccess: (_, { counselSessionId }) => {
      queryClient.invalidateQueries({
        queryKey: ['counselCardBaseInfo', counselSessionId],
      });
    },
  });
};

export const useCounselCardHealthInfoMutation = () => {
  const queryClient = useQueryClient();
  const { setLoading } = useCounselCardStore();

  return useMutation({
    mutationFn: async ({
      counselSessionId,
      data,
    }: {
      counselSessionId: string;
      data: UpdateHealthInformationReq;
    }) => {
      setLoading('health', true);
      try {
        const response =
          await counselCardApi.updateCounselCardHealthInformation(
            counselSessionId,
            data,
          );
        return response.data.data;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error('건강 정보 업데이트 중 오류가 발생했습니다.');
      } finally {
        setLoading('health', false);
      }
    },
    onSuccess: (_, { counselSessionId }) => {
      queryClient.invalidateQueries({
        queryKey: ['counselCardHealthInfo', counselSessionId],
      });
    },
  });
};

export const useCounselCardIndependentLifeInfoMutation = () => {
  const queryClient = useQueryClient();
  const { setLoading } = useCounselCardStore();

  return useMutation({
    mutationFn: async ({
      counselSessionId,
      data,
    }: {
      counselSessionId: string;
      data: UpdateIndependentLifeInformationReq;
    }) => {
      setLoading('independentLife', true);
      try {
        const response =
          await counselCardApi.updateCounselCardIndependentLifeInformation(
            counselSessionId,
            data,
          );
        return response.data.data;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_) {
        toast.error('자립생활 역량 업데이트 중 오류가 발생했습니다.');
      } finally {
        setLoading('independentLife', false);
      }
    },
    onSuccess: (_, { counselSessionId }) => {
      queryClient.invalidateQueries({
        queryKey: ['counselCardIndependentLifeInfo', counselSessionId],
      });
    },
  });
};

export const useCounselCardLivingInfoMutation = () => {
  const queryClient = useQueryClient();
  const { setLoading, setError } = useCounselCardStore();

  return useMutation({
    mutationFn: async ({
      counselSessionId,
      data,
    }: {
      counselSessionId: string;
      data: UpdateLivingInformationReq;
    }) => {
      setLoading('living', true);
      try {
        const response =
          await counselCardApi.updateCounselCardLivingInformation(
            counselSessionId,
            data,
          );
        return response.data.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.message ||
            '생활 정보 업데이트 중 오류가 발생했습니다.';
          setError('living', errorMessage);
        } else {
          setError(
            'living',
            '생활 정보 업데이트 중 알 수 없는 오류가 발생했습니다.',
          );
        }
        throw error;
      } finally {
        setLoading('living', false);
      }
    },
    onSuccess: (_, { counselSessionId }) => {
      queryClient.invalidateQueries({
        queryKey: ['counselCardLivingInfo', counselSessionId],
      });
    },
  });
};

// 상담 카드 상태 업데이트 뮤테이션
export const useCounselCardStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      counselSessionId,
      status,
    }: {
      counselSessionId: string;
      status: string;
    }) => {
      const response = await counselCardApi.updateCounselCardStatus(
        counselSessionId,
        {
          status: status as UpdateCounselCardStatusReqStatusEnum,
        },
      );
      return response.data.data;
    },
    onSuccess: (_, { counselSessionId }) => {
      // 모든 관련 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: ['counselCardBaseInfo', counselSessionId],
      });
      queryClient.invalidateQueries({
        queryKey: ['counselCardHealthInfo', counselSessionId],
      });
      queryClient.invalidateQueries({
        queryKey: ['counselCardIndependentLifeInfo', counselSessionId],
      });
      queryClient.invalidateQueries({
        queryKey: ['counselCardLivingInfo', counselSessionId],
      });
    },
  });
};

// 임시 저장 훅
export const useSaveCounselCardDraft = () => {
  const store = useCounselCardStore();
  const baseInfoMutation = useCounselCardBaseInfoMutation();
  const healthInfoMutation = useCounselCardHealthInfoMutation();
  const independentLifeInfoMutation =
    useCounselCardIndependentLifeInfoMutation();
  const livingInfoMutation = useCounselCardLivingInfoMutation();

  const saveDraft = async (counselSessionId: string) => {
    const promises = [];

    if (store.isDirty.base && store.baseInfo) {
      const baseInfoReq = {
        baseInfo: store.baseInfo.baseInfo || {},
        counselPurposeAndNote: store.baseInfo.counselPurposeAndNote || {},
      };
      promises.push(
        baseInfoMutation.mutateAsync({
          counselSessionId,
          data: baseInfoReq,
        }),
      );
    }

    if (store.isDirty.health && store.healthInfo) {
      const healthInfoReq = {
        diseaseInfo: store.healthInfo.diseaseInfo || {},
        allergy: store.healthInfo.allergy || {},
        medicationSideEffect: store.healthInfo.medicationSideEffect || {},
      };
      promises.push(
        healthInfoMutation.mutateAsync({
          counselSessionId,
          data: healthInfoReq,
        }),
      );
    }

    if (store.isDirty.independentLife && store.independentLifeInfo) {
      const independentLifeInfoReq = {
        communication: store.independentLifeInfo.communication || {},
        evacuation: store.independentLifeInfo.evacuation || {},
        walking: store.independentLifeInfo.walking || {},
      };
      promises.push(
        independentLifeInfoMutation.mutateAsync({
          counselSessionId,
          data: independentLifeInfoReq,
        }),
      );
    }

    if (store.isDirty.living && store.livingInfo) {
      const livingInfoReq = {
        drinking: store.livingInfo.drinking || {},
        smoking: store.livingInfo.smoking || {},
        exercise: store.livingInfo.exercise || {},
        nutrition: store.livingInfo.nutrition || {},
        medicationManagement: store.livingInfo.medicationManagement || {},
      };
      promises.push(
        livingInfoMutation.mutateAsync({
          counselSessionId,
          data: livingInfoReq,
        }),
      );
    }

    try {
      await Promise.all(promises);
      store.resetDirty();
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      toast.error('임시 저장 중 오류가 발생했습니다.');
      return false;
    }
  };

  return { saveDraft };
};

// 설문 완료 훅
export const useCompleteCounselCard = () => {
  const statusMutation = useCounselCardStatusMutation();
  const { saveDraft } = useSaveCounselCardDraft();
  const queryClient = useQueryClient();

  const complete = async (counselSessionId: string) => {
    try {
      // 1. 현재 상태 확인
      const currentData = queryClient.getQueryData([
        'counselCardBaseInfo',
        counselSessionId,
      ]) as { data?: { cardRecordStatus?: string } };
      const currentStatus = currentData?.data?.cardRecordStatus;

      // 2. 모든 변경사항 저장
      const savedSuccessfully = await saveDraft(counselSessionId);
      if (!savedSuccessfully) {
        return false;
      }

      // 3. 상태를 COMPLETED로 변경
      if (currentStatus !== 'IN_PROGRESS') {
        await statusMutation.mutateAsync({
          counselSessionId,
          status: 'COMPLETED',
        });
      }

      return true;
    } catch (_) {
      toast.error('설문 완료 처리 중 오류가 발생했습니다.');
      return false;
    }
  };

  return { complete };
};
