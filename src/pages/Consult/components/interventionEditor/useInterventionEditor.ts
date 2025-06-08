import { useCallback, useEffect } from 'react';
import { useCounselSessionQueryById } from '@/hooks';
import {
  useSaveMedicineConsult,
  useSelectMedicineConsult,
} from '@/pages/Consult/hooks/query/useMedicineConsultQuery';
import { useMedicationConsultStore } from '@/pages/Consult/hooks/store/useMedicationConsultStore';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { safeEditorContentParser } from '@/utils/safeEditorContentParser';
import { getIsSlateNode } from '@/utils/safeEditorContentParser';
import { toast } from 'sonner';

export type SAVE_STATUS = 'SAVED' | 'CHANGED' | 'SAVING' | 'INIT';

export const useInterventionEditor = () => {
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SAVE_STATUS>('INIT');

  const { counselSessionId } = useParams();
  const { data: medicineConsultData } =
    useSelectMedicineConsult(counselSessionId);
  const { medicationConsult, setMedicationConsult } =
    useMedicationConsultStore();

  const {
    mutate: saveMedicationCounsel,
    isSuccess: isSuccessSaveMedicationCounsel,
    isPending: isPendingSaveMedicationCounsel,
  } = useSaveMedicineConsult();

  const { data: counselSessionData } = useCounselSessionQueryById(
    counselSessionId as string,
  );

  const [editorContent, setEditorContent] = useState<string | null>(
    medicationConsult.counselRecord,
  );

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    setMedicationConsult({
      ...medicationConsult,
      counselRecord: content,
    });
    setEditorContentOnLocalStorage(content);
  };

  const handleSave = () => {
    setSaveStatus('SAVING');
    saveMedicationCounsel();
    setSaveStatus('SAVED');
    setEditorSaveTimestampLocalStorage();
  };

  const setEditorSaveTimestampLocalStorage = useCallback(() => {
    localStorage.setItem(
      `editorSaveTimestamp_${counselSessionId}`,
      new Date().toISOString(),
    );
  }, [counselSessionId]);

  const setEditorContentOnLocalStorage = useCallback(
    (content: string) => {
      localStorage.setItem(`editorContent_${counselSessionId}`, content);
    },
    [counselSessionId],
  );

  //중재기록 init
  useEffect(() => {
    if (medicineConsultData) {
      setMedicationConsult({
        counselSessionId: counselSessionId as string,
        medicationCounselId: medicineConsultData.medicationCounselId as string,
        counselRecord: medicineConsultData.counselRecord as string,
      });
      setEditorContent(medicineConsultData.counselRecord as string);
      setEditorContentOnLocalStorage(
        medicineConsultData.counselRecord as string,
      );
    }
  }, [
    medicineConsultData,
    setMedicationConsult,
    counselSessionId,
    setEditorContent,
    setEditorContentOnLocalStorage,
  ]);

  useEffect(() => {
    if (medicineConsultData) {
      const isSlateNode = getIsSlateNode(
        medicineConsultData?.counselRecord || '',
      );

      if (isSlateNode) {
        setEditorContent(
          safeEditorContentParser(medicineConsultData?.counselRecord || ''),
        );
      } else {
        if (medicineConsultData?.counselRecord === '') {
          setEditorContent(null);
        } else {
          setEditorContent(medicineConsultData?.counselRecord || '');
        }
      }

      setIsEditorReady(true);
    }
  }, [medicineConsultData]);

  useEffect(() => {
    if (isSuccessSaveMedicationCounsel) {
      toast.info('작성하신 중재기록을 저장하였습니다.');
    }
  }, [isSuccessSaveMedicationCounsel]);

  useEffect(() => {
    const localStorageContent = localStorage.getItem(
      `editorContent_${counselSessionId}`,
    );

    if (!localStorageContent || !medicineConsultData) {
      return;
    }

    const isContentChanged =
      medicineConsultData?.counselRecord !== editorContent &&
      medicineConsultData?.counselRecord !== localStorageContent;

    if (isContentChanged) {
      setSaveStatus('CHANGED');
    } else if (isPendingSaveMedicationCounsel) {
      setSaveStatus('SAVING');
    } else if (isSuccessSaveMedicationCounsel) {
      setSaveStatus('SAVED');
    }
  }, [
    medicineConsultData?.counselRecord,
    editorContent,
    counselSessionId,
    medicineConsultData,
    isPendingSaveMedicationCounsel,
    isSuccessSaveMedicationCounsel,
  ]);

  return {
    isEditorReady,
    editorContent,
    handleEditorChange,
    handleSave,
    counselSessionData,
    saveStatus,
    setSaveStatus,
    isSuccessSaveMedicationCounsel,
  };
};
