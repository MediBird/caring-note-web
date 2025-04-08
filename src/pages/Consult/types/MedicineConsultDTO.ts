export interface MedicationConsultDTO {
  counselSessionId: string;
  medicationCounselId: string;
  counselRecord: string;
}

export interface CounselRecordHighlights {
  startIndex: number;
  endIndex: number;
  highlight: string;
}
