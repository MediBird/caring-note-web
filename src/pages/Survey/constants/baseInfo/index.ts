import { BaseInfoDTOHealthInsuranceTypeEnum } from '@/api/api';

export const insuranceTypes = [
  {
    value: BaseInfoDTOHealthInsuranceTypeEnum.HealthInsurance,
    label: '건강보험',
  },
  {
    value: BaseInfoDTOHealthInsuranceTypeEnum.MedicalAid,
    label: '의료급여',
  },
  {
    value: BaseInfoDTOHealthInsuranceTypeEnum.VeteransBenefits,
    label: '보훈',
  },
  {
    value: BaseInfoDTOHealthInsuranceTypeEnum.NonCovered,
    label: '비급여',
  },
];
export const consultationCounts = [
  '1회차',
  '2회차',
  '3회차',
  '4회차',
  '5회차 이상',
];
export const consultationGoals = [
  '약물 부작용 상담',
  '생활습관 관리',
  '증상/질병에 대한 이해',
  '복용약물에 대한 검토',
  '기타',
];
