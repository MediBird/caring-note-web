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

//TODO::1차 QA 이후 api 스펙 Enum type 변경 요청 및 수정
//raw string을 받아서 WasteMedicationDisposalReqUnusedReasonTypesEnum으로 변환
export const WasteMedicationDisposalUnusedReasonStringMap: Record<
  string,
  WasteMedicationDisposalReqUnusedReasonTypesEnum
> = {
  '부작용이 나타나 사용 중단함':
    WasteMedicationDisposalReqUnusedReasonTypesEnum.SideEffect,
  '재처방 받음': WasteMedicationDisposalReqUnusedReasonTypesEnum.Recovered,
  '다른 약으로 대체함':
    WasteMedicationDisposalReqUnusedReasonTypesEnum.Replaced,
  '약 먹는 것을 잊어버림':
    WasteMedicationDisposalReqUnusedReasonTypesEnum.Forgotten,
  '필요시 복용하려고 남겨둠':
    WasteMedicationDisposalReqUnusedReasonTypesEnum.Reserved,
  기타: WasteMedicationDisposalReqUnusedReasonTypesEnum.Etc,
} as const;

export interface AddAndUpdateWasteMedicationDisposalDTO {
  unusedReasonTypes?: Array<WasteMedicationDisposalReqUnusedReasonTypesEnum>;
  unusedReasonDetail?: string;
  drugRemainActionType?: WasteMedicationDisposalReqDrugRemainActionTypeEnum;
  drugRemainActionDetail?: string;
  recoveryAgreementType?: WasteMedicationDisposalReqRecoveryAgreementTypeEnum;
  wasteMedicationGram?: number;
}

export interface WasteMedicationListDTO {
  id: string;
  medicationId: string;
  medicationName: string;
  unit: number;
  disposalReason: string;
}
