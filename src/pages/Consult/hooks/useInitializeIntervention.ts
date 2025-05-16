import { useEffect, useState } from 'react';
import { useSelectMedicineConsult } from '@/pages/Consult/hooks/query/useMedicineConsultQuery';
import {
  initialMedicationConsultState,
  useMedicationConsultStore,
} from '@/pages/Consult/hooks/store/useMedicationConsultStore';

export const useInitializeIntervention = (counselSessionId: string | null) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const {
    data: medicineConsultData,
    isError: isMedicineConsultError,
    isLoading: isQueryLoading,
  } = useSelectMedicineConsult(counselSessionId as string);

  const {
    isMedicationConsultInitialized: isStoreInitialized,
    setIsMedicationConsultInitialized: setStoreIsInitialized,
    setMedicationConsult,
    clearMedicationConsult,
  } = useMedicationConsultStore();

  useEffect(() => {
    if (!counselSessionId) {
      setIsLoading(false);
      setIsInitialized(false);
      if (isStoreInitialized) {
        clearMedicationConsult();
      }
      return;
    }

    if (isInitialized && isStoreInitialized) return;

    setIsLoading(isQueryLoading);

    if (isInitialized && isStoreInitialized) return;

    setError(null);

    if (!isQueryLoading) {
      if (medicineConsultData && !isMedicineConsultError) {
        setMedicationConsult({
          counselSessionId: counselSessionId || '',
          medicationCounselId: medicineConsultData.medicationCounselId || '',
          counselRecord: medicineConsultData.counselRecord || '',
        });
        setStoreIsInitialized(true);
        setIsInitialized(true);
      } else if (isMedicineConsultError) {
        setError(new Error('중재 기록 데이터 초기화 중 오류가 발생했습니다.'));
        setIsInitialized(false);
        clearMedicationConsult();
      } else if (!medicineConsultData) {
        setMedicationConsult(initialMedicationConsultState);
        setStoreIsInitialized(true);
        setIsInitialized(true);
      }
    }
  }, [
    counselSessionId,
    medicineConsultData,
    isMedicineConsultError,
    isQueryLoading,
    setMedicationConsult,
    setStoreIsInitialized,
    isStoreInitialized,
    clearMedicationConsult,
    isInitialized,
  ]);

  useEffect(() => {
    if (!counselSessionId) {
      clearMedicationConsult();
      setIsInitialized(false);
      return;
    }
    return () => {
      clearMedicationConsult();
      setIsInitialized(false);
    };
  }, [counselSessionId, clearMedicationConsult]);

  return {
    isLoading,
    error,
    isInterventionInitialized: isInitialized && isStoreInitialized,
  };
};
