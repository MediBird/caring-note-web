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
 * ISO 타임스탬프를 한국 시간대로 변환하여 'YY.MM.DD HH:MM' 형식으로 포맷팅
 * @param isoDateTimeString ISO 타임스탬프 문자열 (예: 2025-05-31T06:12:17.184Z)
 * @returns 포맷팅된 날짜 시간 문자열 (예: 25.05.31 15:12)
 */
export const formatToKSTDotFormat = (
  isoDateTimeString: string | undefined | null,
): string => {
  if (!isoDateTimeString) return '';

  try {
    const dateTime = new Date(isoDateTimeString);

    // 유효한 날짜인지 확인
    if (isNaN(dateTime.getTime())) return '';

    // 한국 시간대(KST, UTC+9)로 변환
    const kstDate = new Date(dateTime.getTime() + 9 * 60 * 60 * 1000);

    // 연도 (2자리)
    const year = kstDate.getUTCFullYear().toString().slice(-2);

    // 월 (2자리, 0 패딩)
    const month = (kstDate.getUTCMonth() + 1).toString().padStart(2, '0');

    // 일 (2자리, 0 패딩)
    const day = kstDate.getUTCDate().toString().padStart(2, '0');

    // 시간 (2자리, 0 패딩)
    const hours = kstDate.getUTCHours().toString().padStart(2, '0');

    // 분 (2자리, 0 패딩)
    const minutes = kstDate.getUTCMinutes().toString().padStart(2, '0');

    return `${year}.${month}.${day} ${hours}:${minutes}`;
  } catch (error) {
    console.error('날짜 포맷팅 중 오류 발생:', error);
    return '';
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
    console.error('날짜 유효성 검사 중 오류 발생:', error);
    return false;
  }
};
