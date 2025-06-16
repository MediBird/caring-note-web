import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  CounselCardControllerApi,
  SelectPreviousItemListByInformationNameAndItemNameTypeEnum,
} from '@/api';
import { useHistoryStore } from '../store/useHistoryStore';
import { useEffect } from 'react';

const counselCardControllerApi = new CounselCardControllerApi();

// 기본 정보 히스토리 조회 훅
export const useBaseInformationHistoryQuery = (
  counselSessionId: string,
  enabled: boolean = true,
) => {
  const { setHistoryData, setLoading, setError } = useHistoryStore();
  const queryResult = useQuery({
    queryKey: ['baseInformationHistory', counselSessionId],
    queryFn: async () => {
      const response =
        await counselCardControllerApi.selectMainCounselBaseInformation(
          counselSessionId,
        );
      return response.data.data;
    },
    enabled: !!counselSessionId && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data, isSuccess, isError, error, isLoading } = queryResult;

  useEffect(() => {
    setLoading(
      SelectPreviousItemListByInformationNameAndItemNameTypeEnum.CounselPurposeAndNote,
      isLoading,
    );
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (isSuccess && data) {
      const counselPurposeHistory = data?.counselPurpose?.history || [];
      const significantNoteHistory = data?.significantNote?.history || [];
      const medicationNoteHistory = data?.medicationNote?.history || [];

      const allHistory = [
        ...counselPurposeHistory,
        ...significantNoteHistory,
        ...medicationNoteHistory,
      ];

      setHistoryData(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.CounselPurposeAndNote,
        allHistory,
      );
      setError(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.CounselPurposeAndNote,
        null,
      );
    }
  }, [isSuccess, data, setHistoryData, setError]);

  useEffect(() => {
    if (isError) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : '기본 정보 히스토리 조회 중 오류가 발생했습니다.';
      setError(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.CounselPurposeAndNote,
        errorMessage,
      );
    }
  }, [isError, error, setError]);

  return queryResult;
};

// 건강 정보 히스토리 조회 훅
export const useHealthInformationHistoryQuery = (
  counselSessionId: string,
  enabled: boolean = true,
) => {
  const { setHistoryData, setLoading, setError } = useHistoryStore();
  const queryResult = useQuery({
    queryKey: ['healthInformationHistory', counselSessionId],
    queryFn: async () => {
      const response =
        await counselCardControllerApi.selectMainCounselHealthInformation(
          counselSessionId,
        );
      return response.data.data;
    },
    enabled: !!counselSessionId && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data, isSuccess, isError, error, isLoading } = queryResult;

  useEffect(() => {
    setLoading(
      SelectPreviousItemListByInformationNameAndItemNameTypeEnum.DiseaseInfo,
      isLoading,
    );
    setLoading(
      SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Allergy,
      isLoading,
    );
    setLoading(
      SelectPreviousItemListByInformationNameAndItemNameTypeEnum.MedicationSideEffect,
      isLoading,
    );
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (isSuccess && data) {
      const diseaseHistory = [
        ...(data?.diseases?.history || []),
        ...(data?.historyNote?.history || []),
        ...(data?.mainInconvenienceNote?.history || []),
      ];
      setHistoryData(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.DiseaseInfo,
        diseaseHistory,
      );

      const allergyHistory = data?.allergy?.history || [];
      setHistoryData(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Allergy,
        allergyHistory,
      );

      const medicationSideEffectHistory =
        data?.medicationSideEffect?.history || [];
      setHistoryData(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.MedicationSideEffect,
        medicationSideEffectHistory,
      );

      setError(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.DiseaseInfo,
        null,
      );
      setError(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Allergy,
        null,
      );
      setError(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.MedicationSideEffect,
        null,
      );
    }
  }, [isSuccess, data, setHistoryData, setError]);

  useEffect(() => {
    if (isError) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : '건강 정보 히스토리 조회 중 오류가 발생했습니다.';
      setError(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.DiseaseInfo,
        errorMessage,
      );
      setError(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Allergy,
        errorMessage,
      );
      setError(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.MedicationSideEffect,
        errorMessage,
      );
    }
  }, [isError, error, setError]);

  return queryResult;
};

// 자립생활 역량 히스토리 조회 훅
export const useIndependentLifeInformationHistoryQuery = (
  counselSessionId: string,
  enabled: boolean = true,
) => {
  const { setHistoryData, setLoading, setError } = useHistoryStore();
  const queryResult = useQuery({
    queryKey: ['independentLifeInformationHistory', counselSessionId],
    queryFn: async () => {
      const response =
        await counselCardControllerApi.selectMainCounselIndependentLifeInformation(
          counselSessionId,
        );
      return response.data.data;
    },
    enabled: !!counselSessionId && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data, isSuccess, isError, error, isLoading } = queryResult;

  useEffect(() => {
    setLoading(
      SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Communication,
      isLoading,
    );
    setLoading(
      SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Walking,
      isLoading,
    );
    setLoading(
      SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Evacuation,
      isLoading,
    );
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (isSuccess && data) {
      const communicationHistory = data?.communication?.history || [];
      setHistoryData(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Communication,
        communicationHistory,
      );

      const walkingHistory = data?.walking?.history || [];
      setHistoryData(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Walking,
        walkingHistory,
      );

      const evacuationHistory = data?.evacuation?.history || [];
      setHistoryData(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Evacuation,
        evacuationHistory,
      );

      setError(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Communication,
        null,
      );
      setError(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Walking,
        null,
      );
      setError(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Evacuation,
        null,
      );
    }
  }, [isSuccess, data, setHistoryData, setError]);

  useEffect(() => {
    if (isError) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : '자립생활 역량 히스토리 조회 중 오류가 발생했습니다.';
      setError(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Communication,
        errorMessage,
      );
      setError(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Walking,
        errorMessage,
      );
      setError(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Evacuation,
        errorMessage,
      );
    }
  }, [isError, error, setError]);

  return queryResult;
};

// 생활 정보 히스토리 조회 훅
export const useLivingInformationHistoryQuery = (
  counselSessionId: string,
  enabled: boolean = true,
) => {
  const { setHistoryData, setLoading, setError } = useHistoryStore();
  const queryResult = useQuery({
    queryKey: ['livingInformationHistory', counselSessionId],
    queryFn: async () => {
      const response =
        await counselCardControllerApi.selectMainCounselLivingInformation(
          counselSessionId,
        );
      return response.data.data;
    },
    enabled: !!counselSessionId && enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const { data, isSuccess, isError, error, isLoading } = queryResult;

  useEffect(() => {
    setLoading(
      SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Smoking,
      isLoading,
    );
    setLoading(
      SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Drinking,
      isLoading,
    );
    setLoading(
      SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Exercise,
      isLoading,
    );
    setLoading(
      SelectPreviousItemListByInformationNameAndItemNameTypeEnum.MedicationManagement,
      isLoading,
    );
    setLoading(
      SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Nutrition,
      isLoading,
    );
  }, [isLoading, setLoading]);

  useEffect(() => {
    if (isSuccess && data) {
      const smokingHistory = data?.smoking?.history || [];
      setHistoryData(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Smoking,
        smokingHistory,
      );

      const drinkingHistory = data?.drinkingAmount?.history || [];
      setHistoryData(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Drinking,
        drinkingHistory,
      );

      const exerciseHistory = data?.exercise?.history || [];
      setHistoryData(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Exercise,
        exerciseHistory,
      );

      const medicationManagementHistory =
        data?.medicationManagement?.history || [];
      setHistoryData(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.MedicationManagement,
        medicationManagementHistory,
      );

      const nutritionHistory = data?.nutrition?.history || [];
      setHistoryData(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Nutrition,
        nutritionHistory,
      );

      setError(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Smoking,
        null,
      );
      setError(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Drinking,
        null,
      );
      setError(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Exercise,
        null,
      );
      setError(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.MedicationManagement,
        null,
      );
      setError(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Nutrition,
        null,
      );
    }
  }, [isSuccess, data, setHistoryData, setError]);

  useEffect(() => {
    if (isError) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : '생활 정보 히스토리 조회 중 오류가 발생했습니다.';
      setError(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Smoking,
        errorMessage,
      );
      setError(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Drinking,
        errorMessage,
      );
      setError(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Exercise,
        errorMessage,
      );
      setError(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.MedicationManagement,
        errorMessage,
      );
      setError(
        SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Nutrition,
        errorMessage,
      );
    }
  }, [isError, error, setError]);

  return queryResult;
};

// 모든 히스토리를 초기화하고 fetching하는 훅
export const useInitializeAllHistoryData = (counselSessionId: string) => {
  const queryClient = useQueryClient();
  const { resetHistoryForSession, currentCounselSessionId } = useHistoryStore();

  useEffect(() => {
    if (counselSessionId && counselSessionId !== currentCounselSessionId) {
      if (currentCounselSessionId) {
        queryClient.removeQueries({
          queryKey: ['baseInformationHistory', currentCounselSessionId],
        });
        queryClient.removeQueries({
          queryKey: ['healthInformationHistory', currentCounselSessionId],
        });
        queryClient.removeQueries({
          queryKey: [
            'independentLifeInformationHistory',
            currentCounselSessionId,
          ],
        });
        queryClient.removeQueries({
          queryKey: ['livingInformationHistory', currentCounselSessionId],
        });
      }
      resetHistoryForSession(counselSessionId);
    }
  }, [
    counselSessionId,
    currentCounselSessionId,
    queryClient,
    resetHistoryForSession,
  ]);

  const baseInfoQuery = useBaseInformationHistoryQuery(counselSessionId);
  const healthInfoQuery = useHealthInformationHistoryQuery(counselSessionId);
  const independentLifeQuery =
    useIndependentLifeInformationHistoryQuery(counselSessionId);
  const livingInfoQuery = useLivingInformationHistoryQuery(counselSessionId);

  const isLoading =
    baseInfoQuery.isLoading ||
    healthInfoQuery.isLoading ||
    independentLifeQuery.isLoading ||
    livingInfoQuery.isLoading;
  const hasError =
    baseInfoQuery.error ||
    healthInfoQuery.error ||
    independentLifeQuery.error ||
    livingInfoQuery.error;

  return {
    isLoading,
    hasError,
  };
};

// 스토어에서 히스토리 데이터를 가져오는 훅
export const useHistoryData = (
  type: SelectPreviousItemListByInformationNameAndItemNameTypeEnum,
) => {
  const {
    getHistoryData,
    isHistoryLoading,
    hasHistoryData,
    isHistoryInitialized,
  } = useHistoryStore();

  return {
    historyData: getHistoryData(type),
    isLoading: isHistoryLoading(type),
    hasData: hasHistoryData(type),
    isInitialized: isHistoryInitialized(type),
  };
};
