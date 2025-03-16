import {
  BaseInfoDTOHealthInsuranceTypeEnum,
  CounselPurposeAndNoteDTOCounselPurposeEnum,
} from '@/api';
import { ButtonGroupOption } from '@/components/ui/button-group';

export const HEALTH_INSURANCE_TYPE_MAP: Record<
  BaseInfoDTOHealthInsuranceTypeEnum,
  string
> = {
  [BaseInfoDTOHealthInsuranceTypeEnum.HealthInsurance]: '건강보험',
  [BaseInfoDTOHealthInsuranceTypeEnum.MedicalAid]: '의료급여',
  [BaseInfoDTOHealthInsuranceTypeEnum.VeteransBenefits]: '보훈',
  [BaseInfoDTOHealthInsuranceTypeEnum.NonCovered]: '없음',
} as const;

export const COUNSEL_PURPOSE_OPTIONS: ButtonGroupOption[] = [
  {
    label: '약물 부작용 상담',
    value: CounselPurposeAndNoteDTOCounselPurposeEnum.MedicationSideEffect,
  },
  {
    label: '생활습관 관리',
    value: CounselPurposeAndNoteDTOCounselPurposeEnum.LifestyleManagement,
  },
  {
    label: '증상/질병 이해',
    value:
      CounselPurposeAndNoteDTOCounselPurposeEnum.SymptomDiseaseUnderstanding,
  },
  {
    label: '복용약물 검토',
    value: CounselPurposeAndNoteDTOCounselPurposeEnum.MedicationReview,
  },
  {
    label: '기타',
    value: CounselPurposeAndNoteDTOCounselPurposeEnum.Other,
  },
] as const;
