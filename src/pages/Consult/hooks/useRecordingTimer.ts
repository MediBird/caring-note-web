import { useRef, useCallback } from 'react';
import { RECORDING_CONFIG } from '../types/recording.types';

interface UseRecordingTimerProps {
  onTick?: () => void;
  onAutoSave?: () => Promise<void>;
}

interface UseRecordingTimerReturn {
  startDurationTimer: () => void;
  stopDurationTimer: () => void;
  startAutoSaveTimer: () => void;
  stopAutoSaveTimer: () => void;
  cleanup: () => void;
}

export const useRecordingTimer = ({
  onTick,
  onAutoSave,
}: UseRecordingTimerProps = {}): UseRecordingTimerReturn => {
  const durationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const stopDurationTimer = useCallback(() => {
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
      durationTimerRef.current = null;
    }
  }, []);

  const startDurationTimer = useCallback(() => {
    stopDurationTimer();
    durationTimerRef.current = setInterval(() => {
      if (onTick) {
        onTick();
      }
    }, 1000);
  }, [onTick, stopDurationTimer]);

  const stopAutoSaveTimer = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearInterval(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }
  }, []);

  const startAutoSaveTimer = useCallback(() => {
    stopAutoSaveTimer();

    if (!onAutoSave) return;

    autoSaveTimerRef.current = setInterval(async () => {
      try {
        await onAutoSave();
        console.log('자동 저장 완료');
      } catch (error) {
        console.warn('자동 저장 실패:', error);
      }
    }, RECORDING_CONFIG.AUTO_SAVE_INTERVAL);
  }, [onAutoSave, stopAutoSaveTimer]);

  const cleanup = useCallback(() => {
    stopDurationTimer();
    stopAutoSaveTimer();
  }, [stopDurationTimer, stopAutoSaveTimer]);

  return {
    startDurationTimer,
    stopDurationTimer,
    startAutoSaveTimer,
    stopAutoSaveTimer,
    cleanup,
  };
};
