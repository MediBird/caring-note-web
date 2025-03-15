import { AddCounseleeReqGenderTypeEnum } from '@/api/api';

export interface AddCounseleeFormData {
  id?: string;
  name: string;
  dateOfBirth: string;
  genderType: AddCounseleeReqGenderTypeEnum;
  phoneNumber: string;
  address: string;
  careManagerName: string;
  affiliatedWelfareInstitution: string;
  isDisability: boolean;
  note: string;
}

export const validateName = (value: string) => {
  if (!value.trim()) return '이름을 입력해주세요.';
  if (value.length > 30) return '이름은 30자 이내로 입력해주세요.';
  if (!/^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z]+$/.test(value))
    return '성명을 올바른 형식으로 입력해주세요.';
  return null;
};

export const validateDateOfBirth = (value: string) => {
  if (!value) return '생년월일을 입력해주세요.';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return '숫자 8자리를 입력해주세요.';
  return null;
};

export const validatePhoneNumber = (value: string) => {
  if (!value) return '전화번호를 입력해주세요.';
  if (!/^\d{3}-\d{4}-\d{4}$/.test(value)) return '숫자 11자리를 입력해주세요';
  return null;
};
