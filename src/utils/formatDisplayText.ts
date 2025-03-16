/**
 * 입력값이 없거나 빈 문자열일 경우 "-"를 반환하는 함수
 * @param value 확인할 값
 * @param fallbackText fallback 값
 * @returns 값이 있으면 그대로 반환, 없으면 fallbackText or defaultText 반환
 */

export const formatDisplayText = (
  value: string | null | undefined,
  fallbackText?: string,
): string => {
  return value === '' || value === null || value === undefined
    ? fallbackText || DEFAULT_TEXT
    : value;
};

const DEFAULT_TEXT = '-';
