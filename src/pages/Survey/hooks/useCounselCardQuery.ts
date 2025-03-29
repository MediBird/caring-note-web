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
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { InfoType, useCounselCardStore } from './counselCardStore';

const counselCardApi = new CounselCardControllerApi();
const counseleeApi = new CounseleeControllerApi();

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

/**
 * 모든 인포 타입에 대한 쿼리 키를 무효화하는 유틸리티 함수
 */
const invalidateAllInfoQueries = (
  queryClient: ReturnType<typeof useQueryClient>,
  sessionId: string,
) => {
  const infoTypes: InfoType[] = ['base', 'health', 'independentLife', 'living'];
  infoTypes.forEach((type) => {
    queryClient.invalidateQueries({
      queryKey: [getQueryKeyForInfoType(type), sessionId],
    });
  });
};

// 정보 유형별 쿼리 키 생성 함수
const getQueryKeyForInfoType = (infoType: InfoType): string => {
  switch (infoType) {
    case 'base':
      return 'counselCardBaseInfo';
    case 'health':
      return 'counselCardHealthInfo';
    case 'independentLife':
      return 'counselCardIndependentLifeInfo';
    case 'living':
      return 'counselCardLivingInfo';
  }
};

// 정보 유형별 데이터 조회 함수
const fetchInfoData = async (infoType: InfoType, counselSessionId: string) => {
  switch (infoType) {
    case 'base':
      return (
        await counselCardApi.selectCounselCardBaseInformation(counselSessionId)
      ).data;
    case 'health':
      return (
        await counselCardApi.selectCounselCardHealthInformation(
          counselSessionId,
        )
      ).data;
    case 'independentLife':
      return (
        await counselCardApi.selectCounselCardIndependentLifeInformation(
          counselSessionId,
        )
      ).data;
    case 'living':
      return (
        await counselCardApi.selectCounselCardLivingInformation(
          counselSessionId,
        )
      ).data;
  }
};

// 정보 유형별 데이터 업데이트 함수
const updateInfoData = async (
  infoType: InfoType,
  counselSessionId: string,
  data:
    | UpdateBaseInformationReq
    | UpdateHealthInformationReq
    | UpdateIndependentLifeInformationReq
    | UpdateLivingInformationReq,
) => {
  switch (infoType) {
    case 'base':
      return (
        await counselCardApi.updateCounselCardBaseInformation(
          counselSessionId,
          data as UpdateBaseInformationReq,
        )
      ).data;
    case 'health':
      return (
        await counselCardApi.updateCounselCardHealthInformation(
          counselSessionId,
          data as UpdateHealthInformationReq,
        )
      ).data;
    case 'independentLife':
      return (
        await counselCardApi.updateCounselCardIndependentLifeInformation(
          counselSessionId,
          data as UpdateIndependentLifeInformationReq,
        )
      ).data;
    case 'living':
      return (
        await counselCardApi.updateCounselCardLivingInformation(
          counselSessionId,
          data as UpdateLivingInformationReq,
        )
      ).data;
  }
};

// 공통 쿼리 훅
export const useCounselCardInfoQuery = <T>(
  counselSessionId: string,
  infoType: InfoType,
  fetchOnMount: boolean = false,
) => {
  const {
    setInfoData,
    setLoading,
    setCounselSessionId,
    setShouldFetch,
    shouldFetch,
    fetchedSessionIds,
    setFetchedSessionId,
  } = useCounselCardStore();
  const [isDisabled, setIsDisabled] = useState(false);
  const queryClient = useQueryClient();
  const prevCounselSessionIdRef = useRef<string | null>(null);
  const hasFetchedRef = useRef<boolean>(false);

  // counselSessionId가 변경될 때마다 스토어의 ID 갱신
  useEffect(() => {
    if (!counselSessionId) return;

    // 세션 ID가 변경되었는지 확인
    if (
      prevCounselSessionIdRef.current &&
      prevCounselSessionIdRef.current !== counselSessionId
    ) {
      // 이전 세션 ID 관련 쿼리 캐시 무효화
      invalidateAllInfoQueries(queryClient, prevCounselSessionIdRef.current);

      // 현재 세션 ID 관련 쿼리 캐시도 무효화하여 강제로 다시 로드
      invalidateAllInfoQueries(queryClient, counselSessionId);

      // 새 세션 ID로 변경될 때 모든 데이터를 다시 불러오도록 설정
      const infoTypes: InfoType[] = [
        'base',
        'health',
        'independentLife',
        'living',
      ];
      infoTypes.forEach((type) => {
        setShouldFetch(type, true);
      });

      // 새 세션에 대해 아직 fetch하지 않음으로 설정
      hasFetchedRef.current = false;
    }

    setCounselSessionId(counselSessionId);
    prevCounselSessionIdRef.current = counselSessionId;
  }, [counselSessionId, setCounselSessionId, queryClient, setShouldFetch]);

  // 독립생활 평가에 필요한 장애 여부 체크
  useEffect(() => {
    if (infoType !== 'independentLife' || !counselSessionId) return;

    const checkDisabilityStatus = async () => {
      const result = await checkIsDisability(counselSessionId);
      setIsDisabled(result);
      setShouldFetch('independentLife', result);
    };

    checkDisabilityStatus();
  }, [counselSessionId, infoType, setShouldFetch]);

  // 컴포넌트 마운트 시 한 번만 fetch 수행을 위한 useEffect
  useEffect(() => {
    if (fetchOnMount && !hasFetchedRef.current && counselSessionId) {
      setShouldFetch(infoType, true);
      hasFetchedRef.current = true;
    }
  }, [fetchOnMount, infoType, counselSessionId, setShouldFetch]);

  // fetch 여부 결정
  const shouldFetchData = Boolean(
    counselSessionId &&
      (infoType !== 'independentLife' || isDisabled) &&
      (fetchedSessionIds[infoType] !== counselSessionId ||
        shouldFetch[infoType]),
  );

  const queryKey = [getQueryKeyForInfoType(infoType), counselSessionId];

  return useQuery({
    queryKey,
    queryFn: async () => {
      setLoading(infoType, true);
      try {
        const response = await fetchInfoData(infoType, counselSessionId);
        // 항상 서버 데이터로 업데이트
        setInfoData(infoType, response.data || {});

        // 성공적으로 fetch했음을 표시
        setFetchedSessionId(infoType, counselSessionId);
        setShouldFetch(infoType, false);

        return response.data as T;
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
    refetchOnMount: false, // 컴포넌트 마운트 시 자동으로 다시 가져오지 않음
  });
};

// 특화된 쿼리 훅 (하위 호환성을 위해 유지)
export const useCounselCardBaseInfoQuery = (
  counselSessionId: string,
  fetchOnMount: boolean = false,
) => {
  return useCounselCardInfoQuery<CounselCardBaseInformationRes>(
    counselSessionId,
    'base',
    fetchOnMount,
  );
};

export const useCounselCardHealthInfoQuery = (
  counselSessionId: string,
  fetchOnMount: boolean = false,
) => {
  return useCounselCardInfoQuery<CounselCardHealthInformationRes>(
    counselSessionId,
    'health',
    fetchOnMount,
  );
};

export const useCounselCardIndependentLifeInfoQuery = (
  counselSessionId: string,
  fetchOnMount: boolean = false,
) => {
  return useCounselCardInfoQuery<CounselCardIndependentLifeInformationRes>(
    counselSessionId,
    'independentLife',
    fetchOnMount,
  );
};

export const useCounselCardLivingInfoQuery = (
  counselSessionId: string,
  fetchOnMount: boolean = false,
) => {
  return useCounselCardInfoQuery<CounselCardLivingInformationRes>(
    counselSessionId,
    'living',
    fetchOnMount,
  );
};

// 공통 뮤테이션 훅 생성기
const createMutationHook = <TReq>(
  infoType: InfoType,
  validateFn?: (data: TReq) => void,
) => {
  return () => {
    const queryClient = useQueryClient();
    const { setLoading, setError } = useCounselCardStore();
    const queryKey = getQueryKeyForInfoType(infoType);

    return useMutation({
      mutationFn: async ({
        counselSessionId,
        data,
      }: {
        counselSessionId: string;
        data: TReq;
      }) => {
        setLoading(infoType, true);
        try {
          // 유효성 검증 함수가 있으면 실행
          if (validateFn) {
            validateFn(data);
          }

          const response = await updateInfoData(
            infoType,
            counselSessionId,
            data as
              | UpdateBaseInformationReq
              | UpdateHealthInformationReq
              | UpdateIndependentLifeInformationReq
              | UpdateLivingInformationReq,
          );
          return response.data;
        } catch (error) {
          if (error instanceof Error) {
            toast.error(error.message);
            setError(infoType, error.message);
          } else {
            handleError(error, infoType, '업데이트');
          }
          throw error;
        } finally {
          setLoading(infoType, false);
        }
      },
      onSuccess: (_, { counselSessionId }) => {
        queryClient.invalidateQueries({
          queryKey: [queryKey, counselSessionId],
        });
      },
    });
  };
};

// 기본 정보 업데이트 뮤테이션 훅
export const useCounselCardBaseInfoMutation =
  createMutationHook<UpdateBaseInformationReq>('base');

// 건강 정보 업데이트 뮤테이션 훅
export const useCounselCardHealthInfoMutation =
  createMutationHook<UpdateHealthInformationReq>('health', validateHealthInfo);

// 독립생활 정보 업데이트 뮤테이션 훅 (특별 로직 포함)
export const useCounselCardIndependentLifeInfoMutation = () => {
  const queryClient = useQueryClient();
  const { setLoading, setError } = useCounselCardStore();
  const queryKey = getQueryKeyForInfoType('independentLife');

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
        const response = await updateInfoData(
          'independentLife',
          counselSessionId,
          data,
        );
        return response.data;
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
        queryKey: [queryKey, counselSessionId],
      });
    },
  });
};

// 생활 정보 업데이트 뮤테이션 훅
export const useCounselCardLivingInfoMutation =
  createMutationHook<UpdateLivingInformationReq>('living', validateLivingInfo);

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
      invalidateAllInfoQueries(queryClient, counselSessionId);

      // 오늘의 스케줄 테이블 데이터도 무효화
      queryClient.invalidateQueries({
        queryKey: ['selectCounselSessionList'],
      });
    },
  });
};

// 임시 저장 훅 - isDirty 제거
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

      // 기본 정보 저장 뮤테이션 추가
      if (store.infoData.base) {
        const baseInfoReq = {
          baseInfo: store.infoData.base.baseInfo || {},
          counselPurposeAndNote:
            store.infoData.base.counselPurposeAndNote || {},
        };
        mutations.push(
          baseInfoMutation.mutateAsync({
            counselSessionId,
            data: baseInfoReq,
          }),
        );
      }

      // 건강 정보 저장 뮤테이션 추가
      if (store.infoData.health) {
        const healthInfoReq = {
          diseaseInfo: store.infoData.health.diseaseInfo || {},
          allergy: store.infoData.health.allergy || {},
          medicationSideEffect:
            store.infoData.health.medicationSideEffect || {},
        };

        mutations.push(
          healthInfoMutation.mutateAsync({
            counselSessionId,
            data: healthInfoReq,
          }),
        );
      }

      // 독립생활 정보 저장 (장애인인 경우에만)
      const isDisability = await checkIsDisability(counselSessionId);
      if (store.infoData.independentLife && isDisability) {
        const independentLifeInfoReq = {
          communication: store.infoData.independentLife.communication || {},
          evacuation: store.infoData.independentLife.evacuation || {},
          walking: store.infoData.independentLife.walking || {},
        };
        mutations.push(
          independentLifeInfoMutation.mutateAsync({
            counselSessionId,
            data: independentLifeInfoReq,
          }),
        );
      }

      // 생활 정보 저장 뮤테이션 추가
      if (store.infoData.living) {
        const livingInfoReq = {
          drinking: store.infoData.living.drinking || {},
          smoking: store.infoData.living.smoking || {},
          exercise: store.infoData.living.exercise || {},
          nutrition: store.infoData.living.nutrition || {},
          medicationManagement:
            store.infoData.living.medicationManagement || {},
        };

        mutations.push(
          livingInfoMutation.mutateAsync({
            counselSessionId,
            data: livingInfoReq,
          }),
        );
      }

      // 모든 뮤테이션 동시 실행
      await Promise.all(mutations);
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
