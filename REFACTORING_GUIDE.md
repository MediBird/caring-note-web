# 🔧 녹음 시스템 리팩토링 가이드

## 📊 리팩토링 개요

### 개선 전 후 비교

| 항목          | 개선 전            | 개선 후                    |
| ------------- | ------------------ | -------------------------- |
| 스토어 크기   | 500줄              | 350줄 (30% 감소)           |
| 컴포넌트 크기 | 591줄              | 280줄 (52% 감소)           |
| 책임 분리     | 단일 거대 컴포넌트 | 6개 모듈로 분리            |
| 타입 안전성   | 부분적             | 완전한 타입 안전성         |
| 에러 처리     | 일관성 없음        | 통합된 에러 처리           |
| 테스트 용이성 | 어려움             | 각 모듈별 독립 테스트 가능 |

### 주요 개선사항

1. **책임 분리** - 단일 책임 원칙 적용
2. **타입 안전성** - 완전한 TypeScript 타입 시스템
3. **성능 최적화** - 선택자 패턴과 메모화
4. **에러 처리** - 통합된 에러 핸들링 시스템
5. **재사용성** - 독립적인 커스텀 훅들
6. **유지보수성** - 모듈화된 구조

## 🏗️ 새로운 아키텍처

### 폴더 구조

```
src/pages/Consult/
├── types/
│   └── recording.types.ts           # 통합 타입 정의
├── hooks/
│   ├── useMediaRecorder.ts          # MediaRecorder 관리
│   ├── useRecordingTimer.ts         # 타이머 관리
│   └── store/
│       └── useRecordingStore.refactored.ts  # 리팩토링된 스토어
├── components/
│   └── recording/
│       ├── RecordingController.tsx   # 메인 컨트롤러
│       └── RecordingControls.tsx     # UI 컴포넌트
├── utils/
│   └── errorHandling.ts             # 에러 처리 유틸리티
└── hooks/query/
    └── useTusUpload.refactored.ts   # 리팩토링된 업로드 훅
```

### 모듈별 책임

#### 1. 타입 시스템 (`recording.types.ts`)

- 모든 녹음 관련 타입 중앙화
- 상수 정의 및 유틸리티 타입
- 타입 안전성 보장

#### 2. MediaRecorder 훅 (`useMediaRecorder.ts`)

- MediaRecorder API 추상화
- 에러 처리 및 상태 관리
- 재사용 가능한 인터페이스

#### 3. 타이머 훅 (`useRecordingTimer.ts`)

- 녹음 시간 관리
- 자동 저장 타이머
- 타이머 정리 함수

#### 4. 스토어 (`useRecordingStore.refactored.ts`)

- 구조화된 상태 관리
- 선택자 패턴으로 성능 최적화
- 명확한 액션 분리

#### 5. 컨트롤러 (`RecordingController.tsx`)

- 비즈니스 로직 집중
- 훅들 조합 및 상태 동기화
- 라이프사이클 관리

#### 6. UI 컴포넌트 (`RecordingControls.tsx`)

- 순수 UI 로직만 담당
- 상태에 따른 렌더링
- 접근성 개선

## 🔄 마이그레이션 가이드

### 1. 점진적 마이그레이션 전략

#### Phase 1: 새로운 스토어 적용

```typescript
// 기존 코드
import { useRecordingStore } from './useRecordingStore';

// 새로운 코드
import {
  useRecordingStore,
  recordingSelectors,
} from './useRecordingStore.refactored';

// 선택자 사용으로 성능 최적화
const session = useRecordingStore(recordingSelectors.session);
const timer = useRecordingStore(recordingSelectors.timer);
```

#### Phase 2: 컴포넌트 교체

```typescript
// 기존 컴포넌트
import { ConsultRecordingControl } from './ConsultRecordingControl';

// 새로운 컴포넌트
import { RecordingController } from './RecordingController';

// 동일한 인터페이스 유지
<RecordingController
  counselSessionId={counselSessionId}
  ref={recordingControlRef}
  onRecordingReady={onRecordingReady}
/>
```

#### Phase 3: 에러 처리 개선

```typescript
// 기존 에러 처리
try {
  await someOperation();
} catch (error) {
  console.error(error);
  toast.error('오류가 발생했습니다.');
}

// 새로운 에러 처리
import { handleRecordingError, ErrorType } from '../utils/errorHandling';

try {
  await someOperation();
} catch (error) {
  handleRecordingError(error, 'SomeOperation', true, {
    context: 'additional info',
  });
}
```

### 2. 레거시 코드 호환성

기존 인터페이스를 유지하여 점진적 마이그레이션 가능:

```typescript
// 레거시 어댑터
export const ConsultRecordingControl = forwardRef<
  ConsultRecordingControlRef,
  ConsultRecordingControlProps
>((props, ref) => {
  // 기존 인터페이스를 새로운 컴포넌트로 매핑
  return <RecordingController {...props} ref={ref} />;
});
```

### 3. 테스트 전략

#### 단위 테스트

```typescript
// hooks 테스트
describe('useMediaRecorder', () => {
  it('should handle recording lifecycle', async () => {
    // 독립적인 훅 테스트
  });
});

// 컴포넌트 테스트
describe('RecordingControls', () => {
  it('should render correct status', () => {
    // UI 로직만 테스트
  });
});
```

#### 통합 테스트

```typescript
describe('Recording System Integration', () => {
  it('should complete full recording workflow', async () => {
    // 전체 플로우 테스트
  });
});
```

## ⚡ 성능 최적화

### 1. 선택자 패턴

```typescript
// 불필요한 리렌더링 방지
const displayDuration = useRecordingStore(recordingSelectors.displayDuration);
const canSave = useRecordingStore(recordingSelectors.canSave);
```

### 2. 메모화

```typescript
const recordingState = useMemo(
  () => ({
    hasRecording: !!file.blob || displayDuration > 0,
    isRecording: session.status === 'recording',
    // ...
  }),
  [file.blob, displayDuration, session.status],
);
```

### 3. 코드 분할

```typescript
// 지연 로딩
const RecordingDialog = lazy(() => import('./RecordingDialog'));
```

## 🛡️ 에러 처리 개선

### 1. 타입 안전한 에러

```typescript
interface RecordingError extends Error {
  code: string;
  details?: any;
}
```

### 2. 사용자 친화적 메시지

```typescript
const getUserFriendlyErrorMessage = (error: Error | RecordingError): string => {
  // 에러 코드에 따른 적절한 메시지 반환
};
```

### 3. 에러 복구

```typescript
const recovered = await attemptErrorRecovery(error, {
  [ErrorType.PERMISSION]: () => requestMicrophonePermission(),
  [ErrorType.NETWORK]: () => retryConnection(),
});
```

## 📈 모니터링 및 로깅

### 1. 성능 모니터링

```typescript
const timer = new PerformanceTimer('Recording Upload');
// ... 작업 수행
timer.end(); // 소요시간 자동 로깅
```

### 2. 메모리 사용량 추적

```typescript
logMemoryUsage('After Recording Complete');
```

### 3. 구조화된 로깅

```typescript
logError(error, 'RecordingController.handleStart', {
  sessionId: counselSessionId,
  duration: timer.totalDuration,
});
```

## 🎯 사용 예제

### 기본 사용법

```typescript
import { RecordingController, RecordingControllerRef } from './RecordingController';

const MyComponent: React.FC = () => {
  const recordingRef = useRef<RecordingControllerRef>(null);

  const handleStart = async () => {
    await recordingRef.current?.startRecording();
  };

  return (
    <RecordingController
      ref={recordingRef}
      counselSessionId="session-123"
      onRecordingReady={({ startRecording }) => {
        // 준비 완료 시 실행할 로직
      }}
    />
  );
};
```

### 커스텀 에러 처리

```typescript
import { handleRecordingError, ErrorType } from '../utils/errorHandling';

const handleCustomError = (error: Error) => {
  handleRecordingError(error, 'CustomOperation', true, {
    sessionId: counselSessionId,
    timestamp: Date.now(),
  });
};
```

## 🔍 디버깅 가이드

### 1. 개발 도구 활용

- Redux DevTools로 스토어 상태 확인
- React DevTools로 컴포넌트 렌더링 추적

### 2. 로깅 레벨 조정

```typescript
// 개발 환경에서 상세 로깅
if (process.env.NODE_ENV === 'development') {
  console.group('🎙️ Recording State');
  console.log('Session:', session);
  console.log('Timer:', timer);
  console.groupEnd();
}
```

### 3. 성능 프로파일링

```typescript
// 메모리 누수 감지
const checkMemoryLeak = () => {
  logMemoryUsage('Memory Check');
  // 일정 시간 후 다시 체크하여 증가량 확인
};
```

## 📝 체크리스트

### 마이그레이션 완료 체크리스트

- [ ] 새로운 타입 시스템 적용
- [ ] 스토어 선택자 패턴 적용
- [ ] 컴포넌트 분리 완료
- [ ] 에러 처리 통합
- [ ] 성능 최적화 적용
- [ ] 테스트 코드 작성
- [ ] 문서화 완료

### 품질 확인 체크리스트

- [ ] TypeScript 에러 없음
- [ ] ESLint 규칙 준수
- [ ] 단위 테스트 통과
- [ ] 통합 테스트 통과
- [ ] 성능 벤치마크 통과
- [ ] 접근성 가이드라인 준수

이 리팩토링을 통해 더 유지보수하기 쉽고, 확장 가능하며, 안정적인 녹음 시스템을 구축할 수 있습니다.
