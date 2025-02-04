// 날짜 문자열을 포맷팅하는 헬퍼 함수
export const formatDate = (value: string) => {
  // 숫자만 남기고 모두 제거 (숫자가 아닌 문자 제거)
  const digits = value.replace(/\D/g, '');

  // 숫자가 4자리 이하인 경우 그대로 반환 (YYYY)
  if (digits.length < 5) {
    return digits;
  }
  // 숫자가 5~6자리인 경우 YYYY-MM 형태로 반환
  if (digits.length < 7) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  }
  // 숫자가 7자리 이상인 경우 YYYY-MM-DD 형태로 반환
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
};
