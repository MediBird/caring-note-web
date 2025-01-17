export type handleOptionChangeTypes =
  | 'walking'
  | 'evacuation'
  | 'communication';

export const IswalkingTypes = [
  '외상 및 보행불가',
  '자립보행 가능',
  '이동장비 필요',
];
export const walkingTools = ['지팡이', '워커', '휠체어', '기타'];
export const evacuationMethods = [
  '자립 화장실 사용',
  '화장실 유도',
  '이동식 변기 사용',
  '기저귀 사용',
  '소변통 사용',
  '기타',
];
export const sightTypes = ['잘 보임', '잘 안 보인', '안 보임', '안경 사용'];
export const hearingTypes = ['잘 들림', '잘 안 들림', '안 들림', '보청기 사용'];
export const communicationTypes = ['소통 가능함', '대강 가능함', '불가능'];
export const usingKoreanTypes = ['읽기 가능', '쓰기 가능'];
