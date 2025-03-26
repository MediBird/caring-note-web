import { WasteMedicationDisposalReqUnusedReasonTypesEnum } from '@/api';
import { useMedicationRecordList } from '@/pages/Consult/hooks/query/medicationRecord/useMedicationRecordList';
import { useSelectMedicineConsult } from '@/pages/Consult/hooks/query/useMedicineConsultQuery';
import { useWasteMedicationDisposalQuery } from '@/pages/Consult/hooks/query/wasteMedicineRecord/useWasteMedicationDisposalQuery';
import { useWasteMedicationList } from '@/pages/Consult/hooks/query/wasteMedicineRecord/useWasteMedicationListQuery';
import { AddAndUpdateWasteMedicationDisposalDTO } from '@/pages/Consult/types/WasteMedicationDTO';
import {
  initialWasteMedicationDisposalState,
  useWasteMedicationDisposalStore,
} from '@/pages/Consult/hooks/store/useWasteMedicationDisposalStore';
import { useWasteMedicationListStore } from '@/pages/Consult/hooks/store/useWasteMedicationListStore';
import useCounselRecordEditorStateStore from '@/store/counselRecordEditorStateStore';
import { useMedicineConsultStore } from '@/store/medicineConsultStore';
import useMedicineMemoStore from '@/store/medicineMemoStore';

import { useEffect, useState } from 'react';
import { EditorState } from 'draft-js';
import { ContentBlock, Modifier, SelectionState } from 'draft-js';
import { ContentState } from 'draft-js';

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
  const { editorState, setEditorState } = useCounselRecordEditorStateStore();
  const { isEditorInitialized, setEditorInitialized, setMedicationConsult } =
    useMedicineConsultStore();

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

  // 폐의약품 설문 init
  useEffect(() => {
    if (isDisposalInitialized) return;

    if (isSuccessWasteMedicationDisposal) {
      setWasteMedicationDisposal(
        wasteMedicationDisposalData
          ? ({
              unusedReasonTypes: wasteMedicationDisposalData.unusedReasons?.map(
                (reason) =>
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
        wasteMedicationListData.map((item) => ({
          id: item.rowId ?? '',
          rowId: item.rowId,
          medicationId: item.medicationId ?? '',
          medicationName: item.medicationName ?? '',
          unit: item.unit ?? 0,
          disposalReason: item.disposalReason ?? '',
        })),
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

  //의약물 기록 init
  useEffect(() => {
    if (isMedicineMemoInitialized) return;

    if (medicationRecordListData) {
      setMedicationRecordList(medicationRecordListData ?? []);
      setMedicineMemoInitialized(true);
    }
  }, [
    medicationRecordListData,
    setMedicationRecordList,
    setMedicineMemoInitialized,
    isMedicineMemoInitialized,
  ]);

  // 중재기록 init
  useEffect(() => {
    if (isEditorInitialized) return;

    if (medicineConsultData) {
      setMedicationConsult({
        counselSessionId: counselSessionId || '',
        medicationCounselId: medicineConsultData.medicationCounselId || '',
        counselRecord: medicineConsultData.counselRecord || '',
        counselRecordHighlights:
          medicineConsultData.counselRecordHighlights || [],
      });

      const contentState = ContentState.createFromText(
        medicineConsultData.counselRecord || '',
      );

      let contentStateWithHighlight = contentState;

      if (
        medicineConsultData.counselRecordHighlights?.length &&
        medicineConsultData.counselRecord
      ) {
        contentStateWithHighlight =
          medicineConsultData.counselRecordHighlights.reduce(
            (currentContent, highlight) => {
              const start = highlight.startIndex;
              const end = highlight.endIndex;

              if (start === -1) return currentContent;

              try {
                let offset = 0;
                let targetBlock: ContentBlock | null = null;
                let targetStart = start;
                let targetEnd = end;

                const blocks = currentContent.getBlockMap().toArray();
                for (const block of blocks) {
                  const length = block.getLength();
                  if (start >= offset && start < offset + length) {
                    targetBlock = block;
                    targetStart = start - offset;
                    targetEnd = end - offset;
                    break;
                  }
                  offset += length + 1;
                }

                if (!targetBlock) return currentContent;

                const blockKey = targetBlock.getKey();
                const selectionState = SelectionState.createEmpty(
                  blockKey,
                ).merge({
                  anchorOffset: targetStart,
                  focusOffset: targetEnd,
                  hasFocus: true,
                });

                return Modifier.applyInlineStyle(
                  currentContent,
                  selectionState,
                  'HIGHLIGHT',
                );
              } catch (error) {
                console.error('하이라이트 스타일 적용 중 오류 발생:', error);
                return currentContent;
              }
            },
            contentState,
          );
      }

      const newEditorState = EditorState.createWithContent(
        contentStateWithHighlight,
      );

      setEditorState(newEditorState);
      setEditorInitialized(true);
    }
  }, [
    medicineConsultData,
    counselSessionId,
    editorState,
    setEditorState,
    setMedicationConsult,
    setEditorInitialized,
    isEditorInitialized,
  ]);

  // 모든 초기화 상태 확인 및 업데이트
  useEffect(() => {
    if (
      isMedicineMemoInitialized &&
      isEditorInitialized &&
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
    isEditorInitialized,
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
      isEditorInitialized ||
      isDisposalInitialized ||
      isWasteListInitialized
    ) {
      setMedicineMemoInitialized(false);
      setEditorInitialized(false);
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
    isEditorInitialized,
    isDisposalInitialized,
    isWasteListInitialized,
  };
};
