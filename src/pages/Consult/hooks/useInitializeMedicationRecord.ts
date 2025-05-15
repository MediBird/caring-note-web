import { useEffect, useState } from 'react';
import { useMedicationRecordList } from '@/pages/Consult/hooks/query/medicationRecord/useMedicationRecordList';
import useMedicineMemoStore from '@/store/medicineMemoStore';

export const useInitializeMedicationRecord = (
  counselSessionId: string | null,
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    data: medicationRecordListData,
    isError: isMedicationRecordError,
    isLoading: isQueryLoading,
  } = useMedicationRecordList({
    counselSessionId: counselSessionId as string,
  });

  const {
    isListInitialized: isStoreInitialized,
    setIsListInitialized: setStoreIsInitialized,
    setMedicationRecordList,
    clearMedicationRecords, // 스토어에 데이터 및 상태 초기화 함수가 있다고 가정
  } = useMedicineMemoStore();

  useEffect(() => {
    if (!counselSessionId) {
      setIsLoading(false);
      setIsInitialized(false);
      if (isStoreInitialized) {
        clearMedicationRecords();
      }
      return;
    }

    // React Query의 enabled 옵션이 counselSessionId 유무에 따라 쿼리를 제어하므로,
    // isQueryLoading 상태를 더 신뢰할 수 있습니다.
    setIsLoading(isQueryLoading);

    if (isInitialized && isStoreInitialized) return;

    setError(null); // 각 실행마다 에러 초기화

    if (!isQueryLoading) {
      // 로딩이 끝났을 때 데이터 처리
      if (medicationRecordListData && !isMedicationRecordError) {
        setMedicationRecordList(medicationRecordListData);
        setStoreIsInitialized(true);
        setIsInitialized(true);
      } else if (isMedicationRecordError) {
        setError(new Error('약물 기록 데이터 초기화 중 오류가 발생했습니다.'));
        setIsInitialized(false);
        clearMedicationRecords();
      } else if (!medicationRecordListData) {
        // 로딩 끝, 에러 없음, 데이터도 없음 (빈 배열 등 초기 상태로 처리)
        setMedicationRecordList([]);
        setStoreIsInitialized(true);
        setIsInitialized(true);
      }
    }
  }, [
    counselSessionId,
    medicationRecordListData,
    isMedicationRecordError,
    isQueryLoading,
    setMedicationRecordList,
    setStoreIsInitialized,
    isStoreInitialized,
    clearMedicationRecords,
    isInitialized,
  ]);

  // counselSessionId 변경 시, 기존 스토어 데이터를 정리합니다.
  useEffect(() => {
    if (!counselSessionId) {
      clearMedicationRecords();
      setIsInitialized(false); // counselSessionId가 null이면 초기화 상태 해제
      return;
    }
    // 이전 ID와 다를 경우 초기화 (최초 마운트 시에는 isInitialized가 false이므로 아래 로직 실행 안됨)
    // 이 로직은 위의 메인 useEffect에서 처리하므로 중복될 수 있어 주석 처리 또는 제거 고려
    // clearMedicationRecords();
    // setIsInitialized(false);

    // 컴포넌트 언마운트 시 정리
    return () => {
      clearMedicationRecords();
      setIsInitialized(false); // 초기화 상태도 리셋
    };
  }, [counselSessionId, clearMedicationRecords]);

  return {
    isLoading, // Hook 내부의 isLoading 상태 사용
    error,
    isMedicationRecordInitialized: isInitialized && isStoreInitialized,
  };
};
