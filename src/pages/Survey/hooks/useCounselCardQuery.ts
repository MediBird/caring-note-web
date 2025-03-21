import {
  CounselCardBaseInformationResCardRecordStatusEnum,
  CounselCardControllerApi,
  CounseleeControllerApi,
  UpdateBaseInformationReq,
  UpdateCounselCardStatusReqStatusEnum,
  UpdateHealthInformationReq,
  UpdateIndependentLifeInformationReq,
  UpdateLivingInformationReq,
} from '@/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useCounselCardStore } from './counselCardStore';

const counselCardApi = new CounselCardControllerApi();
const counseleeApi = new CounseleeControllerApi();

// 정보 타입 정의
type InfoType = 'base' | 'health' | 'independentLife' | 'living';

// 에러 핸들링 공통 함수
const handleError = (
  error: unknown,
  infoType: InfoType,
  action: string,
): void => {
  const setError = useCounselCardStore.getState().setError;

  if (axios.isAxiosError(error)) {
    const errorMessage =
      error.response?.data?.message ||
      `${infoType} 정보 ${action} 중 오류가 발생했습니다.`;
    setError(infoType, errorMessage);
    toast.error(errorMessage);
  } else {
    const defaultMessage = `${infoType} 정보 ${action} 중 알 수 없는 오류가 발생했습니다.`;
    setError(infoType, defaultMessage);
    toast.error(defaultMessage);
  }
};

// 내담자의 장애 여부 확인 함수
const checkIsDisability = async (
  counselSessionId: string,
): Promise<boolean> => {
  try {
    const response =
      await counseleeApi.selectCounseleeBaseInformation(counselSessionId);
    return response.data.data?.isDisability ?? false;
  } catch (error) {
    console.error('내담자 정보를 불러오는 데 실패했습니다.', error);
    return false;
  }
};

// 유효성 검증 함수들
const validateHealthInfo = (data: UpdateHealthInformationReq): boolean => {
  // 알레르기가 있음으로 체크됐는데 노트가 비어있는 경우
  if (data.allergy?.isAllergic && !data.allergy?.allergyNote) {
    toast.error('알레르기가 있는 경우 상세 내용을 작성해주세요.');
    return false;
  }

  // 약물 부작용이 있음으로 체크됐는데 노트가 비어있는 경우
  if (
    data.medicationSideEffect?.isMedicationSideEffect &&
    (!data.medicationSideEffect?.suspectedMedicationNote ||
      !data.medicationSideEffect?.symptomsNote)
  ) {
    toast.error(
      '약물 부작용이 있는 경우 의심되는 약물과 증상을 모두 작성해주세요.',
    );
    return false;
  }

  return true;
};

const validateLivingInfo = (data: UpdateLivingInformationReq): boolean => {
  // 영양 상태 패턴이 비어있는지 확인
  if (!data.nutrition?.mealPattern) {
    toast.error('영양 상태의 하루 식사 패턴을 선택해주세요.');
    return false;
  }

  // 운동 패턴이 비어있는지 확인
  if (!data.exercise?.exercisePattern) {
    toast.error('운동의 주간 운동 패턴을 선택해주세요.');
    return false;
  }

  return true;
};

// 기본 정보 쿼리 훅
export const useCounselCardBaseInfoQuery = (counselSessionId: string) => {
  const { setBaseInfo, setLoading, isDirty, setCounselSessionId } =
    useCounselCardStore();

  // counselSessionId가 변경될 때마다 스토어의 ID 갱신
  useEffect(() => {
    if (counselSessionId) {
      setCounselSessionId(counselSessionId);
    }
  }, [counselSessionId, setCounselSessionId]);

  return useQuery({
    queryKey: ['counselCardBaseInfo', counselSessionId],
    queryFn: async () => {
      setLoading('base', true);
      try {
        const response =
          await counselCardApi.selectCounselCardBaseInformation(
            counselSessionId,
          );
        // 로컬에서 수정된 데이터가 없을 때만 서버 데이터로 업데이트
        if (!isDirty.base) {
          setBaseInfo(response.data.data || {});
        }
        return response.data.data;
      } catch (error) {
        handleError(error, 'base', '조회');
        throw error;
      } finally {
        setLoading('base', false);
      }
    },
    enabled: !!counselSessionId,
    staleTime: 60 * 1000, // 1분 동안 캐시 유지
    gcTime: 5 * 60 * 1000, // 5분 동안 가비지 컬렉션 방지
  });
};

// 건강 정보 쿼리 훅
export const useCounselCardHealthInfoQuery = (counselSessionId: string) => {
  const { setHealthInfo, setLoading, isDirty, setCounselSessionId } =
    useCounselCardStore();

  // counselSessionId가 변경될 때마다 스토어의 ID 갱신
  useEffect(() => {
    if (counselSessionId) {
      setCounselSessionId(counselSessionId);
    }
  }, [counselSessionId, setCounselSessionId]);
  return useQuery({
    queryKey: ['counselCardHealthInfo', counselSessionId],
    queryFn: async () => {
      setLoading('health', true);
      try {
        const response =
          await counselCardApi.selectCounselCardHealthInformation(
            counselSessionId,
          );
        // 로컬에서 수정된 데이터가 없을 때만 서버 데이터로 업데이트
        if (!isDirty.health) {
          setHealthInfo(response.data.data || {});
        }
        return response.data.data;
      } catch (error) {
        handleError(error, 'health', '조회');
        throw error;
      } finally {
        setLoading('health', false);
      }
    },
    enabled: !!counselSessionId,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// 독립생활 평가 쿼리 훅
export const useCounselCardIndependentLifeInfoQuery = (
  counselSessionId: string,
) => {
  const { setIndependentLifeInfo, setLoading, isDirty, setCounselSessionId } =
    useCounselCardStore();
  const [isDisabled, setIsDisabled] = useState(false);

  // counselSessionId가 변경될 때마다 스토어의 ID 갱신
  useEffect(() => {
    if (counselSessionId) {
      setCounselSessionId(counselSessionId);
    }
  }, [counselSessionId, setCounselSessionId]);

  // 내담자의 장애 여부 확인
  useEffect(() => {
    const checkDisability = async () => {
      if (counselSessionId) {
        const result = await checkIsDisability(counselSessionId);
        setIsDisabled(result);
      }
    };

    checkDisability();
  }, [counselSessionId]);

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
        handleError(error, 'independentLife', '조회');
        throw error;
      } finally {
        setLoading('independentLife', false);
      }
    },
    enabled: !!counselSessionId && isDisabled,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// 생활 정보 쿼리 훅
export const useCounselCardLivingInfoQuery = (counselSessionId: string) => {
  const { setLivingInfo, setLoading, isDirty, setCounselSessionId } =
    useCounselCardStore();

  // counselSessionId가 변경될 때마다 스토어의 ID 갱신
  useEffect(() => {
    if (counselSessionId) {
      setCounselSessionId(counselSessionId);
    }
  }, [counselSessionId, setCounselSessionId]);

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
        handleError(error, 'living', '조회');
        throw error;
      } finally {
        setLoading('living', false);
      }
    },
    enabled: !!counselSessionId,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};

// 기본 정보 업데이트 뮤테이션 훅
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
      } catch (error) {
        handleError(error, 'base', '업데이트');
        throw error;
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

// 건강 정보 업데이트 뮤테이션 훅
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
      // 유효성 검증
      if (!validateHealthInfo(data)) {
        return null;
      }

      setLoading('health', true);
      try {
        const response =
          await counselCardApi.updateCounselCardHealthInformation(
            counselSessionId,
            data,
          );
        return response.data.data;
      } catch (error) {
        handleError(error, 'health', '업데이트');
        throw error;
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

// 독립생활 정보 업데이트 뮤테이션 훅
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
      // 장애 여부 확인
      const isDisabled = await checkIsDisability(counselSessionId);
      if (!isDisabled) {
        toast.error(
          '장애인이 아닌 내담자는 자립생활 역량 정보를 업데이트할 수 없습니다.',
        );
        return null;
      }

      setLoading('independentLife', true);
      try {
        const response =
          await counselCardApi.updateCounselCardIndependentLifeInformation(
            counselSessionId,
            data,
          );
        return response.data.data;
      } catch (error) {
        handleError(error, 'independentLife', '업데이트');
        throw error;
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

// 생활 정보 업데이트 뮤테이션 훅
export const useCounselCardLivingInfoMutation = () => {
  const queryClient = useQueryClient();
  const { setLoading } = useCounselCardStore();

  return useMutation({
    mutationFn: async ({
      counselSessionId,
      data,
    }: {
      counselSessionId: string;
      data: UpdateLivingInformationReq;
    }) => {
      // 유효성 검증
      if (!validateLivingInfo(data)) {
        return null;
      }

      setLoading('living', true);
      try {
        const response =
          await counselCardApi.updateCounselCardLivingInformation(
            counselSessionId,
            data,
          );
        return response.data.data;
      } catch (error) {
        handleError(error, 'living', '업데이트');
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
      status: UpdateCounselCardStatusReqStatusEnum;
    }) => {
      try {
        const response = await counselCardApi.updateCounselCardStatus(
          counselSessionId,
          { status },
        );
        return response.data.data;
      } catch (error) {
        handleError(error, 'base', '상태 업데이트');
        throw error;
      }
    },
    onSuccess: (_, { counselSessionId }) => {
      // 모든 관련 쿼리 무효화
      const infoTypes: InfoType[] = [
        'base',
        'health',
        'independentLife',
        'living',
      ];
      infoTypes.forEach((type) => {
        queryClient.invalidateQueries({
          queryKey: [
            `counselCard${type.charAt(0).toUpperCase() + type.slice(1)}Info`,
            counselSessionId,
          ],
        });
      });

      // 오늘의 스케줄 테이블 데이터도 무효화
      queryClient.invalidateQueries({
        queryKey: ['selectCounselSessionList'],
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

      // 유효성 검증은 mutation 내부에서 처리
      promises.push(
        healthInfoMutation.mutateAsync({
          counselSessionId,
          data: healthInfoReq,
        }),
      );
    }

    if (store.isDirty.independentLife && store.independentLifeInfo) {
      // 장애 여부 확인
      const isDisability = await checkIsDisability(counselSessionId);
      if (!isDisability) {
        toast.error(
          '장애인이 아닌 내담자는 자립생활 역량 정보를 업데이트할 수 없습니다.',
        );
        return false;
      }

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

      // 유효성 검증은 mutation 내부에서 처리
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
    } catch (error) {
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

  const complete = async (counselSessionId: string) => {
    try {
      // 1. 모든 변경사항 저장
      const savedSuccessfully = await saveDraft(counselSessionId);
      if (!savedSuccessfully) {
        return false;
      }

      // 2. 현재 상태 확인 (최신 상태를 서버에서 직접 가져오기)
      try {
        const response =
          await counselCardApi.selectCounselCardBaseInformation(
            counselSessionId,
          );
        const currentStatus = response.data.data?.cardRecordStatus;

        // 3. 상태 업데이트 - 완료 상태가 아닐 경우만 업데이트
        if (
          currentStatus !==
          CounselCardBaseInformationResCardRecordStatusEnum.Completed
        ) {
          await statusMutation.mutateAsync({
            counselSessionId,
            status: CounselCardBaseInformationResCardRecordStatusEnum.Completed,
          });
        }
      } catch (error) {
        console.error('상태 확인 중 오류 발생:', error);
        // 상태 확인 실패 시 무조건 업데이트 시도
        await statusMutation.mutateAsync({
          counselSessionId,
          status: CounselCardBaseInformationResCardRecordStatusEnum.Completed,
        });
      }

      return true;
    } catch (error) {
      handleError(error, 'base', '설문 완료 처리');
      return false;
    }
  };

  return { complete };
};

