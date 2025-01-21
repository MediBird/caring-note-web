export type handleOptionChangeTypes =
  | 'walking'
  | 'evacuation'
  | 'communication';

export const IswalkingTypes = [
  {
    label: '외상 및 보행불가',
    value: '외상 및 보행불가',
  },
  {
    label: '자립보행 가능',
    value: '자립보행 가능',
  },
  {
    label: '이동장비 필요',
    value: '이동장비 필요',
  },
];
export const walkingTools = [
  {
    label: '보행기',
    value: '보행기',
  },
  {
    label: '캐인',
    value: '캐인',
  },
  {
    label: '휠체어',
    value: '휠체어',
  },
  {
    label: '발목보호대',
    value: '발목보호대',
  },
  {
    label: '기타',
    value: '기타',
  },
];
export const evacuationMethods = [
  {
    label: '자립',
    value: '자립',
  },
  {
    label: '보조',
    value: '보조',
  },
  {
    label: '보호',
    value: '보호',
  },
  {
    label: '기타',
    value: '기타',
  },
];
export const sightTypes = [
  {
    label: '잘 보임',
    value: '잘 보임',
  },
  {
    label: '잘 안 보인',
    value: '잘 안 보인',
  },
  {
    label: '안 보임',
    value: '안 보임',
  },
  {
    label: '안경 사용',
    value: '안경 사용',
  },
];
export const hearingTypes = [
  {
    label: '잘 들림',
    value: '잘 들림',
  },
  {
    label: '잘 안 들림',
    value: '잘 안 들림',
  },
  {
    label: '안 들림',
    value: '안 들림',
  },
  {
    label: '보청기 사용',
    value: '보청기 사용',
  },
];
export const communicationTypes = [
  {
    label: '소통 가능함',
    value: '소통 가능함',
  },
  {
    label: '대강 가능함',
    value: '대강 가능함',
  },
  {
    label: '불가능',
    value: '불가능',
  },
];
export const usingKoreanTypes = [
  {
    label: '읽기 가능',
    value: '읽기 가능',
  },
  {
    label: '쓰기 가능',
    value: '쓰기 가능',
  },
];
