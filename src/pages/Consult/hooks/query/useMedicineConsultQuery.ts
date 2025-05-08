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
  medicationConsultDTO: MedicationConsultDTO,
) => {
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
  });
};

export const useSaveMedicineConsult = () => {
  const queryClient = useQueryClient();

  const { medicationConsult } = useMedicationConsultStore();

  return useMutation({
    mutationFn: () => saveMedicationCounsel(medicationConsult),
    onSuccess: (counselSessionId) => {
      queryClient.invalidateQueries({
        queryKey: ['SelectMedicationConsult', counselSessionId],
      });
    },
  });
};
