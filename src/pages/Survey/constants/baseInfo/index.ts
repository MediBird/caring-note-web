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
  {
    value: '초기상담',
    label: '초기상담',
  },
  {
    value: '재상담',
    label: '재상담',
  },
];
export const consultationGoals = [
  {
    value: '약물 부작용 상담',
    label: '약물 부작용 상담',
  },
  {
    value: '생활습관 관리',
    label: '생활습관 관리',
  },
  {
    value: '증상/질병에 대한 이해',
    label: '증상/질병에 대한 이해',
  },
  {
    value: '복용약물에 대한 검토',
    label: '복용약물에 대한 검토',
  },
  {
    value: '기타',
    label: '기타',
  },
];
