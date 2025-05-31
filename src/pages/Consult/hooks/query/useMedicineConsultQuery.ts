import { MedicationCounselControllerApi } from '@/api';
import { useMedicationConsultStore } from '@/pages/Consult/hooks/store/useMedicationConsultStore';
import { MedicationConsultDTO } from '@/pages/Consult/types/MedicineConsultDTO';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const medicationCounselControllerApi = new MedicationCounselControllerApi();

const selectMedicationCounsel = async (counselSessionId: string) => {
  const response =
    await medicationCounselControllerApi.selectMedicationCounsel(
      counselSessionId,
    );

  return (
    response.data.data || {
      medicationCounselId: '',
      counselRecord: '',
      counselRecordHighlights: [],
    }
  );
};

const saveMedicationCounsel = async (
  medicationConsultDTO: MedicationConsultDTO | null,
) => {
  if (!medicationConsultDTO) {
    return;
  }

  if (medicationConsultDTO.counselRecord === '') {
    return;
  }

  if (medicationConsultDTO.medicationCounselId === '') {
    await medicationCounselControllerApi.addMedicationCounsel({
      counselSessionId: medicationConsultDTO.counselSessionId,
      counselRecord: medicationConsultDTO.counselRecord || '',
    });
  } else {
    await medicationCounselControllerApi.updateMedicationCounsel({
      medicationCounselId: medicationConsultDTO.medicationCounselId,
      counselRecord: medicationConsultDTO.counselRecord || '',
    });
  }

  return medicationConsultDTO.counselSessionId;
};

export const useSelectMedicineConsult = (counselSessionId?: string) => {
  return useQuery({
    queryKey: ['SelectMedicationConsult', counselSessionId],
    queryFn: () => selectMedicationCounsel(counselSessionId!),
    enabled: !!counselSessionId,
    refetchOnWindowFocus: true,
  });
};

export const useSaveMedicineConsult = () => {
  const queryClient = useQueryClient();
  const { medicationConsult } = useMedicationConsultStore();

  return useMutation({
    mutationFn: async () => {
      try {
        const currentEditorContent = localStorage.getItem(
          `editorContent_${medicationConsult.counselSessionId}`,
        );

        return saveMedicationCounsel({
          ...medicationConsult,
          counselRecord: currentEditorContent || '',
        });
      } catch (error) {
        console.error('중재 기록 저장 중 오류가 발생했습니다:', error);
        throw error;
      }
    },
    onSuccess: (counselSessionId) => {
      if (counselSessionId) {
        queryClient.invalidateQueries({
          queryKey: ['SelectMedicationConsult', counselSessionId],
        });
      }
    },
    onError: (error) => {
      console.error('중재 기록 저장 중 오류가 발생했습니다:', error);
    },
  });
};
