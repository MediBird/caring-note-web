import {
  SelectMedicationRecordListBySessionIdRes,
  WasteMedicationDisposalReqUnusedReasonTypesEnum,
} from '@/api';
import { useMedicationRecordList } from '@/pages/Consult/hooks/query/medicationRecord/useMedicationRecordList';
import { useSelectMedicineConsult } from '@/pages/Consult/hooks/query/useMedicineConsultQuery';
import { useWasteMedicationDisposalQuery } from '@/pages/Consult/hooks/query/wasteMedicineRecord/useWasteMedicationDisposalQuery';
import { useWasteMedicationList } from '@/pages/Consult/hooks/query/wasteMedicineRecord/useWasteMedicationListQuery';
import { useMedicationConsultStore } from '@/pages/Consult/hooks/store/useMedicationConsultStore';
import {
  initialWasteMedicationDisposalState,
  useWasteMedicationDisposalStore,
} from '@/pages/Consult/hooks/store/useWasteMedicationDisposalStore';
import { useWasteMedicationListStore } from '@/pages/Consult/hooks/store/useWasteMedicationListStore';
import { AddAndUpdateWasteMedicationDisposalDTO } from '@/pages/Consult/types/WasteMedicationDTO';
import useMedicineMemoStore from '@/store/medicineMemoStore';
import { useEffect, useState } from 'react';

export const useInitializeAllTabsData = (counselSessionId: string) => {
  // 모든 초기화 진행 상태를 추적하는 플래그
  const [isAllInitialized, setIsAllInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // 의약물 기록 조회
  const { data: medicationRecordListData, isError: isMedicationRecordError } =
    useMedicationRecordList({
      counselSessionId: counselSessionId as string,
    });

  // 중재기록 조회
  const { data: medicineConsultData, isError: isMedicineConsultError } =
    useSelectMedicineConsult(counselSessionId);

  // 폐의약품 처리 조회
  const {
    data: wasteMedicationDisposalData,
    isSuccess: isSuccessWasteMedicationDisposal,
    isError: isWasteMedicationDisposalError,
  } = useWasteMedicationDisposalQuery(counselSessionId as string);

  // 폐의약품 목록 조회
  const {
    data: wasteMedicationListData,
    isSuccess: isSuccessWasteMedicationList,
    isError: isWasteMedicationListError,
  } = useWasteMedicationList(counselSessionId as string);

  // 의약물 기록 store
  const {
    isListInitialized: isMedicineMemoInitialized,
    setIsListInitialized: setMedicineMemoInitialized,
    setMedicationRecordList,
  } = useMedicineMemoStore();

  // 중재기록 store
  const {
    isMedicationConsultInitialized,
    setIsMedicationConsultInitialized,
    setMedicationConsult,
  } = useMedicationConsultStore();

  // 폐의약품 설문 store
  const {
    setWasteMedicationDisposal,
    isDisposalInitialized,
    setIsDisposalInitialized,
  } = useWasteMedicationDisposalStore();

  // 폐의약품 목록 store
  const {
    setWasteMedicationList,
    isWasteListInitialized,
    setIsWasteListInitialized,
  } = useWasteMedicationListStore();

  // 의약물 기록 init 및 업데이트를 하나의 useEffect로 통합
  useEffect(() => {
    if (medicationRecordListData) {
      setMedicationRecordList(medicationRecordListData);

      // 아직 초기화되지 않았다면 초기화 완료로 표시
      if (!isMedicineMemoInitialized) {
        setMedicineMemoInitialized(true);
      }
    }
  }, [
    medicationRecordListData,
    setMedicationRecordList,
    setMedicineMemoInitialized,
    isMedicineMemoInitialized,
  ]);

  // 폐의약품 설문 init
  useEffect(() => {
    if (isDisposalInitialized) return;

    if (isSuccessWasteMedicationDisposal) {
      setWasteMedicationDisposal(
        wasteMedicationDisposalData
          ? ({
              unusedReasonTypes: wasteMedicationDisposalData.unusedReasons?.map(
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
                wasteMedicationDisposalData.recoveryAgreementType ?? undefined,
              wasteMedicationGram:
                wasteMedicationDisposalData.wasteMedicationGram ?? 0,
            } as AddAndUpdateWasteMedicationDisposalDTO)
          : initialWasteMedicationDisposalState,
      );
      setIsDisposalInitialized(true);
    }
  }, [
    setIsDisposalInitialized,
    isSuccessWasteMedicationDisposal,
    wasteMedicationDisposalData,
    setWasteMedicationDisposal,
    counselSessionId,
    isDisposalInitialized,
  ]);

  //폐의약품 목록 init
  useEffect(() => {
    if (isWasteListInitialized) return;

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
      setIsWasteListInitialized(true);
    }
  }, [
    isSuccessWasteMedicationList,
    wasteMedicationListData,
    setWasteMedicationList,
    setIsWasteListInitialized,
    isWasteListInitialized,
    counselSessionId,
  ]);

  // 중재기록 init
  useEffect(() => {
    if (isMedicationConsultInitialized) return;

    if (medicineConsultData) {
      setMedicationConsult({
        counselSessionId: counselSessionId || '',
        medicationCounselId: medicineConsultData.medicationCounselId || '',
        counselRecord: medicineConsultData.counselRecord || '',
      });
      setIsMedicationConsultInitialized(true);
    }
  }, [
    medicineConsultData,
    setMedicationConsult,
    setIsMedicationConsultInitialized,
    isMedicationConsultInitialized,
    counselSessionId,
  ]);

  // 모든 초기화 상태 확인 및 업데이트
  useEffect(() => {
    if (
      isMedicineMemoInitialized &&
      isMedicationConsultInitialized &&
      isDisposalInitialized &&
      isWasteListInitialized
    ) {
      setIsAllInitialized(true);
      setIsLoading(false);
    }

    return () => {
      setIsAllInitialized(false);
      setIsLoading(true);
    };
  }, [
    isMedicineMemoInitialized,
    isMedicationConsultInitialized,
    isDisposalInitialized,
    isWasteListInitialized,
  ]);

  // 에러 처리
  useEffect(() => {
    if (
      isMedicationRecordError ||
      isMedicineConsultError ||
      isWasteMedicationDisposalError ||
      isWasteMedicationListError
    ) {
      setError(new Error('본상담 데이터 초기화 중 오류가 발생했습니다.'));
      setIsLoading(false);
    }
  }, [
    isMedicationRecordError,
    isMedicineConsultError,
    isWasteMedicationDisposalError,
    isWasteMedicationListError,
  ]);

  //counselSessionId 변경시 초기화
  useEffect(() => {
    if (!counselSessionId) return;

    setIsLoading(true);
    setError(null);

    // 이미 초기화된 상태인 경우에만 초기화 상태를 리셋
    if (
      isMedicineMemoInitialized ||
      isMedicationConsultInitialized ||
      isDisposalInitialized ||
      isWasteListInitialized
    ) {
      setMedicineMemoInitialized(false);
      setIsMedicationConsultInitialized(false);
      setIsDisposalInitialized(false);
      setIsWasteListInitialized(false);
      setIsAllInitialized(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counselSessionId]); // 의존성 배열에는 counselSessionId만 포함

  return {
    isLoading,
    error,
    isAllInitialized,
    isMedicineMemoInitialized,
    isMedicationConsultInitialized,
    isDisposalInitialized,
    isWasteListInitialized,
  };
};
