# 상담사 관리 기능

이 디렉토리는 상담사 관리에 관련된 기능을 담고 있습니다.

## 주요 파일 구조

```
src/pages/Counselor/
├── components/
│   └── CounselorManagement.tsx    # 상담사 관리 예시 컴포넌트
├── hooks/
│   ├── queries/
│   │   └── useCounselorQuery.ts   # React Query 훅
│   └── useCounselorManagement.ts  # 통합 관리 훅
└── store/
    └── useCounselorStore.ts       # Zustand 상태 관리 스토어
```

## 기능 개요

- 상담사 목록을 페이지네이션으로 조회
- 상담사 정보 업데이트
- 상담사 삭제
- 상담사 비밀번호 초기화

## 사용 예시

```tsx
// 상담사 관리 페이지 컴포넌트에서
import { useCounselorManagement } from './hooks/useCounselorManagement';

const CounselorManagementPage = () => {
  const {
    counselors,
    pageInfo,
    isLoading,
    handlePageChange,
    handleUpdateCounselor,
    handleDeleteCounselor,
    handleResetPassword
  } = useCounselorManagement();

  // 여기서 UI 렌더링 및 이벤트 핸들링
  return (
    <div>
      {/* 상담사 목록, 등록/수정/삭제 UI */}
    </div>
  );
};
```

## API 연동 기능

### getCounselorsByPage
- 상담사 목록을 페이지네이션 형태로 조회
- 페이지 번호와 페이지 크기를 파라미터로 받음

### updateCounselor
- 상담사 정보를 업데이트
- 상담사 ID와 업데이트할 정보를 파라미터로 받음

### deleteCounselor
- 상담사를 시스템에서 삭제
- 상담사 ID를 파라미터로 받음

### resetPassword
- 상담사의 비밀번호를 초기화
- 상담사 ID와 새 비밀번호 정보를 파라미터로 받음 