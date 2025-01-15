import {MedicationCounselControllerApi,
        UpdateMedicationCounselReq,
        UpdateMedicationCounselRes,
        AddMedicationCounselReq,
        AddMedicationCounselRes,
        DeleteMedicationCounselReq
        } from "@/api/api";
import {useQuery, useMutation} from "@tanstack/react-query";
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
    
        const response = await medicationCounselControllerApi.addMedicationCounsel({
            counselSessionId: medicineConsultDTO.counselSessionId,
            counselRecord: medicineConsultDTO.counselRecord,
            counselRecordHighlights: medicineConsultDTO.counselRecordHighlights,
          });
          return response.data.data?.medicationCounselId;
    } else {

        const response = await medicationCounselControllerApi.updateMedicationCounsel({
            medicationCounselId: medicineConsultDTO.medicationCounselId,
            counselRecord: medicineConsultDTO.counselRecord,
            counselRecordHighlights: medicineConsultDTO.counselRecordHighlights,
          });
        return response.data.data?.updatedMedicationCounselId;
    }
}

export const useSelectMedicineConsult = (counselSessionId: string) =>{

    return useQuery({
        queryKey: ["SelectMedicationConsult",counselSessionId],
        queryFn: () => selectMedicationCounsel(counselSessionId),
      });
    }

export const useSaveMedicineConsult = () => {

    return useMutation<string | undefined, Error, MedicineConsultDTO>({
          mutationFn: (medicineConsultDTO: MedicineConsultDTO) =>
            saveMedicationCounsel(medicineConsultDTO),
        });
    };