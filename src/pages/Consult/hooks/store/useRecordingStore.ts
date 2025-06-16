import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import {
  RecordingTimerState,
  RecordingFileData,
  RecordingUploadState,
  RecordingSessionState,
  STORAGE_KEYS,
} from '../../types/recording.types';
import {
  saveRecordingBlob,
  loadRecordingBlob,
  deleteRecordingBlob,
  isIndexedDBSupported,
  saveRecordingBlobFallback,
  loadRecordingBlobFallback,
} from '../../utils/recordingStorage';

// 상태 인터페이스 분리
interface RecordingStoreState {
  // 세션 관리
  session: RecordingSessionState;

  // 타이머 상태
  timer: RecordingTimerState;

  // 파일 데이터
  file: RecordingFileData;

  // 업로드 상태
  upload: RecordingUploadState;
}

// 액션 인터페이스 분리
interface RecordingStoreActions {
  // 세션 관리
  setSession: (updates: Partial<RecordingSessionState>) => void;
  loadSession: (sessionId: string) => Promise<void>;
  resetSession: (sessionId?: string) => Promise<void>;

  // 타이머 관리
  setTimer: (updates: Partial<RecordingTimerState>) => void;
  incrementDuration: () => void;

  // 파일 관리
  setFile: (updates: Partial<RecordingFileData>) => void;
  saveToStorage: (
    sessionId: string,
    blob: Blob,
    duration: number,
  ) => Promise<void>;
  loadFromStorage: (sessionId: string) => Promise<boolean>;
  deleteFromStorage: (sessionId: string) => Promise<void>;

  // 업로드 관리
  setUpload: (updates: Partial<RecordingUploadState>) => void;

  // 복합 액션
  startRecording: () => void;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => void;
  startUploading: () => void;
  startProcessing: () => void;
  completeRecording: () => void;
}

export type RecordingStore = RecordingStoreState & RecordingStoreActions;

// 초기 상태
const INITIAL_STATE: RecordingStoreState = {
  session: {
    currentSessionId: null,
    isLoading: false,
    status: 'idle',
    aiSummaryStatus: null,
  },
  timer: {
    recordedDuration: 0,
    currentSessionDuration: 0,
    totalDuration: 0,
  },
  file: {
    blob: null,
    fileId: null,
    duration: 0,
    isFromStorage: false,
  },
  upload: {
    progress: 0,
    isUploading: false,
    error: null,
  },
};

export const useRecordingStore = create<RecordingStore>()(
  subscribeWithSelector((set, get) => ({
    ...INITIAL_STATE,

    // 세션 관리
    setSession: (updates) =>
      set((state) => ({
        session: { ...state.session, ...updates },
      })),

    loadSession: async (sessionId) => {
      const state = get();

      // 같은 세션이면 로드하지 않음
      if (state.session.currentSessionId === sessionId) return;

      set((state) => ({
        session: { ...state.session, isLoading: true },
      }));

      try {
        // 이전 세션 상태 저장
        if (state.session.currentSessionId) {
          await get().saveToStorage(
            state.session.currentSessionId,
            state.file.blob!,
            state.timer.totalDuration,
          );

          // localStorage에 상태 저장
          const stateToSave = {
            session: state.session,
            timer: state.timer,
            upload: state.upload,
          };
          localStorage.setItem(
            STORAGE_KEYS.RECORDING_STATE(state.session.currentSessionId),
            JSON.stringify(stateToSave),
          );
        }

        // 새 세션으로 초기화
        set({
          ...INITIAL_STATE,
          session: {
            ...INITIAL_STATE.session,
            currentSessionId: sessionId,
            isLoading: true,
          },
        });

        // 저장된 상태 로드
        const savedState = localStorage.getItem(
          STORAGE_KEYS.RECORDING_STATE(sessionId),
        );
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          set((state) => ({
            ...state,
            ...parsedState,
            session: {
              ...parsedState.session,
              currentSessionId: sessionId,
            },
          }));
        }

        // 파일 로드
        const hasFile = await get().loadFromStorage(sessionId);
        if (hasFile) {
          set((state) => ({
            session: {
              ...state.session,
              status: 'stopped',
              isLoading: false,
            },
            file: {
              ...state.file,
              isFromStorage: true,
            },
          }));
        } else {
          set((state) => ({
            session: { ...state.session, isLoading: false },
          }));
        }
      } catch (error) {
        console.error('세션 로드 실패:', error);
        set((state) => ({
          session: { ...state.session, isLoading: false },
        }));
      }
    },

    resetSession: async (sessionId) => {
      if (sessionId) {
        await get().deleteFromStorage(sessionId);
        localStorage.removeItem(STORAGE_KEYS.RECORDING_STATE(sessionId));
      }

      set({
        ...INITIAL_STATE,
        session: {
          ...INITIAL_STATE.session,
          currentSessionId: sessionId || null,
        },
      });
    },

    // 타이머 관리
    setTimer: (updates) =>
      set((state) => ({
        timer: { ...state.timer, ...updates },
      })),

    incrementDuration: () =>
      set((state) => ({
        timer: {
          ...state.timer,
          recordedDuration: state.timer.recordedDuration + 1,
          currentSessionDuration: state.timer.currentSessionDuration + 1,
        },
      })),

    // 파일 관리
    setFile: (updates) =>
      set((state) => ({
        file: { ...state.file, ...updates },
      })),

    saveToStorage: async (sessionId, blob, duration) => {
      try {
        if (isIndexedDBSupported()) {
          await saveRecordingBlob(sessionId, blob, duration);
        } else {
          await saveRecordingBlobFallback(sessionId, blob, duration);
        }
      } catch (error) {
        console.error('파일 저장 실패:', error);
        throw error;
      }
    },

    loadFromStorage: async (sessionId) => {
      try {
        let recordingData;

        if (isIndexedDBSupported()) {
          recordingData = await loadRecordingBlob(sessionId);
        } else {
          recordingData = await loadRecordingBlobFallback(sessionId);
        }

        if (recordingData) {
          set((state) => ({
            file: {
              ...state.file,
              blob: recordingData.blob,
              duration: recordingData.duration,
            },
            timer: {
              ...state.timer,
              totalDuration: recordingData.duration,
            },
          }));
          return true;
        }
        return false;
      } catch (error) {
        console.error('파일 로드 실패:', error);
        return false;
      }
    },

    deleteFromStorage: async (sessionId) => {
      try {
        if (isIndexedDBSupported()) {
          await deleteRecordingBlob(sessionId);
        } else {
          localStorage.removeItem(STORAGE_KEYS.RECORDING_BLOB(sessionId));
        }
      } catch (error) {
        console.error('파일 삭제 실패:', error);
        throw error;
      }
    },

    // 업로드 관리
    setUpload: (updates) =>
      set((state) => ({
        upload: { ...state.upload, ...updates },
      })),

    // 복합 액션
    startRecording: () =>
      set((state) => ({
        session: {
          ...state.session,
          status: 'recording',
        },
        file: {
          ...state.file,
          isFromStorage: false,
        },
        upload: {
          ...state.upload,
          error: null,
        },
      })),

    pauseRecording: () =>
      set((state) => ({
        session: {
          ...state.session,
          status: 'paused',
        },
      })),

    resumeRecording: () =>
      set((state) => ({
        session: {
          ...state.session,
          status: 'recording',
        },
      })),

    stopRecording: () =>
      set((state) => ({
        session: {
          ...state.session,
          status: 'stopped',
        },
        timer: {
          ...state.timer,
          totalDuration:
            state.timer.totalDuration + state.timer.currentSessionDuration,
          currentSessionDuration: 0,
        },
      })),

    startUploading: () =>
      set((state) => ({
        session: {
          ...state.session,
          status: 'uploading',
        },
        upload: {
          ...state.upload,
          isUploading: true,
          progress: 0,
          error: null,
        },
      })),

    startProcessing: () =>
      set((state) => ({
        session: {
          ...state.session,
          status: 'processing',
          aiSummaryStatus: 'STT_PROGRESS',
        },
      })),

    completeRecording: () =>
      set((state) => ({
        session: {
          ...state.session,
          status: 'completed',
          aiSummaryStatus: 'COMPLETED',
        },
        upload: {
          ...state.upload,
          isUploading: false,
          progress: 100,
        },
      })),
  })),
);

// 선택자 함수들 (성능 최적화)
export const recordingSelectors = {
  session: (state: RecordingStore) => state.session,
  timer: (state: RecordingStore) => state.timer,
  file: (state: RecordingStore) => state.file,
  upload: (state: RecordingStore) => state.upload,

  // 계산된 값들
  displayDuration: (state: RecordingStore) =>
    state.timer.totalDuration > 0
      ? state.timer.totalDuration
      : state.timer.recordedDuration,

  isRecordingActive: (state: RecordingStore) =>
    state.session.status === 'recording' || state.session.status === 'paused',

  hasUnsavedRecording: (state: RecordingStore) =>
    state.file.blob && state.session.status === 'stopped',

  canSave: (state: RecordingStore) =>
    state.file.blob && state.timer.totalDuration >= 3,
};
