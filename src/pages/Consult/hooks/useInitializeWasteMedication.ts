import { useEffect, useState } from 'react';
import {
  SelectMedicationRecordListBySessionIdRes,
  WasteMedicationDisposalReqUnusedReasonTypesEnum,
} from '@/api';
import { useWasteMedicationDisposalQuery } from '@/pages/Consult/hooks/query/wasteMedicineRecord/useWasteMedicationDisposalQuery';
import { useWasteMedicationList } from '@/pages/Consult/hooks/query/wasteMedicineRecord/useWasteMedicationListQuery';
import {
  initialWasteMedicationDisposalState,
  useWasteMedicationDisposalStore,
} from '@/pages/Consult/hooks/store/useWasteMedicationDisposalStore';
import { useWasteMedicationListStore } from '@/pages/Consult/hooks/store/useWasteMedicationListStore';
import { AddAndUpdateWasteMedicationDisposalDTO } from '@/pages/Consult/types/WasteMedicationDTO';

export const useInitializeWasteMedication = (
  counselSessionId: string | null,
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isDisposalInitializedLocal, setIsDisposalInitializedLocal] =
    useState(false);
  const [isListInitializedLocal, setIsListInitializedLocal] = useState(false);

  const {
    data: wasteMedicationDisposalData,
    isSuccess: isSuccessWasteMedicationDisposal,
    isError: isWasteMedicationDisposalError,
    isLoading: isDisposalQueryLoading,
  } = useWasteMedicationDisposalQuery(counselSessionId as string);

  const {
    data: wasteMedicationListData,
    isSuccess: isSuccessWasteMedicationList,
    isError: isWasteMedicationListError,
    isLoading: isListQueryLoading,
  } = useWasteMedicationList(counselSessionId as string);

  const {
    isDisposalInitialized: isDisposalStoreInitialized,
    setIsDisposalInitialized: setDisposalStoreIsInitialized,
    setWasteMedicationDisposal,
    clearWasteMedicationDisposal,
  } = useWasteMedicationDisposalStore();

  const {
    isWasteListInitialized: isListStoreInitialized,
    setIsWasteListInitialized: setListStoreIsInitialized,
    setWasteMedicationList,
    clearWasteMedicationList,
  } = useWasteMedicationListStore();

  // 폐의약품 설문 init
  useEffect(() => {
    if (!counselSessionId) {
      setIsDisposalInitializedLocal(false);
      if (isDisposalStoreInitialized) clearWasteMedicationDisposal();
      return;
    }
    if (isDisposalInitializedLocal && isDisposalStoreInitialized) return;

    if (!isDisposalQueryLoading) {
      if (isSuccessWasteMedicationDisposal && wasteMedicationDisposalData) {
        setWasteMedicationDisposal(
          wasteMedicationDisposalData
            ? ({
                unusedReasonTypes:
                  wasteMedicationDisposalData.unusedReasons?.map(
                    (reason: string) =>
                      reason as WasteMedicationDisposalReqUnusedReasonTypesEnum,
                  ),
                unusedReasonDetail:
                  wasteMedicationDisposalData.unusedReasonDetail ?? '',
                drugRemainActionType:
                  wasteMedicationDisposalData.drugRemainActionType ?? undefined,
                drugRemainActionDetail:
                  wasteMedicationDisposalData.drugRemainActionDetail ?? '',
                recoveryAgreementType:
                  wasteMedicationDisposalData.recoveryAgreementType ??
                  undefined,
                wasteMedicationGram:
                  wasteMedicationDisposalData.wasteMedicationGram ?? 0,
              } as AddAndUpdateWasteMedicationDisposalDTO)
            : initialWasteMedicationDisposalState,
        );
        setDisposalStoreIsInitialized(true);
        setIsDisposalInitializedLocal(true);
      } else if (isWasteMedicationDisposalError) {
        setError(
          (prev) => prev || new Error('폐의약품 처리 데이터 초기화 중 오류.'),
        );
        setIsDisposalInitializedLocal(false);
        clearWasteMedicationDisposal();
      } else if (isSuccessWasteMedicationDisposal) {
        setWasteMedicationDisposal(initialWasteMedicationDisposalState);
        setDisposalStoreIsInitialized(true);
        setIsDisposalInitializedLocal(true);
      }
    }
  }, [
    counselSessionId,
    wasteMedicationDisposalData,
    isSuccessWasteMedicationDisposal,
    isWasteMedicationDisposalError,
    isDisposalQueryLoading,
    setWasteMedicationDisposal,
    setDisposalStoreIsInitialized,
    isDisposalStoreInitialized,
    clearWasteMedicationDisposal,
    isDisposalInitializedLocal,
  ]);

  // 폐의약품 목록 init
  useEffect(() => {
    if (!counselSessionId) {
      setIsListInitializedLocal(false);
      if (isListStoreInitialized) clearWasteMedicationList();
      return;
    }
    if (isListInitializedLocal && isListStoreInitialized) return;

    if (!isListQueryLoading) {
      if (isSuccessWasteMedicationList && wasteMedicationListData) {
        setWasteMedicationList(
          wasteMedicationListData.map(
            (item: SelectMedicationRecordListBySessionIdRes) => ({
              id: item.rowId ?? '',
              rowId: item.rowId,
              medicationId: item.medicationId ?? '',
              medicationName: item.medicationName ?? '',
              unit: item.unit ?? 0,
              disposalReason: item.disposalReason ?? '',
            }),
          ),
        );
        setListStoreIsInitialized(true);
        setIsListInitializedLocal(true);
      } else if (isWasteMedicationListError) {
        setError(
          (prev) => prev || new Error('폐의약품 목록 데이터 초기화 중 오류.'),
        );
        setIsListInitializedLocal(false);
        clearWasteMedicationList();
      } else if (isSuccessWasteMedicationList) {
        setWasteMedicationList([]);
        setListStoreIsInitialized(true);
        setIsListInitializedLocal(true);
      }
    }
  }, [
    counselSessionId,
    wasteMedicationListData,
    isSuccessWasteMedicationList,
    isWasteMedicationListError,
    isListQueryLoading,
    setWasteMedicationList,
    setListStoreIsInitialized,
    isListStoreInitialized,
    clearWasteMedicationList,
    isListInitializedLocal,
  ]);

  useEffect(() => {
    if (!counselSessionId) {
      setIsLoading(false);
      setError(null);
      return;
    }
    const currentLoading = isDisposalQueryLoading || isListQueryLoading;
    setIsLoading(currentLoading);

    if (!currentLoading) {
      if (isWasteMedicationDisposalError || isWasteMedicationListError) {
        setError(new Error('폐의약품 데이터 초기화 중 오류가 발생했습니다.'));
      } else {
        setError(null);
      }
    }
  }, [
    isDisposalQueryLoading,
    isListQueryLoading,
    counselSessionId,
    isWasteMedicationDisposalError,
    isWasteMedicationListError,
  ]);

  useEffect(() => {
    if (!counselSessionId) {
      clearWasteMedicationDisposal();
      clearWasteMedicationList();
      setIsDisposalInitializedLocal(false);
      setIsListInitializedLocal(false);
      return;
    }
    return () => {
      clearWasteMedicationDisposal();
      clearWasteMedicationList();
      setIsDisposalInitializedLocal(false);
      setIsListInitializedLocal(false);
    };
  }, [
    counselSessionId,
    clearWasteMedicationDisposal,
    clearWasteMedicationList,
  ]);

  return {
    isLoading,
    error,
    isWasteMedicationInitialized:
      isDisposalInitializedLocal &&
      isListInitializedLocal &&
      isDisposalStoreInitialized &&
      isListStoreInitialized,
  };
};
