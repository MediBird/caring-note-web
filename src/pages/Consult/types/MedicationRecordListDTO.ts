import { SelectMedicationRecordHistRes } from '@/api';

export interface MedicationRecordListSaveDTO {
  counselSessionId: string;
  medicationRecordHistList: SelectMedicationRecordHistRes[];
}
