import {
  CounselCardBaseInformationRes,
  CounselCardBaseInformationResCardRecordStatusEnum,
  CounselCardControllerApi,
  CounselCardHealthInformationRes,
  CounselCardIndependentLifeInformationRes,
  CounselCardLivingInformationRes,
  CounseleeControllerApi,
  UpdateCounselCardReq,
  UpdateCounselCardStatusReqStatusEnum,
  UpdateCounseleeReq,
} from '@/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useRef } from 'react';
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
        await counselCardApi.updateCounselCardStatus(counselSessionId, {
          status,
        });
        return { counselSessionId };
      } catch (error) {
        handleError(error, 'base', '상태 업데이트');
        throw error;
      }
    },
    onSuccess: ({ counselSessionId }) => {
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
  const queryClient = useQueryClient();
  const { setLoading, setError } = useCounselCardStore();

  const saveDraft = async (counselSessionId: string) => {
    try {
      setLoading('base', true);
      setLoading('health', true);
      setLoading('independentLife', true);
      setLoading('living', true);

      // 모든 정보를 하나의 요청으로 통합
      const updateCounselCardReq: UpdateCounselCardReq = {};

      // 기본 정보
      if (store.infoData.base) {
        // 내담자 정보 업데이트
        if (
          store.infoData.base.baseInfo?.counseleeId &&
          (store.infoData.base.baseInfo?.counseleeName ||
            store.infoData.base.baseInfo?.birthDate ||
            store.infoData.base.baseInfo?.healthInsuranceType)
        ) {
          const updateCounseleeReq: UpdateCounseleeReq = {
            counseleeId: store.infoData.base.baseInfo.counseleeId,
            name: store.infoData.base.baseInfo.counseleeName || '',
            dateOfBirth: store.infoData.base.baseInfo.birthDate || '',
            healthInsuranceType:
              store.infoData.base.baseInfo.healthInsuranceType,
          };

          try {
            await counseleeApi.updateCounselee(updateCounseleeReq);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            toast.error('내담자 정보 업데이트에 실패했습니다.');
          }
        }

        if (store.infoData.base.counselPurposeAndNote) {
          updateCounselCardReq.counselPurposeAndNote =
            store.infoData.base.counselPurposeAndNote;
        }
      }

      // 건강 정보
      if (store.infoData.health) {
        if (store.infoData.health.diseaseInfo) {
          updateCounselCardReq.diseaseInfo = store.infoData.health.diseaseInfo;
        }
        if (store.infoData.health.allergy) {
          updateCounselCardReq.allergy = store.infoData.health.allergy;
        }
        if (store.infoData.health.medicationSideEffect) {
          updateCounselCardReq.medicationSideEffect =
            store.infoData.health.medicationSideEffect;
        }
      }

      if (store.infoData.independentLife) {
        if (store.infoData.independentLife.communication) {
          updateCounselCardReq.communication =
            store.infoData.independentLife.communication;
        }
        if (store.infoData.independentLife.evacuation) {
          updateCounselCardReq.evacuation =
            store.infoData.independentLife.evacuation;
        }
        if (store.infoData.independentLife.walking) {
          updateCounselCardReq.walking = store.infoData.independentLife.walking;
        }
      }

      // 생활 정보
      if (store.infoData.living) {
        if (store.infoData.living.drinking) {
          updateCounselCardReq.drinking = store.infoData.living.drinking;
        }
        if (store.infoData.living.smoking) {
          updateCounselCardReq.smoking = store.infoData.living.smoking;
        }
        if (store.infoData.living.exercise) {
          updateCounselCardReq.exercise = store.infoData.living.exercise;
        }
        if (store.infoData.living.nutrition) {
          updateCounselCardReq.nutrition = store.infoData.living.nutrition;
        }
        if (store.infoData.living.medicationManagement) {
          updateCounselCardReq.medicationManagement =
            store.infoData.living.medicationManagement;
        }
      }

      // 기본 정보 필수 필드 유효성 검증
      if (!store.infoData.base?.baseInfo?.healthInsuranceType) {
        throw new Error('의료보장형태를 선택해주세요.');
      }

      if (
        !store.infoData.base?.counselPurposeAndNote?.counselPurpose ||
        store.infoData.base.counselPurposeAndNote.counselPurpose.length === 0
      ) {
        throw new Error('상담 목적을 선택해주세요.');
      }

      // 건강 정보 유효성 검증
      if (
        updateCounselCardReq.allergy?.isAllergic &&
        !updateCounselCardReq.allergy?.allergyNote
      ) {
        throw new Error('알레르기가 있는 경우 상세 내용을 작성해주세요.');
      }

      if (
        updateCounselCardReq.medicationSideEffect?.isMedicationSideEffect &&
        (!updateCounselCardReq.medicationSideEffect?.suspectedMedicationNote ||
          !updateCounselCardReq.medicationSideEffect?.symptomsNote)
      ) {
        throw new Error(
          '약물 부작용이 있는 경우 의심되는 약물과 증상을 모두 작성해주세요.',
        );
      }

      // 통합 API 호출로 모든 정보 한 번에 저장
      await counselCardApi.updateCounselCard(
        counselSessionId,
        updateCounselCardReq,
      );

      // 모든 관련 쿼리 무효화
      invalidateAllInfoQueries(queryClient, counselSessionId);

      // 내담자 목록 쿼리도 무효화
      queryClient.invalidateQueries({
        queryKey: ['selectCounseleeList'],
      });

      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
        // 에러 메시지를 모든 정보 타입에 설정
        setError('base', error.message);
        setError('health', error.message);
        setError('independentLife', error.message);
        setError('living', error.message);
      } else {
        handleError(error, 'base', '임시 저장');
      }
      console.error('임시 저장 중 오류 발생:', error);
      return false;
    } finally {
      setLoading('base', false);
      setLoading('health', false);
      setLoading('independentLife', false);
      setLoading('living', false);
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
