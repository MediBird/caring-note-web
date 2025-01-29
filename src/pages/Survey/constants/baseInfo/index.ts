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
    value: '1회차',
    label: '1회차',
  },
  {
    value: '2회차',
    label: '2회차',
  },
  {
    value: '3회차',
    label: '3회차',
  },
  {
    value: '4회차',
    label: '4회차',
  },
  {
    value: '5회차 이상',
    label: '5회차 이상',
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
