import { SelectMedicationRecordHistRes } from '@/api/api';

export interface MedicationRecordListSaveDTO {
  counselSessionId: string;
  medicationRecordHistList: SelectMedicationRecordHistRes[];
}
