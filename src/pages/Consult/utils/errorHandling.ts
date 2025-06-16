import { toast } from 'sonner';
import { RecordingError } from '../types/recording.types';

// 에러 타입 정의
export enum ErrorType {
  PERMISSION = 'PERMISSION_ERROR',
  RECORDING = 'RECORDING_ERROR',
  UPLOAD = 'UPLOAD_ERROR',
  NETWORK = 'NETWORK_ERROR',
  STORAGE = 'STORAGE_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR',
}

// 에러 생성 팩토리 함수
export const createRecordingError = (
  type: ErrorType,
  message: string,
  details?: unknown,
): RecordingError => {
  const error = new Error(message) as RecordingError;
  error.code = type;
  error.details = details;
  return error;
};

// 에러 메시지 매핑
const ERROR_MESSAGES: Record<ErrorType, string> = {
  [ErrorType.PERMISSION]: '마이크 접근 권한이 필요합니다.',
  [ErrorType.RECORDING]: '녹음 처리 중 오류가 발생했습니다.',
  [ErrorType.UPLOAD]: '파일 업로드 중 오류가 발생했습니다.',
  [ErrorType.NETWORK]: '네트워크 연결을 확인해주세요.',
  [ErrorType.STORAGE]: '저장소 접근 중 오류가 발생했습니다.',
  [ErrorType.VALIDATION]: '입력값을 확인해주세요.',
  [ErrorType.UNKNOWN]: '알 수 없는 오류가 발생했습니다.',
};

// 사용자 친화적인 에러 메시지 반환
export const getUserFriendlyErrorMessage = (
  error: Error | RecordingError,
): string => {
  if ('code' in error && error.code in ERROR_MESSAGES) {
    return ERROR_MESSAGES[error.code as ErrorType];
  }

  // 특정 에러 메시지 패턴 처리
  const message = error.message.toLowerCase();

  if (message.includes('permission') || message.includes('denied')) {
    return ERROR_MESSAGES[ErrorType.PERMISSION];
  }

  if (message.includes('network') || message.includes('fetch')) {
    return ERROR_MESSAGES[ErrorType.NETWORK];
  }

  if (message.includes('blob') || message.includes('file')) {
    return ERROR_MESSAGES[ErrorType.UPLOAD];
  }

  return error.message || ERROR_MESSAGES[ErrorType.UNKNOWN];
};

// 에러 로깅 함수
export const logError = (
  error: Error | RecordingError,
  context: string,
  additionalInfo?: Record<string, unknown>,
) => {
  const errorInfo = {
    message: error.message,
    code: 'code' in error ? error.code : 'NO_CODE',
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    ...additionalInfo,
  };

  console.error(`[${context}] 에러 발생:`, errorInfo);

  // 개발 환경에서는 추가 정보 출력
  if (process.env.NODE_ENV === 'development') {
    console.group(`🚨 ${context} 에러 상세 정보`);
    console.error('Error:', error);
    console.log('Additional Info:', additionalInfo);
    console.groupEnd();
  }

  // 여기서 에러 리포팅 서비스에 전송할 수 있음
  // 예: Sentry, LogRocket 등
};

// 에러 핸들러 함수
export const handleRecordingError = (
  error: Error | RecordingError,
  context: string,
  showToast: boolean = true,
  additionalInfo?: Record<string, unknown>,
) => {
  // 에러 로깅
  logError(error, context, additionalInfo);

  // 사용자에게 친화적인 메시지 표시
  if (showToast) {
    const userMessage = getUserFriendlyErrorMessage(error);
    toast.error(userMessage);
  }

  return error;
};

// 에러 복구 함수
export const attemptErrorRecovery = async (
  error: Error | RecordingError,
  recoveryActions: {
    [key in ErrorType]?: () => Promise<void> | void;
  },
): Promise<boolean> => {
  const errorCode = 'code' in error ? error.code : ErrorType.UNKNOWN;
  const recoveryAction = recoveryActions[errorCode as ErrorType];

  if (recoveryAction) {
    try {
      await recoveryAction();
      console.log(`에러 복구 성공: ${errorCode}`);
      return true;
    } catch (recoveryError) {
      console.error(`에러 복구 실패: ${errorCode}`, recoveryError);
      return false;
    }
  }

  return false;
};

// 재시도 가능한 에러인지 확인
export const isRetryableError = (error: Error | RecordingError): boolean => {
  const retryableCodes = [
    ErrorType.NETWORK,
    ErrorType.UPLOAD,
    ErrorType.STORAGE,
  ];

  if ('code' in error) {
    return retryableCodes.includes(error.code as ErrorType);
  }

  const message = error.message.toLowerCase();
  return (
    message.includes('network') ||
    message.includes('timeout') ||
    message.includes('aborted') ||
    message.includes('failed to fetch')
  );
};

// 재시도 함수
export const retryWithExponentialBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxRetries) {
        throw lastError;
      }

      if (!isRetryableError(lastError)) {
        throw lastError;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      console.log(`재시도 ${attempt + 1}/${maxRetries} (${delay}ms 후)`);

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
};

// 성능 모니터링을 위한 타이머
export class PerformanceTimer {
  private startTime: number;
  private endTime?: number;

  constructor(private label: string) {
    this.startTime = performance.now();
    console.time(this.label);
  }

  end(): number {
    this.endTime = performance.now();
    const duration = this.endTime - this.startTime;
    console.timeEnd(this.label);
    console.log(`${this.label} 소요시간: ${duration.toFixed(2)}ms`);
    return duration;
  }

  getDuration(): number {
    const currentTime = this.endTime || performance.now();
    return currentTime - this.startTime;
  }
}

// 메모리 사용량 모니터링
export const logMemoryUsage = (context: string): void => {
  if ('memory' in performance) {
    const memory = (
      performance as unknown as {
        memory: {
          usedJSHeapSize: number;
          totalJSHeapSize: number;
          jsHeapSizeLimit: number;
        };
      }
    ).memory;
    console.log(`[${context}] 메모리 사용량:`, {
      used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
      total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`,
      limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`,
    });
  }
};
