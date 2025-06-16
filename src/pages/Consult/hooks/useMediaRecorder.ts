import { useRef, useCallback, useState } from 'react';
import {
  MediaRecorderState,
  RecordingError,
  RECORDING_CONFIG,
} from '../types/recording.types';

interface UseMediaRecorderProps {
  onStart?: () => void;
  onStop?: (blob: Blob) => void;
  onError?: (error: RecordingError) => void;
  onDataAvailable?: (chunk: Blob) => void;
}

interface UseMediaRecorderReturn {
  state: MediaRecorderState;
  startRecording: (stream: MediaStream) => Promise<void>;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => Promise<Blob | null>;
  cleanup: () => void;
  isRecording: boolean;
  isPaused: boolean;
}

export const useMediaRecorder = ({
  onStart,
  onStop,
  onError,
  onDataAvailable,
}: UseMediaRecorderProps = {}): UseMediaRecorderReturn => {
  const [state, setState] = useState<MediaRecorderState>({
    instance: null,
    stream: null,
    chunks: [],
    isActive: false,
  });

  const chunksRef = useRef<Blob[]>([]);

  const createRecordingError = useCallback(
    (message: string, details?: unknown): RecordingError => {
      const error = new Error(message) as RecordingError;
      error.code = 'RECORDING_ERROR';
      error.details = details;
      return error;
    },
    [],
  );

  const cleanup = useCallback(() => {
    setState((prevState) => {
      // MediaRecorder 정리
      if (prevState.instance && prevState.instance.state !== 'inactive') {
        prevState.instance.stop();
      }

      // MediaStream 정리
      if (prevState.stream) {
        prevState.stream.getTracks().forEach((track) => track.stop());
      }

      return {
        instance: null,
        stream: null,
        chunks: [],
        isActive: false,
      };
    });

    chunksRef.current = [];
  }, []);

  const startRecording = useCallback(
    async (stream: MediaStream): Promise<void> => {
      return new Promise((resolve, reject) => {
        try {
          // 기존 레코더가 있다면 정리
          cleanup();

          if (!MediaRecorder.isTypeSupported(RECORDING_CONFIG.MIME_TYPE)) {
            throw createRecordingError('지원되지 않는 오디오 형식입니다.');
          }

          const mediaRecorder = new MediaRecorder(stream, {
            mimeType: RECORDING_CONFIG.MIME_TYPE,
          });

          chunksRef.current = [];

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              chunksRef.current.push(event.data);
              if (onDataAvailable) {
                onDataAvailable(event.data);
              }
            }
          };

          mediaRecorder.onstart = () => {
            setState((prevState) => ({
              ...prevState,
              isActive: true,
            }));

            if (onStart) {
              onStart();
            }
            resolve();
          };

          mediaRecorder.onerror = (event) => {
            const error = createRecordingError(
              '녹음 중 오류가 발생했습니다.',
              event,
            );
            if (onError) {
              onError(error);
            }
            reject(error);
          };

          mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, {
              type: RECORDING_CONFIG.MIME_TYPE,
            });
            setState((prevState) => ({
              ...prevState,
              chunks: chunksRef.current,
              isActive: false,
            }));

            if (onStop) {
              onStop(blob);
            }
          };

          setState({
            instance: mediaRecorder,
            stream,
            chunks: [],
            isActive: false,
          });

          mediaRecorder.start(RECORDING_CONFIG.CHUNK_INTERVAL);
        } catch (error) {
          const recordingError =
            error instanceof Error
              ? createRecordingError(error.message, error)
              : createRecordingError('녹음 시작에 실패했습니다.');

          if (onError) {
            onError(recordingError);
          }
          reject(recordingError);
        }
      });
    },
    [cleanup, createRecordingError, onStart, onStop, onError, onDataAvailable],
  );

  const pauseRecording = useCallback(() => {
    if (state.instance && state.instance.state === 'recording') {
      state.instance.pause();
    }
  }, [state.instance]);

  const resumeRecording = useCallback(() => {
    if (state.instance && state.instance.state === 'paused') {
      state.instance.resume();
    }
  }, [state.instance]);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    return new Promise((resolve) => {
      if (state.instance && state.instance.state !== 'inactive') {
        const originalOnStop = state.instance.onstop;

        state.instance.onstop = (event) => {
          // 원래 핸들러 실행
          if (originalOnStop && state.instance) {
            originalOnStop.call(state.instance, event);
          }

          // Blob 생성 및 반환
          const blob = new Blob(chunksRef.current, {
            type: RECORDING_CONFIG.MIME_TYPE,
          });
          resolve(blob);
        };

        state.instance.stop();
      } else {
        resolve(null);
      }
    });
  }, [state.instance]);

  return {
    state,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    cleanup,
    isRecording: state.instance?.state === 'recording',
    isPaused: state.instance?.state === 'paused',
  };
};
