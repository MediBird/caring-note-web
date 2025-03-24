import {
  CounselCardBaseInformationRes,
  CounselCardBaseInformationResCardRecordStatusEnum,
  CounselCardControllerApi,
  CounselCardHealthInformationRes,
  CounselCardIndependentLifeInformationRes,
  CounselCardLivingInformationRes,
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
export type InfoType = 'base' | 'health' | 'independentLife' | 'living';

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
const validateHealthInfo = (data: UpdateHealthInformationReq): void => {
  // 알레르기가 있음으로 체크됐는데 노트가 비어있는 경우
  if (data.allergy?.isAllergic && !data.allergy?.allergyNote) {
    throw new Error('알레르기가 있는 경우 상세 내용을 작성해주세요.');
  }

  // 약물 부작용이 있음으로 체크됐는데 노트가 비어있는 경우
  if (
    data.medicationSideEffect?.isMedicationSideEffect &&
    (!data.medicationSideEffect?.suspectedMedicationNote ||
      !data.medicationSideEffect?.symptomsNote)
  ) {
    throw new Error(
      '약물 부작용이 있는 경우 의심되는 약물과 증상을 모두 작성해주세요.',
    );
  }
};

const validateLivingInfo = (data: UpdateLivingInformationReq): void => {
  // 영양 상태 패턴이 비어있는지 확인
  if (!data.nutrition?.mealPattern) {
    throw new Error('영양 상태의 하루 식사 패턴을 선택해주세요.');
  }

  // 운동 패턴이 비어있는지 확인
  if (!data.exercise?.exercisePattern) {
    throw new Error('운동의 주간 운동 패턴을 선택해주세요.');
  }
};

// 공통 쿼리 훅
export const useCounselCardInfoQuery = <T>(
  counselSessionId: string,
  infoType: InfoType,
) => {
  const {
    setBaseInfo,
    setHealthInfo,
    setIndependentLifeInfo,
    setLivingInfo,
    setLoading,
    isDirty,
    setCounselSessionId,
    setShouldFetch,
    shouldFetch,
    fetchedSessionIds,
    setFetchedSessionId,
  } = useCounselCardStore();
  const [isDisabled, setIsDisabled] = useState(false);

  // counselSessionId가 변경될 때마다 스토어의 ID 갱신
  useEffect(() => {
    if (counselSessionId) {
      setCounselSessionId(counselSessionId);
    }
  }, [counselSessionId, setCounselSessionId]);

  // 독립생활 평가에 필요한 장애 여부 체크
  useEffect(() => {
    const checkDisabilityStatus = async () => {
      if (infoType === 'independentLife' && counselSessionId) {
        const result = await checkIsDisability(counselSessionId);
        setIsDisabled(result);
        setShouldFetch('independentLife', result);
      }
    };

    if (infoType === 'independentLife') {
      checkDisabilityStatus();
    }
  }, [counselSessionId, infoType, setShouldFetch]);

  // fetch 여부 결정
  const shouldFetchData = (() => {
    // 세션 ID가 없으면 fetch하지 않음
    if (!counselSessionId) return false;

    // 독립생활 정보인데 장애가 없으면 fetch하지 않음
    if (infoType === 'independentLife' && !isDisabled) return false;

    // 이미 같은 세션ID로 fetch했고, 강제 fetch가 아니면 fetch하지 않음
    if (
      fetchedSessionIds[infoType] === counselSessionId &&
      !shouldFetch[infoType]
    ) {
      return false;
    }

    return true;
  })();

  return useQuery({
    queryKey: [
      `counselCard${infoType.charAt(0).toUpperCase() + infoType.slice(1)}Info`,
      counselSessionId,
    ],
    queryFn: async () => {
      setLoading(infoType, true);
      try {
        let response;

        switch (infoType) {
          case 'base':
            response =
              await counselCardApi.selectCounselCardBaseInformation(
                counselSessionId,
              );
            if (!isDirty.base) {
              setBaseInfo(response.data.data || {});
            }
            break;
          case 'health':
            response =
              await counselCardApi.selectCounselCardHealthInformation(
                counselSessionId,
              );
            if (!isDirty.health) {
              setHealthInfo(response.data.data || {});
            }
            break;
          case 'independentLife':
            response =
              await counselCardApi.selectCounselCardIndependentLifeInformation(
                counselSessionId,
              );
            if (!isDirty.independentLife) {
              setIndependentLifeInfo(response.data.data || {});
            }
            break;
          case 'living':
            response =
              await counselCardApi.selectCounselCardLivingInformation(
                counselSessionId,
              );
            if (!isDirty.living) {
              setLivingInfo(response.data.data || {});
            }
            break;
        }

        // 성공적으로 fetch했음을 표시
        setFetchedSessionId(infoType, counselSessionId);
        setShouldFetch(infoType, false);

        return response?.data.data as T;
      } catch (error) {
        handleError(error, infoType, '조회');
        throw error;
      } finally {
        setLoading(infoType, false);
      }
    },
    enabled: shouldFetchData,
    staleTime: 60 * 1000, // 1분 동안 캐시 유지
    gcTime: 5 * 60 * 1000, // 5분 동안 가비지 컬렉션 방지
  });
};

// 특화된 쿼리 훅 (하위 호환성을 위해 유지)
export const useCounselCardBaseInfoQuery = (counselSessionId: string) => {
  return useCounselCardInfoQuery<CounselCardBaseInformationRes>(
    counselSessionId,
    'base',
  );
};

export const useCounselCardHealthInfoQuery = (counselSessionId: string) => {
  return useCounselCardInfoQuery<CounselCardHealthInformationRes>(
    counselSessionId,
    'health',
  );
};

export const useCounselCardIndependentLifeInfoQuery = (counselSessionId: string) => {
  return useCounselCardInfoQuery<CounselCardIndependentLifeInformationRes>(
    counselSessionId,
    'independentLife',
  );
};

export const useCounselCardLivingInfoQuery = (counselSessionId: string) => {
  return useCounselCardInfoQuery<CounselCardLivingInformationRes>(
    counselSessionId,
    'living',
  );
};

// 기본 정보 업데이트 뮤테이션 훅
export const useCounselCardBaseInfoMutation = () => {
  const queryClient = useQueryClient();
  const { setLoading, setError } = useCounselCardStore();

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
  const { setLoading, setError } = useCounselCardStore();

  return useMutation({
    mutationFn: async ({
      counselSessionId,
      data,
    }: {
      counselSessionId: string;
      data: UpdateHealthInformationReq;
    }) => {
      try {
        // 유효성 검증
        validateHealthInfo(data);

        setLoading('health', true);
        const response =
          await counselCardApi.updateCounselCardHealthInformation(
            counselSessionId,
            data,
          );
        return response.data.data;
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
          setError('health', error.message);
        } else {
          handleError(error, 'health', '업데이트');
        }
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
  const { setLoading, setError } = useCounselCardStore();

  return useMutation({
    mutationFn: async ({
      counselSessionId,
      data,
    }: {
      counselSessionId: string;
      data: UpdateIndependentLifeInformationReq;
    }) => {
      try {
        // 독립생활 정보는 장애인 내담자만 업데이트 가능
        const isDisabled = await checkIsDisability(counselSessionId);
        if (!isDisabled) {
          throw new Error(
            '장애인인 내담자만 독립생활 역량 정보를 업데이트할 수 있습니다.',
          );
        }

        setLoading('independentLife', true);
        const response =
          await counselCardApi.updateCounselCardIndependentLifeInformation(
            counselSessionId,
            data,
          );
        return response.data.data;
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
          setError('independentLife', error.message);
        } else {
          handleError(error, 'independentLife', '업데이트');
        }
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
  const { setLoading, setError } = useCounselCardStore();

  return useMutation({
    mutationFn: async ({
      counselSessionId,
      data,
    }: {
      counselSessionId: string;
      data: UpdateLivingInformationReq;
    }) => {
      try {
        // 유효성 검증
        validateLivingInfo(data);

        setLoading('living', true);
        const response =
          await counselCardApi.updateCounselCardLivingInformation(
            counselSessionId,
            data,
          );
        return response.data.data;
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
          setError('living', error.message);
        } else {
          handleError(error, 'living', '업데이트');
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
    try {
      const mutations = [];

      if (store.isDirty.base && store.baseInfo) {
        const baseInfoReq = {
          baseInfo: store.baseInfo.baseInfo || {},
          counselPurposeAndNote: store.baseInfo.counselPurposeAndNote || {},
        };
        mutations.push(
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

        mutations.push(
          healthInfoMutation.mutateAsync({
            counselSessionId,
            data: healthInfoReq,
          }),
        );
      }

      const isDisability = await checkIsDisability(counselSessionId);
      if (
        store.isDirty.independentLife &&
        store.independentLifeInfo &&
        isDisability
      ) {
        const independentLifeInfoReq = {
          communication: store.independentLifeInfo.communication || {},
          evacuation: store.independentLifeInfo.evacuation || {},
          walking: store.independentLifeInfo.walking || {},
        };
        mutations.push(
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

        mutations.push(
          livingInfoMutation.mutateAsync({
            counselSessionId,
            data: livingInfoReq,
          }),
        );
      }

      await Promise.all(mutations);
      store.resetDirty();
      return true;
    } catch (error) {
      // 유효성 검증 실패 또는 API 오류
      console.error('임시 저장 중 오류 발생:', error);
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

