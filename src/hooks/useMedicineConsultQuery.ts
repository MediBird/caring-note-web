import { MedicationCounselControllerApi } from "@/api/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MedicineConsultDTO }  from "@/types/MedicineConsultDTO";

const medicationCounselControllerApi = new MedicationCounselControllerApi();

const selectMedicationCounsel = async (counselSessionId: string) => {

    const response = await medicationCounselControllerApi.selectMedicationCounsel(counselSessionId);

    return response.data.data||{
        medicationCounselId: '',
        counselRecord: '',
        counselRecordHighlights: [],
        counselNeedStatus: undefined, // 기본값으로 설정
      };

}


const saveMedicationCounsel = async (medicineConsultDTO: MedicineConsultDTO) => {

    if (medicineConsultDTO.medicationCounselId === "") {
    
        await medicationCounselControllerApi.addMedicationCounsel({
            counselSessionId: medicineConsultDTO.counselSessionId,
            counselRecord: medicineConsultDTO.counselRecord,
            counselRecordHighlights: medicineConsultDTO.counselRecordHighlights,
            counselNeedStatus: "ONE"
          });
    } else {

        await medicationCounselControllerApi.updateMedicationCounsel({
            medicationCounselId: medicineConsultDTO.medicationCounselId,
            counselRecord: medicineConsultDTO.counselRecord,
            counselRecordHighlights: medicineConsultDTO.counselRecordHighlights,
            counselNeedStatus: "ONE"
          });
    }

    return medicineConsultDTO.counselSessionId;
}

export const useSelectMedicineConsult = (counselSessionId: string) =>{

    return useQuery({
        queryKey: ["SelectMedicationConsult", counselSessionId],
        queryFn: () => selectMedicationCounsel(counselSessionId),
      });
    }

export const useSaveMedicineConsult = () => {

    const queryClient = useQueryClient();

    return useMutation<string | undefined, Error, MedicineConsultDTO>({
          mutationFn: (medicineConsultDTO: MedicineConsultDTO) =>
            saveMedicationCounsel(medicineConsultDTO),
          onSuccess: (counselSessionId) => {      
            queryClient.invalidateQueries({
                queryKey: ["SelectMedicationConsult", counselSessionId]});  
        }
        });
    };