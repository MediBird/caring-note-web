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
    clearMedicationRecords,
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

    setIsLoading(isQueryLoading);

    if (isInitialized && isStoreInitialized) return;

    setError(null);

    if (!isQueryLoading) {
      if (medicationRecordListData && !isMedicationRecordError) {
        setMedicationRecordList(medicationRecordListData);
        setStoreIsInitialized(true);
        setIsInitialized(true);
      } else if (isMedicationRecordError) {
        setError(new Error('약물 기록 데이터 초기화 중 오류가 발생했습니다.'));
        setIsInitialized(false);
        clearMedicationRecords();
      } else if (!medicationRecordListData) {
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

  useEffect(() => {
    if (!counselSessionId) {
      clearMedicationRecords();
      setIsInitialized(false);
      return;
    }

    return () => {
      clearMedicationRecords();
      setIsInitialized(false);
    };
  }, [counselSessionId, clearMedicationRecords]);

  return {
    isLoading,
    error,
    isMedicationRecordInitialized: isInitialized && isStoreInitialized,
  };
};
