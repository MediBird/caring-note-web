export type CounselAssistantDialogTypes =
  | 'REGISTER'
  | 'TEMP_SAVE'
  | 'EXIT'
  | null;

export const InformationThirdSections = [
  {
    id: 1,
    details: {
      title: '제공 받는 자',
      content: ['신림종합사회복지관, 강감찬종합사회복지관'],
    },
    items: {
      title: '제공 항목',
      content: [
        '성명, 생년월일, 주소, 연락처, 건강정보, 복용약물 및 기타 건강상태에 대한 사항',
      ],
    },
    purpose: {
      title: '제공 목적',
      content: ['사회 복지 서비스 연계'],
    },
    duration: {
      title: '보유 및 이용기간',
      content: ['해당 사업 제공기간 및 사업 종료일로부터 3년'],
    },
  },
  {
    id: 2,
    details: {
      title: '제공 받는 자',
      content: ['정다운우리의원'],
    },
    items: {
      title: '제공 항목',
      content: [
        '성명, 생년월일, 주소, 연락처, 건강정보, 복용약물 및 기타 건강상태에 대한 사항',
      ],
    },
    purpose: {
      title: '제공 목적',
      content: ['진료 의뢰'],
    },
    duration: {
      title: '보유 및 이용기간',
      content: ['해당 사업 제공기간 및 사업 종료일로부터 3년'],
    },
  },
];
