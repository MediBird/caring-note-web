/**
 * ISO 날짜 문자열에서 날짜와 시간을 추출
 * @param isoDateTimeString ISO 날짜 시간 문자열 (예: 2023-12-31T14:30:00)
 * @returns 날짜와 시간을 포함하는 객체 { date: 'YYYY-MM-DD', time: 'HH:MM' }
 */
export const extractDateTimeFromIso = (
  isoDateTimeString: string | undefined,
): { date: string; time: string } => {
  const defaultResult = { date: '', time: '' };

  if (!isoDateTimeString) return defaultResult;

  try {
    const dateTime = new Date(isoDateTimeString);

    // 유효한 날짜인지 확인
    if (isNaN(dateTime.getTime())) return defaultResult;

    // 날짜 형식 (YYYY-MM-DD)
    const formattedDate = dateTime.toISOString().split('T')[0];

    // 시간 형식 (HH:MM)
    const hours = dateTime.getHours().toString().padStart(2, '0');
    const minutes = dateTime.getMinutes().toString().padStart(2, '0');
    const formattedTime = `${hours}:${minutes}`;

    return {
      date: formattedDate,
      time: formattedTime,
    };
  } catch (error) {
    console.error('날짜 변환 중 오류 발생:', error);
    return defaultResult;
  }
};

/**
 * 날짜와 시간을 'yyyy-mm-dd HH:mm' 형식의 문자열로 결합
 * @param date 날짜 문자열 (YYYY-MM-DD)
 * @param time 시간 문자열 (HH:MM)
 * @returns 날짜 시간 문자열 (예: 2023-12-31 14:30)
 */
export const combineToFormattedDateTime = (
  date: string,
  time: string,
): string | null => {
  if (!date || !time) return null;

  try {
    return `${date} ${time}`;
  } catch (error) {
    console.error('날짜 결합 중 오류 발생:', error);
    return null;
  }
};

/**
 * 날짜와 시간을 ISO 형식의 문자열로 결합
 * @param date 날짜 문자열 (YYYY-MM-DD)
 * @param time 시간 문자열 (HH:MM)
 * @returns ISO 날짜 시간 문자열 (예: 2023-12-31T14:30:00)
 * @deprecated 새 형식을 사용하려면 combineToFormattedDateTime을 사용하세요
 */
export const combineToIsoDateTime = (
  date: string,
  time: string,
): string | null => {
  if (!date || !time) return null;

  try {
    // 'yyyy-mm-dd HH:mm' 형식으로 변경
    return combineToFormattedDateTime(date, time);
  } catch (error) {
    console.error('날짜 결합 중 오류 발생:', error);
    return null;
  }
};

/**
 * 날짜와 시간의 유효성 검사
 * @param date 날짜 문자열
 * @param time 시간 문자열
 * @returns 유효 여부
 */
export const isValidDateTime = (date: string, time: string): boolean => {
  if (!date || !time) return false;

  try {
    const dateTimeString = `${date}T${time}:00`;
    const dateTime = new Date(dateTimeString);
    return !isNaN(dateTime.getTime());
  } catch (error) {
    return false;
  }
};
