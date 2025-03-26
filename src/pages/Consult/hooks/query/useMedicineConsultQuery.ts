import { MedicationCounselControllerApi } from '@/api';
import { MedicineConsultDTO } from '@/pages/Consult/types/MedicineConsultDTO';
import { useMedicineConsultStore } from '@/store/medicineConsultStore';
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
  medicineConsultDTO: MedicineConsultDTO,
) => {
  if (medicineConsultDTO.counselRecord === '') {
    return;
  }

  if (medicineConsultDTO.medicationCounselId === '') {
    await medicationCounselControllerApi.addMedicationCounsel({
      counselSessionId: medicineConsultDTO.counselSessionId,
      counselRecord: medicineConsultDTO.counselRecord,
      counselRecordHighlights: medicineConsultDTO.counselRecordHighlights,
    });
  } else {
    await medicationCounselControllerApi.updateMedicationCounsel({
      medicationCounselId: medicineConsultDTO.medicationCounselId,
      counselRecord: medicineConsultDTO.counselRecord,
      counselRecordHighlights: medicineConsultDTO.counselRecordHighlights,
    });
  }

  return medicineConsultDTO.counselSessionId;
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

  const { medicineConsult } = useMedicineConsultStore();

  return useMutation({
    mutationFn: () => saveMedicationCounsel(medicineConsult),
    onSuccess: (counselSessionId) => {
      queryClient.invalidateQueries({
        queryKey: ['SelectMedicationConsult', counselSessionId],
      });
    },
  });
};
