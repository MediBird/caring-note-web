export interface MedicationConsultDTO {
  counselSessionId: string;
  medicationCounselId: string;
  counselRecord: string;
  counselRecordHighlights: CounselRecordHighlights[];
}

export interface CounselRecordHighlights {
  startIndex: number;
  endIndex: number;
  highlight: string;
}
