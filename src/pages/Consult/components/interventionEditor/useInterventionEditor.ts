import { useEffect } from 'react';
import { useCounselSessionQueryById } from '@/hooks';
import {
  useSaveMedicineConsult,
  useSelectMedicineConsult,
} from '@/pages/Consult/hooks/query/useMedicineConsultQuery';
import { useMedicationConsultStore } from '@/pages/Consult/hooks/store/useMedicationConsultStore';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { convertSlateToLexical } from '@/utils/convertSlateToLexcialState';
import { getIsSlateNode } from '@/utils/convertSlateToLexcialState';
import { toast } from 'sonner';

export const useInterventionEditor = () => {
  const [isEditorReady, setIsEditorReady] = useState(false);

  const { counselSessionId } = useParams();
  const { data: medicineConsultData } =
    useSelectMedicineConsult(counselSessionId);
  const { medicationConsult, setMedicationConsult } =
    useMedicationConsultStore();

  const {
    mutate: saveMedicationCounsel,
    isSuccess: isSuccessSaveMedicationCounsel,
  } = useSaveMedicineConsult();

  const { data: counselSessionData } = useCounselSessionQueryById(
    counselSessionId as string,
  );

  const [editorContent, setEditorContent] = useState<string | null>(
    medicationConsult.counselRecord,
  );

  //중재기록 init
  useEffect(() => {
    if (medicineConsultData) {
      setMedicationConsult({
        counselSessionId: counselSessionId as string,
        medicationCounselId: medicineConsultData.medicationCounselId as string,
        counselRecord: medicineConsultData.counselRecord as string,
      });
    }
  }, [medicineConsultData, setMedicationConsult, counselSessionId]);

  useEffect(() => {
    if (medicineConsultData) {
      const isSlateNode = getIsSlateNode(
        medicineConsultData?.counselRecord || '',
      );

      if (isSlateNode) {
        setEditorContent(
          convertSlateToLexical(medicineConsultData?.counselRecord || ''),
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

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
    setMedicationConsult({
      ...medicationConsult,
      counselRecord: content,
    });
  };

  const handleSave = () => {
    // API 호출로 저장 기능 구현

    // TODO: 서버에 저장하는 로직 추가
    saveMedicationCounsel();
  };

  return {
    isEditorReady,
    editorContent,
    handleEditorChange,
    handleSave,
    counselSessionData,
  };
};
