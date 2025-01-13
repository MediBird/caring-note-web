import {MedicationCounselControllerApi,
        UpdateMedicationCounselReq,
        AddMedicationCounselReq,
        DeleteMedicationCounselReq
        } from "@/api/api";
import {useQuery} from "@tanstack/react-query";

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

const updateMedicationCounsel = async (updateMedicationCounselReq: UpdateMedicationCounselReq) => {

    const response = await medicationCounselControllerApi.updateMedicationCounsel(updateMedicationCounselReq);
    return response.data.data;

}

const addMedicationCounsel = async (addMedicationCounselReq: AddMedicationCounselReq) => {

    const response = await medicationCounselControllerApi.addMedicationCounsel(addMedicationCounselReq);
    return response.data.data;

}

const deleteMedicationCounsel = async (deleteMedicationCounselReq : DeleteMedicationCounselReq) => {

    const response = await medicationCounselControllerApi.deleteMedicationCounsel(deleteMedicationCounselReq);
    return response.data.data;

}

export const useSelectMedicineConsult = (counselSessionId: string) =>{

    return useQuery({
        queryKey: ["SelectMedicationConsult",counselSessionId],
        queryFn: () => selectMedicationCounsel(counselSessionId),
      });
    }


export const useUpdateMedicineConsult = (updateMedicationCounselReq: UpdateMedicationCounselReq) => 
    useQuery({
        queryKey: [updateMedicationCounselReq],
        queryFn: () => updateMedicationCounsel(updateMedicationCounselReq),
      });


export const useAddMedicineConsult = (addMedicationCounselReq: AddMedicationCounselReq) =>
    useQuery({
        queryKey: [addMedicationCounselReq],
        queryFn: () => addMedicationCounsel(addMedicationCounselReq),
      });

export const useDeleteMedicineConsult = (deleteMedicationCounselReq: DeleteMedicationCounselReq) => 
    useQuery({
        queryKey: [deleteMedicationCounselReq],
        queryFn: () => deleteMedicationCounsel(deleteMedicationCounselReq),
      });