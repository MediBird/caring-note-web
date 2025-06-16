import { useQuery } from '@tanstack/react-query';
import {
  CounselCardControllerApi,
  SelectPreviousItemListByInformationNameAndItemNameTypeEnum,
  TimeRecordedResObject,
} from '@/api';
import { useHistoryStore } from '../store/useHistoryStore';
import { useEffect } from 'react';

const counselCardControllerApi = new CounselCardControllerApi();

// 히스토리 데이터 조회 함수
const selectPreviousItemList = async (
  counselSessionId: string,
  type: SelectPreviousItemListByInformationNameAndItemNameTypeEnum,
): Promise<TimeRecordedResObject[]> => {
  const response =
    await counselCardControllerApi.selectPreviousItemListByInformationNameAndItemName(
      counselSessionId,
      type,
    );

  return response.data.data ?? [];
};

// 개별 히스토리 조회 훅 (내부적으로만 사용)
const useHistoryQueryInternal = (
  counselSessionId: string,
  type: SelectPreviousItemListByInformationNameAndItemNameTypeEnum,
  enabled: boolean = true,
) => {
  const { setHistoryData, setLoading, setError } = useHistoryStore();

  return useQuery({
    queryKey: ['historyData', counselSessionId, type],
    queryFn: async () => {
      setLoading(type, true);
      try {
        const data = await selectPreviousItemList(counselSessionId, type);
        setHistoryData(type, data);
        setError(type, null);
        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : '히스토리 조회 중 오류가 발생했습니다.';
        setError(type, errorMessage);
        throw error;
      } finally {
        setLoading(type, false);
      }
    },
    enabled: !!counselSessionId && enabled,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};

// 여러 타입의 히스토리를 한번에 조회하는 훅
export const useInitializeHistoryData = (
  counselSessionId: string,
  types: SelectPreviousItemListByInformationNameAndItemNameTypeEnum[],
) => {
  const { setCounselSessionId, currentCounselSessionId, clearHistoryData } =
    useHistoryStore();

  // counselSessionId가 변경되면 스토어 초기화
  useEffect(() => {
    if (counselSessionId && counselSessionId !== currentCounselSessionId) {
      clearHistoryData();
      setCounselSessionId(counselSessionId);
    }
  }, [
    counselSessionId,
    currentCounselSessionId,
    clearHistoryData,
    setCounselSessionId,
  ]);

  // 각 타입별로 쿼리 실행 - 조건부 훅 사용을 피하기 위해 모든 타입에 대해 훅 호출
  const query1 = useHistoryQueryInternal(
    counselSessionId,
    types[0] ||
      SelectPreviousItemListByInformationNameAndItemNameTypeEnum.CounselPurposeAndNote,
    types.length > 0,
  );
  const query2 = useHistoryQueryInternal(
    counselSessionId,
    types[1] ||
      SelectPreviousItemListByInformationNameAndItemNameTypeEnum.DiseaseInfo,
    types.length > 1,
  );
  const query3 = useHistoryQueryInternal(
    counselSessionId,
    types[2] ||
      SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Allergy,
    types.length > 2,
  );
  const query4 = useHistoryQueryInternal(
    counselSessionId,
    types[3] ||
      SelectPreviousItemListByInformationNameAndItemNameTypeEnum.MedicationSideEffect,
    types.length > 3,
  );
  const query5 = useHistoryQueryInternal(
    counselSessionId,
    types[4] ||
      SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Smoking,
    types.length > 4,
  );
  const query6 = useHistoryQueryInternal(
    counselSessionId,
    types[5] ||
      SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Drinking,
    types.length > 5,
  );
  const query7 = useHistoryQueryInternal(
    counselSessionId,
    types[6] ||
      SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Exercise,
    types.length > 6,
  );
  const query8 = useHistoryQueryInternal(
    counselSessionId,
    types[7] ||
      SelectPreviousItemListByInformationNameAndItemNameTypeEnum.MedicationManagement,
    types.length > 7,
  );
  const query9 = useHistoryQueryInternal(
    counselSessionId,
    types[8] ||
      SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Nutrition,
    types.length > 8,
  );
  const query10 = useHistoryQueryInternal(
    counselSessionId,
    types[9] ||
      SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Communication,
    types.length > 9,
  );
  const query11 = useHistoryQueryInternal(
    counselSessionId,
    types[10] ||
      SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Walking,
    types.length > 10,
  );
  const query12 = useHistoryQueryInternal(
    counselSessionId,
    types[11] ||
      SelectPreviousItemListByInformationNameAndItemNameTypeEnum.Evacuation,
    types.length > 11,
  );

  const queries = [
    query1,
    query2,
    query3,
    query4,
    query5,
    query6,
    query7,
    query8,
    query9,
    query10,
    query11,
    query12,
  ].slice(0, types.length);

  const isLoading = queries.some((query) => query.isLoading);
  const hasError = queries.some((query) => query.error);

  return {
    isLoading,
    hasError,
    queries,
  };
};

// 스토어에서 히스토리 데이터를 가져오는 훅
export const useHistoryData = (
  type: SelectPreviousItemListByInformationNameAndItemNameTypeEnum,
) => {
  const { getHistoryData, isHistoryLoading, hasHistoryData } =
    useHistoryStore();

  return {
    historyData: getHistoryData(type),
    isLoading: isHistoryLoading(type),
    hasData: hasHistoryData(type),
  };
};
