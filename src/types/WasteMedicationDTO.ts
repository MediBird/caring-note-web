import {
  WasteMedicationDisposalReqUnusedReasonTypesEnum,
  WasteMedicationDisposalReqDrugRemainActionTypeEnum,
  WasteMedicationDisposalReqRecoveryAgreementTypeEnum,
} from '@/api/api';

export const WasteMedicationDisposalDrugRemainActionDetailEnum = {
  Stacked: '쌓아둠', //쌓아둠
  Shared: '지인에게 나눠줌', //지인에게 나눠줌
  Trash: '쓰레기통에 버림', //쓰레기통에 버림
  Designated: '폐의약품 수거함 등 지정된 폐기 장소에 버림', //폐의약품 수거함 등 지정된 폐기 장소에 버림
  Etc: '기타', //기타
} as const;

export interface AddAndUpdateWasteMedicationDisposalDTO {
  unusedReasonTypes?: Array<WasteMedicationDisposalReqUnusedReasonTypesEnum>;
  unusedReasonDetail?: string;
  drugRemainActionType?: WasteMedicationDisposalReqDrugRemainActionTypeEnum;
  drugRemainActionDetail?: string;
  recoveryAgreementType?: WasteMedicationDisposalReqRecoveryAgreementTypeEnum;
  wasteMedicationGram?: number;
}

export interface AddAndUpdateWasteMedicationDisposalSaveDTO {
  counselSessionId: string;
  wasteMedicationDisposal: AddAndUpdateWasteMedicationDisposalDTO;
}

export interface WasteMedicationListDTO {
  id: string;
  rowId?: string;
  medicationId: string;
  medicationName: string;
  unit: number;
  disposalReason: string;
}

export interface WasteMedicationListSaveDTO {
  counselSessionId: string;
  wasteMedicationList: Omit<WasteMedicationListDTO, 'id'>[];
}
