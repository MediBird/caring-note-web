import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useRecordingStore,
  recordingSelectors,
} from './store/useRecordingStore';

interface UsePageLeaveGuardOptions {
  hasUnsavedChanges?: boolean;
  onBeforeLeave?: () => Promise<void> | void;
  onLeaveConfirmed?: () => void;
  sessionStatus?: string; // 상담 세션 상태 추가
}

interface UsePageLeaveGuardReturn {
  isLeaveDialogOpen: boolean;
  setIsLeaveDialogOpen: (open: boolean) => void;
  handleLeaveConfirm: () => void;
  handleLeaveCancel: () => void;
  isRecording: boolean;
  hasUnsavedChanges: boolean;
  interceptNavigation: (path: string) => boolean;
}

export const usePageLeaveGuard = ({
  hasUnsavedChanges = false,
  onBeforeLeave,
  onLeaveConfirmed,
  sessionStatus,
}: UsePageLeaveGuardOptions = {}): UsePageLeaveGuardReturn => {
  const [isLeaveDialogOpen, setIsLeaveDialogOpen] = useState(false);
  const navigate = useNavigate();

  // 녹음 상태 확인
  const session = useRecordingStore(recordingSelectors.session);
  const isRecording =
    session.status === 'recording' || session.status === 'paused';

  // 페이지 이탈 시도 정보 저장
  const pendingNavigationRef = useRef<{
    type: 'navigate' | 'beforeunload' | 'programmatic';
    path?: string;
    event?: BeforeUnloadEvent;
  } | null>(null);

  // 진행중인 상담인지 확인 (COMPLETED가 아닌 경우)
  const isActiveSession = sessionStatus && sessionStatus !== 'COMPLETED';

  // 페이지 이탈 조건 확인 - 진행중인 상담에서만 차단
  const shouldBlockNavigation =
    isActiveSession && (isRecording || hasUnsavedChanges);

  // 전역 네비게이션 차단을 위한 플래그
  const isNavigationBlockedRef = useRef(false);

  // 뒤로가기 처리 상태 관리
  const isProcessingBackNavigationRef = useRef(false);
  const allowNextNavigationRef = useRef(false);

  // 브라우저 beforeunload 이벤트 처리
  const handleBeforeUnload = useCallback(
    (event: BeforeUnloadEvent) => {
      if (shouldBlockNavigation) {
        event.preventDefault();

        // 녹음 중인 경우 더 강한 경고
        if (isRecording) {
          const message =
            '녹음이 진행 중입니다. 페이지를 나가면 녹음이 중단됩니다.';
          event.returnValue = message;
          return message;
        }

        // 일반적인 변경사항이 있는 경우
        if (hasUnsavedChanges) {
          const message = '저장되지 않은 변경사항이 있습니다.';
          event.returnValue = message;
          return message;
        }
      }
    },
    [shouldBlockNavigation, isRecording, hasUnsavedChanges],
  );

  // React Router 네비게이션 차단 (뒤로가기/앞으로가기)
  useEffect(() => {
    if (!shouldBlockNavigation) {
      return;
    }

    const handlePopState = () => {
      // 다음 네비게이션이 허용된 경우 통과
      if (allowNextNavigationRef.current) {
        allowNextNavigationRef.current = false;
        return;
      }

      // 이미 처리 중이거나 다이얼로그가 열려있으면 무시
      if (isProcessingBackNavigationRef.current || isLeaveDialogOpen) {
        return;
      }

      if (shouldBlockNavigation) {
        isProcessingBackNavigationRef.current = true;

        // 현재 위치를 히스토리에 다시 추가하여 뒤로가기를 무효화
        window.history.pushState(null, '', window.location.pathname);

        pendingNavigationRef.current = {
          type: 'navigate',
        };

        setIsLeaveDialogOpen(true);
      }
    };

    // popstate 이벤트 리스너 등록
    window.addEventListener('popstate', handlePopState);

    // 뒤로가기 감지를 위한 히스토리 엔트리 추가
    window.history.pushState(null, '', window.location.pathname);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [shouldBlockNavigation, isLeaveDialogOpen]);

  // beforeunload 이벤트 리스너 등록
  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [handleBeforeUnload]);

  // 전역 네비게이션 차단 설정
  useEffect(() => {
    if (shouldBlockNavigation) {
      isNavigationBlockedRef.current = true;

      // 전역 이벤트로 네비게이션 시도를 감지
      const handleNavigationAttempt = (event: CustomEvent) => {
        if (isNavigationBlockedRef.current && !isLeaveDialogOpen) {
          event.preventDefault();
          pendingNavigationRef.current = {
            type: 'programmatic',
            path: event.detail.path,
          };
          setIsLeaveDialogOpen(true);
        }
      };

      window.addEventListener(
        'navigation-attempt',
        handleNavigationAttempt as EventListener,
      );

      return () => {
        window.removeEventListener(
          'navigation-attempt',
          handleNavigationAttempt as EventListener,
        );
      };
    } else {
      isNavigationBlockedRef.current = false;
    }
  }, [shouldBlockNavigation, isLeaveDialogOpen]);

  // 페이지 이탈 확인 처리
  const handleLeaveConfirm = useCallback(async () => {
    // 중복 실행 방지
    if (
      isProcessingBackNavigationRef.current &&
      pendingNavigationRef.current?.type === 'navigate'
    ) {
      return;
    }

    try {
      // 이탈 전 처리 실행
      if (onBeforeLeave) {
        await onBeforeLeave();
      }

      // 녹음 중인 경우 녹음 중단 처리
      if (isRecording) {
        const { stopRecording, resetSession } = useRecordingStore.getState();
        try {
          await stopRecording();
          await resetSession(session.currentSessionId || undefined);
        } catch (error) {
          console.error('녹음 중단 실패:', error);
        }
      }

      // 모든 차단 상태 해제
      isNavigationBlockedRef.current = false;

      setIsLeaveDialogOpen(false);

      // 이탈 확인 콜백 실행
      if (onLeaveConfirmed) {
        onLeaveConfirmed();
      }

      // 대기 중인 네비게이션 실행
      const pendingNavigation = pendingNavigationRef.current;
      pendingNavigationRef.current = null;

      if (pendingNavigation) {
        if (pendingNavigation.type === 'navigate') {
          // 뒤로가기인 경우: 다음 네비게이션을 허용하고 실제 뒤로가기 실행
          allowNextNavigationRef.current = true;
          isProcessingBackNavigationRef.current = false;

          setTimeout(() => {
            window.history.back();
          }, 50);
        } else if (
          pendingNavigation.type === 'programmatic' &&
          pendingNavigation.path
        ) {
          // 프로그래밍적 네비게이션인 경우 해당 경로로 이동
          isProcessingBackNavigationRef.current = false;

          setTimeout(() => {
            navigate(pendingNavigation.path!);
          }, 50);
        }
      } else {
        isProcessingBackNavigationRef.current = false;
      }
    } catch (error) {
      console.error('페이지 이탈 처리 실패:', error);
      setIsLeaveDialogOpen(false);
      isProcessingBackNavigationRef.current = false;
    }
  }, [
    onBeforeLeave,
    onLeaveConfirmed,
    isRecording,
    session.currentSessionId,
    navigate,
  ]);

  // 페이지 이탈 취소 처리
  const handleLeaveCancel = useCallback(() => {
    setIsLeaveDialogOpen(false);
    pendingNavigationRef.current = null;
    isProcessingBackNavigationRef.current = false;
    allowNextNavigationRef.current = false;
  }, []);

  // 프로그래밍적 네비게이션 차단 함수
  const interceptNavigation = useCallback(
    (targetPath: string) => {
      if (shouldBlockNavigation) {
        pendingNavigationRef.current = {
          type: 'programmatic',
          path: targetPath,
        };
        setIsLeaveDialogOpen(true);
        return false; // 네비게이션 차단
      }
      return true; // 네비게이션 허용
    },
    [shouldBlockNavigation],
  );

  return {
    isLeaveDialogOpen,
    setIsLeaveDialogOpen,
    handleLeaveConfirm,
    handleLeaveCancel,
    isRecording,
    hasUnsavedChanges,
    interceptNavigation,
  };
};
