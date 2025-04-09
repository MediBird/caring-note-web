import { AddCounseleeReqGenderTypeEnum } from '@/api';

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
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
    return '날짜 형식이 올바르지 않습니다. YYYY-MM-DD 형식으로 입력해주세요.';

  // 유효한 날짜인지 확인
  const date = new Date(value);
  if (isNaN(date.getTime())) return '유효하지 않은 날짜입니다.';

  // 입력된 값과 Date 객체의 값이 일치하는지 확인 (2월 30일 같은 경우 체크)
  const parts = value.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // JavaScript의 월은 0부터 시작
  const day = parseInt(parts[2], 10);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return '존재하지 않는 날짜입니다.';
  }

  // 미래 날짜 체크
  const today = new Date();
  if (date > today) {
    return '미래 날짜는 입력할 수 없습니다.';
  }

  // 너무 오래된 과거 날짜 체크 (150년 전)
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 150);
  if (date < minDate) {
    return '너무 오래된 날짜입니다.';
  }
  
  return null;
};

export const validatePhoneNumber = (value: string) => {
  if (!value) return '전화번호를 입력해주세요.';
  if (!/^\d{2,3}-\d{3,4}-\d{4}$/.test(value))
    return '올바른 전화번호 형식이 아닙니다.';
  return null;
};

export const validatePassword = (value: string) => {
  if (!value) return '비밀번호를 입력해주세요.';
  if (value.length < 8) return '비밀번호는 8자 이상으로 입력해주세요.';
  if (value.length > 20) return '비밀번호는 20자 이하로 입력해주세요.';

  return null;
};

export const validateConfirmPassword = (value: string, password: string) => {
  if (!value) return '비밀번호 확인을 입력해주세요.';
  if (value !== password) return '비밀번호가 일치하지 않습니다.';
  return null;
};
