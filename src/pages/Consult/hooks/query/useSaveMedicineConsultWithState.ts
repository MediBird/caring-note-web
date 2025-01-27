import { useMedicineConsultStore } from '@/store/medicineConsultStore';
import { useSaveMedicineConsult } from '@/pages/Consult/hooks/query/useMedicineConsultQuery';

export const useSaveMedicineConsultWithState = () => {
  const { mutate } = useSaveMedicineConsult();
  const { medicineConsult } = useMedicineConsultStore();

  const handleSaveMedicineConsult = () => {
    mutate(medicineConsult);
    console.log(medicineConsult);
  };

  return {
    handleSaveMedicineConsult,
  };
};
